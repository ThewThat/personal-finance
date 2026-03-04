"use client";

import { type FC } from "react";
import dynamic from "next/dynamic";
import type { PriceHistory } from "../types";
import { fmt } from "../utils/formatters";

// ApexCharts must be loaded dynamically in Next.js to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PriceChartProps {
  history: PriceHistory[];
  symbol: string;
  avgCost?: number;
}

export const PriceChart: FC<PriceChartProps> = ({
  history,
  avgCost,
}) => {
  if (!history || history.length < 2) {
    return (
      <div className="flex h-[200px] items-center justify-center text-dca-muted text-xs font-mono">
        No chart data available
      </div>
    );
  }

  const isUp = history[history.length - 1].close >= history[0].close;
  const lineColor = isUp ? "#10b981" : "#ef4444"; // dca-green : dca-red

  const series = [
    {
      name: "Price",
      data: history.map((d) => ({ x: d.date, y: d.close })),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 190,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true },
      background: "transparent",
      fontFamily: "var(--font-mono)",
    },
    colors: [lineColor],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "var(--dca-border)",
      strokeDashArray: 4,
      padding: { left: 10, right: 10, top: 0, bottom: 0 },
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: true,
        style: { colors: "var(--dca-dim)", fontSize: "9px" },
        format: "MMM dd",
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: { colors: "var(--dca-dim)", fontSize: "9px" },
        formatter: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(2)),
      },
    },
    tooltip: {
      theme: "dark",
      x: { format: "dd MMM yyyy" },
      y: {
        formatter: (v) => `$${fmt(v, v < 10 ? 4 : 2)}`,
        title: { formatter: () => "" },
      },
      style: { fontSize: "11px" },
    },
    annotations: {
      yaxis: avgCost
        ? [
            {
              y: avgCost,
              borderColor: "#f59e0b", // dca-amber
              strokeDashArray: 5,
              label: {
                borderColor: "#f59e0b",
                style: {
                  color: "#fff",
                  background: "#f59e0b",
                  fontSize: "9px",
                },
                text: "AVG COST",
                position: "right",
                offsetY: 2,
              },
            },
          ]
        : [],
    },
  };

  return (
    <div className="h-[210px] w-full mt-[-10px]">
      <Chart options={options} series={series} type="area" height={210} />
    </div>
  );
};
