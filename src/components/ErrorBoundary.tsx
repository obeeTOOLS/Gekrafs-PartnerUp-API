import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleHardReset = () => {
    try {
      // Bersihkan localStorage yang berpotensi korup
      localStorage.clear();
      sessionStorage.clear();
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    } catch (e) {
      console.error('Gagal clear storage:', e);
    }
    // Muat ulang bersih tanpa cache
    window.location.href = window.location.pathname;
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f0f4f9] text-[#10233d] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#001c3c] tracking-tight">
                Aplikasi Mengalami Kendala Tampilan
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Terjadi kesalahan sementara pada browser atau cache aplikasi. Anda dapat memuat ulang atau mereset cache lokal untuk memulihkan sistem secara instan.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] font-mono text-slate-600 overflow-x-auto max-h-32">
                <strong>Error:</strong> {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#001c3c] hover:bg-[#002c5c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Hapus cache dan kembalikan ke pengaturan awal"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Cache & Pulihkan</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400">
              GEKRAFS Kota Batu &bull; PartnerUp Headless System
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
