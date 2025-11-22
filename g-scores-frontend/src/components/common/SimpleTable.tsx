"use client";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "../ui/table";

export interface SimpleColumn {
  key: string;
  label: string;
}

interface SimpleTableProps {
  columns: SimpleColumn[];
  rows: any[];
}

export default function SimpleTable({ columns, rows }: SimpleTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
      <Table className="min-w-full text-sm font-medium text-center border border-gray-300">
        <TableHeader>
          <TableRow className="bg-primary/10 text-primary dark:bg-primary/20  ">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="px-4 py-3 border border-gray-300 text-center font-semibold uppercase text-xs tracking-wide text-primary dark:text-white "
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              className="hover:bg-primary/5 dark:hover:bg-white/10 transition-colors border-b border-gray-100 dark:border-neutral-800 text-center"
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={`px-4 py-3 border border-gray-300 ${col.key === "rank"
                    ? "font-bold text-primary dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 text-center"
                    }`}
                >
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
