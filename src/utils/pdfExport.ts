import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * html2canvas doesn't support modern CSS color functions (lab, oklch, lch, oklab).
 * This patches a cloned element by resolving all computed styles and replacing
 * unsupported color values with their RGB equivalents using a canvas trick.
 */
function resolveColor(value: string): string {
  // If it's already a safe color format, return as-is
  if (!value || !/lab\(|oklch\(|lch\(|oklab\(/.test(value)) {
    return value;
  }

  // Use a temporary canvas context to resolve the color to RGB
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "#000000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return "#000000";
  }
}

function patchUnsupportedColors(element: HTMLElement): void {
  const allElements = element.querySelectorAll<HTMLElement>("*");
  const targets = [element, ...Array.from(allElements)];

  const colorProps = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "outlineColor",
    "fill",
    "stroke",
    "caretColor",
    "columnRuleColor",
    "textDecorationColor",
  ] as const;

  targets.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const styleDecl = el.style as any;

    colorProps.forEach((prop) => {
      const value = computed[prop as keyof CSSStyleDeclaration] as string;
      if (value && /lab\(|oklch\(|lch\(|oklab\(/.test(value)) {
        styleDecl[prop] = resolveColor(value);
      }
    });

    // Also patch CSS custom properties on the element's inline style
    // by reading and overriding the style attribute content
    const style = el.getAttribute("style") || "";
    if (/lab\(|oklch\(|lch\(|oklab\(/.test(style)) {
      el.setAttribute(
        "style",
        style.replace(/(lab|oklch|lch|oklab)\([^)]+\)/g, (match) =>
          resolveColor(match),
        ),
      );
    }
  });
}

export async function exportInvoicePDF(
  elementId: string,
  filename: string,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Invoice preview element not found");
  }

  const parent = element.parentElement;
  const grandParent = parent?.parentElement;

  const originalParentTransform = parent ? parent.style.transform : "";
  const originalGrandParentHeight = grandParent ? grandParent.style.height : "";

  if (parent) parent.style.transform = "none";
  if (grandParent) grandParent.style.height = "auto";

  // Clone the element so we never mutate the live DOM
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = "-9999px";
  clone.style.width = `${element.offsetWidth}px`;
  clone.style.zIndex = "-1";
  clone.style.pointerEvents = "none";
  document.body.appendChild(clone);

  try {
    // Patch unsupported color functions on the clone only
    patchUnsupportedColors(clone);

    const canvas = await html2canvas(clone, {
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
      pdf.addImage(
        imageData,
        "JPEG",
        0,
        0,
        imgWidth,
        Math.min(imgHeight, pageHeight),
      );
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
    // Always clean up the clone and restore original styles
    document.body.removeChild(clone);

    if (parent) parent.style.transform = originalParentTransform;
    if (grandParent) grandParent.style.height = originalGrandParentHeight;
  }
}
