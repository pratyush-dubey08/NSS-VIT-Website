package com.vitbhopal.nss;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Message;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private Dialog currentAuthDialog = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register back button callback for Android 10+ gesture navigation and button navigation
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                // 1. Dismiss popup OAuth dialog if currently showing
                if (currentAuthDialog != null && currentAuthDialog.isShowing()) {
                    try {
                        currentAuthDialog.dismiss();
                    } catch (Exception ignored) {}
                    currentAuthDialog = null;
                    return;
                }

                // 2. Navigate back in WebView history if user visited pages (e.g. Annual Camp, Dashboard, etc.)
                if (bridge != null && bridge.getWebView() != null) {
                    WebView mainWebView = bridge.getWebView();
                    if (mainWebView.canGoBack()) {
                        mainWebView.goBack();
                        return;
                    }
                }

                // 3. At root of app, allow system to exit/minimize app cleanly
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

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onResume() {
        super.onResume();
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebView mainWebView = this.bridge.getWebView();
            WebSettings settings = mainWebView.getSettings();
            
            // Enable JavaScript and persistent HTML5 storage
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);
            settings.setSupportMultipleWindows(true);

            // Enable cookies and third-party cookies for Google session preservation
            final CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            cookieManager.setAcceptThirdPartyCookies(mainWebView, true);

            // Clean User-Agent removing '; wv' and 'Version/4.0'
            String ua = settings.getUserAgentString();
            if (ua != null) {
                String cleanUa = ua.replace("; wv", "").replace("Version/4.0 ", "");
                settings.setUserAgentString(cleanUa);
            }

            // In-app OAuth popup handler with clean lifecycle and repeatable clicks
            mainWebView.setWebChromeClient(new WebChromeClient() {
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
