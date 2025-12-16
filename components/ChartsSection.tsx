"use client";

import { Boat } from "@/lib/supabase";
import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export function ChartsSection({ boats }: { boats: Boat[] }) {

    // Pre-compute chart data with useMemo to reduce re-renders
    const scatterData = useMemo(() =>
        boats.map(b => ({
            x: Number(b.year_built),
            y: Number(b.price_eur),
            z: Number(b.length),
            name: b.model,
            builder: b.builder
        })).filter(d => !isNaN(d.x) && !isNaN(d.y) && d.x > 1900 && d.y > 0).slice(0, 500), // Limit points for performance
        [boats]);

    const histogramData = useMemo(() => [
        { range: '<100k', count: boats.filter(b => b.price_eur < 100000).length },
        { range: '100k-500k', count: boats.filter(b => b.price_eur >= 100000 && b.price_eur < 500000).length },
        { range: '500k-1M', count: boats.filter(b => b.price_eur >= 500000 && b.price_eur < 1000000).length },
        { range: '1M-5M', count: boats.filter(b => b.price_eur >= 1000000 && b.price_eur < 5000000).length },
        { range: '>5M', count: boats.filter(b => b.price_eur >= 5000000).length },
    ], [boats]);

    if (boats.length === 0) {
        return (
            <div className="flex items-center justify-center h-[350px] border border-border rounded-xl bg-card text-muted-foreground text-sm">
                No data available for current filters
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scatter Plot */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-semibold mb-4 text-foreground uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0080FF]" />
                    Price vs Year
                </h3>
                <div className="w-full h-[280px] overflow-hidden">
                    <ScatterChart width={480} height={280} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis type="number" dataKey="x" name="Year" domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                        <YAxis type="number" dataKey="y" name="Price" tickFormatter={(val) => `€${val / 1000}k`} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                        <ZAxis type="number" dataKey="z" range={[30, 200]} name="Length" unit="m" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                            formatter={(value: any, name: any) => [name === 'Price' ? `€${(value as number).toLocaleString()}` : value, name]}
                        />
                        <Scatter name="Boats" data={scatterData} fill="#0080FF" fillOpacity={0.6} isAnimationActive={false} />
                    </ScatterChart>
                </div>
            </div>

            {/* Price Distribution */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-semibold mb-4 text-foreground uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0080FF]" />
                    Price Distribution
                </h3>
                <div className="w-full h-[280px] overflow-hidden">
                    <BarChart width={480} height={280} data={histogramData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
                        <Bar dataKey="count" fill="#0080FF" radius={[4, 4, 0, 0]} barSize={50} isAnimationActive={false} />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}
