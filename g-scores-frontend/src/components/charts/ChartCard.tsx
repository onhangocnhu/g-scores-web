"use client";

import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { ChartConfig } from "../ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type ColorName =
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "purple"
  | "pink"
  | "teal"
  | "cyan"
  | "lime"
  | "indigo"
  | "brown"
  | "gray"
  | "black"
  | "white"
  | "magenta"
  | "violet"
  | "gold"
  | "silver";
type OpacityColor = "25%" | "50%" | "75%" | "100%";
type HSLColor = `hsl(${string}, ${string}, ${string}${string}`;
export type XaxisData = {
  key: string;
  values: string[];
  formatter?: (value: string) => string;
};

export type YaxisData = Array<{
  key: string;
  label: string;
  color: ColorName;
  opacity?: OpacityColor; // Individual opacity per series
  values: number[];
}>;

export type DropdownOption = {
  label: string;
  value: string;
  onSelect?: () => void;
};

export type SelectedValueType<T extends readonly { value: string }[]> =
  T[number]["value"];

export interface BarChartMultipleProps<T extends readonly DropdownOption[]> {
  xAxisData: XaxisData;
  yAxisData: YaxisData;
  title: string;
  description?: string;
  footerText?: {
    subTitle?: string;
    title?: string;
  };
  dropdownOptions?: T;
  dropdownDefaultValue?: T[number]["value"];
  chartType?: "bar" | "area";
  isLoading?: boolean;
  selectValue?: string;
  showChartLegend?: boolean;
  onSelectValue?: (value: T[number]["value"]) => void;
  className?: string;
  chartCustomSize?: number; // Change from string to number
}

const getHSLColor = (
  color: ColorName,
  opacity: OpacityColor = "100%"
): HSLColor => {
  const opacityMap: Record<OpacityColor, string> = {
    "25%": ", 25%)",
    "50%": ", 50%)",
    "75%": ", 75%)",
    "100%": ")",
  };

  const colorMap: Record<ColorName, string> = {
    red: "hsl(0, 70%, 50%",
    green: "hsl(120, 70%, 50%",
    blue: "hsl(210, 70%, 50%",
    yellow: "hsl(38, 98%, 51%",
    orange: "hsl(30, 100%, 50%",
    purple: "hsl(270, 70%, 50%",
    pink: "hsl(330, 100%, 70%",
    teal: "hsl(180, 70%, 50%",
    cyan: "hsl(180, 100%, 50%",
    lime: "hsl(90, 70%, 50%",
    indigo: "hsl(240, 70%, 50%",
    brown: "hsl(20, 50%, 40%",
    gray: "hsl(0, 0%, 50%",
    black: "hsl(0, 0%, 0%",
    white: "hsl(0, 0%, 100%",
    magenta: "hsl(300, 70%, 50%",
    violet: "hsl(280, 70%, 50%",
    gold: "hsl(50, 100%, 50%",
    silver: "hsl(0, 0%, 75%",
  };

  return `${colorMap[color]}${opacityMap[opacity]}` as HSLColor;
};

export function ChartCard1<T extends readonly DropdownOption[]>({
  xAxisData,
  yAxisData,
  title,
  description,
  footerText,
  dropdownOptions = [] as unknown as T,
  dropdownDefaultValue,
  chartType = "bar",
  isLoading = false,
  selectValue,
  showChartLegend = true,
  className = "",
  chartCustomSize,

  onSelectValue,
}: BarChartMultipleProps<T>) {
  const chartData = xAxisData.values.map((xValue, index) => {
    const dataPoint: Record<string, unknown> = { [xAxisData.key]: xValue };
    yAxisData.forEach((yAxis) => {
      dataPoint[yAxis.key] = yAxis.values[index];
    });
    return dataPoint;
  });

  const chartConfig = yAxisData.reduce((acc, curr) => {
    acc[curr.key] = {
      label: curr.label,
      color: getHSLColor(curr.color, curr.opacity),
    };
    return acc;
  }, {} as ChartConfig);

  // Determine if component is controlled or uncontrolled
  const isControlled = selectValue !== undefined;

  // Initialize state with the right value
  const [internalSelectedValue, setInternalSelectedValue] = useState<string>(
    () => {
      // If component is controlled, use the provided value
      if (isControlled) {
        return selectValue || "";
      }

      // For uncontrolled component
      if (dropdownOptions.length > 0) {
        // If a default is provided and exists in options, use it
        if (
          dropdownDefaultValue &&
          dropdownOptions.some((opt) => opt.value === dropdownDefaultValue)
        ) {
          return dropdownDefaultValue;
        }
        // Otherwise use the first option
        return dropdownOptions[0].value;
      }

      return "";
    }
  );

  // The actual value to use in the component
  const selectedValue = isControlled
    ? selectValue || ""
    : internalSelectedValue;

  // Update internal state when props change
  useEffect(() => {
    // For controlled component, don't update internal state
    if (isControlled) {
      return;
    }

    // For uncontrolled component with dropdown options
    if (dropdownOptions.length > 0) {
      let newValue = internalSelectedValue;

      // If default exists and changes, use it
      if (
        dropdownDefaultValue &&
        dropdownOptions.some((opt) => opt.value === dropdownDefaultValue)
      ) {
        newValue = dropdownDefaultValue;
      }
      // If current value isn't valid, use first option
      else if (
        !dropdownOptions.some((opt) => opt.value === internalSelectedValue)
      ) {
        newValue = dropdownOptions[0].value;
      }

      // Only update if value would change
      if (newValue !== internalSelectedValue) {
        setInternalSelectedValue(newValue);
      }
    } else {
      setInternalSelectedValue("");
    }
  }, [dropdownOptions, dropdownDefaultValue, isControlled]);

  // For debugging
  useEffect(() => { }, [
    isControlled,
    selectValue,
    internalSelectedValue,
    dropdownDefaultValue,
    dropdownOptions,
    selectedValue,
  ]);

  const handleValueChange = (value: string) => {
    // Always update internal state for uncontrolled component
    setInternalSelectedValue(value);

    // Call callback if provided
    if (onSelectValue) {
      onSelectValue(value as T[number]["value"]);
    }
  };

  return (
    <Card className={`p-1 ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          <div className="flex items-center justify-between gap-6  ">
            {/* Chart Legend */}

            {/* Dropdown Menu */}
            {dropdownOptions.length > 0 && (
              <Select value={selectedValue} onValueChange={handleValueChange}>
                <SelectTrigger
                  className="h-10
                 dark:bg-neutral-800 dark:text-neutral-300 bg-neutral-100 border-none text-neutral-600"
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent align="end">
                  {dropdownOptions.map((option) => (
                    <SelectItem
                      value={option.value}
                      key={option.value}
                      onSelect={option.onSelect}
                      className="h-10"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-64 rounded-sm" />
        ) : (
          <ChartContainer
            style={
              chartCustomSize ? { height: `${chartCustomSize}px` } : undefined
            }
            className={`${chartCustomSize && `h-[${chartCustomSize}px]`} w-full`}
            config={chartConfig}
          >
            {chartType === "bar" ? (
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={xAxisData.key}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={xAxisData.formatter || ((value) => value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                {yAxisData.map((yAxis) => (
                  <Bar
                    key={yAxis.key}
                    dataKey={yAxis.key}
                    fill={getHSLColor(yAxis.color, yAxis.opacity)}
                    radius={4}
                  />
                ))}
              </BarChart>
            ) : (
              <AreaChart accessibilityLayer data={chartData}>
                <defs>
                  {yAxisData.map((yAxis) => (
                    <linearGradient
                      key={`gradient-${yAxis.key}`}
                      id={`gradient-${yAxis.key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={getHSLColor(yAxis.color, yAxis.opacity)}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={getHSLColor(yAxis.color, yAxis.opacity)}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={xAxisData.key}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={xAxisData.formatter || ((value) => value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                {yAxisData.map((yAxis) => (
                  <Area
                    key={yAxis.key}
                    type="monotone"
                    dataKey={yAxis.key}
                    stroke={getHSLColor(yAxis.color, yAxis.opacity)}
                    fill={`url(#gradient-${yAxis.key})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            )}
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center justify-between w-full">
          {footerText && (
            <div className="flex flex-col gap-2">
              {footerText.title && (
                <div className="flex gap-2 font-medium leading-none">
                  {footerText.title}
                </div>
              )}
              {footerText.subTitle && (
                <div className="leading-none text-muted-foreground">
                  {footerText.subTitle}
                </div>
              )}
            </div>
          )}

          {showChartLegend && (
            <div className="flex gap-4 justify-end   ">
              {yAxisData.map((yAxis) => (
                <div key={yAxis.key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 p-2  rounded-sm"
                    style={{
                      backgroundColor: getHSLColor(yAxis.color, yAxis.opacity),
                    }}
                  />
                  <span className="text-sm">{yAxis.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

