import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { UploadForm } from './page.client';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Turbo Summary</h1>
        <p className="mb-2">Pick a Turborepo summary file and view the results.</p>

        <UploadForm />

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">or</span>

          <Button asChild variant="outline">
            <Link href="/sample">View a Sample</Link>
          </Button>
        </div>
      </div>

      <p className="bg-muted/20 text-muted-foreground rounded-lg border p-4 text-sm">
        Also check out the project I created this app for:{' '}
        <Link href="https://qrcardapp.com" target="_blank">
          <span className="scale-125 font-bold transition-all hover:text-[#c20e1a]">QRcard</span>
        </Link>{' '}
        - your last business card 😉
      </p>
    </div>
  );
}
