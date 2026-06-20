"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvoicePreview from "@/components/InvoicePreview";
import type { InvoiceDetails } from "@/types/invoice";
import { exportInvoicePDF } from "@/utils/pdfExport";

const storageKey = "invoice-gst-calculator:invoice";

export default function PreviewPage() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedInvoice = window.localStorage.getItem(storageKey);

    if (!storedInvoice) {
      setError("No invoice found. Create an invoice first.");
      return;
    }

    try {
      setInvoice(JSON.parse(storedInvoice) as InvoiceDetails);
    } catch {
      setError("Saved invoice data could not be read.");
    }
  }, []);

  const handleDownload = async () => {
    if (!invoice) {
      return;
    }

    setIsDownloading(true);
    setError("");

    try {
      await exportInvoicePDF(
        "invoice-preview",
        `invoice-${invoice.invoiceNumber || "draft"}.pdf`,
      );
    } catch (downloadError) {
      console.error(downloadError);
      setError("Unable to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Preview
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-800">
              Invoice Preview
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              type="button"
              onClick={() => router.push("/")}
            >
              Back to Edit
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={!invoice || isDownloading}
              onClick={handleDownload}
            >
              {isDownloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {invoice ? (
          <InvoicePreview invoice={invoice} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
            Invoice preview will appear here after saving from the builder.
          </div>
        )}
      </div>
    </div>
  );
}
