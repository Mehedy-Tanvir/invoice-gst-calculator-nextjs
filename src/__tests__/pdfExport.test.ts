import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { exportInvoicePDF } from "@/utils/pdfExport";

jest.mock("html2canvas", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockAddImage = jest.fn();
const mockAddPage = jest.fn();
const mockSave = jest.fn();

jest.mock("jspdf", () => ({
  jsPDF: jest.fn(() => ({
    addImage: mockAddImage,
    addPage: mockAddPage,
    save: mockSave,
  })),
}));

const mockedHtml2Canvas = jest.mocked(html2canvas);
const mockedJsPDF = jest.mocked(jsPDF);

function createMockCanvas(width = 1000, height = 1200): HTMLCanvasElement {
  return {
    width,
    height,
    toDataURL: jest.fn(() => "data:image/jpeg;base64,mock-image"),
  } as unknown as HTMLCanvasElement;
}

describe("exportInvoicePDF", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    mockedHtml2Canvas.mockResolvedValue(createMockCanvas());
  });

  it("resolves without throwing when called with a valid elementId", async () => {
    document.body.innerHTML = '<div id="invoice-preview">Invoice</div>';

    await expect(
      exportInvoicePDF("invoice-preview", "invoice-test.pdf"),
    ).resolves.toBeUndefined();

    expect(mockedHtml2Canvas).toHaveBeenCalledWith(
      document.getElementById("invoice-preview"),
      {
        scale: 2,
        useCORS: true,
        logging: false,
      },
    );
    expect(mockedJsPDF).toHaveBeenCalledWith("p", "mm", "a4");
  });

  it('throws Error with message "Invoice preview element not found" when element is missing', async () => {
    await expect(
      exportInvoicePDF("missing-preview", "invoice-test.pdf"),
    ).rejects.toThrow("Invoice preview element not found");
  });

  it("calls pdf.save with the correct filename", async () => {
    document.body.innerHTML = '<div id="invoice-preview">Invoice</div>';

    await exportInvoicePDF("invoice-preview", "invoice-INV-001.pdf");

    expect(mockSave).toHaveBeenCalledWith("invoice-INV-001.pdf");
  });
});
