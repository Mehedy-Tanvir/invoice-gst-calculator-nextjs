export type GSTSlab = 0 | 5 | 12 | 18 | 28;

export type TaxType = "GST" | "IGST";

export type BusinessInfo = {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  email: string;
  phone: string;
};

export type InvoiceItem = {
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  gstSlab: GSTSlab;
  cgst: number;
  sgst: number;
  igst: number;
  lineTotal: number;
};

export type InvoiceDetails = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  taxType: TaxType;
  seller: BusinessInfo;
  buyer: BusinessInfo;
  items: InvoiceItem[];
  notes: string;
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  grandTotal: number;
};
