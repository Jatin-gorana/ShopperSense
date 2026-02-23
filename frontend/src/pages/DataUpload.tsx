import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Trash2, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';
import GlassCard from '../components/common/GlassCard';
import { transactionService, Transaction } from '../services/transaction.service';

import axios from 'axios';

const REQUIRED_COLUMNS = [
    'customer_id',
    'age',
    'gender',
    'location',
    'product_category',
    'product_name',
    'purchase_amount',
    'quantity',
    'purchase_date',
    'payment_method'
];

const HEADER_MAPPING: Record<string, string> = {
    'customer id': 'customer_id',
    'customerid': 'customer_id',
    'cust id': 'customer_id',
    'age': 'age',
    'gender': 'gender',
    'sex': 'gender',
    'location': 'location',
    'city': 'location',
    'address': 'location',
    'category': 'product_category',
    'product category': 'product_category',
    'item purchased': 'product_name',
    'product': 'product_name',
    'product name': 'product_name',
    'item': 'product_name',
    'purchase amount (usd)': 'purchase_amount',
    'purchase amount': 'purchase_amount',
    'amount': 'purchase_amount',
    'price': 'purchase_amount',
    'payment method': 'payment_method',
    'payment': 'payment_method',
    'quantity': 'quantity',
    'qty': 'quantity',
    'purchase date': 'purchase_date',
    'date': 'purchase_date',
    'timestamp': 'purchase_date'
};

interface DataUploadProps {
    onDataRefresh: () => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataRefresh }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsing, setParsing] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [allData, setAllData] = useState<Transaction[]>([]);
    const [headerMap, setHeaderMap] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState<{ count: number, skipped: number } | null>(null);
    const [progress, setProgress] = useState(0);

    const mapHeaders = (headers: string[]) => {
        const mapping: Record<string, string> = {};
        headers.forEach(header => {
            const normalized = header.toLowerCase().trim();
            if (HEADER_MAPPING[normalized]) {
                mapping[header] = HEADER_MAPPING[normalized];
            } else if (REQUIRED_COLUMNS.includes(normalized.replace(/\s+/g, '_'))) {
                mapping[header] = normalized.replace(/\s+/g, '_');
            }
        });
        return mapping;
    };

    const validateAndCleanData = (results: Papa.ParseResult<any>) => {
        const originalHeaders = results.meta.fields || [];
        const mapping = mapHeaders(originalHeaders);
        setHeaderMap(mapping);

        const mappedFields = Object.values(mapping);
        const essentialFields = ['customer_id', 'product_name', 'purchase_amount'];
        const missingEssential = essentialFields.filter(f => !mappedFields.includes(f));

        if (missingEssential.length > 0) {
            throw new Error(`Could not automatically map essential columns. Please ensure your CSV contains at least: ${essentialFields.join(', ')} (or similar names).`);
        }

        const cleanedData: Transaction[] = results.data
            .filter((row: any) => Object.values(row).some(val => val !== null && val !== ''))
            .map((row: any) => {
                const mappedRow: any = { metadata: {} };
                
                // Map existing fields
                Object.entries(mapping).forEach(([original, target]) => {
                    let value = row[original];
                    
                    if (target === 'purchase_amount') {
                        value = parseFloat(String(value).replace(/[$,]/g, '').trim()) || 0;
                    } else if (target === 'age' || target === 'quantity') {
                        value = parseInt(String(value).trim()) || (target === 'quantity' ? 1 : 0);
                    } else if (target === 'purchase_date') {
                        const date = new Date(value);
                        value = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                    } else if (typeof value === 'string') {
                        value = value.trim();
                        // Normalize case for categories and methods
                        if (target === 'product_category' || target === 'payment_method' || target === 'gender') {
                            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                        }
                    }
                    mappedRow[target] = value;
                });

                // Collect extra columns into metadata
                Object.keys(row).forEach(key => {
                    if (!mapping[key]) {
                        mappedRow.metadata[key] = row[key];
                    }
                });

                // Set defaults for missing fields
                if (!mappedRow.quantity) mappedRow.quantity = 1;
                if (!mappedRow.purchase_date) mappedRow.purchase_date = new Date().toISOString();
                
                // Ensure all REQUIRED_COLUMNS have at least an empty string or default
                REQUIRED_COLUMNS.forEach(col => {
                    if (mappedRow[col] === undefined) {
                        if (col === 'age') mappedRow[col] = 0;
                        else if (col === 'quantity') mappedRow[col] = 1;
                        else if (col === 'purchase_amount') mappedRow[col] = 0;
                        else if (col === 'purchase_date') mappedRow[col] = new Date().toISOString();
                        else mappedRow[col] = 'N/A';
                    }
                });

                return mappedRow as Transaction;
            });

        return cleanedData;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile: File) => {
        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setParsing(true);
        setSuccess(null);

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const cleaned = validateAndCleanData(results);
                    setAllData(cleaned);
                    setPreviewData(cleaned.slice(0, 10));
                    setParsing(false);
                } catch (err: any) {
                    setError(err.message);
                    setParsing(false);
                }
            },
            error: (err) => {
                setError(`Parsing error: ${err.message}`);
                setParsing(false);
            }
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            processFile(droppedFile);
        }
    };

    const handleImport = async () => {
        if (allData.length === 0) return;

        setUploading(true);
        setProgress(10);
        
        const controller = new AbortController();
        try {
            const result = await transactionService.bulkCreateTransactions(allData, controller.signal);
            setSuccess({ 
                count: result.count, 
                skipped: allData.length - result.count 
            });
            onDataRefresh(); // Refresh dashboard data
            setAllData([]);
            setPreviewData([]);
            setFile(null);
            setProgress(100);
        } catch (err: any) {
            if (axios.isCancel(err)) return;
            setError(err.response?.data?.message || 'Failed to import data. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewData([]);
        setAllData([]);
        setError(null);
        setSuccess(null);
        setProgress(0);
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-text-primary hidden sm:block">Data Upload</h1>

            <GlassCard className="p-4 md:p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2 text-center">Upload Transaction Data</h2>
                    <p className="text-text-secondary text-center max-w-md mb-6 text-sm">
                        Upload your CSV dataset to ingest new transactions into the platform. 
                        Required columns: {REQUIRED_COLUMNS.slice(0, 5).join(', ')}...
                    </p>

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`w-full max-w-2xl h-48 md:h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                            file ? 'border-primary bg-primary/5' : 'border-card-border hover:border-secondary hover:bg-secondary/5'
                        }`}
                    >
                        {!file ? (
                            <>
                                <div className="p-3 md:p-4 bg-secondary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                                </div>
                                <p className="text-text-primary font-medium mb-1 text-sm md:text-base text-center px-4">Drag and drop your CSV here</p>
                                <p className="text-text-secondary text-xs mb-4">or</p>
                                <label className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium">
                                    Select File
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </>
                        ) : (
                            <div className="flex flex-col items-center animate-in fade-in duration-500">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <FileText className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-text-primary font-medium mb-1 text-sm truncate max-w-[200px] md:max-w-md px-4">{file.name}</p>
                                <p className="text-text-secondary text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                                <button 
                                    onClick={clearFile}
                                    className="mt-4 text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
                                >
                                    <Trash2 className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </GlassCard>

            <AnimatePresence>
                {parsing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-center p-8"
                    >
                        <Loader2 className="w-6 h-6 text-primary animate-spin mr-3" />
                        <span className="text-text-primary font-medium">Parsing CSV data...</span>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GlassCard className="p-4 border-l-4 border-red-500 bg-red-500/5">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                                <div>
                                    <h3 className="text-red-500 font-bold">Validation Error</h3>
                                    <p className="text-text-secondary text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <GlassCard className="p-6 border-l-4 border-primary bg-primary/5">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-primary/20 rounded-full mr-4">
                                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-primary font-bold text-lg">✅ Data mapped & imported successfully</h3>
                                                    <p className="text-text-secondary">⚡ Dashboard updated</p>
                                                    <div className="mt-2 flex gap-4 text-sm">
                                                        <span className="text-primary font-semibold">Imported: {success.count} rows</span>
                                                        {success.skipped > 0 && <span className="text-yellow-500 font-semibold">Skipped (duplicates): {success.skipped} rows</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                )}
                
                                {previewData.length > 0 && !uploading && !success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-bold text-text-primary">Data Preview</h3>
                                                    <span className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium">
                                                        {allData.length} rows detected
                                                    </span>
                                                    <span className="text-secondary text-xs font-semibold">“Columns mapped successfully”</span>
                                                </div>
                                                <button
                                                    onClick={handleImport}
                                                    className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    Import Data <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                
                                            {/* Column Mapping Preview */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 bg-card/50 rounded-xl border border-card-border">
                                                {Object.entries(headerMap).map(([original, mapped]) => (
                                                    <div key={original} className="flex flex-col p-2 bg-background/50 rounded border border-card-border overflow-hidden">
                                                        <span className="text-[10px] text-text-secondary uppercase font-bold">Original</span>
                                                        <span className="text-xs text-text-primary truncate mb-1">{original}</span>
                                                        <ArrowRight className="w-3 h-3 text-text-secondary my-0.5 opacity-30" />
                                                        <span className="text-[10px] text-primary uppercase font-bold">Mapped</span>
                                                        <span className="text-xs text-primary truncate font-semibold">{mapped.replace('_', ' ')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                
                                        <div className="overflow-x-auto -mx-6 px-6">
                                            <div className="inline-block min-w-full rounded-xl border border-card-border bg-card/30 overflow-hidden">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-card/50 border-b border-card-border">
                                                            {REQUIRED_COLUMNS.map(col => (
                                                                <th key={col} className="px-4 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider min-w-[120px]">
                                                                    {col.replace('_', ' ')}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-card-border">
                                                        {previewData.map((row, idx) => (
                                                            <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                                                {REQUIRED_COLUMNS.map(col => (
                                                                    <td key={col} className="px-4 py-3 text-xs md:text-sm text-text-secondary">
                                                                        {col === 'purchase_amount' ? `$${row[col]}` : col === 'purchase_date' ? row[col].split('T')[0] : row[col]}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {uploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <GlassCard className="p-8 md:p-10 w-full max-w-md flex flex-col items-center">
                            <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin mb-6" />
                            <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2 text-center">Ingesting Data...</h3>
                            <p className="text-text-secondary text-center mb-6 text-sm">Processing {allData.length} records. This might take a moment.</p>
                            
                            <div className="w-full bg-card-border rounded-full h-2 mb-2 overflow-hidden">
                                <motion.div 
                                    className="bg-primary h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-primary font-bold">{progress}% Completed</span>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DataUpload;
