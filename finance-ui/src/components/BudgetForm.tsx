import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function BudgetForm({ userId }: { userId: string }) {
    const [totalBudget, setTotalBudget] = useState<number>(0);
    const [categories, setCategories] = useState<{ [key: string]: number }>({});
    const [categoryInput, setCategoryInput] = useState('');
    const [categoryAmount, setCategoryAmount] = useState<number>(0);

    const addCategory = () => {
        if (categoryInput && categoryAmount > 0) {
            setCategories(prev => ({ ...prev, [categoryInput]: categoryAmount }));
            setCategoryInput('');
            setCategoryAmount(0);
        }
    };

    const submit = async () => {
        await setDoc(doc(db, `users/${userId}/budgets`, 'current'), {
            totalBudget,
            categories
        });
        setTotalBudget(0);
        setCategories({});
    };

    return (
        <div>
            <h3>Set Budget</h3>
            <input
                type="number"
                placeholder="Total Budget"
                value={totalBudget}
                onChange={e => setTotalBudget(Number(e.target.value))}
            />
            <div>
                <input
                    placeholder="Category"
                    value={categoryInput}
                    onChange={e => setCategoryInput(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={categoryAmount}
                    onChange={e => setCategoryAmount(Number(e.target.value))}
                />
                <button onClick={addCategory}>Add Category</button>
            </div>
            <ul>
                {Object.entries(categories).map(([cat, amt]) => (
                    <li key={cat}>{cat}: ${amt}</li>
                ))}
            </ul>
            <button onClick={submit}>Save Budget</button>
        </div>
    );
}
