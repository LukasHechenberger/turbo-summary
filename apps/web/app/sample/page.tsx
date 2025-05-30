'use client';

import {
  CartesianGrid,
  Customized,
  LabelList,
  Line,
  LineChart,
  Rectangle,
  XAxis,
  YAxis,
} from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';
import prettyMilliseconds from 'pretty-ms';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import almostWorking from './almost-working.json';
import failing from './failing.json';
import cached from './cached.json';

// MARK: Settings

/** How many --chart-# colors are available */
const colors = 5;
/** Height of the task's rectangle */
const barHeight = 20;

const samples = [
  { title: 'Failing', data: failing },
  { title: 'Almost Working', data: almostWorking },
  { title: 'Cached', data: cached },
];

type Summary = (typeof samples)[number]['data'];

const chartConfig = {} satisfies ChartConfig;

// using Customized gives you access to all relevant chart props
const CustomizedRectangle = (props) => {
  const { formattedGraphicalItems, colorByTask } = props;
  // get first and second series in chart
  const firstSeries = formattedGraphicalItems[0];
  const secondSeries = formattedGraphicalItems[1];

  // render custom content using points from the graph
  return firstSeries?.props?.points.map((firstSeriesPoint, index) => {
    const secondSeriesPoint = secondSeries?.props?.points[index];
    const xDifference = firstSeriesPoint.x - secondSeriesPoint.x;

    return (
      <Rectangle
        key={firstSeriesPoint.payload.taskId}
        height={barHeight}
        radius={barHeight / 2}
        width={xDifference}
        x={secondSeriesPoint.x}
        y={secondSeriesPoint.y - barHeight / 2}
        fill={colorByTask[firstSeriesPoint.payload.task]}
        stroke="var(--destructive)"
        strokeWidth={firstSeriesPoint.payload?.execution.exitCode === 0 ? 0 : 4}
        fillOpacity={firstSeriesPoint.payload?.cache?.status === 'HIT' ? 0.5 : 1}
      />
    );
  });
};

function TasksChart({ summary }: { summary: Summary }) {
  const chartData = summary.tasks.map((task) => ({
    ...task,
    delay: task.execution.startTime - summary.execution.startTime,
    duration: task.execution.endTime - task.execution.startTime,

    start: task.execution.startTime - summary.execution.startTime,
    end: task.execution.endTime - summary.execution.startTime,
  }));

  const taskNames = summary.tasks.reduce((acc, task) => acc.add(task.task), new Set<string>());
  const colorByTask = Object.fromEntries(
    [...taskNames.values()].map((task, index) => {
      return [task, `var(--chart-${(index % colors) + 1})`];
    }),
  );

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData} layout="vertical">
        <XAxis
          type="number"
          min={0}
          max={summary.execution.endTime - summary.execution.startTime}
          tickFormatter={(value) => prettyMilliseconds(value)}
        />
        <YAxis
          dataKey="taskId"
          type="category"
          hide
          padding={{ top: barHeight, bottom: barHeight }}
        />
        <CartesianGrid horizontal={false} />

        <Customized component={(p) => <CustomizedRectangle {...p} colorByTask={colorByTask} />} />

        <Line
          dataKey="start"
          stroke="var(--foreground)"
          strokeWidth={0}
          opacity={0.2}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="taskId"
            position="insideLeft"
            offset={8}
            fill="var(--foreground)"
            className="text-red-500"
            fontSize={12}
          />
        </Line>
        <Line dataKey="end" stroke="var(--foreground)" strokeWidth={0} opacity={0.2} />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Task: ${value}`}
              formatter={(value, name, item, index) =>
                index === 0 && (
                  <>
                    <div className="text-muted-foreground flex basis-full items-center text-xs">
                      Delay
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {prettyMilliseconds(
                          item.payload.execution.startTime - summary.execution.startTime,
                        )}
                      </div>
                    </div>
                    <div className="text-muted-foreground flex basis-full items-center text-xs">
                      Duration
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {prettyMilliseconds(
                          item.payload.execution.endTime - item.payload.execution.startTime,
                        )}
                      </div>
                    </div>
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
                )
              }
            />
          }
        />
      </LineChart>
    </ChartContainer>
  );
}

export default function SamplePage() {
  const summary = samples[0].data;
  const facts = [
    {
      title: 'Failed Tasks',
      value: `${summary.execution.failed}`,
    },
    {
      title: 'Handled Tasks',
      value: `${summary.tasks.length}/${summary.execution.attempted}`,
    },
    {
      title: 'Cached Tasks',
      value: `${summary.tasks.filter((task) => task.cache.status === 'HIT').length}/${summary.tasks.length}`,
    },
    {
      title: 'Time Saved (Caching)',
      value: prettyMilliseconds(
        summary.tasks.reduce((saved, task) => saved + task.cache.timeSaved, 0),
      ),
    },
    {
      title: 'Time Saved (Parallelization)',
      value: prettyMilliseconds(
        summary.tasks.reduce(
          (total, task) => total + task.execution.endTime - task.execution.startTime,
          0,
        ) -
          summary.execution.endTime +
          summary.execution.startTime,
      ),
    },
  ];

  return (
    <div>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex gap-6">
              <div className="flex-1">
                <CardTitle>Run Summary</CardTitle>
                <CardDescription>This chart shows the execution time of tasks.</CardDescription>
              </div>

              {/* Facts */}
              {facts.map((fact) => (
                <div key={fact.title} className="flex flex-col items-end justify-center gap-1">
                  <span className="text-muted-foreground text-xs">{fact.title}</span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">{fact.value}</span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <TasksChart summary={summary} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
