"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Table2,
  Search,
  Download,
  FileSpreadsheet,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, formatTimestamp, getStatusBg, exportCSV, exportExcel } from "@/utils";
import type { SeismicHistoryEntry, IntensityStatus } from "@/types";

interface EventTableProps {
  history: SeismicHistoryEntry[];
}

type SortKey = "timestamp" | "magnitude" | "status" | "x" | "y" | "z";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

export function EventTable({ history }: EventTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | IntensityStatus>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let data = [...history];
    if (filter !== "ALL") data = data.filter((d) => d.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.status.toLowerCase().includes(q) ||
          d.magnitude.toString().includes(q) ||
          formatTimestamp(d.timestamp).toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      let av: number | string = a[sortKey];
      let bv: number | string = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [history, filter, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronUp className="w-3 h-3 text-gray-600" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-accent-blue" />
    ) : (
      <ChevronDown className="w-3 h-3 text-accent-blue" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-2xl p-5 mb-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
            <Table2 className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              Event Log
            </h2>
            <p className="text-xs text-gray-500">
              {filtered.length} of {history.length} records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-8 pr-3 py-1.5 bg-surface-light border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-blue/50 w-40"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value as typeof filter); setPage(0); }}
            className="px-3 py-1.5 bg-surface-light border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50"
          >
            <option value="ALL">All Status</option>
            <option value="WEAK">WEAK</option>
            <option value="MODERATE">MODERATE</option>
            <option value="STRONG">STRONG</option>
          </select>

          {/* Export */}
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-green/10 border border-accent-green/30 hover:bg-accent-green/20 rounded-lg text-sm text-accent-green transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={() => exportExcel(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/30 hover:bg-accent-blue/20 rounded-lg text-sm text-accent-blue transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-light/50">
              {[
                { key: "timestamp" as SortKey, label: "Timestamp" },
                { key: "magnitude" as SortKey, label: "Magnitude" },
                { key: "status" as SortKey, label: "Status" },
                { key: "x" as SortKey, label: "X (m/s²)" },
                { key: "y" as SortKey, label: "Y (m/s²)" },
                { key: "z" as SortKey, label: "Z (m/s²)" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs text-gray-400 font-medium uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-600"
                >
                  No events found
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-white/5 hover:bg-surface-light/30 transition-colors",
                    i === 0 && "bg-accent-blue/3"
                  )}
                >
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">
                    {formatTimestamp(row.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-white tabular-nums">
                    {row.magnitude.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded text-xs font-bold border font-mono",
                        getStatusBg(row.status as IntensityStatus)
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-400 text-xs tabular-nums">
                    {row.x.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 font-mono text-green-400 text-xs tabular-nums">
                    {row.y.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 font-mono text-yellow-400 text-xs tabular-nums">
                    {row.z.toFixed(4)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">
            Page {page + 1} of {totalPages} — {filtered.length} records
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-accent-blue/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(0, Math.min(page - 2 + i, totalPages - 5 + i));
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-mono border transition-colors",
                    pg === page
                      ? "bg-accent-blue border-accent-blue text-white"
                      : "border-white/10 text-gray-400 hover:text-white hover:border-accent-blue/50"
                  )}
                >
                  {pg + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-accent-blue/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
