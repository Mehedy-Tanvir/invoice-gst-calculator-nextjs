import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportInvoicePDF(
  elementId: string,
  filename: string,
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Invoice preview element not found");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imageData = canvas.toDataURL("image/jpeg", 0.98);

  if (imgHeight <= pageHeight) {
    pdf.addImage(imageData, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
    pdf.save(filename);
    return;
  }

  let remainingHeight = imgHeight;
  let position = 0;

  pdf.addImage(imageData, "JPEG", 0, position, imgWidth, imgHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    position = remainingHeight - imgHeight;
    pdf.addPage();
    pdf.addImage(imageData, "JPEG", 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(filename);
}
