window.toBengaliNumerals = (n) => {
    if (n === undefined || n === null) return "";
    return n.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
};

// Bookmark Helpers (Global)
window.toggleBookmark = (data) => {
    let bookmarks = JSON.parse(localStorage.getItem('deen_bookmarks') || '[]');
    const index = bookmarks.findIndex(b => b.key === data.key);
    
    if (index === -1) {
        bookmarks.push(data);
        localStorage.setItem('deen_bookmarks', JSON.stringify(bookmarks));
        showToast('বুকমার্ক করা হয়েছে!');
        return true;
    } else {
        bookmarks.splice(index, 1);
        localStorage.setItem('deen_bookmarks', JSON.stringify(bookmarks));
        showToast('বুকমার্ক সরানো হয়েছে');
        return false;
    }
};

window.isBookmarked = (key) => {
    const bookmarks = JSON.parse(localStorage.getItem('deen_bookmarks') || '[]');
    return bookmarks.some(b => b.key === key);
};

window.copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast('কপি করা হয়েছে!');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
};

// --- Font Size Manager ---
window.fontSizeManager = {
    arabic: parseInt(localStorage.getItem('fontSize_arabic')) || 32,
    bengali: parseInt(localStorage.getItem('fontSize_bengali')) || 18,

    init() {
        this.apply();
        this.injectSettings();
    },

    set(type, value) {
        this[type] = parseInt(value);
        localStorage.setItem(`fontSize_${type}`, this[type]);
        this.apply();
        this.updateLabels();
    },

    reset() {
        this.arabic = 32;
        this.bengali = 18;
        localStorage.setItem('fontSize_arabic', 32);
        localStorage.setItem('fontSize_bengali', 18);
        this.apply();
        this.updateLabels();
        
        // Update slider positions
        const sA = document.getElementById('slider-arabic');
        const sB = document.getElementById('slider-bengali');
        if (sA) sA.value = 32;
        if (sB) sB.value = 18;
        showToast('ডিফল্ট সাইজ সেট করা হয়েছে');
    },

    apply() {
        const styleId = 'deen-font-sizes';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.innerHTML = `
            .font-arabic { font-size: ${this.arabic}px !important; line-height: 2.2 !important; }
            .font-bengali-content { font-size: ${this.bengali}px !important; line-height: 1.8 !important; }
            
            .deen-range {
                -webkit-appearance: none;
                width: 100%;
                height: 6px;
                background: #e2e8f0;
                border-radius: 5px;
                outline: none;
            }
            .dark .deen-range { background: #1e293b; }
            .deen-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: #059669;
                cursor: pointer;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
        `;
    },

    updateLabels() {
        const aLabel = document.getElementById('label-arabic-size');
        const bLabel = document.getElementById('label-bengali-size');
        if (aLabel) aLabel.innerText = window.toBengaliNumerals(this.arabic);
        if (bLabel) bLabel.innerText = window.toBengaliNumerals(this.bengali);
    },

    injectSettings() {
        const allowedPages = ['surah.html', 'hadith-view.html'];
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        if (!allowedPages.includes(page)) return;

        const settingsHTML = `
        <!-- Settings Drawer -->
        <div id="settings-drawer" class="fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 z-[200] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transform translate-x-full transition-transform duration-500 ease-in-out border-l border-emerald-50 dark:border-slate-800">
            <div class="p-8">
                <div class="flex justify-between items-center mb-10">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">পঠন সেটিংস</h3>
                    <button id="close-drawer" class="text-slate-400 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div class="space-y-10">
                    <!-- Arabic Slider -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-sm font-bold text-slate-500 uppercase tracking-widest">আরবি ফন্ট সাইজ</span>
                            <span id="label-arabic-size" class="text-sm font-bold text-primary bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg">${window.toBengaliNumerals(this.arabic)}</span>
                        </div>
                        <input type="range" min="20" max="64" value="${this.arabic}" class="deen-range" id="slider-arabic" oninput="window.fontSizeManager.set('arabic', this.value)">
                    </div>

                    <!-- Bengali Slider -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-sm font-bold text-slate-500 uppercase tracking-widest">বাংলা ফন্ট সাইজ</span>
                            <span id="label-bengali-size" class="text-sm font-bold text-primary bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg">${window.toBengaliNumerals(this.bengali)}</span>
                        </div>
                        <input type="range" min="14" max="36" value="${this.bengali}" class="deen-range" id="slider-bengali" oninput="window.fontSizeManager.set('bengali', this.value)">
                    </div>

                    <button onclick="window.fontSizeManager.reset()" class="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>রিসেট করুন</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Transparent Backdrop (No Blur) -->
        <div id="drawer-backdrop" class="fixed inset-0 bg-transparent z-[190] hidden"></div>

        <!-- Floating Button -->
        <button id="settings-toggle" class="fixed bottom-24 right-8 w-14 h-14 bg-white dark:bg-slate-900 text-primary rounded-2xl shadow-xl flex items-center justify-center border border-emerald-50 dark:border-slate-800 hover:scale-110 active:scale-95 transition-all z-[150]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
        `;

        const div = document.createElement('div');
        div.innerHTML = settingsHTML;
        document.body.appendChild(div);

        const toggle = document.getElementById('settings-toggle');
        const drawer = document.getElementById('settings-drawer');
        const backdrop = document.getElementById('drawer-backdrop');
        const closeBtn = document.getElementById('close-drawer');

        const openDrawer = () => {
            drawer.classList.remove('translate-x-full');
            backdrop.classList.remove('hidden');
        };

        const closeDrawer = () => {
            drawer.classList.add('translate-x-full');
            backdrop.classList.add('hidden');
        };

        toggle.onclick = openDrawer;
        closeBtn.onclick = closeDrawer;
        backdrop.onclick = closeDrawer;
    }
};

function showToast(message) {
    let toast = document.getElementById('deen-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'deen-toast';
        document.body.appendChild(toast);
    }
    toast.className = "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[300] font-bold text-sm animate-bounce-in opacity-100 transition-opacity duration-500";
    toast.innerText = message;
    
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 2000);
}

// Add toast animation style
const toastStyle = document.createElement('style');
toastStyle.innerHTML = `
    @keyframes bounce-in {
        0% { transform: translate(-50%, 20px); opacity: 0; }
        60% { transform: translate(-50%, -5px); opacity: 1; }
        100% { transform: translate(-50%, 0); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
`;
document.head.appendChild(toastStyle);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Font Size Manager
    if (window.fontSizeManager) window.fontSizeManager.init();

    const path = window.location.pathname;
    const isSubDir = path.includes('/articles/');
    const basePath = isSubDir ? '../' : '';
    const currentPage = path.split('/').pop() || 'index.html';

    // 1. Inject Navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        navbarPlaceholder.innerHTML = `
        <nav class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="${basePath}index.html" class="flex items-center space-x-2 shrink-0">
                    <span class="text-2xl font-extrabold text-primary tracking-tighter">DeenIslam</span>
                </a>
                
                <div class="hidden md:flex flex-grow justify-center items-center">
                    <ul class="flex space-x-6 lg:space-x-8 items-center">
                        <li><a href="${basePath}index.html" class="${(currentPage === 'index.html' || currentPage === '') && !isSubDir ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">হোম</a></li>
                        <li><a href="${basePath}quran.html" class="${currentPage === 'quran.html' ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">কুরআন</a></li>
                        <li><a href="${basePath}hadith.html" class="${currentPage === 'hadith.html' ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">হাদিস</a></li>
                        <li><a href="${basePath}salat.html" class="${currentPage === 'salat.html' ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">সালাত</a></li>
                        <li><a href="${basePath}media.html" class="${currentPage === 'media.html' ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">মিডিয়া</a></li>
                        <li><a href="${basePath}articles/index.html" class="${isSubDir || currentPage === 'articles' ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">প্রবন্ধ</a></li>
                        
                        <li class="relative group">
                            <button class="flex items-center space-x-1 ${['community.html', 'about.html', 'credits.html'].includes(currentPage) ? 'text-primary font-bold' : 'hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors duration-200 font-medium'}">
                                <span>অন্যান্য</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div class="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-emerald-50 dark:border-slate-800 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                <a href="${basePath}community.html" class="block px-6 py-3 text-sm font-medium ${currentPage === 'community.html' ? 'text-primary bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-primary'}">কমিউনিটি</a>
                                <a href="${basePath}about.html" class="block px-6 py-3 text-sm font-medium ${currentPage === 'about.html' ? 'text-primary bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-primary'}">আমাদের সম্পর্কে</a>
                                <a href="${basePath}credits.html" class="block px-6 py-3 text-sm font-medium ${currentPage === 'credits.html' ? 'text-primary bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-primary'}">কৃতজ্ঞতা স্বীকার</a>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="flex items-center space-x-2 shrink-0">
                    <a href="${basePath}bookmarks.html" class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-300 group ${currentPage === 'bookmarks.html' ? 'text-primary bg-emerald-50 dark:bg-emerald-900/20' : ''}" title="বুকমার্ক">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="${currentPage === 'bookmarks.html' ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </a>
                    <a href="${basePath}donation.html" class="hidden lg:flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span>দান করুন</span>
                    </a>
                    <button class="theme-toggle p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-300 mr-2 focus:outline-none">
                        <svg class="theme-toggle-dark-icon hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                        <svg class="theme-toggle-light-icon hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </button>
                    <button id="mobile-menu-btn" class="md:hidden text-slate-600 dark:text-slate-300 focus:outline-none ml-2 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </div>

            <div id="mobile-menu" class="hidden md:hidden bg-white dark:bg-slate-900 border-t border-emerald-50 dark:border-slate-800 px-4 py-6 space-y-2 shadow-xl overflow-y-auto max-h-[80vh]">
                <a href="${basePath}index.html" class="block p-3 rounded-xl ${(currentPage === 'index.html' || currentPage === '') && !isSubDir ? 'text-primary font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">হোম</a>
                <a href="${basePath}quran.html" class="block p-3 rounded-xl ${currentPage === 'quran.html' ? 'text-primary font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">কুরআন</a>
                <a href="${basePath}hadith.html" class="block p-3 rounded-xl ${currentPage === 'hadith.html' ? 'text-primary font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">হাদিস</a>
                <a href="${basePath}salat.html" class="block p-3 rounded-xl ${currentPage === 'salat.html' ? 'text-primary font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">সালাত</a>
                <a href="${basePath}media.html" class="block p-3 rounded-xl ${currentPage === 'media.html' ? 'text-primary font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">মিডিয়া</a>
                <a href="${basePath}articles/index.html" class="block p-3 rounded-xl ${isSubDir || currentPage === 'articles' ? 'text-primary font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">প্রবন্ধ</a>
                <div>
                    <button id="mobile-other-btn" class="w-full flex justify-between items-center p-3 rounded-xl font-medium dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <span>অন্যান্য</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform" id="mobile-other-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div id="mobile-other-menu" class="hidden pl-6 space-y-1 mt-1">
                        <a href="${basePath}community.html" class="block p-3 rounded-xl text-sm ${currentPage === 'community.html' ? 'text-primary font-bold' : 'dark:text-slate-400 font-medium'}">কমিউনিটি</a>
                        <a href="${basePath}about.html" class="block p-3 rounded-xl text-sm ${currentPage === 'about.html' ? 'text-primary font-bold' : 'dark:text-slate-400 font-medium'}">আমাদের সম্পর্কে</a>
                        <a href="${basePath}credits.html" class="block p-3 rounded-xl text-sm ${currentPage === 'credits.html' ? 'text-primary font-bold' : 'dark:text-slate-400 font-medium'}">কৃতজ্ঞতা স্বীকার</a>
                    </div>
                </div>
                <a href="${basePath}donation.html" class="block p-4 mt-4 bg-primary text-white text-center rounded-2xl font-bold shadow-lg">দান করুন</a>
            </div>
        </nav>
        `;

        const mobileOtherBtn = document.getElementById('mobile-other-btn');
        const mobileOtherMenu = document.getElementById('mobile-other-menu');
        const mobileOtherIcon = document.getElementById('mobile-other-icon');
        if (mobileOtherBtn && mobileOtherMenu) {
            mobileOtherBtn.onclick = () => {
                mobileOtherMenu.classList.toggle('hidden');
                mobileOtherIcon.classList.toggle('rotate-180');
            };
        }

        const themeToggles = document.querySelectorAll('.theme-toggle');
        const updateIcons = () => {
            const isDark = document.documentElement.classList.contains('dark');
            document.querySelectorAll('.theme-toggle-dark-icon').forEach(i => isDark ? i.classList.add('hidden') : i.classList.remove('hidden'));
            document.querySelectorAll('.theme-toggle-light-icon').forEach(i => isDark ? i.classList.remove('hidden') : i.classList.add('hidden'));
        };
        updateIcons();
        themeToggles.forEach(btn => {
            btn.onclick = () => {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                updateIcons();
            };
        });

        const mBtn = document.getElementById('mobile-menu-btn');
        const mMenu = document.getElementById('mobile-menu');
        if (mBtn && mMenu) {
            mBtn.onclick = () => mMenu.classList.toggle('hidden');
        }
    }

    // 2. Inject Tasbeeh Counter (Home Page Only)
    if ((currentPage === 'index.html' || currentPage === '') && !isSubDir) {
        const tasbeehHTML = `
        <button id="tasbeeh-bubble" class="fixed bottom-8 right-8 flex flex-col items-center space-y-1 z-[90] group focus:outline-none">
            <div class="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-width="2.5" d="M12 17c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z" stroke-dasharray="0.1 4.5" /></svg>
            </div>
            <span class="text-[10px] font-extrabold text-primary dark:text-emerald-400 uppercase tracking-widest bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-emerald-100 dark:border-slate-800">তাসবীহ</span>
        </button>
        <div id="tasbeeh-modal" class="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[200] hidden flex flex-col items-center justify-center p-6">
            <button id="close-tasbeeh" class="absolute top-8 right-8 text-white/50 hover:text-white p-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div class="text-center w-full max-w-md">
                <h2 class="text-emerald-400 font-bold text-xl mb-8">তাসবীহ পড়ুন</h2>
                <div class="flex flex-wrap justify-center gap-3 mb-10" id="zikir-selector">
                    <button class="zikir-btn px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm" data-zikir="সুবহানাল্লাহ">সুবহানাল্লাহ</button>
                    <button class="zikir-btn px-4 py-2 rounded-xl bg-white/5 text-white/50 font-bold text-sm" data-zikir="আলহামদুলিল্লাহ">আলহামদুলিল্লাহ</button>
                    <button class="zikir-btn px-4 py-2 rounded-xl bg-white/5 text-white/50 font-bold text-sm" data-zikir="আল্লাহু আকবার">আল্লাহু আকবার</button>
                </div>
                <div id="tasbeeh-circle" class="relative w-72 h-72 mx-auto rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform select-none">
                    <svg class="absolute inset-0 w-full h-full -rotate-90"><circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.05)" stroke-width="8" fill="none" /><circle id="tasbeeh-progress" cx="50%" cy="50%" r="48%" stroke="#10b981" stroke-width="8" fill="none" stroke-dasharray="1000" stroke-dashoffset="1000" stroke-linecap="round" /></svg>
                    <div class="text-center"><span id="tasbeeh-count" class="text-8xl font-extrabold text-white">০</span></div>
                </div>
                <div class="mt-20 flex items-center justify-center space-x-12">
                    <button id="reset-tasbeeh" class="flex flex-col items-center"><div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div></button>
                    <button id="goal-tasbeeh" class="flex flex-col items-center"><div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-2"><span id="tasbeeh-goal-label" class="font-bold text-sm">৩৩</span></div></button>
                </div>
            </div>
        </div>
        <div id="tasbeeh-confirm-modal" class="fixed inset-0 z-[300] hidden flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" id="tasbeeh-confirm-bg"></div>
            <div class="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-emerald-100 dark:border-slate-800 transform scale-95 transition-transform duration-300">
                <h3 class="text-xl font-bold text-slate-800 dark:text-white text-center mb-8">রিসেট করতে চান?</h3>
                <div class="grid grid-cols-2 gap-4">
                    <button id="tasbeeh-confirm-cancel" class="py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800">না</button>
                    <button id="tasbeeh-confirm-yes" class="py-4 rounded-2xl font-bold text-white bg-red-500">হ্যাঁ</button>
                </div>
            </div>
        </div>
        `;
        const tDiv = document.createElement('div');
        tDiv.innerHTML = tasbeehHTML;
        document.body.appendChild(tDiv);

        const tBubble = document.getElementById('tasbeeh-bubble');
        const tModal = document.getElementById('tasbeeh-modal');
        const tCloseBtn = document.getElementById('close-tasbeeh');
        const tResetBtn = document.getElementById('reset-tasbeeh');
        const tGoalBtn = document.getElementById('goal-tasbeeh');
        const tCircle = document.getElementById('tasbeeh-circle');
        const tCountDisplay = document.getElementById('tasbeeh-count');
        const tProgressBar = document.getElementById('tasbeeh-progress');
        const tGoalLabel = document.getElementById('tasbeeh-goal-label');
        const tConfirmModal = document.getElementById('tasbeeh-confirm-modal');
        const tConfirmYes = document.getElementById('tasbeeh-confirm-yes');
        const tConfirmCancel = document.getElementById('tasbeeh-confirm-cancel');

        let tCount = parseInt(localStorage.getItem('tasbeeh_count')) || 0;
        let tGoal = parseInt(localStorage.getItem('tasbeeh_goal')) || 33;

        const tUpdateDisplay = () => {
            tCountDisplay.innerText = window.toBengaliNumerals(tCount);
            tGoalLabel.innerText = window.toBengaliNumerals(tGoal);
            const radius = 48;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (Math.min(tCount % tGoal, tGoal) / tGoal) * circumference;
            tProgressBar.style.strokeDasharray = `${circumference} ${circumference}`;
            tProgressBar.style.strokeDashoffset = offset;
            localStorage.setItem('tasbeeh_count', tCount);
        };

        tBubble.onclick = () => tModal.classList.remove('hidden');
        tCloseBtn.onclick = () => tModal.classList.add('hidden');
        tCircle.onclick = () => { tCount++; tUpdateDisplay(); if (window.navigator.vibrate) window.navigator.vibrate(50); };
        tResetBtn.onclick = () => tConfirmModal.classList.remove('hidden');
        tConfirmCancel.onclick = () => tConfirmModal.classList.add('hidden');
        tConfirmYes.onclick = () => { tCount = 0; tUpdateDisplay(); tConfirmModal.classList.add('hidden'); };
        tGoalBtn.onclick = () => {
            const goals = [33, 100, 1000];
            tGoal = goals[(goals.indexOf(tGoal) + 1) % goals.length];
            localStorage.setItem('tasbeeh_goal', tGoal);
            tUpdateDisplay();
        };
        tUpdateDisplay();
    }

    // 3. Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
        <footer class="bg-slate-900 text-slate-300 py-16 px-6 mt-auto">
            <div class="container mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
                    <div class="col-span-1 md:col-span-2">
                        <h2 class="text-3xl font-bold text-white mb-6">DeenIslam</h2>
                        <p class="text-slate-400 leading-relaxed max-w-sm">আমরা ইসলামের শুদ্ধ আলো ছড়িয়ে দিতে কাজ করে যাচ্ছি। সঠিক তথ্য ও গাইড পেতে আমাদের সাথেই থাকুন।</p>
                        <p class="mt-4"><a href="https://www.deenislam.org" class="text-primary font-bold hover:underline">www.deenislam.org</a></p>
                    </div>
                    <div>
                        <h3 class="text-white font-bold mb-6 uppercase tracking-wider">লিংক</h3>
                        <ul class="space-y-4">
                            <li><a href="${basePath}about.html" class="hover:text-white transition-colors">আমাদের সম্পর্কে</a></li>
                            <li><a href="${basePath}credits.html" class="hover:text-white transition-colors">কৃতজ্ঞতা স্বীকার</a></li>
                            <li><a href="${basePath}community.html" class="hover:text-white transition-colors">কমিউনিটি</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-white font-bold mb-6 uppercase tracking-wider">যোগাযোগ</h3>
                        <p class="text-slate-400">contact@deenislam.org</p>
                        <div class="mt-6">
                            <a href="https://www.facebook.com/groups/deenislam.org/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2 bg-[#1877F2] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#166fe5] transition-all shadow-lg shadow-blue-900/20">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                <span>ফেসবুক কমিউনিটি</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="text-center text-sm text-slate-500">© 2026 DeenIslam.org | সর্বস্বত্ব সংরক্ষিত</div>
            </div>
        </footer>
        `;
    }
});
