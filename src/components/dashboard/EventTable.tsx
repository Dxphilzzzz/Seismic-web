"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  FileSpreadsheet,
  Search,
  Table2,
} from "lucide-react";
import type { IntensityStatus, SeismicHistoryEntry } from "@/types";
import { cn, exportCSV, exportExcel, formatTimestamp, getStatusBg } from "@/utils";

interface EventTableProps {
  history: SeismicHistoryEntry[];
  isDarkMode?: boolean;
}

type SortKey = "timestamp" | "magnitude" | "status" | "x" | "y" | "z";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

export function EventTable({ history, isDarkMode = false }: EventTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | IntensityStatus>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return history
      .filter((row) => filter === "ALL" || row.status === filter)
      .filter((row) => {
        if (!searchText) return true;
        return (
          row.status.toLowerCase().includes(searchText) ||
          row.magnitude.toString().includes(searchText) ||
          formatTimestamp(row.timestamp).toLowerCase().includes(searchText)
        );
      })
      .sort((a, b) => {
        let av: number | string = a[sortKey];
        let bv: number | string = b[sortKey];
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [filter, history, search, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((value) => (value === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className={cn(
        "mb-6 rounded-xl p-5",
        isDarkMode ? "border border-white/10 bg-[#475569]/90" : "border border-slate-200 bg-white/90 shadow-sm"
      )}
    >
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-blue/20 bg-accent-blue/10">
            <Table2 className="h-5 w-5 text-accent-blue" />
          </div>
          <div>
            <h2 className={cn("text-base font-semibold", isDarkMode ? "text-white" : "text-slate-900")}>Event Log</h2>
            <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-slate-500")}>
              {filtered.length} of {history.length} records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2", isDarkMode ? "text-gray-500" : "text-slate-400")} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              className={cn(
                "w-44 rounded-lg border py-1.5 pl-8 pr-3 text-sm outline-none",
                isDarkMode
                  ? "border-white/10 bg-slate-900/60 text-white placeholder:text-gray-600 focus:border-accent-blue/50"
                  : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-accent-blue/50"
              )}
            />
          </div>

          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value as typeof filter);
              setPage(0);
            }}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm outline-none",
              isDarkMode
                ? "border-white/10 bg-slate-900/60 text-white focus:border-accent-blue/50"
                : "border-slate-200 bg-slate-50 text-slate-800 focus:border-accent-blue/50"
            )}
          >
            <option value="ALL">All Status</option>
            <option value="WEAK">WEAK</option>
            <option value="MODERATE">MODERATE</option>
            <option value="STRONG">STRONG</option>
          </select>

          <button
            type="button"
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 rounded-lg border border-accent-green/30 bg-accent-green/10 px-3 py-1.5 text-sm text-accent-green transition-colors hover:bg-accent-green/20"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
          <button
            type="button"
            onClick={() => void exportExcel(filtered)}
            className="flex items-center gap-1.5 rounded-lg border border-accent-blue/30 bg-accent-blue/10 px-3 py-1.5 text-sm text-accent-blue transition-colors hover:bg-accent-blue/20"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Excel
          </button>
        </div>
      </div>

      <div className={cn("overflow-x-auto rounded-xl border", isDarkMode ? "border-white/5" : "border-slate-200")}>
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className={isDarkMode ? "bg-slate-900/50" : "bg-slate-50/80"}>
              {[
                ["timestamp", "TIMESTAMP"],
                ["magnitude", "MAGNITUDE"],
                ["status", "STATUS"],
                ["x", "X (M/S2)"],
                ["y", "Y (M/S2)"],
                ["z", "Z (M/S2)"],
              ].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as SortKey)}
                  className={cn(
                    "cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors",
                    isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortKey === key ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3 text-accent-blue" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-accent-blue" />
                      )
                    ) : (
                      <ChevronUp className={cn("h-3 w-3", isDarkMode ? "text-gray-600" : "text-slate-300")} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className={cn("px-4 py-12 text-center", isDarkMode ? "text-gray-600" : "text-slate-500")}>
                  No events found
                </td>
              </tr>
            ) : (
              pageData.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t transition-colors",
                    isDarkMode ? "border-white/5 hover:bg-slate-900/40" : "border-slate-200 hover:bg-slate-50",
                    index === 0 && (isDarkMode ? "bg-accent-blue/5" : "bg-sky-50")
                  )}
                >
                  <td className={cn("whitespace-nowrap px-4 py-3 font-mono text-xs", isDarkMode ? "text-gray-400" : "text-slate-500")}>
                    {formatTimestamp(row.timestamp)}
                  </td>
                  <td className={cn("px-4 py-3 font-mono font-bold tabular-nums", isDarkMode ? "text-white" : "text-slate-900")}>
                    {row.magnitude.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded border px-2 py-0.5 font-mono text-xs font-bold",
                        getStatusBg(row.status)
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-blue-400">
                    {row.x.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-green-400">
                    {row.y.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-yellow-400">
                    {row.z.toFixed(4)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            Page {page + 1} of {totalPages} - {filtered.length} records
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={page === 0}
              className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:border-accent-blue/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:border-accent-blue/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.section>
  );
}
