import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BudgetTracker from '../components/BudgetTracker';
import BudgetForm from "../components/BudgetForm.tsx";
import BudgetChart from '../components/BudgetChart';
import BudgetComparison from '../components/BudgetComparison';
import useAuthUserId from "../hooks/useAuthUserId.ts";

export default function Dashboard() {
    const userId = useAuthUserId();

    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
    const [spent, setSpent] = useState<{ [key: string]: number }>({});
    const [limits, setLimits] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                const ref = doc(db, `users/${userId}/budgets`, 'current');
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    const rawSpent = data.spent || {};
                    const rawLimits = data.categories || {};
                    setSpent(rawSpent);
                    setLimits(rawLimits);
                    setChartData(
                        Object.entries(rawSpent).map(([name, value]) => ({
                            name,
                            value: Number(value),
                        }))
                    );
                }
            };
            fetchData();
        }
    }, [userId]);

    const downloadCSV = () => {
        const csv = ['Category,Spent,Budget'];
        Object.entries(limits).forEach(([cat, limit]) => {
            const used = spent[cat] || 0;
            csv.push(`${cat},${used},${limit}`);
        });
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'monthly_report.csv';
        link.click();
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Monthly Budget Report', 14, 16);
        autoTable(doc, {
            startY: 20,
            head: [['Category', 'Spent', 'Budget']],
            body: Object.entries(limits).map(([cat, limit]) => {
                const used = spent[cat] || 0;
                return [cat, `$${used}`, `$${limit}`];
            }),
        });
        doc.save('monthly_report.pdf');
    };
    if (!userId) return <div>Loading...</div>;
    return (
        <div>
            <h1>Dashboard</h1>
            <TransactionForm userId={userId} />
            <TransactionList userId={userId} />
            <BudgetForm userId={userId} />
            <BudgetTracker userId={userId} />
            <BudgetComparison spent={spent} limits={limits} />
            <h3>Spending Breakdown</h3>
            <BudgetChart data={chartData} />
            <button onClick={downloadCSV}>Download Report</button>
            <button onClick={downloadPDF}>Download PDF</button>
        </div>
    );
}
