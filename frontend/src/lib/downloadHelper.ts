/**
 * Robust file download and share utility.
 * - On Desktop / Standard Website: DIRECT browser download via <a download> (NO share menu popup).
 * - Inside NSS Android App: Directly invokes native Java bridge to save to device Downloads folder!
 * - On Mobile Web: Uses Web Share API or download fallback.
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
  // 1. FOR NATIVE ANDROID APP: Direct 1-Click Save to phone's public Downloads directory via Java Bridge!
  if (typeof window !== 'undefined' && (window as any).AndroidApp?.saveBase64File) {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        (window as any).AndroidApp.saveBase64File(base64Data, filename, mimeType);
      };
      reader.readAsDataURL(blob);
      return { success: true, method: 'android-native-download' };
    } catch (err) {
      console.warn('Android native bridge save failed, trying fallback:', err);
    }
  }

  // Check if running on mobile device or native app
  const isMobileOrApp =
    typeof navigator !== 'undefined' &&
    (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.()));

  // 2. FOR DESKTOP / PC BROWSERS: ALWAYS USE DIRECT BROWSER DOWNLOAD (No Windows share dialog!)
  if (!isMobileOrApp) {
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
      return { success: true, method: 'direct-desktop-download' };
    } catch (err) {
      console.error('Desktop direct download failed, trying fallback:', err);
    }
  }

  // 3. FOR MOBILE BROWSERS: Try Web Share API (Save to device / WhatsApp / Drive)
  try {
    if (typeof navigator !== 'undefined' && 'canShare' in navigator) {
      const file = new File([blob], filename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text
        });
        return { success: true, method: 'mobile-share-sheet' };
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: true, method: 'aborted' };
    }
    console.warn('Mobile Web Share API failed, attempting standard download fallback:', err);
  }

  // 4. Fallback: Standard <a download>
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
    return { success: true, method: 'download-fallback' };
  } catch (err) {
    console.error('Download fallback failed:', err);
  }

  // 5. Last-resort fallback for mobile WebViews
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
