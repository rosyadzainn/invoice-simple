// No top-level imports of jsPDF / html2canvas — both reference browser globals
// and would crash during Next.js SSR if imported at module-load time.

export async function downloadInvoicePDF(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found in DOM`);

  // Lazy-load only in the browser, only when the user actually clicks.
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // ── Universal colour normaliser ───────────────────────────────────────────
  //
  // Tailwind CSS v4 emits its entire colour palette as oklch() CSS variables
  // (e.g. --color-gray-900: oklch(0.21 0.034 264.665)).  html2canvas v1.4.1
  // only understands rgb / rgba / hsl / hsla / hex — it throws:
  //   "Attempting to parse an unsupported color function 'lab'"
  // when it encounters these modern formats.
  //
  // Fix: feed every computed colour into a 1×1 Canvas 2D context.  The
  // browser's compositing engine converts ANY valid CSS colour — oklch, lab,
  // lch, color(), display-p3, etc. — to '#rrggbb' or 'rgba(r,g,b,a)' before
  // writing it to fillStyle.  We read that safe value back and apply it as an
  // inline style on the cloned element so html2canvas only ever sees hex/rgba.
  //
  // This runs in onclone (before html2canvas starts painting) so it is a
  // zero-cost transformation — no extra render passes.
  // ─────────────────────────────────────────────────────────────────────────
  const normCanvas = document.createElement("canvas");
  normCanvas.width = normCanvas.height = 1;
  const normCtx = normCanvas.getContext("2d")!;

  /** Convert any CSS colour string to a browser-safe hex / rgba value. */
  function toSafeColor(raw: string): string {
    if (!raw || raw === "transparent" || raw === "none") return raw;
    try {
      normCtx.fillStyle = raw;          // browser resolves oklch/lab → sRGB
      return normCtx.fillStyle;         // '#rrggbb' or 'rgba(r,g,b,a)'
    } catch {
      return raw;                       // unsupported in THIS browser — keep as-is
    }
  }

  // CSS properties that carry colour values and that html2canvas must parse.
  // We intentionally skip shorthand 'background' (may contain gradients) and
  // instead target 'background-color' only.
  const COLOR_PROPS_KEBAB = [
    "color",
    "background-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "outline-color",
    "text-decoration-color",
  ] as const;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,           // required for cross-origin logo <img> tags
    backgroundColor: "#ffffff",
    logging: false,

    onclone: (clonedDoc: Document) => {
      const origRoot  = document.getElementById(elementId);
      const cloneRoot = clonedDoc.getElementById(elementId) as HTMLElement | null;
      if (!origRoot || !cloneRoot) return;

      // Walk every element in the captured subtree in document order.
      // querySelectorAll returns elements in the same order in both trees, so
      // index i correctly pairs each original element with its clone.
      const origEls  = [origRoot,  ...origRoot.querySelectorAll<HTMLElement>("*")];
      const cloneEls = [cloneRoot, ...cloneRoot.querySelectorAll<HTMLElement>("*")];

      origEls.forEach((orig, i) => {
        const clone = cloneEls[i];
        if (!clone) return;

        const cs = window.getComputedStyle(orig);   // reads from the LIVE DOM

        COLOR_PROPS_KEBAB.forEach((prop) => {
          const val = cs.getPropertyValue(prop);     // 'oklch(...)' or 'rgb(...)'
          if (val && val !== "") {
            clone.style.setProperty(prop, toSafeColor(val));
          }
        });
      });

      // Fix images: html2canvas doesn't support object-fit, so images with
      // width/height:auto + max constraints get stretched. We compute the
      // correct pixel size from the natural aspect ratio and apply it explicitly.
      origRoot.querySelectorAll<HTMLImageElement>("img").forEach((origImg) => {
        const naturalW = origImg.naturalWidth;
        const naturalH = origImg.naturalHeight;
        if (!naturalW || !naturalH) return;

        const cs   = window.getComputedStyle(origImg);
        const maxW = parseFloat(cs.maxWidth)  || 9999;
        const maxH = parseFloat(cs.maxHeight) || 9999;
        const ratio = naturalW / naturalH;

        let w = Math.min(naturalW, maxW);
        let h = w / ratio;
        if (h > maxH) { h = maxH; w = h * ratio; }

        // Find the matching clone img by src
        const cloneImg = cloneRoot.querySelector<HTMLImageElement>(`img[src="${CSS.escape(origImg.src)}"]`);
        if (!cloneImg) return;
        cloneImg.style.width      = `${w}px`;
        cloneImg.style.height     = `${h}px`;
        cloneImg.style.maxWidth   = "unset";
        cloneImg.style.maxHeight  = "unset";
        cloneImg.style.objectFit  = "unset";
      });

      // Remove shadow / rounded corners on the outermost card so PDF edges
      // are crisp (shadows outside the element boundary are clipped anyway).
      cloneRoot.style.setProperty("box-shadow", "none");
      cloneRoot.style.setProperty("border-radius", "0");
    },
  });

  // Size the PDF page to the exact content height so nothing is cropped.
  // canvas is at 2× — dividing gives logical CSS pixels.
  const PAGE_W_MM = 210;   // A4 width in mm
  const PAGE_H_MM = Math.ceil((canvas.height / canvas.width) * PAGE_W_MM);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PAGE_W_MM, PAGE_H_MM],
  });

  pdf.addImage(
    canvas.toDataURL("image/jpeg", 0.97),
    "JPEG",
    0,
    0,
    PAGE_W_MM,
    PAGE_H_MM
  );

  pdf.save(filename);
}
