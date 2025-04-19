import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';

export default function DebtForm({ userId }: { userId: string }) {
    const [counterparty, setCounterparty] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [dueDate, setDueDate] = useState('');

    const submit = async () => {
        await addDoc(collection(db, `users/${userId}/debts`), {
            counterparty,
            amount,
            dueDate: Timestamp.fromDate(new Date(dueDate)),
        });
        setCounterparty('');
        setAmount(0);
        setDueDate('');
    };

    return (
        <div>
            <h3>Add Debt</h3>
            <input placeholder="Lender" value={counterparty} onChange={e => setCounterparty(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <button onClick={submit}>Add Debt</button>
        </div>
    );
}
