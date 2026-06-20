import type { TaxType } from "@/types/invoice";
import { formatCurrency } from "@/utils/gstCalculations";

type GSTSummaryProps = {
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  grandTotal: number;
  taxType: TaxType;
};

export default function GSTSummary({
  subtotal,
  totalCGST,
  totalSGST,
  totalIGST,
  grandTotal,
  taxType,
}: GSTSummaryProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Live Summary</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-slate-800">
            {formatCurrency(subtotal)}
          </span>
        </div>
        {taxType === "GST" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">CGST</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(totalCGST)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">SGST</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(totalSGST)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">IGST</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(totalIGST)}
            </span>
          </div>
        )}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between text-base">
            <span className="font-semibold text-slate-800">Grand Total</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
