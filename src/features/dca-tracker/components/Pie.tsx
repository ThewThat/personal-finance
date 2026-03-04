"use client";

import { type FC } from "react";
import dynamic from "next/dynamic";
import { PALETTE } from "../constants";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieSlice {
  label: string;
  value: number;
}

interface PieProps {
  data: PieSlice[];
  size?: number;
}

export const Pie: FC<PieProps> = ({ data, size = 180 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!total) {
    return (
      <div
        className="rounded-full bg-dca-card border border-dca-border border-dashed"
        style={{ width: size, height: size }}
      />
    );
  }

  const series = data.map((d) => d.value);
  const labels = data.map((d) => d.label);

  const options: ApexCharts.ApexOptions = {
    labels,
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "var(--font-mono)",
      animations: { enabled: true },
    },
    colors: [...PALETTE],
    legend: { show: false },
    stroke: { width: 4, colors: ["var(--dca-bg)"] },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "14px",
              fontWeight: "bold",
              color: "var(--dca-text)",
              formatter: (v) => `${((Number(v) / total) * 100).toFixed(1)}%`,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Allocation",
              formatter: () => "Total",
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (v) => `$${Number(v).toLocaleString()}`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
      style: { fontSize: "11px" },
    },
  };

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <Chart options={options} series={series} type="donut" width={size + 40} height={size + 40} />
    </div>
  );
};
