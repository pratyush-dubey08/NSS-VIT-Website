/**
 * Robust file download and share utility for mobile WebViews and desktop browsers.
 * In Android WebViews, standard <a download> is blocked.
 * This utility uses the Web Share API on mobile to trigger native system save/open,
 * with standard browser download as fallback.
 */
export async function downloadOrShareFile({
  blob,
  filename,
  mimeType,
  title = 'NSS Document',
  text = 'National Service Scheme Document'
}: {
  blob: Blob;
  filename: string;
  mimeType: string;
  title?: string;
  text?: string;
}): Promise<{ success: boolean; method: string }> {
  // 1. Try Web Share API (Natively supported in modern mobile Chrome & Android WebViews)
  try {
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined' && 'canShare' in navigator) {
      const file = new File([blob], filename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text
        });
        return { success: true, method: 'share' };
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: true, method: 'aborted' };
    }
    console.warn('Web Share API failed, attempting fallback download:', err);
  }

  // 2. Standard browser <a download> fallback (works on Desktop browsers)
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return { success: true, method: 'download' };
  } catch (err) {
    console.error('Browser anchor download failed:', err);
  }

  // 3. Fallback for mobile WebViews where <a download> fails: Open data/blob in new tab
  try {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${base64data}" frameborder="0" style="border:0; position:fixed; top:0; left:0; right:0; bottom:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    };
    reader.readAsDataURL(blob);
    return { success: true, method: 'iframe' };
  } catch (err) {
    console.error('Final iframe fallback failed:', err);
  }

  return { success: false, method: 'failed' };
}
