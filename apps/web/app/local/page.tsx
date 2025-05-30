'use client';

import { Summary, TurboSummary } from '@/components/summary';
import { useEffect, useState } from 'react';

export default function LocalPage() {
  const [data, setData] = useState<{ data: TurboSummary } | undefined>();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const data = JSON.parse(
      localStorage.getItem(`turbo-summary/${id}`) ?? JSON.stringify({ id, data: null }),
    );
    setData(data);
  }, []);
  const loading = !data;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.data) {
    return <div>No data found for ID: {data.id}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Summary summary={data.data} />
    </div>
  );
}
