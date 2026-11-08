"use client";

import { useMemo, useState } from "react";
import bbU from "@/data/who/bb-u.json";
import pbU from "@/data/who/pb-u.json";
import tbU from "@/data/who/tb-u.json";
import { valueAtZ, type LmsRow } from "@/lib/growth/zscore";
import type { IndicatorResult, Sex } from "@/lib/growth";

type Curve = { month: number; value: number }[];
type ChartIndicator = "bb-u" | "pb-u" | "tb-u";

const zLines = [
  { z: -3, label: "−3 SD", color: "#dc2626" },
  { z: -2, label: "−2 SD", color: "#d99a00" },
  { z: 0, label: "Median", color: "#16834a" },
  { z: 2, label: "+2 SD", color: "#d99a00" },
  { z: 3, label: "+3 SD", color: "#dc2626" },
] as const;

const tables = { "bb-u": bbU, "pb-u": pbU, "tb-u": tbU };
const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 });

function curvesFor(indicator: ChartIndicator, sex: Sex): Record<number, Curve> {
  const rows = tables[indicator][sex] as LmsRow[];
  return Object.fromEntries(zLines.map(({ z }) => [
    z,
    rows.map((row, index) => ({ month: row.month ?? index, value: valueAtZ(row, z) })),
  ]));
}

export function GrowthChart({
  sex,
  ageMonths,
  items,
  measurements = [],
}: {
  sex: Sex;
  ageMonths: number;
  items: IndicatorResult[];
  measurements?: { ageMonths: number; weightKg: number; heightCm?: number }[];
}) {
  const heightResult = items.find((item) => item.key === "pb-u" || item.key === "tb-u");
  const [indicator, setIndicator] = useState<ChartIndicator>("bb-u");
  const activeIndicator: ChartIndicator = indicator === "bb-u"
    ? "bb-u"
    : heightResult?.key === "pb-u" ? "pb-u" : "tb-u";
  const maxMonth = ageMonths <= 24 ? 24 : 60;
  const unit = activeIndicator === "bb-u" ? "kg" : "cm";
  const chartCurves = useMemo(
    () => curvesFor(activeIndicator, sex),
    [activeIndicator, sex],
  );
  const measured = activeIndicator === "bb-u"
    ? items.find((item) => item.key === "bb-u")
    : heightResult;
  const values = Object.values(chartCurves).flat()
    .filter((point) => point.month <= maxMonth)
    .map((point) => point.value);
  for (const point of measurements) {
    const value = activeIndicator === "bb-u" ? point.weightKg : point.heightCm;
    if (value !== undefined && point.ageMonths >= 0 && point.ageMonths <= maxMonth) values.push(value);
  }
  if (measured) values.push(measured.value);
  const minValue = Math.floor(Math.min(...values) * 0.9 * 2) / 2;
  const maxValue = Math.ceil(Math.max(...values) * 1.05 * 2) / 2;
  const width = 360;
  const height = 230;
  const left = 43;
  const right = 10;
  const top = 12;
  const bottom = 31;
  const x = (month: number) => left + (month / maxMonth) * (width - left - right);
  const y = (value: number) => top + ((maxValue - value) / (maxValue - minValue)) * (height - top - bottom);
  const curvePath = (curve: Curve) => curve
    .filter((point) => point.month <= maxMonth)
    .map((point, index) => `${index === 0 ? "M" : "L"}${x(point.month).toFixed(1)},${y(point.value).toFixed(1)}`)
    .join(" ");
  const lowerNormal = chartCurves[-2]?.filter((point) => point.month <= maxMonth) ?? [];
  const upperNormal = chartCurves[2]?.filter((point) => point.month <= maxMonth) ?? [];
  const normalArea = [
    ...upperNormal.map((point) => `${x(point.month).toFixed(1)},${y(point.value).toFixed(1)}`),
    ...lowerNormal.slice().reverse().map((point) => `${x(point.month).toFixed(1)},${y(point.value).toFixed(1)}`),
  ].join(" ");
  const yTicks = 4;
  const xTicks = maxMonth === 24 ? [0, 6, 12, 18, 24] : [0, 12, 24, 36, 48, 60];

  return (
    <section aria-label="Kurva pertumbuhan WHO" className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">Kurva pertumbuhan WHO</h3>
          <p className="mt-1 text-xs text-muted">Titik menunjukkan hasil pengukuran.</p>
        </div>
        {heightResult && (
          <div role="group" aria-label="Pilih kurva" className="flex rounded-full border border-border p-0.5 text-xs">
            <button
              type="button"
              aria-pressed={indicator === "bb-u"}
              onClick={() => setIndicator("bb-u")}
              className={`min-h-10 rounded-full px-3 ${indicator === "bb-u" ? "bg-accent text-white" : "text-muted"}`}
            >BB/U</button>
            <button
              type="button"
              aria-pressed={indicator !== "bb-u"}
              onClick={() => setIndicator(heightResult.key as "pb-u" | "tb-u")}
              className={`min-h-10 rounded-full px-3 ${indicator !== "bb-u" ? "bg-accent text-white" : "text-muted"}`}
            >{heightResult.key === "pb-u" ? "PB/U" : "TB/U"}</button>
          </div>
        )}
      </div>

      <div className="mt-3 w-full" role="img" aria-label={`${activeIndicator === "bb-u" ? "Kurva berat badan menurut umur" : heightResult?.name}, usia ${ageMonths} bulan, hasil ${measured ? `${fmt(measured.value)} ${unit}` : ""}`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" aria-hidden="true">
          <polygon points={normalArea} fill="#22a35a" fillOpacity="0.11" />
          {Array.from({ length: yTicks + 1 }, (_, index) => {
            const value = minValue + ((maxValue - minValue) * index) / yTicks;
            return (
              <g key={index}>
                <line x1={left} x2={width - right} y1={y(value)} y2={y(value)} stroke="currentColor" opacity="0.09" />
                <text x={left - 5} y={y(value) + 3} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.68">{fmt(value)}</text>
              </g>
            );
          })}
          {xTicks.map((month) => (
            <g key={month}>
              <line x1={x(month)} x2={x(month)} y1={top} y2={height - bottom} stroke="currentColor" opacity="0.06" />
              <text x={x(month)} y={height - 12} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.68">{month}</text>
            </g>
          ))}
          {zLines.map(({ z, color }) => (
            <path key={z} d={curvePath(chartCurves[z])} fill="none" stroke={color} strokeWidth={z === 0 ? 2.2 : 1.5} strokeDasharray={Math.abs(z) === 3 ? "4 3" : undefined} />
          ))}
          {measured && measured.value >= minValue && measured.value <= maxValue && (
            <g>
              <line x1={x(ageMonths)} x2={x(ageMonths)} y1={top} y2={height - bottom} stroke="#d6336c" strokeDasharray="3 3" opacity="0.5" />
              <circle cx={x(ageMonths)} cy={y(measured.value)} r="6" fill="#d6336c" stroke="white" strokeWidth="2.5" />
            </g>
          )}
          {measurements.filter((point) => point.ageMonths >= 0 && point.ageMonths <= maxMonth).map((point, index) => {
            const value = activeIndicator === "bb-u" ? point.weightKg : point.heightCm;
            return value !== undefined && value >= minValue && value <= maxValue ? <circle key={index} cx={x(point.ageMonths)} cy={y(value)} r="5" fill="#d6336c" stroke="white" strokeWidth="2" /> : null;
          })}
          <text x={left} y={height - 1} fontSize="9" fill="currentColor" opacity="0.7">Usia (bulan)</text>
          <text x={width - right} y={height - 1} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.7">{unit}</text>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-muted" aria-label="Legenda kurva">
        {zLines.map(({ z, label, color }) => (
          <span key={z} className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 border-t-2" style={{ borderColor: color, borderTopStyle: Math.abs(z) === 3 ? "dashed" : "solid" }} />{label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-emerald-500/20" />Area hijau: kisaran −2 sampai +2 SD</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-accent" />Pengukuran anak</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">Grafik membantu melihat pola pertumbuhan dan bukan diagnosis. Diskusikan hasil di luar pita hijau dengan tenaga kesehatan.</p>
    </section>
  );
}
