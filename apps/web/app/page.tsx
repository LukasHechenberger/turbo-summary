import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import Link from 'next/link';
import { UploadForm } from './page.client';

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Turbo Summary</h1>
        <p className="mb-2">
          Upload your turborepo <code>summary.json</code> and view the results.
        </p>

        <UploadForm />

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">or</span>

          <Button asChild variant="outline">
            <Link href="/sample">View a Sample</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
