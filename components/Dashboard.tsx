"use client";

import { useMemo, useState, useDeferredValue } from "react";
import { Boat, getBoats } from "@/lib/supabase";
import { Sidebar } from "./Sidebar";
import { KPIGrid } from "./KPIGrid";
import { ChartsSection } from "./ChartsSection";
import { InventoryTable } from "./InventoryTable";
import { Menu, X } from "lucide-react";

interface DashboardProps {
    initialBoats: Boat[];
}

export default function Dashboard({ initialBoats }: DashboardProps) {
    // State for Filters
    const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [yearRange, setYearRange] = useState<[number, number]>([1990, 2026]);
    const [lengthRange, setLengthRange] = useState<[number, number]>([0, 100]);
    const [showSold, setShowSold] = useState(false);

    // Mobile Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Deferred filter values for performance (allows UI to stay responsive)
    const deferredBuilders = useDeferredValue(selectedBuilders);
    const deferredModels = useDeferredValue(selectedModels);
    const deferredYearRange = useDeferredValue(yearRange);
    const deferredLengthRange = useDeferredValue(lengthRange);
    const deferredShowSold = useDeferredValue(showSold);

    // Derived State (Filtering) - uses deferred values to prevent lag
    const filteredBoats = useMemo(() => {
        return initialBoats.filter((boat) => {
            // 1. Builder Filter
            if (deferredBuilders.length > 0 && !deferredBuilders.includes(boat.builder)) return false;
            // 2. Model Filter
            if (deferredModels.length > 0 && !deferredModels.includes(boat.model)) return false;
            // 3. Year Filter
            if (boat.year_built < deferredYearRange[0] || boat.year_built > deferredYearRange[1]) return false;
            // 4. Length Filter
            if ((boat.length || 0) < deferredLengthRange[0] || (boat.length || 0) > deferredLengthRange[1]) return false;
            // 5. Sold Filter
            if (!deferredShowSold && boat.is_sold) return false;

            return true;
        });
    }, [initialBoats, deferredBuilders, deferredModels, deferredYearRange, deferredLengthRange, deferredShowSold]);

    // Aggregate Data for Filters
    const allBuilders = useMemo(() => Array.from(new Set(initialBoats.map(b => b.builder).filter(Boolean))).sort(), [initialBoats]);
    const availableModels = useMemo(() => {
        // Models should depend on Selected Builders (if any), otherwise all models
        const source = selectedBuilders.length > 0
            ? initialBoats.filter(b => selectedBuilders.includes(b.builder))
            : initialBoats;
        return Array.from(new Set(source.map(b => b.model).filter(Boolean))).sort();
    }, [initialBoats, selectedBuilders]);

    // Reset Filters Handler
    const resetFilters = () => {
        setSelectedBuilders([]);
        setSelectedModels([]);
        setYearRange([1990, 2026]);
        setLengthRange([0, 100]);
        setShowSold(false);
    };

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground font-sans selection:bg-primary/20 relative">

            {/* MOBILE HEADER */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card shadow-sm sticky top-0 z-50">
                <img src="/batoo-logo.png" alt="batoo" className="h-6" />
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-foreground/70 hover:text-primary transition-colors">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* SIDEBAR - Dark Navy */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-[#121A54] text-white p-6 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex mb-8 items-center">
                    <img src="/batoo-logo.png" alt="batoo" className="h-7 invert brightness-0 invert" />
                </div>

                <Sidebar
                    builders={allBuilders}
                    models={availableModels}
                    selectedBuilders={selectedBuilders}
                    setSelectedBuilders={setSelectedBuilders}
                    selectedModels={selectedModels}
                    setSelectedModels={setSelectedModels}
                    yearRange={yearRange}
                    setYearRange={setYearRange}
                    lengthRange={lengthRange}
                    setLengthRange={setLengthRange}
                    showSold={showSold}
                    setShowSold={setShowSold}
                    onResetFilters={resetFilters}
                />
            </aside>

            {/* OVERLAY for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 lg:p-10 space-y-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end pb-4 border-b border-white/5">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Market Overview</h2>
                        <p className="text-sm text-muted-foreground mt-1">Real-time valuation analytics for {filteredBoats.length} assets</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Last Update</div>
                        <div className="text-sm font-mono text-primary">LIVE</div>
                    </div>
                </div>

                <KPIGrid boats={filteredBoats} />
                <ChartsSection boats={filteredBoats} />
                <InventoryTable boats={filteredBoats} />
            </main>
        </div>
    );
}
