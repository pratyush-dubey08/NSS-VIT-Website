package com.vitbhopal.nss;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Message;
import android.util.Base64;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;

public class MainActivity extends BridgeActivity {
    private Dialog currentAuthDialog = null;
    private ValueCallback<Uri[]> mUploadMessage = null;
    private final static int FILECHOOSER_RESULTCODE = 1001;

    // JavaScript Native Interface for 1-Click Blob/Base64 File Downloads in App
    public class AndroidNativeBridge {
        Context mContext;

        AndroidNativeBridge(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void saveBase64File(String base64Data, String filename, String mimeType) {
            try {
                byte[] pdfAsBytes = Base64.decode(base64Data, Base64.DEFAULT);
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (!downloadsDir.exists()) {
                    downloadsDir.mkdirs();
                }
                File file = new File(downloadsDir, filename);
                FileOutputStream os = new FileOutputStream(file, false);
                os.write(pdfAsBytes);
                os.flush();
                os.close();

                // Notify Android Media Scanner so file appears immediately in Files/Downloads app
                Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                mediaScanIntent.setData(Uri.fromFile(file));
                mContext.sendBroadcast(mediaScanIntent);

                runOnUiThread(() -> Toast.makeText(mContext, "Downloaded " + filename + " to Downloads folder", Toast.LENGTH_LONG).show());
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(mContext, "Download failed: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware / Gesture Back Navigation
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (currentAuthDialog != null && currentAuthDialog.isShowing()) {
                    try {
                        currentAuthDialog.dismiss();
                    } catch (Exception ignored) {}
                    currentAuthDialog = null;
                    return;
                }

                if (bridge != null && bridge.getWebView() != null) {
                    WebView mainWebView = bridge.getWebView();
                    if (mainWebView.canGoBack()) {
                        mainWebView.goBack();
                        return;
                    }
                }

                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
                setEnabled(true);
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (currentAuthDialog != null && currentAuthDialog.isShowing()) {
            try {
                currentAuthDialog.dismiss();
            } catch (Exception ignored) {}
            currentAuthDialog = null;
            return;
        }

        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView mainWebView = this.bridge.getWebView();
            if (mainWebView.canGoBack()) {
                mainWebView.goBack();
                return;
            }
        }

        super.onBackPressed();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (mUploadMessage == null) return;
            mUploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            mUploadMessage = null;
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onResume() {
        super.onResume();
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView mainWebView = this.bridge.getWebView();
            WebSettings settings = mainWebView.getSettings();
            
            // Enable JavaScript and HTML5 storage
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);
            settings.setSupportMultipleWindows(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);

            // Add JavaScript Interface for Direct File Downloads
            mainWebView.addJavascriptInterface(new AndroidNativeBridge(this), "AndroidApp");

            // Native Download Listener for HTTP/HTTPS files
            mainWebView.setDownloadListener(new DownloadListener() {
                @Override
                public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                    try {
                        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                        request.setMimeType(mimeType);
                        String cookies = CookieManager.getInstance().getCookie(url);
                        request.addRequestHeader("cookie", cookies);
                        request.addRequestHeader("User-Agent", userAgent);
                        request.setDescription("Downloading file from NSS Unit...");
                        String filename = URLUtil.guessFileName(url, contentDisposition, mimeType);
                        request.setTitle(filename);
                        request.allowScanningByMediaScanner();
                        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
                        
                        DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                        if (dm != null) {
                            dm.enqueue(request);
                            Toast.makeText(getApplicationContext(), "Downloading " + filename + "...", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        try {
                            Intent intent = new Intent(Intent.ACTION_VIEW);
                            intent.setData(Uri.parse(url));
                            startActivity(intent);
                        } catch (Exception ignored) {}
                    }
                }
            });

            // Enable cookies
            final CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            cookieManager.setAcceptThirdPartyCookies(mainWebView, true);

            // Clean User-Agent
            String ua = settings.getUserAgentString();
            if (ua != null) {
                String cleanUa = ua.replace("; wv", "").replace("Version/4.0 ", "");
                settings.setUserAgentString(cleanUa);
            }

            // WebChromeClient with File Chooser (<input type="file">) and OAuth Popup support
            mainWebView.setWebChromeClient(new WebChromeClient() {
                // File Chooser Handler (Upload Photos, CSV, Certificates)
                @Override
                public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                    if (mUploadMessage != null) {
                        mUploadMessage.onReceiveValue(null);
                    }
                    mUploadMessage = filePathCallback;

                    Intent intent = fileChooserParams.createIntent();
                    try {
                        startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                    } catch (ActivityNotFoundException e) {
                        mUploadMessage = null;
                        Toast.makeText(MainActivity.this, "Cannot open file picker", Toast.LENGTH_SHORT).show();
                        return false;
                    }
                    return true;
                }

                @Override
                public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                    if (currentAuthDialog != null && currentAuthDialog.isShowing()) {
                        try {
                            currentAuthDialog.dismiss();
                        } catch (Exception ignored) {}
                    }

                    final Dialog authDialog = new Dialog(MainActivity.this, android.R.style.Theme_DeviceDefault_Light_NoActionBar_Fullscreen);
                    currentAuthDialog = authDialog;

                    final WebView popupWebView = new WebView(MainActivity.this);
                    WebSettings popupSettings = popupWebView.getSettings();
                    popupSettings.setJavaScriptEnabled(true);
                    popupSettings.setDomStorageEnabled(true);
                    popupSettings.setDatabaseEnabled(true);
                    popupSettings.setJavaScriptCanOpenWindowsAutomatically(true);
                    popupSettings.setSupportMultipleWindows(true);
                    popupSettings.setUserAgentString(settings.getUserAgentString());

                    cookieManager.setAcceptThirdPartyCookies(popupWebView, true);

                    popupWebView.setWebViewClient(new WebViewClient() {
                        @Override
                        public boolean shouldOverrideUrlLoading(WebView v, String url) {
                            return false;
                        }
                    });

                    popupWebView.setWebChromeClient(new WebChromeClient() {
                        @Override
                        public void onCloseWindow(WebView window) {
                            try {
                                authDialog.dismiss();
                                window.destroy();
                            } catch (Exception ignored) {}
                            currentAuthDialog = null;
                        }
                    });

                    authDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                        @Override
                        public void onDismiss(DialogInterface dialog) {
                            try {
                                popupWebView.destroy();
                            } catch (Exception ignored) {}
                            currentAuthDialog = null;
                        }
                    });

                    authDialog.setContentView(popupWebView, new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, 
                        ViewGroup.LayoutParams.MATCH_PARENT
                    ));
                    authDialog.show();

                    WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                    transport.setWebView(popupWebView);
                    resultMsg.sendToTarget();
                    return true;
                }
            });
        }
    }
}
