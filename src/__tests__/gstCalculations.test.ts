import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateInvoiceTotals,
  calculateLineItem,
  formatCurrency,
} from "@/utils/gstCalculations";
import type { InvoiceItem } from "@/types/invoice";

describe("GST calculations", () => {
  it("splits GST into CGST and SGST", () => {
    const result = calculateLineItem(1000, 2, 18, "GST");

    assert.deepEqual(result, {
      cgst: 180,
      sgst: 180,
      igst: 0,
      taxableAmount: 2000,
      lineTotal: 2360,
    });
  });

  it("calculates IGST as a single tax value", () => {
    const result = calculateLineItem(1000, 2, 18, "IGST");

    assert.deepEqual(result, {
      cgst: 0,
      sgst: 0,
      igst: 360,
      taxableAmount: 2000,
      lineTotal: 2360,
    });
  });

  it("totals invoice line items", () => {
    const items: InvoiceItem[] = [
      {
        id: "1",
        description: "Software development",
        hsnCode: "998314",
        quantity: 1,
        unitPrice: 1000,
        gstSlab: 18,
        cgst: 0,
        sgst: 0,
        igst: 0,
        lineTotal: 0,
      },
    ];

    assert.deepEqual(calculateInvoiceTotals(items, "GST"), {
      subtotal: 1000,
      totalCGST: 90,
      totalSGST: 90,
      totalIGST: 0,
      grandTotal: 1180,
    });
  });

  it("formats INR currency", () => {
    assert.equal(formatCurrency(1234.56), "₹1,234.56");
  });
});
