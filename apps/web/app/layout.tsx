import { Geist, Geist_Mono } from 'next/font/google';
import '@repo/ui/globals.css';
import { Providers } from '@/components/providers';
import Link from 'next/link';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="bg-background/50 sticky top-0 z-40 flex items-center justify-between p-4 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <span className="font-medium">Turbo Summary</span>
                </Link>
              </div>
            </header>

            {children}
          </div>

          <footer className="bg-muted/20 text-muted-foreground mt-12 border-t px-4 pb-12 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Lukas Hechenberger
          </footer>
        </Providers>
      </body>
    </html>
  );
}
