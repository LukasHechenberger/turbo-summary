'use client';

import { Card, CardContent } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { useRouter } from 'next/navigation';

export function UploadForm() {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Read the file content if needed
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const json = JSON.parse(content);

      // Save the file content to localStorage
      localStorage.setItem(
        `turbo-summary/${json.id}`,
        JSON.stringify({ name: file.name, uploaded: new Date(), data: json }),
      );

      // and redirect to the local page
      router.push(`/local#${json.id}`, { scroll: true });
    };
    reader.readAsText(file);
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <Input
          id="summary"
          name="summary"
          type="file"
          accept="application/json"
          className="min-w-12"
          placeholder="Upload a summary.json file"
          onChange={handleChange}
        />

        <p className="text-muted-foreground text-xs">
          Your data remains in your browser and is not sent to any server.
        </p>
      </CardContent>
    </Card>
  );
}
