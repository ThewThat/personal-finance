"use client";

import { type FC } from "react";
import dynamic from "next/dynamic";
import type { DcaResult } from "../types";
import { fB } from "../utils/formatters";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface GrowthChartProps {
  dca: DcaResult;
}

export const GrowthChart: FC<GrowthChartProps> = ({ dca }) => {
  const s = dca.schedule;
  if (!s || s.length < 2) return null;

  const series = [
    {
      name: "Portfolio Value",
      data: s.map((d) => ({ x: `Year ${d.year}`, y: d.value })),
    },
    {
      name: "Total Invested",
      data: s.map((d) => ({ x: `Year ${d.year}`, y: d.invested })),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 150,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: "var(--font-mono)",
    },
    colors: ["#0ea5e9", "#94a3b8"], // dca-cyan, dca-muted
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: [0.35, 0.15],
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: [2.5, 1.5],
      dashArray: [0, 5],
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "var(--dca-border)",
      strokeDashArray: 3,
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "dark",
      shared: true,
      y: {
        formatter: (v) => fB(v),
      },
      style: { fontSize: "11px" },
    },
    xaxis: {
      labels: {
        show: true,
        style: { colors: "var(--dca-dim)", fontSize: "9px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: { colors: "var(--dca-dim)", fontSize: "9px" },
        formatter: (v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)),
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "10px",
      labels: { colors: "var(--dca-dim)" },
      markers: { size: 4 },
    },
  };

  return (
    <div className="h-[200px] w-full mt-[-10px]">
      <Chart options={options} series={series} type="area" height={200} />
    </div>
  );
};
