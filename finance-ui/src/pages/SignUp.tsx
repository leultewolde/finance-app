import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h2>Sign Up</h2>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await signUp(email, password);
                }}
            >
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}
