"use client";

export const HSN_OPTIONS = [
  { code: "998314", label: "Software development" },
  { code: "998313", label: "Web development" },
  { code: "998312", label: "Graphic design" },
  { code: "998361", label: "Digital marketing" },
  { code: "997331", label: "IT support" },
  { code: "998222", label: "Accounting services" },
  { code: "9982", label: "Legal services" },
  { code: "9983", label: "Consulting services" },
  { code: "9989", label: "Printing services" },
  { code: "998311", label: "Data processing" },
];

type HSNLookupProps = {
  value: string;
  onChange: (code: string, description?: string) => void;
};

export default function HSNLookup({ value, onChange }: HSNLookupProps) {
  return (
    <div>
      <input
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        list="hsn-codes"
        placeholder="Search HSN"
        value={value}
        onChange={(event) => {
          const selected = HSN_OPTIONS.find(
            (option) => option.code === event.target.value,
          );
          onChange(event.target.value, selected?.label);
        }}
      />
      <datalist id="hsn-codes">
        {HSN_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </datalist>
    </div>
  );
}
