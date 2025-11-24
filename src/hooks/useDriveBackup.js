import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function useDriveBackup() {
    const { currentUser, driveAccessToken } = useAuth();
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [backupStatus, setBackupStatus] = useState({ success: null, message: '' });

    // Get or create backup folder in Google Drive
    const getBackupFolder = async () => {
        if (!driveAccessToken) {
            throw new Error('No hay acceso a Google Drive. Por favor, cierra sesión y vuelve a iniciar.');
        }

        // Check if folder ID is stored in Firestore
        const configRef = doc(db, 'Configuracion', currentUser.uid);
        const configDoc = await getDoc(configRef);

        if (configDoc.exists() && configDoc.data().driveFolderId) {
            return configDoc.data().driveFolderId;
        }

        // Search for existing folder
        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='Notely - Copias de Seguridad' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            {
                headers: {
                    'Authorization': `Bearer ${driveAccessToken}`
                }
            }
        );

        const searchData = await searchResponse.json();

        if (searchData.files && searchData.files.length > 0) {
            const folderId = searchData.files[0].id;
            // Store folder ID
            await setDoc(configRef, { driveFolderId: folderId }, { merge: true });
            return folderId;
        }

        // Create new folder
        const createResponse = await fetch(
            'https://www.googleapis.com/drive/v3/files',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${driveAccessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Notely - Copias de Seguridad',
                    mimeType: 'application/vnd.google-apps.folder'
                })
            }
        );

        const createData = await createResponse.json();
        const folderId = createData.id;

        // Store folder ID
        await setDoc(configRef, { driveFolderId: folderId }, { merge: true });

        return folderId;
    };

    // Upload backup to Google Drive
    const uploadBackup = async (notesData) => {
        setIsBackingUp(true);
        setBackupStatus({ success: null, message: 'Creando copia de seguridad...' });

        try {
            const folderId = await getBackupFolder();

            // Create backup file name with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `notely-backup-${timestamp}.json`;

            // Prepare backup data
            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                userId: currentUser.uid,
                notes: notesData,
                metadata: {
                    totalNotes: notesData.length,
                    createdBy: currentUser.email
                }
            };

            // Convert to blob
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });

            // Create metadata
            const metadata = {
                name: fileName,
                mimeType: 'application/json',
                parents: [folderId]
            };

            // Upload using multipart
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', blob);

            const uploadResponse = await fetch(
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${driveAccessToken}`
                    },
                    body: form
                }
            );

            if (!uploadResponse.ok) {
                throw new Error('Error al subir el archivo a Google Drive');
            }

            const uploadData = await uploadResponse.json();

            // Store last backup info in Firestore
            const configRef = doc(db, 'Configuracion', currentUser.uid);
            await setDoc(configRef, {
                lastBackup: {
                    date: new Date().toISOString(),
                    fileId: uploadData.id,
                    fileName: fileName,
                    notesCount: notesData.length
                }
            }, { merge: true });

            setBackupStatus({
                success: true,
                message: `✅ Copia de seguridad creada exitosamente. ${notesData.length} notas respaldadas.`
            });

            return uploadData;
        } catch (error) {
            console.error('Error creating backup:', error);
            setBackupStatus({
                success: false,
                message: `❌ Error: ${error.message}`
            });
            throw error;
        } finally {
            setIsBackingUp(false);
        }
    };

    // Get last backup info
    const getLastBackupInfo = async () => {
        try {
            const configRef = doc(db, 'Configuracion', currentUser.uid);
            const configDoc = await getDoc(configRef);

            if (configDoc.exists() && configDoc.data().lastBackup) {
                return configDoc.data().lastBackup;
            }

            return null;
        } catch (error) {
            console.error('Error getting backup info:', error);
            return null;
        }
    };

    return {
        uploadBackup,
        getLastBackupInfo,
        isBackingUp,
        backupStatus,
        hasAccessToken: !!driveAccessToken
    };
}
