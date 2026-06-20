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
  return (
    <section
      className="mx-auto w-full max-w-5xl bg-white p-6 text-slate-800 shadow-sm sm:p-10"
      id="invoice-preview"
    >
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Tax Invoice
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            {invoice.seller.name || "Seller Business"}
          </h1>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>{invoice.seller.address}</p>
            <p>
              {[invoice.seller.city, invoice.seller.state, invoice.seller.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>GSTIN: {invoice.seller.gstin || "-"}</p>
            <p>{[invoice.seller.email, invoice.seller.phone].filter(Boolean).join(" | ")}</p>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 p-4 text-sm">
          <div className="grid grid-cols-[120px_1fr] gap-y-2">
            <span className="text-slate-500">Invoice No.</span>
            <span className="font-semibold text-slate-800">
              {invoice.invoiceNumber}
            </span>
            <span className="text-slate-500">Invoice Date</span>
            <span>{formatDate(invoice.invoiceDate)}</span>
            <span className="text-slate-500">Due Date</span>
            <span>{formatDate(invoice.dueDate)}</span>
            <span className="text-slate-500">Tax Type</span>
            <span>{invoice.taxType}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 py-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Bill From
          </h2>
          <div className="mt-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">{invoice.seller.name}</p>
            <p>{invoice.seller.address}</p>
            <p>
              {[invoice.seller.city, invoice.seller.state, invoice.seller.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Bill To
          </h2>
          <div className="mt-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">
              {invoice.buyer.name || "Buyer Business"}
            </p>
            <p>{invoice.buyer.address}</p>
            <p>
              {[invoice.buyer.city, invoice.buyer.state, invoice.buyer.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>GSTIN: {invoice.buyer.gstin || "-"}</p>
            <p>{[invoice.buyer.email, invoice.buyer.phone].filter(Boolean).join(" | ")}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3 font-semibold">Item</th>
              <th className="px-3 py-3 font-semibold">HSN</th>
              <th className="px-3 py-3 text-right font-semibold">Qty</th>
              <th className="px-3 py-3 text-right font-semibold">Rate</th>
              <th className="px-3 py-3 text-right font-semibold">GST</th>
              <th className="px-3 py-3 text-right font-semibold">Tax</th>
              <th className="px-3 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-4 font-medium text-slate-800">
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
                <td className="px-3 py-4 text-right font-semibold text-slate-800">
                  {formatCurrency(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl text-sm text-slate-600">
          <h2 className="font-semibold text-slate-800">Notes</h2>
          <p className="mt-2 whitespace-pre-line">
            {invoice.notes || "Thank you for your business."}
          </p>
        </div>
        <div className="w-full rounded-lg border border-slate-200 p-4 text-sm sm:max-w-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxType === "GST" ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CGST</span>
                  <span>{formatCurrency(invoice.totalCGST)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SGST</span>
                  <span>{formatCurrency(invoice.totalSGST)}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">IGST</span>
                <span>{formatCurrency(invoice.totalIGST)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between text-lg font-bold text-slate-800">
                <span>Grand Total</span>
                <span className="text-blue-600">
                  {formatCurrency(invoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
