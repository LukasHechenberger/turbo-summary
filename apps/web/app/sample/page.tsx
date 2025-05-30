'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Label } from '@repo/ui/components/label';
import almostWorking from './almost-working.json';
import failing from './failing.json';
import cached from './cached.json';
import { useState } from 'react';
import { Summary } from '@/components/summary';

const samples = [
  { title: 'Failing', data: failing },
  { title: 'Almost Working', data: almostWorking },
  { title: 'Cached', data: cached },
];

export default function SamplePage() {
  const [sampleIndex, setSampleIndex] = useState(0);

  const sample = samples[sampleIndex]!;
  const summary = sample.data;

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="flex items-baseline justify-end gap-2 p-4">
          <Label htmlFor="select-sample" className="mb-2">
            Select Sample
          </Label>

          <Select
            value={`${sampleIndex}`}
            onValueChange={(value) => setSampleIndex(parseInt(value, 10))}
          >
            <SelectTrigger id="select-sample" className="w-[180px]">
              <SelectValue placeholder="Sample" />
            </SelectTrigger>

            <SelectContent className="bg-background">
              {samples.map((sample, index) => (
                <SelectItem key={sample.title} value={`${index}`}>
                  {sample.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Summary summary={summary} />
      </div>
    </div>
  );
}
