import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

export default function TransactionForm({ userId }: { userId: string }) {
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState<'income' | 'expense'>('income');

    const submit = async () => {
        await addDoc(collection(db, `users/${userId}/transactions`), {
            amount,
            type,
            timestamp: serverTimestamp()
        });
    };

    return (
        <div>
            <select onChange={e => setType(e.target.value as any)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <input type="number" onChange={e => setAmount(Number(e.target.value))} />
            <button onClick={submit}>Add Transaction</button>
        </div>
    );
}
