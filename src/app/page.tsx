"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import GSTSummary from "@/components/GSTSummary";
import InvoiceForm from "@/components/InvoiceForm";
import LineItemsTable, {
  createEmptyInvoiceItem,
} from "@/components/LineItemsTable";
import type { BusinessInfo, InvoiceDetails, InvoiceItem } from "@/types/invoice";
import {
  calculateInvoiceTotals,
  calculateLineItem,
} from "@/utils/gstCalculations";

const emptyBusiness: BusinessInfo = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  gstin: "",
  email: "",
  phone: "",
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function dueDateISO(): string {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);
  return dueDate.toISOString().slice(0, 10);
}

function createInitialInvoice(): InvoiceDetails {
  return {
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    invoiceDate: todayISO(),
    dueDate: dueDateISO(),
    taxType: "GST",
    seller: emptyBusiness,
    buyer: emptyBusiness,
    items: [createEmptyInvoiceItem()],
    notes: "",
    subtotal: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalIGST: 0,
    grandTotal: 0,
  };
}

function recalculateItems(
  items: InvoiceItem[],
  taxType: InvoiceDetails["taxType"],
): InvoiceItem[] {
  return items.map((item) => {
    const calculated = calculateLineItem(
      item.unitPrice,
      item.quantity,
      item.gstSlab,
      taxType,
    );

    return {
      ...item,
      cgst: calculated.cgst,
      sgst: calculated.sgst,
      igst: calculated.igst,
      lineTotal: calculated.lineTotal,
    };
  });
}

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceDetails>(() =>
    createInitialInvoice(),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatedInvoice = useMemo(() => {
    const items = recalculateItems(invoice.items, invoice.taxType);
    const totals = calculateInvoiceTotals(items, invoice.taxType);

    return {
      ...invoice,
      items,
      ...totals,
    };
  }, [invoice]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading Invoice Builder...</p>
        </div>
      </div>
    );
  }

  const updateInvoice = (nextInvoice: InvoiceDetails) => {
    const items =
      nextInvoice.taxType !== invoice.taxType
        ? recalculateItems(nextInvoice.items, nextInvoice.taxType)
        : nextInvoice.items;
    const totals = calculateInvoiceTotals(items, nextInvoice.taxType);

    setInvoice({
      ...nextInvoice,
      items,
      ...totals,
    });
  };

  const updateItems = (items: InvoiceItem[]) => {
    const totals = calculateInvoiceTotals(items, invoice.taxType);

    setInvoice({
      ...invoice,
      items,
      ...totals,
    });
  };

  const previewInvoice = () => {
    window.localStorage.setItem(
      "invoice-gst-calculator:invoice",
      JSON.stringify(calculatedInvoice),
    );
    router.push("/preview");
  };

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              GST Invoice Builder
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
              Invoice & GST Calculator
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Create clean GST or IGST invoices with HSN lookup, live tax
              totals, and PDF export.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            type="button"
            onClick={previewInvoice}
          >
            Preview Invoice
          </button>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <InvoiceForm
              invoice={calculatedInvoice}
              onInvoiceChange={updateInvoice}
            />
            <LineItemsTable
              items={calculatedInvoice.items}
              taxType={calculatedInvoice.taxType}
              onItemsChange={updateItems}
            />
          </div>
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <GSTSummary
              grandTotal={calculatedInvoice.grandTotal}
              subtotal={calculatedInvoice.subtotal}
              taxType={calculatedInvoice.taxType}
              totalCGST={calculatedInvoice.totalCGST}
              totalIGST={calculatedInvoice.totalIGST}
              totalSGST={calculatedInvoice.totalSGST}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
