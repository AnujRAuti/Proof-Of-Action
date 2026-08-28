import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/context';
import { I18nProvider } from '@/lib/i18n/context';
import { AppProvider } from '@/lib/store/app-context';
import { DpiHeader } from '@/components/layout/dpi-header';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { CommandPalette } from '@/components/ui/command-palette';
import { KeyboardShortcutsModal } from '@/components/ui/keyboard-shortcuts-modal';
import { ToastContainer } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'Proof-of-Action | Evidence Integrity & Intelligence Layer (EIIL)',
  description:
    'Indian Government-Grade Digital Public Infrastructure (DPI) evidence auditing layer verifying spatial, temporal, visual and cross-project consistency of public works submissions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-Flash Theme Initializer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('eiil_theme');
                  var theme = 'light';
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    theme = 'dark';
                  } else if (saved === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                  
                  var savedLang = localStorage.getItem('eiil_language');
                  if (savedLang === 'ur') {
                    document.documentElement.dir = 'rtl';
                    document.documentElement.lang = 'ur';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-canvas text-ink-primary antialiased flex flex-col min-h-screen">
        <ThemeProvider>
          <I18nProvider>
            <AppProvider>
              {/* Top GIGW 3.0 Header */}
              <DpiHeader />

              {/* Main App Body with Sidebar and Main Content Area */}
              <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
                <SidebarNav />
                <main className="flex-1 overflow-x-hidden min-w-0 bg-canvas animate-page-enter">
                  {children}
                </main>
              </div>

              {/* Global Overlays */}
              <CommandPalette />
              <KeyboardShortcutsModal />
              <ToastContainer />
            </AppProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

