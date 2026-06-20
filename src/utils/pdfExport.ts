export async function downloadInvoicePDF(
  elementId = "invoice-preview",
  fileName = "invoice.pdf",
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Unable to find invoice element with id "${elementId}".`);
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  let heightLeft = imageHeight;
  let position = 0;

  pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imageHeight;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}
