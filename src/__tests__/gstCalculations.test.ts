import type { GSTSlab, InvoiceItem } from "@/types/invoice";
import {
  calculateInvoiceTotals,
  calculateLineItem,
  formatCurrency,
  validateGSTIN,
} from "@/utils/gstCalculations";

function createItem(
  overrides: Partial<InvoiceItem> & {
    unitPrice: number;
    quantity: number;
    gstSlab: GSTSlab;
  },
): InvoiceItem {
  return {
    id: "item-1",
    description: "Test item",
    hsnCode: "998314",
    quantity: overrides.quantity,
    unitPrice: overrides.unitPrice,
    gstSlab: overrides.gstSlab,
    cgst: 0,
    sgst: 0,
    igst: 0,
    lineTotal: 0,
    ...overrides,
  };
}

describe("calculateLineItem", () => {
  it("calculates 18% GST mode for unitPrice=1000 and qty=2", () => {
    expect(calculateLineItem(1000, 2, 18, "GST")).toEqual({
      cgst: 180,
      sgst: 180,
      igst: 0,
      taxableAmount: 2000,
      lineTotal: 2360,
    });
  });

  it("calculates 18% IGST mode for unitPrice=1000 and qty=2", () => {
    expect(calculateLineItem(1000, 2, 18, "IGST")).toEqual({
      cgst: 0,
      sgst: 0,
      igst: 360,
      taxableAmount: 2000,
      lineTotal: 2360,
    });
  });

  it("calculates 28% GST mode for unitPrice=500 and qty=1", () => {
    expect(calculateLineItem(500, 1, 28, "GST")).toEqual({
      cgst: 70,
      sgst: 70,
      igst: 0,
      taxableAmount: 500,
      lineTotal: 640,
    });
  });

  it("calculates 5% IGST mode for unitPrice=200 and qty=3", () => {
    expect(calculateLineItem(200, 3, 5, "IGST")).toEqual({
      cgst: 0,
      sgst: 0,
      igst: 30,
      taxableAmount: 600,
      lineTotal: 630,
    });
  });

  it("returns zero tax for 0% slab and keeps lineTotal equal to taxableAmount", () => {
    expect(calculateLineItem(450.75, 4, 0, "GST")).toEqual({
      cgst: 0,
      sgst: 0,
      igst: 0,
      taxableAmount: 1803,
      lineTotal: 1803,
    });

    expect(calculateLineItem(450.75, 4, 0, "IGST")).toEqual({
      cgst: 0,
      sgst: 0,
      igst: 0,
      taxableAmount: 1803,
      lineTotal: 1803,
    });
  });

  it("rounds decimal precision to 2 decimal places", () => {
    expect(calculateLineItem(99.99, 3, 18, "GST")).toEqual({
      cgst: 27,
      sgst: 27,
      igst: 0,
      taxableAmount: 299.97,
      lineTotal: 353.97,
    });
  });
});

describe("calculateInvoiceTotals", () => {
  it("sums each tax column for GST mode with multi-slab items", () => {
    const items: InvoiceItem[] = [
      createItem({
        id: "item-1",
        unitPrice: 1000,
        quantity: 1,
        gstSlab: 18,
      }),
      createItem({
        id: "item-2",
        unitPrice: 500,
        quantity: 2,
        gstSlab: 5,
      }),
    ];

    expect(calculateInvoiceTotals(items, "GST")).toEqual({
      subtotal: 2000,
      totalCGST: 115,
      totalSGST: 115,
      totalIGST: 0,
      grandTotal: 2230,
    });
  });

  it("keeps CGST and SGST at zero and sums IGST in IGST mode", () => {
    const items: InvoiceItem[] = [
      createItem({
        id: "item-1",
        unitPrice: 1000,
        quantity: 1,
        gstSlab: 18,
      }),
      createItem({
        id: "item-2",
        unitPrice: 500,
        quantity: 2,
        gstSlab: 5,
      }),
    ];

    expect(calculateInvoiceTotals(items, "IGST")).toEqual({
      subtotal: 2000,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 230,
      grandTotal: 2230,
    });
  });

  it("returns zero totals for an empty items array", () => {
    expect(calculateInvoiceTotals([], "GST")).toEqual({
      subtotal: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      grandTotal: 0,
    });
  });
});

describe("formatCurrency", () => {
  it("formats 1234.56 in INR", () => {
    expect(formatCurrency(1234.56)).toBe("₹1,234.56");
  });

  it("formats zero in INR", () => {
    expect(formatCurrency(0)).toBe("₹0.00");
  });

  it("uses Indian number grouping for 100000", () => {
    expect(formatCurrency(100000)).toBe("₹1,00,000.00");
  });
});

describe("validateGSTIN", () => {
  it("accepts a valid GSTIN format", () => {
    expect(validateGSTIN("27AAPFU0939F1ZV")).toBe(true);
  });

  it("rejects INVALID", () => {
    expect(validateGSTIN("INVALID")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(validateGSTIN("")).toBe(false);
  });

  it("accepts a 15-character all-uppercase alphanumeric value", () => {
    expect(validateGSTIN("ABCDE12345FGHIJ")).toBe(true);
  });
});
