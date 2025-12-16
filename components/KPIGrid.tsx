"use client";

import { Boat } from "@/lib/supabase";
import { useMemo } from "react";

export function KPIGrid({ boats }: { boats: Boat[] }) {

    const metrics = useMemo(() => {
        const total = boats.length;
        if (total === 0) return {
            avgPrice: 0, avgPricePerM: 0, total: 0,
            totalValue: 0, soldCount: 0, priceMin: 0, priceMax: 0, topBuilder: '-', avgLength: 0
        };

        const totalPrice = boats.reduce((sum, b) => sum + (b.price_eur || 0), 0);
        const avgPrice = totalPrice / total;

        const validLengths = boats.filter(b => b.length > 0 && b.price_eur > 0);
        const avgPricePerM = validLengths.reduce((sum, b) => sum + (b.price_eur / b.length), 0) / (validLengths.length || 1);

        const totalValue = totalPrice;
        const soldCount = boats.filter(b => b.is_sold).length;
        const prices = boats.map(b => b.price_eur).filter(p => p > 0);
        const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
        const priceMax = prices.length > 0 ? Math.max(...prices) : 0;

        const builderCounts: Record<string, number> = {};
        boats.forEach(b => { builderCounts[b.builder] = (builderCounts[b.builder] || 0) + 1; });
        const topBuilder = Object.entries(builderCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

        const avgLength = boats.reduce((sum, b) => sum + (b.length || 0), 0) / (total || 1);

        return { avgPrice, avgPricePerM, total, totalValue, soldCount, priceMin, priceMax, topBuilder, avgLength };
    }, [boats]);

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
        return `€${val.toFixed(0)}`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard title="Total Boats" value={metrics.total.toString()} subtext="In inventory" />
            <KPICard title="Total Value" value={formatCurrency(metrics.totalValue)} subtext="Market cap" />
            <KPICard title="Avg. Price" value={formatCurrency(metrics.avgPrice)} subtext="Per boat" />
            <KPICard title="Avg. €/Meter" value={formatCurrency(metrics.avgPricePerM)} subtext="Per linear m" />
            <KPICard title="Price Range" value={`${formatCurrency(metrics.priceMin)} - ${formatCurrency(metrics.priceMax)}`} subtext="Min to Max" small />
            <KPICard title="Sold" value={metrics.soldCount.toString()} subtext="Boats sold" />
            <KPICard title="Top Builder" value={metrics.topBuilder} subtext="Most listings" small />
            <KPICard title="Avg. Length" value={`${metrics.avgLength.toFixed(1)}m`} subtext="LOA average" />
        </div>
    );
}

function KPICard({ title, value, subtext, small }: { title: string, value: string, subtext: string, small?: boolean }) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {title}
            </h3>
            <div className={`font-semibold text-foreground ${small ? 'text-base truncate' : 'text-xl'}`}>
                {value}
            </div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-1">
                {subtext}
            </p>
        </div>
    );
}
