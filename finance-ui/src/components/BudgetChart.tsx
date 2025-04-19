import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1'];

export default function BudgetChart({ data }: { data: { name: string; value: number }[] }) {
    return (
        <PieChart width={300} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
        </PieChart>
    );
}
