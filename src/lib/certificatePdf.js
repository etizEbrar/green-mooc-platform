// Client-side PDF generation for the certificate of completion.
//
// Approach: render the certificate template off-screen at a fixed width,
// rasterise it with html2canvas, and place that image into a landscape A4
// page with jsPDF. Everything happens in the browser — no server, no
// Cloud Function, no upload of the learner's name anywhere.
//
// Why a fixed off-screen render rather than capturing what is on screen:
// html2canvas photographs an element at its *current* rendered size, so
// capturing the visible certificate would produce a cramped PDF on a phone
// and a wide one on a desktop. The hidden template is always A4-landscape
// shaped, so every learner gets the same document.

// A4 landscape at 96 CSS px per inch — the shape the hidden template is
// rendered at, and the page the PDF is written to.
export const CAPTURE_WIDTH_PX = 1123;
export const A4_LANDSCAPE_MM = { width: 297, height: 210 };

// Rasterisation factor. 2 keeps text sharp when printed without producing a
// file so large that older phones fail to encode it.
const CAPTURE_SCALE = 2;

/**
 * Build the certificate PDF without saving it.
 *
 * Split out from the download so the expensive part — rasterising the DOM and
 * assembling the document — can be exercised on its own, and so a future
 * feature (emailing the certificate, attaching it to a record) can reuse it.
 *
 * @param {HTMLElement} element  the off-screen certificate node to capture
 * @returns {Promise<import('jspdf').jsPDF>}
 */
export async function buildCertificatePdf(element) {
  if (!element) {
    throw new Error('Certificate template is not mounted yet.');
  }

  // Loaded on demand: together these libraries are heavier than the rest of
  // the app, and most sessions never generate a certificate.
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ]);

  // Without this the capture can happen while Inter is still loading, and the
  // PDF silently falls back to a system font with different metrics.
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: CAPTURE_SCALE,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    // Measure against the template's own fixed width, not the viewport, so a
    // narrow phone does not reflow the layout before it is photographed.
    windowWidth: CAPTURE_WIDTH_PX,
    width: element.offsetWidth,
    height: element.offsetHeight
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const { width, height, x, y } = fitToPage(canvas.width, canvas.height);
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, width, height, undefined, 'FAST');
  return pdf;
}

/**
 * Build the certificate PDF and hand it to the browser as a download.
 *
 * @param {HTMLElement} element  the off-screen certificate node to capture
 * @param {string} fileName      file name offered to the browser, without extension
 * @returns {Promise<void>}      resolves once the download has been triggered
 */
export async function downloadCertificatePdf(element, fileName) {
  const pdf = await buildCertificatePdf(element);
  pdf.save(`${fileName}.pdf`);
}

/**
 * Scale a canvas to fit an A4 landscape page while preserving its aspect
 * ratio, and centre whatever margin is left over.
 */
export function fitToPage(
  canvasWidth,
  canvasHeight,
  page = A4_LANDSCAPE_MM
) {
  const scale = Math.min(page.width / canvasWidth, page.height / canvasHeight);
  const width = canvasWidth * scale;
  const height = canvasHeight * scale;
  return {
    width,
    height,
    x: (page.width - width) / 2,
    y: (page.height - height) / 2
  };
}

/**
 * Safe, recognisable file name: "CREDIT-certificate-elif-kaya-CREDIT-2026-1O56-HFZ".
 * Falls back to the code alone when the name has no usable characters
 * (e.g. a name written entirely in a script the regex strips).
 */
export function certificateFileName(learnerName, code) {
  const slug = String(learnerName || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40);
  return slug ? `CREDIT-certificate-${slug}-${code}` : `CREDIT-certificate-${code}`;
}
