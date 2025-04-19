import {useEffect, useState} from 'react';
import {auth, messaging} from './firebase';
import {signInAnonymously} from 'firebase/auth';
import {getToken, onMessage} from 'firebase/messaging';
import Dashboard from './pages/Dashboard';
import DebtsPage from './pages/Debts';
import {toast} from 'react-toastify';
import SignInPage from "./pages/SignIn.tsx";
import SignUpPage from "./pages/SignUp.tsx";

export default function App() {
    const [userId, setUserId] = useState<string | null>(null);
    const [view, setView] = useState<'dashboard' | 'debts' | 'sign-in' | 'sing-up'>('sign-in');

    useEffect(() => {
        const ensureAuth = async () => {
            if (!auth.currentUser) {
                const result = await signInAnonymously(auth);
                setUserId(result.user.uid);
            } else {
                setUserId(auth.currentUser.uid);
            }
        };

        ensureAuth();
    }, []);

    // ✅ FCM token & listener
    useEffect(() => {
        getToken(messaging, {
            vapidKey: 'BIUOzG83GgxKkWpx0jPbVP9ybKeBd7mZ1SNbHJmdEzHCMhkM7oXqAyryDE13ZZnpb88CioJ5_xgktgXE3Pw5PE8'
        })
            .then((currentToken) => {
                if (currentToken) {
                    // console.log('FCM Token:', currentToken);
                    // Optional: Save to Firestore
                }
            })
            .catch((err) => {
                console.error('FCM token error:', err);
            });

        onMessage(messaging, (payload) => {
            const {title, body} = payload.notification || {};
            if (title || body) {
                toast.info(`${title}: ${body}`);
            }
        });
    }, []);

    if (!userId) return <div>Authenticating...</div>;

    return (
        <div>
            <nav style={{display: 'flex', gap: '10px', marginBottom: '1rem'}}>
                <button onClick={() => setView('dashboard')}>Dashboard</button>
                <button onClick={() => setView('debts')}>Debts</button>
                <button onClick={() => setView('sign-in')}>Sign In</button>
                <button onClick={() => setView('sing-up')}>Sign Up</button>
            </nav>
            {view === 'dashboard' && <Dashboard/>}
            {view === 'debts' && <DebtsPage/>}
            {view === 'sign-in' && <SignInPage/>}
            {view === 'sing-up' && <SignUpPage/>}
        </div>
    );
}
