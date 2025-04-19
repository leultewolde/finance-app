import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Debt {
    id: string;
    counterparty: string;
    amount: number;
    dueDate: { seconds: number };
}

export default function DebtList({ userId }: { userId: string }) {
    const [debts, setDebts] = useState<Debt[]>([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, `users/${userId}/debts`), snapshot => {
            setDebts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Debt)));
        });
        return () => unsub();
    }, [userId]);

    return (
        <div>
            <h2>Debts</h2>
            <ul>
                {debts.map(d => (
                    <li key={d.id}>{d.counterparty}: ${d.amount} due {new Date(d.dueDate.seconds * 1000).toLocaleDateString()}</li>
                ))}
            </ul>
        </div>
    );
}
