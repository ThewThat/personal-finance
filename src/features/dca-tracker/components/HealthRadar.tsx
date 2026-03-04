"use client";

import { type FC } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HealthRadarProps {
  data: { n: string; s: number }[];
}

export const HealthRadar: FC<HealthRadarProps> = ({ data }) => {
  const series = [
    {
      name: "Score",
      data: data.map((d) => d.s),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "var(--font-mono)",
    },
    colors: ["#10b981"], // dca-green
    stroke: { width: 2 },
    fill: { opacity: 0.2 },
    markers: { size: 4 },
    xaxis: {
      categories: data.map((d) => d.n),
      labels: {
        show: true,
        style: {
          colors: ["var(--dca-dim)", "var(--dca-dim)", "var(--dca-dim)"],
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
      tickAmount: 4,
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (v) => `${v}/100`,
      },
      style: { fontSize: "11px" },
    },
  };

  return (
    <div className="flex items-center justify-center h-[220px]">
      <Chart options={options} series={series} type="radar" height={260} width={260} />
    </div>
  );
};
