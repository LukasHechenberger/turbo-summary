import { Geist, Geist_Mono } from 'next/font/google';
import '@repo/ui/globals.css';
import { Providers } from '@/components/providers';
import Link from 'next/link';
import { Button } from '@repo/ui/components/button';
import { GithubIcon } from 'lucide-react';

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
          <div className="flex min-h-screen flex-col pb-12">
            <header className="bg-background/50 sticky top-0 z-40 flex items-center justify-between px-4 py-2 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <span className="font-medium">Turbo Summary</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" asChild>
                  <Link
                    href="https://github.com/LukasHechenberger/turbo-summary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon />
                    <span>GitHub</span>
                  </Link>
                </Button>
              </div>
            </header>

            {children}
          </div>

          <footer className="bg-muted/20 text-muted-foreground border-t px-4 pb-12 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()}{' '}
            <Button variant="ghost" asChild>
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/LukasHechenberger"
              >
                Lukas Hechenberger
              </Link>
            </Button>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
