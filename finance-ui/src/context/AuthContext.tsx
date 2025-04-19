import { createContext, useContext, useEffect, useState } from 'react';
import {auth} from "../firebase.ts";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInAnonymously,
    onAuthStateChanged,
    signOut,
    User
} from 'firebase/auth';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInAnon: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signUp: async () => {},
    signIn: async () => {},
    signInAnon: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u) {
                setUser(u);
                setLoading(false);
            } else {
                // fallback to anon
                const anon = await signInAnonymously(auth);
                setUser(anon.user);
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    const signUp = async (email: string, password: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUser(result.user);
    };

    const signIn = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
    };

    const signInAnon = async () => {
        const result = await signInAnonymously(auth);
        setUser(result.user);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signInAnon, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
