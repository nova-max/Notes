import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Chrome, User } from 'lucide-react';

const Login = () => {
    const { loginWithGoogle, loginAsGuest, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">
                        AppNotas
                    </h1>
                    <p className="text-muted-foreground">Capture ideas, analyze with AI.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => loginWithGoogle()}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black rounded-xl font-medium hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Chrome className="w-5 h-5" />
                        Sign in with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-muted-foreground bg-card">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={loginAsGuest}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-secondary/50 text-foreground border border-white/5 rounded-xl font-medium hover:bg-secondary/80 transition-all"
                    >
                        <User className="w-5 h-5" />
                        Guest Mode (Offline)
                    </button>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;
