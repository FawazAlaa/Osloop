"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
//npx shadcn@latest add card from this
//>>>after npm i recharts lucide-react
// shadcn/ui is NOT an npm package
// It copies components into your repo
// It assumes Tailwind CSS is already working
// You can remove shadcn later without vendor lock-in
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"; //npx shadcn@latest add chart
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAnalyticsAll } from "@/hooks/useAnalyticesAll";
import { useState } from "react";

export const description = "A mixed bar chart";


  //El V hna gia m,n recharts ta2sima el charts mohema gedan ba3d kda bahy arsm el char ta7t
  //   notesCount
  // :
  // 3
  // tasksByStatus
  // :
  // {todo: 3, in-progress: 3, done: 1}
  // tasksByWeek
  // :
  // 6
  // totalTasks
  // :
  // 7


//   const chartData = [
//   {
//     browser: "chrome",
//     visitors: 275,
//     fill: "var(--color-chrome)",
//     v1: 275,
//     v2: 0,
//     v3: 0,
//     raw: 400,
//   },
//   {
//     browser: "safari",
//     visitors: 400,
//     fill: "var(--color-safari)",
//     count: 400,
//     v2: 0,
//     v3: 0,
//   },
//   {
//     browser: "firefox",
//     visitors: 187,
//     fill: "var(--color-firefox)",
//     v1: 80,
//     v2: 60,
//     v3: 47,
//   },
//   {
//     browser: "edge",
//     visitors: 173,
//     fill: "var(--color-edge)",
//     v1: 173,
//     v2: 0,
//     v3: 0,
//     indicatorColor: "blue", //ana 3amlt deh mn 3ady 3lshan awry el example bs
//   },
//   {
//     browser: "other",
//     visitors: 90,
//     fill: "var(--color-other)",
//     v1: 90,
//     v2: 0,
//     v3: 0,
//   },
// ];

export default function DashboardPage() {

    const [open,setOpen]=useState(false)
 const toggleExtra = () => setOpen((v) => !v);
  const { data: analytics, isLoading,error } = useAnalytics();
  const {data:analyticsAll}=useAnalyticsAll()
console.log("All Analytics data:", analyticsAll);
                         //label el betzhar
  const chartConfig = {  // color da beta3 el icon /banzal tat7 fel bar var
                           //  beta3 el bar w a3maL fill lel color
    todo: { label: "Todo", color: "red" },
    inProgress: { label: "In progress", color: "yellow"},
    done: { label: "Done", color: "green"},
    value: { label: "Count", color: "red" },
  } satisfies ChartConfig;   


  type ChartRow =
  | { esmha: string; todo?: number; inProgress?: number; done?: number; value?: never }
  | { esmha: string; todo?: 0; inProgress?: 0; done?: 0; value: number };

  //kant hna lazm a3mal ? fel type 3lshan ma3mlsh la5bta
  const data: ChartRow[] = [
    {
     esmha: "Tasks (by status)",
      todo: analytics?.tasksByStatus?.todo ?? 0,
      inProgress: analytics?.tasksByStatus?.["in-progress"] ?? 0,
      done: analytics?.tasksByStatus?.done ?? 0,
    },
    {esmha: "Tasks / week",  value: analytics?.tasksByWeek ?? 0 },
    {esmha: "Notes",  value: analytics?.notesCount ?? 0 },
    {esmha: "Total tasks", value: analytics?.totalTasks ?? 0 },
  ];

  const extraData: ChartRow[] = [
  { esmha: "All Tasks Over time", value: analyticsAll?.taskId ?? 0 },
  { esmha: "All Notes Over time", value: analyticsAll?.noteId ?? 0 },
];


// just for if no tasks or an error 
 if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check out your activity</CardTitle>
          <CardDescription>Up To Date</CardDescription>
        </CardHeader>
        <CardContent>Loading…</CardContent>
      </Card>
    );
  }
  if (error || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check out your activity</CardTitle>
          <CardDescription>Up To Date</CardDescription>
        </CardHeader>
        <CardContent>Failed to load analytics.</CardContent>
      </Card>
    );
  }

  console.log("Analytics data:", analytics);
  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Check out your activity </CardTitle>
        <CardDescription>Up To Date </CardDescription>
      </CardHeader>

      <CardContent style={{ width: "60%" }}>
           {/* lazm chart container height */}
    <ChartContainer config={chartConfig} className="w-full h-80">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="esmha"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              tick={{ dy: 9 }}
            />
            <XAxis type="number" hide tick={{ dy: -9 }} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="todo" stackId="a" fill="var(--color-todo)" radius={[4, 0, 0, 4]} />
            <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" />
            <Bar dataKey="done" stackId="a" fill="var(--color-done)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          This is your current tasks and Notes
        </div>
        <div>If you want all Your tasks and Notes Across your account</div>

        <button
          onClick={toggleExtra}
          className="rounded-md border px-3 py-2 text-sm"
        >
          {open ? "Hide all-time stats" : "Show all-time stats"}
        </button>
      </CardFooter>
    </Card>


    {open && (
      <Card className="mt-6 w-[60%]">
        <CardHeader>
          <CardTitle className="text-base">All-time stats</CardTitle>
          <CardDescription>Across your whole account</CardDescription>
        </CardHeader>
        <CardContent style={{ width: "60%" }}>
            {/* lazm chart container height */}
        <ChartContainer config={chartConfig} className="w-full h-55">
            <BarChart
              accessibilityLayer
              data={extraData}
              layout="vertical"
              margin={{ left: 0 }}
            >
              <YAxis dataKey="esmha" type="category" tickLine={false} tickMargin={10} axisLine />
              <XAxis type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )}
  </>
  );
}

