import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import deepmerge from "deepmerge";
import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  BaseChartProps,
  ChartAreaPlugin,
  prepData,
  prepOptions,
  useIsClient,
} from "../common";

export const stackedOptions = {
  scales: {
    x: {
      stacked: true,
      ticks: {
        major: {
          enabled: false,
        },
      },
    },
    y: {
      stacked: true,
    },
  },
};

export const vertOptions = {
  indexAxis: "x" as const,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
export const horizOptions = {
  indexAxis: "y" as const,
  plugins: {
    legend: {
      position: "right" as const,
    },
  },
};

export interface SimpleBarProps extends BaseChartProps {
  direction?: "vertical" | "horizontal";
  stacked?: boolean;
}

export function SimpleBar(props: SimpleBarProps) {
  const { direction = "vertical", stacked, className } = props;
  const isClient = useIsClient();
  useEffect(() => {
    ChartJS.register(
      ChartAreaPlugin,
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
  }, []);
  if (!isClient) {
    return null;
  }
  const normalized = prepData(props, {
    preferNonNumericAsLabel: true,
    opacity: 1,
  });
  const options = prepOptions(props);
  return (
    <div className={className}>
      <Bar
        key={`${props.direction}${props.stacked}`}
        options={deepmerge.all([
          ...options,
          direction === "vertical" ? vertOptions : horizOptions,
          stacked ? stackedOptions : {},
        ])}
        data={normalized}
      />
    </div>
  );
}
