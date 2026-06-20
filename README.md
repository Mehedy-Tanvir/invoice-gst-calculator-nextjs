# Invoice & GST Calculator

A production-grade, highly responsive, and premium Invoice & GST Calculator built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. This application helps businesses and freelancers seamlessly calculate Indian GST/IGST slabs, manage line items, perform HSN code lookups, and export professional A4-style invoices to PDF with a single click.

---

## 🚀 Live Demo

You can view the live application here:
👉 **[Live Link](https://invoice-gst-calculator-nextjs.vercel.app)**

---

## ✨ Features

- **Double-Mode Tax System:** Dynamic toggling between **GST (CGST + SGST)** for intra-state transactions and **IGST** for inter-state transactions.
- **Searchable HSN Lookups:** Built-in HSN code search dropdown supporting common services like Web Development (998313), Software Development (998314), Graphic Design (998312), and more.
- **Automated Tax & Totals Math:** Live calculation of taxable amounts, tax percentages (0%, 5%, 12%, 18%, 28%), line item totals, and cumulative subtotals & grand totals.
- **100% Mobile Responsive:**
  - Dynamic **card-based view** for adding/managing line items on mobile and tablet viewports.
  - Interactive **transform-scaled sheet preview** that fits A4 designs on mobile screens without scrollbars.
  - Classic tabular grids on desktop screens.
- **Client-Side Persistence:** LocalStorage integration to securely pass invoice drafts from the builder page to the preview screen.
- **Professional PDF Export:** Integrates `html2canvas` + `jsPDF` to generate pixel-perfect A4-style invoices for instant downloading.
- **Validation Engine:** Built-in validation rules, including a strict 15-character alphanumeric Indian GSTIN regex validator.

---

## 🛠️ Technology Stack

- **Core Framework:** Next.js 16 (App Router) & React 19
- **Programming Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS (v4)
- **PDF Generation:** `jsPDF` & `html2canvas`
- **Testing Framework:** Jest & Jest-DOM

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── layout.tsx         # App wrapper rendering the responsive footer on all pages
│   ├── globals.css        # Tailwind directives and main styles
│   ├── page.tsx           # Interactive Invoice Builder form page
│   └── preview/
│       └── page.tsx       # Live Invoice preview sheet and PDF export page
├── components/
│   ├── InvoiceForm.tsx    # Seller/Buyer details & Invoice metadata form
│   ├── LineItemsTable.tsx # Responsive line items manager (table/card view switcher)
│   ├── HSNLookup.tsx      # Searchable datalist HSN dropdown
│   ├── GSTSummary.tsx     # Live calculating summary widget
│   ├── InvoicePreview.tsx # Scaled A4 preview sheet component
│   └── Footer.tsx         # Developer information footer
├── types/
│   └── invoice.ts         # Strictly-typed interfaces for invoice models
├── utils/
│   ├── gstCalculations.ts # Rounding, slab math, Indian currency formatting, and GSTIN regex
│   └── pdfExport.ts       # High-DPI canvas wrapper for PDF generation
└── __tests__/
    ├── gstCalculations.test.ts
    ├── invoiceValidation.test.ts
    ├── hsnLookup.test.ts
    └── pdfExport.test.ts
```

---

## 💻 Local Installation & Development

To run this project locally, follow these steps:

### 1. Prerequisites

Ensure you have **Node.js** (v18.x or higher) and **npm** installed.

### 2. Clone the Repository

```bash
git clone https://github.com/Mehedy-Tanvir/invoice-gst-calculator-nextjs.git
cd invoice-gst-calculator-nextjs
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Running the Jest Test Suite

To verify the calculation models and validations, execute:

```bash
npx jest
```

### 6. Build for Production

To generate a production-optimized build:

```bash
npm run build
```

---

## 🛡️ License

This project is open-source and available under the MIT License.
