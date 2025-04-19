import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    timestamp?: string;
}

export default function TransactionList({ userId }: { userId: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const q = query(collection(db, `users/${userId}/transactions`), orderBy('timestamp', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
        });
        return () => unsub();
    }, [userId]);

    return (
        <div>
            <h2>Transactions</h2>
            <ul>
                {transactions.map(tx => (
                    <li key={tx.id}>{tx.type}: ${tx.amount}</li>
                ))}
            </ul>
        </div>
    );
}
