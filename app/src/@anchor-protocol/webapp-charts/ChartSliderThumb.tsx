import React from 'react';

export interface ChartSliderThumbProps {
  backgroundColor: string;
  strokeColor: string;
  filter: string;
}

export function ChartSliderThumb({
  backgroundColor,
  strokeColor,
  filter,
}: ChartSliderThumbProps) {
  return (
    <>
      <circle
        r={10}
        fill={"black"}
        stroke={"black"}
        filter={filter}
      />
      <path
        d="M6.32825,5.35325 L8.57825,3.10325 C8.77325,2.90825 8.77325,2.59125 8.57825,2.39625 L6.32825,0.14625 C6.13325,-0.04875 5.81625,-0.04875 5.62125,0.14625 C5.42625,0.34125 5.42625,0.65825 5.62125,0.85325 L7.51725,2.74925 L5.62125,4.64625 C5.42625,4.84125 5.42625,5.15825 5.62125,5.35325 C5.71925,5.45125 5.84725,5.49925 5.97425,5.49925 C6.10225,5.49925 6.23025,5.45125 6.32825,5.35325 M2.75025,5.49925 C2.62225,5.49925 2.49425,5.45125 2.39625,5.35325 L0.14625,3.10325 C-0.04875,2.90825 -0.04875,2.59125 0.14625,2.39625 L2.39625,0.14625 C2.59225,-0.04875 2.90825,-0.04875 3.10325,0.14625 C3.29925,0.34125 3.29925,0.65825 3.10325,0.85325 L1.20725,2.74925 L3.10325,4.64625 C3.29925,4.84125 3.29925,5.15825 3.10325,5.35325 C3.00625,5.45125 2.87825,5.49925 2.75025,5.49925"
        transform="translate(-4 -3)"
        fill={strokeColor}
      />
    </>
  );
}
