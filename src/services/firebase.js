import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDbI5vndQaAzo0UETHb6ZJVeWaAy2YrceY",
    authDomain: "reservas-f34a0.firebaseapp.com",
    projectId: "reservas-f34a0",
    storageBucket: "reservas-f34a0.firebasestorage.app",
    messagingSenderId: "827449642714",
    appId: "1:827449642714:web:273216fa7c6b8423679fe3",
    measurementId: "G-GBMM2PLNVC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error signing in", error);
        throw error;
    }
};

export const logout = () => firebaseSignOut(auth);

// Escuchar notas en tiempo real (Mapeando de Español a Inglés para la App)
export const subscribeToNotes = (callback) => {
    const user = auth.currentUser;
    if (!user) return () => { };

    // Consulta: Colección 'Notas', donde 'uid' sea el usuario actual
    const q = query(
        collection(db, 'Notas'),
        where('uid', '==', user.uid),
        orderBy('Fecha', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const notes = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convertir de BD (Español) a App (Inglés)
            return {
                id: doc.id,
                title: data.Titulo || '',
                content: data.Contenido || '',
                tags: data.Etiquetas || [],
                pinned: data.Fijado || false,
                updatedAt: data.Fecha || new Date().toISOString(),
                createdAt: data.FechaCreacion || new Date().toISOString()
            };
        });
        callback(notes);
    }, (error) => {
        console.error("Error cargando notas:", error);
        if (error.code === 'failed-precondition') {
            alert("⚠️ IMPORTANTE: Firebase necesita un índice para mostrar tus notas.\n\nAbre la consola del navegador (F12), busca el enlace rojo de Firebase y haz clic en él para crearlo automáticamente.");
        }
    });
};

// Guardar nota (Mapeando de Inglés a Español para Firebase)
export const saveNote = async (note) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const noteRef = doc(db, 'Notas', note.id);

    // Datos a guardar en Español
    const dataToSave = {
        uid: user.uid, // Importante para saber de quién es
        Titulo: note.title || '',
        Contenido: note.content || '',
        Etiquetas: note.tags || [],
        Fijado: note.pinned || false,
        Fecha: new Date().toISOString(),
        FechaCreacion: note.createdAt || new Date().toISOString()
    };

    await setDoc(noteRef, dataToSave, { merge: true });
};

export const deleteNote = async (noteId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    await deleteDoc(doc(db, 'Notas', noteId));
};

export { auth };
