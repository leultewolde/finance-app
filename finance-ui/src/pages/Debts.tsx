import DebtForm from '../components/DebtForm';
import DebtList from '../components/DebtList';
import useAuthUserId from "../hooks/useAuthUserId.ts";

export default function DebtsPage() {
    const userId = useAuthUserId();

    if (!userId) return <div>Loading...</div>;
    return (
        <div>
            <h1>Debts</h1>
            <DebtForm userId={userId} />
            <DebtList userId={userId} />
        </div>
    );
}
