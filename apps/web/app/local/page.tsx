'use client';

import { Summary, TurboSummary } from '@/components/summary';
import { Separator } from '@repo/ui/components/separator';
import { useEffect, useState } from 'react';
import { UploadForm } from '../page.client';

export default function LocalPage() {
  const [data, setData] = useState<{ id: string; data?: TurboSummary } | undefined>();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const data = JSON.parse(localStorage.getItem(`turbo-summary/${id}`) ?? '{}');
    setData({ id, ...data });
  }, []);
  const loading = !data;

  if (loading) {
    return (
      <div className="container mx-auto flex flex-1 items-center justify-center p-4">
        Loading...
      </div>
    );
  }

  if (!data.data) {
    return (
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg">No data found for ID: {data.id}</p>
        <p className="text-muted-foreground text-sm">Try to upload your summary again</p>

        <UploadForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Summary summary={data.data} />
    </div>
  );
}
