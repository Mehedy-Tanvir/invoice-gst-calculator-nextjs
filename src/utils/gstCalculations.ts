import type { GSTSlab, InvoiceItem, TaxType } from "@/types/invoice";

function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateLineItem(
  unitPrice: number,
  quantity: number,
  gstSlab: GSTSlab,
  taxType: TaxType,
): {
  cgst: number;
  sgst: number;
  igst: number;
  taxableAmount: number;
  lineTotal: number;
} {
  const safeUnitPrice = Number.isFinite(unitPrice) ? unitPrice : 0;
  const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
  const taxableAmount = roundToTwo(safeUnitPrice * safeQuantity);
  const totalTax = roundToTwo((taxableAmount * gstSlab) / 100);
  const cgst = taxType === "GST" ? roundToTwo(totalTax / 2) : 0;
  const sgst = taxType === "GST" ? roundToTwo(totalTax / 2) : 0;
  const igst = taxType === "IGST" ? totalTax : 0;
  const lineTotal = roundToTwo(taxableAmount + cgst + sgst + igst);

  return { cgst, sgst, igst, taxableAmount, lineTotal };
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxType: TaxType,
): {
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  grandTotal: number;
} {
  return items.reduce(
    (totals, item) => {
      const calculated = calculateLineItem(
        item.unitPrice,
        item.quantity,
        item.gstSlab,
        taxType,
      );

      return {
        subtotal: roundToTwo(totals.subtotal + calculated.taxableAmount),
        totalCGST: roundToTwo(totals.totalCGST + calculated.cgst),
        totalSGST: roundToTwo(totals.totalSGST + calculated.sgst),
        totalIGST: roundToTwo(totals.totalIGST + calculated.igst),
        grandTotal: roundToTwo(totals.grandTotal + calculated.lineTotal),
      };
    },
    {
      subtotal: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      grandTotal: 0,
    },
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function validateGSTIN(gstin: string): boolean {
  return /^[0-9A-Z]{15}$/i.test(gstin.trim());
}
