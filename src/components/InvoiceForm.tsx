"use client";

import type { BusinessInfo, InvoiceDetails, TaxType } from "@/types/invoice";
import { validateGSTIN } from "@/utils/gstCalculations";

type InvoiceFormProps = {
  invoice: InvoiceDetails;
  onInvoiceChange: (invoice: InvoiceDetails) => void;
};

type BusinessField = keyof BusinessInfo;

const businessFields: {
  key: BusinessField;
  label: string;
  type?: string;
  placeholder: string;
}[] = [
  { key: "name", label: "Name", placeholder: "Business name" },
  { key: "address", label: "Address", placeholder: "Street address" },
  { key: "city", label: "City", placeholder: "City" },
  { key: "state", label: "State", placeholder: "State" },
  { key: "pincode", label: "Pincode", placeholder: "Pincode" },
  { key: "gstin", label: "GSTIN", placeholder: "15-character GSTIN" },
  { key: "email", label: "Email", type: "email", placeholder: "name@example.com" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "Phone number" },
];

export default function InvoiceForm({
  invoice,
  onInvoiceChange,
}: InvoiceFormProps) {
  const updateBusiness = (
    party: "seller" | "buyer",
    key: BusinessField,
    value: string,
  ) => {
    onInvoiceChange({
      ...invoice,
      [party]: {
        ...invoice[party],
        [key]: value,
      },
    });
  };

  const updateInvoiceField = (
    key: "invoiceNumber" | "invoiceDate" | "dueDate" | "notes" | "taxType",
    value: string,
  ) => {
    onInvoiceChange({
      ...invoice,
      [key]: key === "taxType" ? (value as TaxType) : value,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Invoice Number
            </span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              value={invoice.invoiceNumber}
              onChange={(event) =>
                updateInvoiceField("invoiceNumber", event.target.value)
              }
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Invoice Date
            </span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              type="date"
              value={invoice.invoiceDate}
              onChange={(event) =>
                updateInvoiceField("invoiceDate", event.target.value)
              }
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Due Date</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              type="date"
              value={invoice.dueDate}
              onChange={(event) =>
                updateInvoiceField("dueDate", event.target.value)
              }
            />
          </label>
        </div>
        <div className="mt-5">
          <span className="text-sm font-medium text-slate-700">Tax Mode</span>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {(["GST", "IGST"] as TaxType[]).map((type) => (
              <label
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition ${
                  invoice.taxType === type
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
                key={type}
              >
                <span className="font-medium">
                  {type === "GST" ? "GST (CGST + SGST)" : "IGST"}
                </span>
                <input
                  className="h-4 w-4 accent-blue-600"
                  checked={invoice.taxType === type}
                  name="taxType"
                  type="radio"
                  value={type}
                  onChange={(event) =>
                    updateInvoiceField("taxType", event.target.value)
                  }
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {(["seller", "buyer"] as const).map((party) => (
          <section
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            key={party}
          >
            <h2 className="text-lg font-semibold capitalize text-slate-800">
              {party} Details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {businessFields.map((field) => {
                const value = invoice[party][field.key];
                const showGSTINError =
                  field.key === "gstin" && value.length > 0 && !validateGSTIN(value);

                return (
                  <label
                    className={field.key === "address" ? "block sm:col-span-2" : "block"}
                    key={field.key}
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {field.label}
                    </span>
                    <input
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                        showGSTINError
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                      }`}
                      placeholder={field.placeholder}
                      type={field.type ?? "text"}
                      value={value}
                      onChange={(event) =>
                        updateBusiness(party, field.key, event.target.value)
                      }
                    />
                    {showGSTINError ? (
                      <span className="mt-1 block text-xs text-red-600">
                        Enter a 15-character alphanumeric GSTIN.
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            className="mt-1 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            placeholder="Payment terms, bank details, or thank-you note"
            value={invoice.notes}
            onChange={(event) => updateInvoiceField("notes", event.target.value)}
          />
        </label>
      </section>
    </div>
  );
}
