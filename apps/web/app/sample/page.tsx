'use client';

import { Customized, Line, LineChart, Rectangle, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';
import prettyMilliseconds from 'pretty-ms';
import summary from './summary.json';

const chartData = summary.tasks.map((task) => ({
  ...task,
  delay: task.execution.startTime - summary.execution.startTime,
  duration: task.execution.endTime - task.execution.startTime,

  start: task.execution.startTime - summary.execution.startTime,
  end: task.execution.endTime - summary.execution.startTime,
}));

const chartConfig = {
  start: {
    label: 'Start',
    color: '#2563eb',
  },
  end: {
    label: 'End',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

// using Customized gives you access to all relevant chart props
const CustomizedRectangle = (props) => {
  const { formattedGraphicalItems } = props;
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
        height={10}
        radius={5}
        width={xDifference}
        x={secondSeriesPoint.x}
        y={secondSeriesPoint.y - 5}
        fill={firstSeriesPoint.payload?.execution.exitCode === 0 ? 'green' : 'red'}
        fillOpacity={firstSeriesPoint.payload?.cache?.status === 'HIT' ? 0.5 : 1}
      />
    );
  });
};

function TasksChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 180,
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
          padding={{ top: 20, bottom: 20 }}
        />

        <Line dataKey="start" stroke={chartConfig.start.color} strokeWidth={0} opacity={0.2} />
        <Line dataKey="end" stroke={chartConfig.end.color} strokeWidth={0} opacity={0.2} />
        <Customized component={CustomizedRectangle} />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Package: ${value}`}
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
  return (
    <div>
      <div className="container mx-auto p-4">
        <TasksChart />
      </div>
    </div>
  );
}
