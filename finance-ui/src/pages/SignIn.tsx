import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
    const { signIn, signInAnon } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h2>Sign In</h2>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await signIn(email, password);
                }}
            >
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Sign In</button>
            </form>
            <button onClick={signInAnon}>Continue as Guest</button>
        </div>
    );
}
