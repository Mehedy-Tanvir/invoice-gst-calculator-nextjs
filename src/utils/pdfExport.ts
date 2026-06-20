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

  // Temporarily reset CSS transform scaling of parent/grandparent wrapper so html2canvas renders the invoice cleanly in its full/proper aspect ratio and dimensions on mobile devices.
  const parent = element.parentElement;
  const grandParent = parent?.parentElement;
  
  const originalParentTransform = parent ? parent.style.transform : "";
  const originalGrandParentHeight = grandParent ? grandParent.style.height : "";

  if (parent) {
    parent.style.transform = "none";
  }
  if (grandParent) {
    grandParent.style.height = "auto";
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    // restore style settings inside finally block
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
  } finally {
    if (parent) {
      parent.style.transform = originalParentTransform;
    }
    if (grandParent) {
      grandParent.style.height = originalGrandParentHeight;
    }
  }
}
