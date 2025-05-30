'use client';

import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';
import prettyMilliseconds from 'pretty-ms';
import summary from './summary.json';

const tasksPerPackage = summary.tasks.reduce(
  (perPackage, task) => ({
    ...perPackage,
    [task.package]: [...(perPackage[task.package] ?? []), task],
  }),
  {} as Record<string, (typeof summary)['tasks'][number][]>,
);

// const chartData = Object.entries(tasksPerPackage).map(([packageName, tasks]) => ({
//   package: packageName,
//   // desktop: 40 * Math.random(),
//   // mobile: 20 * Math.random(),
//   tasks: tasks.map((task) => ({
//     ...task,
//     delay: task.execution.startTime - summary.execution.startTime,
//     duration: task.execution.endTime - task.execution.startTime,
//   })),
// }));

const chartData = summary.tasks.map((task) => ({
  ...task,
  delay: task.execution.startTime - summary.execution.startTime,
  duration: task.execution.endTime - task.execution.startTime,
}));

const chartConfig = {
  delay: {
    label: 'Delay',
    color: '#2563eb',
  },
  duration: {
    label: 'Duration',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

function MyChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 50,
        }}
      >
        <XAxis
          type="number"
          min={0}
          max={summary.execution.endTime - summary.execution.startTime}
          tickFormatter={(value) => prettyMilliseconds(value)}
        />
        <YAxis
          dataKey="taskId"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          // tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Task: ${value}`}
              formatter={(value, name, item, index) => (
                <>
                  <div className="text-muted-foreground flex basis-full items-center text-xs">
                    {chartConfig[name as keyof typeof chartConfig]?.label || name}
                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                      {prettyMilliseconds(value)}
                    </div>
                  </div>

                  {/* Add this after the last item */}
                  {index === 1 && (
                    <>
                      <div className="text-muted-foreground flex basis-full items-center text-xs">
                        Cache
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {item.payload.cache.status}
                        </div>
                      </div>
                      <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                        Status
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {item.payload.execution.exitCode === 0 ? 'Success' : 'Failed'}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            />
          }
        />

        <Bar stackId="a" dataKey="delay" fill="grey" radius={4} style={{ opacity: 0.1 }} />
        <Bar stackId="a" dataKey="duration" fill="var(--chart-1)" radius={4}>
          {chartData.map((task) => (
            <Cell
              key={task.taskId}
              fill={task.execution.exitCode === 0 ? 'green' : 'red'}
              opacity={task.cache.status === 'HIT' ? 0.5 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export default function SamplePage() {
  return (
    <div>
      <h1>Sample Page</h1>

      <div className="container mx-auto p-4">
        <MyChart />
      </div>
    </div>
  );
}
