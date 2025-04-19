import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface BudgetData {
    totalBudget: number;
    categories: { [key: string]: number };
}

export default function BudgetTracker({ userId }: { userId: string }) {
    const [budget, setBudget] = useState<BudgetData | null>(null);

    useEffect(() => {
        const fetchBudget = async () => {
            const docRef = doc(db, `users/${userId}/budgets`, 'current');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setBudget(docSnap.data() as BudgetData);
        };
        fetchBudget();
    }, [userId]);

    if (!budget) return <div>Loading budget...</div>;

    return (
        <div>
            <h3>Budget</h3>
            <p>Total Budget: ${budget.totalBudget}</p>
            <ul>
                {Object.entries(budget.categories).map(([cat, amt]) => (
                    <li key={cat}>{cat}: ${amt}</li>
                ))}
            </ul>
        </div>
    );
}
