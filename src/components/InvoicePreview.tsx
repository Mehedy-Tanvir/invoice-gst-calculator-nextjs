"use client";

import { useEffect, useState, useRef } from "react";
import type { InvoiceDetails } from "@/types/invoice";
import { formatCurrency } from "@/utils/gstCalculations";

type InvoicePreviewProps = {
  invoice: InvoiceDetails;
};

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const preview = previewRef.current;
      if (!container || !preview) return;

      const containerWidth = container.clientWidth;
      const targetWidth = 800; // Fixed visual width of A4 preview page sheet for clean scaling

      const newScale = Math.min(1, containerWidth / targetWidth);
      setScale(newScale);
      setHeight(preview.clientHeight * newScale);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (previewRef.current) {
      resizeObserver.observe(previewRef.current);
    }
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden flex justify-center items-start"
      style={height ? { height: `${height}px` } : undefined}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: "800px",
          minWidth: "800px",
          flexShrink: 0,
        }}
      >
        <div
          ref={previewRef}
          className="bg-white p-8 text-slate-800 shadow-md border border-slate-200"
          id="invoice-preview"
        >
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Tax Invoice
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-800 max-w-md break-words">
                {invoice.seller.name || "Seller Business"}
              </h1>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p className="whitespace-pre-line max-w-sm break-words">{invoice.seller.address}</p>
                <p>
                  {[invoice.seller.city, invoice.seller.state, invoice.seller.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="font-medium text-slate-700">GSTIN: {invoice.seller.gstin || "-"}</p>
                <p className="text-xs">{[invoice.seller.email, invoice.seller.phone].filter(Boolean).join(" | ")}</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 text-sm bg-slate-50/50 min-w-[240px]">
              <div className="grid grid-cols-[110px_1fr] gap-y-2">
                <span className="text-slate-500">Invoice No.</span>
                <span className="font-semibold text-slate-800 break-all">
                  {invoice.invoiceNumber}
                </span>
                <span className="text-slate-500">Invoice Date</span>
                <span className="text-slate-700 font-medium">{formatDate(invoice.invoiceDate)}</span>
                <span className="text-slate-500">Due Date</span>
                <span className="text-slate-700 font-medium">{formatDate(invoice.dueDate)}</span>
                <span className="text-slate-500">Tax Type</span>
                <span className="text-slate-700 font-medium font-semibold">{invoice.taxType}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 py-6 sm:grid-cols-2">
            <div className="border-r border-slate-100 pr-4 last:border-r-0">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Bill From
              </h2>
              <div className="mt-3 text-sm text-slate-700">
                <p className="font-bold text-slate-800 max-w-sm break-words">{invoice.seller.name}</p>
                <p className="whitespace-pre-line max-w-sm break-words mt-1">{invoice.seller.address}</p>
                <p className="mt-1">
                  {[invoice.seller.city, invoice.seller.state, invoice.seller.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Bill To
              </h2>
              <div className="mt-3 text-sm text-slate-700">
                <p className="font-bold text-slate-800 max-w-sm break-words">
                  {invoice.buyer.name || "Buyer Business"}
                </p>
                <p className="whitespace-pre-line max-w-sm break-words mt-1">{invoice.buyer.address}</p>
                <p className="mt-1">
                  {[invoice.buyer.city, invoice.buyer.state, invoice.buyer.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="mt-2 font-medium text-slate-800">GSTIN: {invoice.buyer.gstin || "-"}</p>
                <p className="text-xs text-slate-500 mt-1">{[invoice.buyer.email, invoice.buyer.phone].filter(Boolean).join(" | ")}</p>
              </div>
            </div>
          </div>

          <div className="mt-2 overflow-x-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3 font-semibold w-[35%]">Item</th>
                  <th className="px-3 py-3 font-semibold w-[15%]">HSN</th>
                  <th className="px-3 py-3 text-right font-semibold w-[10%]">Qty</th>
                  <th className="px-3 py-3 text-right font-semibold w-[12%]">Rate</th>
                  <th className="px-3 py-3 text-right font-semibold w-[8%]">GST</th>
                  <th className="px-3 py-3 text-right font-semibold w-[10%]">Tax</th>
                  <th className="px-3 py-3 text-right font-semibold w-[10%]">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-4 font-medium text-slate-800 break-words max-w-xs">
                      {item.description || "Untitled item"}
                    </td>
                    <td className="px-3 py-4 text-slate-600">{item.hsnCode || "-"}</td>
                    <td className="px-3 py-4 text-right text-slate-600">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-4 text-right text-slate-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-3 py-4 text-right text-slate-600">
                      {item.gstSlab}%
                    </td>
                    <td className="px-3 py-4 text-right text-slate-600">
                      {invoice.taxType === "GST"
                        ? formatCurrency(item.cgst + item.sgst)
                        : formatCurrency(item.igst)}
                    </td>
                    <td className="px-3 py-4 text-right font-bold text-slate-800">
                      {formatCurrency(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-t border-slate-100 pt-6">
            <div className="max-w-md text-sm text-slate-600">
              <h2 className="font-semibold text-slate-800 uppercase tracking-wider text-xs">Notes</h2>
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-500">
                {invoice.notes || "Thank you for your business."}
              </p>
            </div>
            <div className="w-full rounded-lg border border-slate-200 p-4 text-sm sm:max-w-sm bg-slate-50/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxType === "GST" ? (
                  <>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>CGST</span>
                      <span className="font-medium text-slate-800">{formatCurrency(invoice.totalCGST)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>SGST</span>
                      <span className="font-medium text-slate-800">{formatCurrency(invoice.totalSGST)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>IGST</span>
                    <span className="font-medium text-slate-800">{formatCurrency(invoice.totalIGST)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between text-base font-bold text-slate-800">
                    <span>Grand Total</span>
                    <span className="text-xl font-extrabold text-blue-600">
                      {formatCurrency(invoice.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
