import type { BusinessInfo, InvoiceDetails, InvoiceItem } from "@/types/invoice";
import { validateGSTIN } from "@/utils/gstCalculations";

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

function validateInvoice(invoice: InvoiceDetails): ValidationResult {
  const errors: string[] = [];

  if (!invoice.seller.name.trim()) {
    errors.push("Seller name is required.");
  }

  if (invoice.seller.gstin && !validateGSTIN(invoice.seller.gstin)) {
    errors.push("Seller GSTIN is invalid.");
  }

  if (invoice.buyer.gstin && !validateGSTIN(invoice.buyer.gstin)) {
    errors.push("Buyer GSTIN is invalid.");
  }

  if (invoice.items.length === 0) {
    errors.push("At least one line item is required.");
  }

  invoice.items.forEach((item) => {
    if (item.quantity <= 0) {
      errors.push("Line item quantity must be greater than zero.");
    }

    if (item.unitPrice < 0) {
      errors.push("Line item unit price cannot be negative.");
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

const validBusiness: BusinessInfo = {
  name: "Acme Services",
  address: "123 Main Road",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  gstin: "27AAPFU0939F1ZV",
  email: "billing@example.com",
  phone: "9876543210",
};

const validItem: InvoiceItem = {
  id: "item-1",
  description: "Software development",
  hsnCode: "998314",
  quantity: 1,
  unitPrice: 1000,
  gstSlab: 18,
  cgst: 90,
  sgst: 90,
  igst: 0,
  lineTotal: 1180,
};

function createInvoice(overrides: Partial<InvoiceDetails> = {}): InvoiceDetails {
  return {
    invoiceNumber: "INV-001",
    invoiceDate: "2026-06-20",
    dueDate: "2026-07-05",
    taxType: "GST",
    seller: validBusiness,
    buyer: {
      ...validBusiness,
      name: "Client Company",
      gstin: "29ABCDE1234F1Z5",
    },
    items: [validItem],
    notes: "Thank you.",
    subtotal: 1000,
    totalCGST: 90,
    totalSGST: 90,
    totalIGST: 0,
    grandTotal: 1180,
    ...overrides,
  };
}

describe("invoice validation", () => {
  it("fails when seller name is empty", () => {
    const invoice = createInvoice({
      seller: {
        ...validBusiness,
        name: "",
      },
    });

    expect(validateInvoice(invoice)).toEqual({
      valid: false,
      errors: ["Seller name is required."],
    });
  });

  it("passes valid GSTINs and fails invalid GSTINs", () => {
    expect(validateGSTIN("27AAPFU0939F1ZV")).toBe(true);
    expect(validateGSTIN("INVALID")).toBe(false);

    const invoice = createInvoice({
      buyer: {
        ...validBusiness,
        name: "Client Company",
        gstin: "INVALID",
      },
    });

    expect(validateInvoice(invoice).valid).toBe(false);
    expect(validateInvoice(invoice).errors).toContain("Buyer GSTIN is invalid.");
  });

  it("fails when a line item has qty=0", () => {
    const invoice = createInvoice({
      items: [
        {
          ...validItem,
          quantity: 0,
        },
      ],
    });

    expect(validateInvoice(invoice).valid).toBe(false);
    expect(validateInvoice(invoice).errors).toContain(
      "Line item quantity must be greater than zero.",
    );
  });

  it("fails when a line item has a negative price", () => {
    const invoice = createInvoice({
      items: [
        {
          ...validItem,
          unitPrice: -1,
        },
      ],
    });

    expect(validateInvoice(invoice).valid).toBe(false);
    expect(validateInvoice(invoice).errors).toContain(
      "Line item unit price cannot be negative.",
    );
  });

  it("fails when invoice has no items", () => {
    const invoice = createInvoice({
      items: [],
    });

    expect(validateInvoice(invoice).valid).toBe(false);
    expect(validateInvoice(invoice).errors).toContain(
      "At least one line item is required.",
    );
  });

  it("passes a valid complete invoice", () => {
    expect(validateInvoice(createInvoice())).toEqual({
      valid: true,
      errors: [],
    });
  });
});
