import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export function Login() {
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            console.error("Failed to log in", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <span style={{ fontSize: '3rem' }}>✨</span>
                    <h1>Bienvenido a Notely AI</h1>
                    <p>Tus ideas, seguras y en la nube.</p>
                </div>

                <button className="btn btn-primary btn-large" onClick={handleLogin}>
                    <LogIn size={24} />
                    Iniciar Sesión con Google
                </button>
            </div>
        </div>
    );
}
