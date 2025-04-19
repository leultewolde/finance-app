interface BudgetComparisonProps {
    spent: { [key: string]: number };
    limits: { [key: string]: number };
}

export default function BudgetComparison({ spent, limits }: BudgetComparisonProps) {
    return (
        <div>
            <h3>Budget vs Spent</h3>
            <ul>
                {Object.entries(limits).map(([category, limit]) => {
                    const used = spent[category] || 0;
                    const percent = Math.round((used / limit) * 100);
                    return (
                        <li key={category} style={{ color: percent > 90 ? 'red' : percent > 75 ? 'orange' : 'black' }}>
                            {category}: ${used} / ${limit} ({percent}%)
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
