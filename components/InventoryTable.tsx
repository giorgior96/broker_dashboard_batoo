"use client";

import { Boat } from "@/lib/supabase";

export function InventoryTable({ boats }: { boats: Boat[] }) {
    return (
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-semibold text-foreground tracking-tight flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Inventory List
                    <span className="text-xs text-muted-foreground font-normal ml-2 bg-secondary/50 px-2 py-0.5 rounded text-white">{boats.length} assets</span>
                </h3>
                <button className="text-xs text-accent hover:text-accent/80 transition-colors uppercase font-medium tracking-wide">
                    Export CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/20 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Builder</th>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Length</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {boats.slice(0, 50).map((boat) => (
                            <tr key={boat.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-4 py-3">
                                    {boat.image_url ? (
                                        <img src={boat.image_url} alt="boat" className="w-12 h-8 object-cover rounded shadow-sm border border-border/50" />
                                    ) : (
                                        <div className="w-12 h-8 bg-secondary/50 rounded flex items-center justify-center text-[8px] text-muted-foreground">N/A</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 font-medium text-foreground group-hover:text-primary transition-colors">{boat.builder}</td>
                                <td className="px-4 py-3 text-muted-foreground">{boat.model}</td>
                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{boat.year_built}</td>
                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{boat.length}m</td>
                                <td className="px-4 py-3 font-mono text-foreground font-semibold">
                                    {boat.price_eur ? `€${boat.price_eur.toLocaleString()}` : <span className="text-muted-foreground/30">-</span>}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {boat.is_sold ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] uppercase font-bold bg-white/5 text-muted-foreground border border-white/10">
                                            SOLD
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] uppercase font-bold bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                            ACTIVE
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {boats.length > 50 && (
                <div className="p-2 text-center text-xs text-muted-foreground bg-muted/20">
                    Showing 50 of {boats.length} rows
                </div>
            )}
        </div>
    );
}
