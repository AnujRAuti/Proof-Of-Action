"use client"
import React, { useState } from 'react';
import { compareImages } from '@/services/api-service';

export function ImageProcessor() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>("");

    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);
    const [beforeLat, setBeforeLat] = useState<string>("");
    const [beforeLng, setBeforeLng] = useState<string>("");
    const [afterLat, setAfterLat] = useState<string>("");
    const [afterLng, setAfterLng] = useState<string>("");
    const [beforeDate, setBeforeDate] = useState<string>("");
    const [afterDate, setAfterDate] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!beforeFile || !afterFile) return;

        setLoading(true);
        try {
            const data = await compareImages({
                beforeImg: beforeFile,
                afterImg: afterFile,
                beforeCoords: [parseFloat(beforeLat), parseFloat(beforeLng)],
                afterCoords: [parseFloat(afterLat), parseFloat(afterLng)],
                beforeDate,
                afterDate,
            });
            setResult(data.response);
        } catch (error) {
            console.error(error);
            setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col justify-between p-6 max-w-5xl mx-auto bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
                <h2 className="text-xl font-semibold tracking-tight text-slate-100">Image analysis proof of concept</h2>

                <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-sm bg-slate-950/40">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                            <tr>
                                <th className="p-3 font-medium">Parameter</th>
                                <th className="p-3 font-medium">Before Image</th>
                                <th className="p-3 font-medium">After Image</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            <tr>
                                <td className="p-3 font-medium text-slate-200">Source File</td>
                                <td className="p-3">
                                    <input 
                                        type="file" 
                                        required 
                                        onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-600 file:text-white hover:file:bg-orange-500 cursor-pointer"
                                    />
                                </td>
                                <td className="p-3">
                                    <input 
                                        type="file" 
                                        required 
                                        onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-600 file:text-white hover:file:bg-orange-500 cursor-pointer"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-slate-200">Latitude</td>
                                <td className="p-3">
                                    <input type="number" step="any" value={beforeLat} onChange={(e) => setBeforeLat(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500" placeholder="" />
                                </td>
                                <td className="p-3">
                                    <input type="number" step="any" value={afterLat} onChange={(e) => setAfterLat(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500" placeholder="" />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-slate-200">Longitude</td>
                                <td className="p-3">
                                    <input type="number" step="any" value={beforeLng} onChange={(e) => setBeforeLng(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500" placeholder="" />
                                </td>
                                <td className="p-3">
                                    <input type="number" step="any" value={afterLng} onChange={(e) => setAfterLng(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500" placeholder="" />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-slate-200">Capture Date</td>
                                <td className="p-3">
                                    <input type="date" value={beforeDate} onChange={(e) => setBeforeDate(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-orange-500" />
                                </td>
                                <td className="p-3">
                                    <input type="date" value={afterDate} onChange={(e) => setAfterDate(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:border-orange-500" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 px-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {loading ? 'Processing Analysis...' : 'Process Images'}
                </button>
            </form>

            {result && (
                <div className="mt-6 flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-400">Analysis Result:</span>
                    <div className="max-h-60 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
