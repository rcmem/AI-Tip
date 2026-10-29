/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  Loader2, 
  Globe, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

const BASE_TARGET_URL = 'https://tips.floot.app';

export default function App() {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Preserve query parameters and hash if visitors arrive with referral codes or subpaths
  const fullTargetUrl = useMemo(() => {
    if (typeof window === 'undefined') return BASE_TARGET_URL;
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    return `${BASE_TARGET_URL}${search}${hash}`;
  }, []);

  // Perform redirection
  const triggerRedirect = () => {
    setRedirectAttempted(true);
    try {
      // If inside an iframe and permitted, try top level first
      if (window.top && window.top !== window) {
        try {
          window.top.location.href = fullTargetUrl;
          return;
        } catch {
          // Cross-origin iframe restriction: fallback to current window
        }
      }
      window.location.replace(fullTargetUrl);
    } catch {
      window.location.href = fullTargetUrl;
    }
  };

  useEffect(() => {
    // Attempt instant redirect right away
    const immediateTimer = setTimeout(() => {
      triggerRedirect();
    }, 150);

    // Countdown timer for visual indicator
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(immediateTimer);
      clearInterval(interval);
    };
  }, [fullTargetUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullTargetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-indigo-600/20 via-violet-500/20 to-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>Đang tự động chuyển hướng...</span>
        </div>

        {/* Icon & Title */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-5">
          <Globe className="w-8 h-8 text-white animate-pulse" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Đang chuyển đến Tips Floot
        </h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Hệ thống đang tự động điều hướng bạn đến trang đích chính thức. Vui lòng đợi trong giây lát...
        </p>

        {/* Target URL Box */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 mb-6 flex items-center justify-between gap-3 text-left">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Trang đích</div>
            <div className="text-sm font-semibold text-indigo-300 truncate font-mono">
              {fullTargetUrl}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs text-slate-300 transition-all cursor-pointer border border-slate-700/60"
            title="Sao chép liên kết"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-col gap-3">
          <a
            href={fullTargetUrl}
            target="_top"
            rel="noopener noreferrer"
            onClick={triggerRedirect}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] text-white font-medium text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer group"
          >
            <span>Nhấn vào đây để truy cập ngay</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
            <button
              onClick={triggerRedirect}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer py-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Thử lại chuyển hướng</span>
            </button>
            <span>•</span>
            <a
              href={fullTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors"
            >
              <span>Mở tab mới</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Safety & Trust info */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
          <span>Liên kết chuyển hướng an toàn và chính thức</span>
        </div>
      </div>

      {/* Footer watermark */}
      <div className="relative z-10 mt-8 text-center text-xs text-slate-400">
        Tips Floot • <span className="font-mono text-slate-400">tips.floot.app</span>
      </div>
    </div>
  );
}
