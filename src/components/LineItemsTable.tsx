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

      {/* Desktop View */}
      <div className="hidden lg:block mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3 font-semibold w-[35%]">Description</th>
              <th className="px-3 py-3 font-semibold w-[20%]">HSN Code</th>
              <th className="px-3 py-3 font-semibold w-[10%]">Qty</th>
              <th className="px-3 py-3 font-semibold w-[12%]">Unit Price</th>
              <th className="px-3 py-3 font-semibold w-[10%]">GST Slab</th>
              <th className="px-3 py-3 font-semibold w-[10%]">Tax</th>
              <th className="px-3 py-3 font-semibold w-[10%]">Line Total</th>
              <th className="px-3 py-3 text-right font-semibold w-[8%]">Action</th>
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                <td className="px-3 py-3 align-top text-slate-600 whitespace-nowrap">
                  {taxType === "GST" ? (
                    <div className="space-y-1">
                      <p className="text-xs">CGST: {formatCurrency(item.cgst)}</p>
                      <p className="text-xs">SGST: {formatCurrency(item.sgst)}</p>
                    </div>
                  ) : (
                    <p className="text-xs">IGST: {formatCurrency(item.igst)}</p>
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

      {/* Mobile/Tablet Card View */}
      <div className="block lg:hidden mt-5 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4 relative transition hover:border-blue-200"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-sm font-bold text-slate-700">Item #{index + 1}</span>
              <button
                type="button"
                disabled={items.length === 1}
                onClick={() => removeItem(item.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Description
                </span>
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(event) =>
                    updateItem(item.id, { description: event.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  HSN Code
                </span>
                <HSNLookup
                  value={item.hsnCode}
                  onChange={(code, description) =>
                    updateItem(item.id, {
                      hsnCode: code,
                      description: item.description || description || "",
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Quantity
                  </span>
                  <input
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Unit Price
                  </span>
                  <input
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    GST Slab
                  </span>
                  <select
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Calculated Tax
                  </span>
                  <div className="text-xs text-slate-700 bg-white border border-slate-200 p-2 rounded-md h-9 flex items-center justify-center font-medium">
                    {taxType === "GST" ? (
                      <div className="flex justify-between w-full px-1">
                        <span>CGST: {formatCurrency(item.cgst)}</span>
                        <span>SGST: {formatCurrency(item.sgst)}</span>
                      </div>
                    ) : (
                      <span>IGST: {formatCurrency(item.igst)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm font-semibold text-slate-500">Line Total</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
