/**
 * DeenIslam Theme Initialization
 * Executed in <head> to prevent theme flashing (FOUC).
 */
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    // Inject Global Dark Mode Styles immediately
    const style = document.createElement('style');
    style.innerHTML = `
        .dark body { background-color: #020617 !important; color: #f1f5f9 !important; }
        .dark .bg-white { background-color: #0f172a !important; border-color: #1e293b !important; }
        .dark .bg-slate-50 { background-color: #020617 !important; }
        .dark .text-slate-900, .dark .text-slate-800 { color: #f8fafc !important; }
        .dark .text-slate-700, .dark .text-slate-600, .dark .text-slate-500 { color: #94a3b8 !important; }
        .dark .border-slate-100, .dark .border-emerald-50, .dark .border-emerald-100 { border-color: #1e293b !important; }
        .dark nav { background-color: rgba(15, 23, 42, 0.8) !important; border-color: #1e293b !important; }
        .dark #mobile-menu { background-color: #0f172a !important; }
        .dark .bg-emerald-50 { background-color: rgba(16, 185, 129, 0.1) !important; color: #34d399 !important; }
        .dark .bg-amber-50 { background-color: rgba(245, 158, 11, 0.1) !important; color: #fbbf24 !important; }
        .dark .prose { color: #cbd5e1 !important; }
        .dark input { background-color: #1e293b !important; border-color: #334155 !important; color: white !important; }
        .dark .bg-slate-900 { background-color: #020617 !important; border-top: 1px solid #1e293b; }
    `;
    document.head.appendChild(style);
})();
