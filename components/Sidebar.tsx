"use client";

import { useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Search, RefreshCw, FilterX } from "lucide-react";

interface SidebarProps {
    builders: string[];
    models: string[];
    selectedBuilders: string[];
    setSelectedBuilders: (val: string[]) => void;
    selectedModels: string[];
    setSelectedModels: (val: string[]) => void;
    yearRange: [number, number];
    setYearRange: (val: [number, number]) => void;
    lengthRange: [number, number];
    setLengthRange: (val: [number, number]) => void;
    showSold: boolean;
    setShowSold: (val: boolean) => void;
    onResetFilters: () => void;
}

export function Sidebar({
    builders,
    models,
    selectedBuilders,
    setSelectedBuilders,
    selectedModels,
    setSelectedModels,
    yearRange,
    setYearRange,
    lengthRange,
    setLengthRange,
    showSold,
    setShowSold,
    onResetFilters,
}: SidebarProps) {

    const [builderSearch, setBuilderSearch] = useState("");
    const [modelSearch, setModelSearch] = useState("");

    // Local state for smooth slider experience (preventing lag)
    const [localYearRange, setLocalYearRange] = useState<[number, number]>(yearRange);
    const [localLengthRange, setLocalLengthRange] = useState<[number, number]>(lengthRange);

    // Sync local state when parent state changes (e.g. on Reset)
    useEffect(() => {
        setLocalYearRange(yearRange);
    }, [yearRange]);

    useEffect(() => {
        setLocalLengthRange(lengthRange);
    }, [lengthRange]);

    // Local state for text inputs to avoid hydration mismatch
    const [yearInputs, setYearInputs] = useState({ min: yearRange[0].toString(), max: yearRange[1].toString() });
    const [lengthInputs, setLengthInputs] = useState({ min: lengthRange[0].toString(), max: lengthRange[1].toString() });

    useEffect(() => {
        setYearInputs({ min: yearRange[0].toString(), max: yearRange[1].toString() });
    }, [yearRange]);

    useEffect(() => {
        setLengthInputs({ min: lengthRange[0].toString(), max: lengthRange[1].toString() });
    }, [lengthRange]);

    const toggleBuilder = (b: string) => {
        if (selectedBuilders.includes(b)) {
            setSelectedBuilders(selectedBuilders.filter((x) => x !== b));
        } else {
            setSelectedBuilders([...selectedBuilders, b]);
        }
    };

    const toggleModel = (m: string) => {
        if (selectedModels.includes(m)) {
            setSelectedModels(selectedModels.filter((x) => x !== m));
        } else {
            setSelectedModels([...selectedModels, m]);
        }
    };

    const filteredBuilders = builders.filter(b => b.toLowerCase().includes(builderSearch.toLowerCase()));
    const filteredModels = models.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()));

    // Dark sidebar styles
    const inputClass = "w-full bg-white/10 border border-white/20 rounded-md pl-8 pr-2 py-1.5 text-xs text-white placeholder:text-white/50 focus:ring-1 focus:ring-[#0080FF] outline-none transition-all";
    const listClass = "h-40 overflow-y-auto border border-white/20 rounded-lg p-2 space-y-1 bg-white/5 backdrop-blur-sm";

    return (
        <div className="space-y-6 pr-2 relative text-white">

            {/* Reset Button */}
            <button
                onClick={onResetFilters}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-xs font-medium py-2.5 rounded-lg border border-white/20 text-white/80 hover:text-white transition-all duration-200"
            >
                <FilterX size={14} />
                Reset Filters
            </button>

            {/* Builders Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Builder</label>

                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search builders..."
                        value={builderSearch}
                        onChange={(e) => setBuilderSearch(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className={listClass}>
                    {filteredBuilders.length === 0 ? (
                        <div className="text-xs text-white/50 p-2 text-center italic">No matches</div>
                    ) : (
                        filteredBuilders.map((b) => (
                            <div key={b} className="flex items-center space-x-3 group cursor-pointer hover:bg-white/10 p-1.5 rounded transition-colors" onClick={() => toggleBuilder(b)}>
                                <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${selectedBuilders.includes(b) ? 'bg-[#0080FF] border-[#0080FF]' : 'border-white/30 group-hover:border-[#0080FF]/50'}`}>
                                    {selectedBuilders.includes(b) && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
                                </div>
                                <span className={`text-sm transition-colors ${selectedBuilders.includes(b) ? 'text-white font-medium' : 'text-white/70 group-hover:text-white'}`}>
                                    {b}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Models Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Model</label>

                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search models..."
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <div className={listClass}>
                    {filteredModels.length === 0 ? (
                        <div className="text-xs text-white/50 p-2 text-center italic">
                            {models.length === 0 ? "Select a builder first" : "No matches"}
                        </div>
                    ) : (
                        filteredModels.map((m) => (
                            <div key={m} className="flex items-center space-x-3 group cursor-pointer hover:bg-white/10 p-1.5 rounded transition-colors" onClick={() => toggleModel(m)}>
                                <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${selectedModels.includes(m) ? 'bg-accent border-accent' : 'border-muted-foreground/50 group-hover:border-accent/50'}`}>
                                    {selectedModels.includes(m) && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
                                </div>
                                <span className={`text-sm transition-colors ${selectedModels.includes(m) ? 'text-white font-medium' : 'text-white/70 group-hover:text-white'}`}>
                                    {m}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Year Range */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Year Built</label>
                    <span className="text-xs font-mono text-[#9AFFFF]">{localYearRange[0]} — {localYearRange[1]}</span>
                </div>
                <div className="px-1">
                    <Slider
                        range
                        min={1980}
                        max={2026}
                        value={localYearRange}
                        onChange={(val) => setLocalYearRange(val as [number, number])}
                        onAfterChange={(val) => setYearRange(val as [number, number])}
                        trackStyle={[{ backgroundColor: '#0080FF' }]}
                        handleStyle={[
                            { borderColor: '#0080FF', backgroundColor: '#fff', opacity: 1 },
                            { borderColor: '#0080FF', backgroundColor: '#fff', opacity: 1 }
                        ]}
                        railStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <input
                        type="number"
                        className="w-full h-8 text-xs bg-white/10 border border-white/20 rounded px-2 text-center text-white focus:border-[#0080FF] focus:ring-1 focus:ring-[#0080FF] outline-none"
                        value={yearInputs.min}
                        onChange={(e) => setYearInputs(prev => ({ ...prev, min: e.target.value }))}
                        onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            const newVal: [number, number] = [isNaN(val) ? 1980 : val, yearRange[1]];
                            setLocalYearRange(newVal);
                            setYearRange(newVal);
                        }}
                    />
                    <span className="text-white/40 text-xs">-</span>
                    <input
                        type="number"
                        className="w-full h-8 text-xs bg-white/10 border border-white/20 rounded px-2 text-center text-white focus:border-[#0080FF] focus:ring-1 focus:ring-[#0080FF] outline-none"
                        value={yearInputs.max}
                        onChange={(e) => setYearInputs(prev => ({ ...prev, max: e.target.value }))}
                        onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            const newVal: [number, number] = [yearRange[0], isNaN(val) ? 2026 : val];
                            setLocalYearRange(newVal);
                            setYearRange(newVal);
                        }}
                    />
                </div>
            </div>

            {/* Length Range */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Length (m)</label>
                    <span className="text-xs font-mono text-[#9AFFFF]">{localLengthRange[0]}m — {localLengthRange[1]}m</span>
                </div>
                <div className="px-1">
                    <Slider
                        range
                        min={0}
                        max={100}
                        value={localLengthRange}
                        onChange={(val) => setLocalLengthRange(val as [number, number])}
                        onAfterChange={(val) => setLengthRange(val as [number, number])}
                        trackStyle={[{ backgroundColor: '#0080FF' }]}
                        handleStyle={[
                            { borderColor: '#0080FF', backgroundColor: '#fff', opacity: 1 },
                            { borderColor: '#0080FF', backgroundColor: '#fff', opacity: 1 }
                        ]}
                        railStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <input
                        type="number"
                        className="w-full h-8 text-xs bg-white/10 border border-white/20 rounded px-2 text-center text-white focus:border-[#0080FF] focus:ring-1 focus:ring-[#0080FF] outline-none"
                        value={lengthInputs.min}
                        onChange={(e) => setLengthInputs(prev => ({ ...prev, min: e.target.value }))}
                        onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            const newVal: [number, number] = [isNaN(val) ? 0 : val, lengthRange[1]];
                            setLocalLengthRange(newVal);
                            setLengthRange(newVal);
                        }}
                    />
                    <span className="text-white/40 text-xs">-</span>
                    <input
                        type="number"
                        className="w-full h-8 text-xs bg-white/10 border border-white/20 rounded px-2 text-center text-white focus:border-[#0080FF] focus:ring-1 focus:ring-[#0080FF] outline-none"
                        value={lengthInputs.max}
                        onChange={(e) => setLengthInputs(prev => ({ ...prev, max: e.target.value }))}
                        onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            const newVal: [number, number] = [lengthRange[0], isNaN(val) ? 100 : val];
                            setLocalLengthRange(newVal);
                            setLengthRange(newVal);
                        }}
                    />
                </div>
            </div>

            {/* Sold Toggle */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-2">
                <label className="text-sm font-medium text-white/80">Include Sold Boats</label>
                <button
                    onClick={() => setShowSold(!showSold)}
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${showSold ? 'bg-[#0080FF]' : 'bg-white/20'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${showSold ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

        </div>
    );
}
