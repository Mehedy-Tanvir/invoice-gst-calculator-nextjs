"use client";

import type { GSTSlab, InvoiceItem, TaxType } from "@/types/invoice";
import { calculateLineItem, formatCurrency } from "@/utils/gstCalculations";
import HSNLookup from "./HSNLookup";

const gstSlabs: GSTSlab[] = [0, 5, 12, 18, 28];

type LineItemsTableProps = {
  items: InvoiceItem[];
  taxType: TaxType;
  onItemsChange: (items: InvoiceItem[]) => void;
};

export function createEmptyInvoiceItem(): InvoiceItem {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    description: "",
    hsnCode: "",
    quantity: 1,
    unitPrice: 0,
    gstSlab: 18,
    cgst: 0,
    sgst: 0,
    igst: 0,
    lineTotal: 0,
  };
}

function withCalculatedTaxes(item: InvoiceItem, taxType: TaxType): InvoiceItem {
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
}

export default function LineItemsTable({
  items,
  taxType,
  onItemsChange,
}: LineItemsTableProps) {
  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? withCalculatedTaxes({ ...item, ...updates }, taxType) : item,
      ),
    );
  };

  const addItem = () => {
    onItemsChange([...items, withCalculatedTaxes(createEmptyInvoiceItem(), taxType)]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      return;
    }

    onItemsChange(items.filter((item) => item.id !== id));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Line Items</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add services or goods and taxes are calculated automatically.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          type="button"
          onClick={addItem}
        >
          Add Item
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3 font-semibold">Description</th>
              <th className="px-3 py-3 font-semibold">HSN Code</th>
              <th className="px-3 py-3 font-semibold">Qty</th>
              <th className="px-3 py-3 font-semibold">Unit Price</th>
              <th className="px-3 py-3 font-semibold">GST Slab</th>
              <th className="px-3 py-3 font-semibold">Tax</th>
              <th className="px-3 py-3 font-semibold">Line Total</th>
              <th className="px-3 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-3 align-top">
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    placeholder="Service description"
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, { description: event.target.value })
                    }
                  />
                </td>
                <td className="px-3 py-3 align-top">
                  <HSNLookup
                    value={item.hsnCode}
                    onChange={(code, description) =>
                      updateItem(item.id, {
                        hsnCode: code,
                        description: item.description || description || "",
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3 align-top">
                  <input
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    min="0"
                    step="1"
                    type="number"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.id, {
                        quantity: Number(event.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3 align-top">
                  <input
                    className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    min="0"
                    step="0.01"
                    type="number"
                    value={item.unitPrice}
                    onChange={(event) =>
                      updateItem(item.id, {
                        unitPrice: Number(event.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3 align-top">
                  <select
                    className="w-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={item.gstSlab}
                    onChange={(event) =>
                      updateItem(item.id, {
                        gstSlab: Number(event.target.value) as GSTSlab,
                      })
                    }
                  >
                    {gstSlabs.map((slab) => (
                      <option key={slab} value={slab}>
                        {slab}%
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 align-top text-slate-600">
                  {taxType === "GST" ? (
                    <div className="space-y-1">
                      <p>CGST {formatCurrency(item.cgst)}</p>
                      <p>SGST {formatCurrency(item.sgst)}</p>
                    </div>
                  ) : (
                    <p>IGST {formatCurrency(item.igst)}</p>
                  )}
                </td>
                <td className="px-3 py-3 align-top font-semibold text-slate-800">
                  {formatCurrency(item.lineTotal)}
                </td>
                <td className="px-3 py-3 text-right align-top">
                  <button
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    disabled={items.length === 1}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
