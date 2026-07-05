'use client';

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { StockSeries } from '@/lib/widgets/twelveData';

interface StockChartProps {
  series: StockSeries;
  color: string;
}

export default function StockChart({ series, color }: StockChartProps) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={series.points}>
        <XAxis dataKey="time" hide />
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip
          formatter={(value) => Number(value).toFixed(2)}
          labelFormatter={() => series.symbol}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
