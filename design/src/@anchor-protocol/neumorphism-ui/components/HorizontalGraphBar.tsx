import { pressed } from '@anchor-protocol/styled-neumorphism';
import {
  Children,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HorizontalGraphBarProps<T>
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  min: number;
  max: number;
  padding?: number;
  values: T[];
  labelRenderer?: (value: T, rect: Rect) => ReactNode | null;
  valueFunction: (value: T) => number;
  colorFunction: (value: T) => string;
}

function HorizontalGraphBarBase<T>({
  className,
  min,
  max,
  padding = 1,
  children,
  values,
  valueFunction,
  colorFunction,
  labelRenderer,
  ...divProps
}: HorizontalGraphBarProps<T>) {
  const { ref, width = 500, height = 10 } = useResizeObserver<HTMLDivElement>(
    {},
  );

  const total = max - min;

  const rects = useMemo<Rect[]>(() => {
    return values.map((value) => {
      const r: number = (max + valueFunction(value)) / total;

      return {
        x: padding,
        y: padding,
        width: r * (width - padding * 2),
        height: height - padding * 2,
      };
    });
  }, [
    colorFunction,
    height,
    max,
    padding,
    total,
    valueFunction,
    values,
    width,
  ]);

  return (
    <div {...divProps} ref={ref} className={className}>
      <svg width={width} height={height}>
        {Children.toArray(
          rects.map((rect, i) => (
            <rect {...rect} rx={5} ry={5} fill={colorFunction(values[i])} />
          )),
        )}
      </svg>
      {typeof labelRenderer === 'function' &&
        Children.toArray(
          rects.map((rect, i) => labelRenderer(values[i], rect)),
        )}
      {children}
    </div>
  );
}

export const HorizontalGraphBar: <T>(
  props: HorizontalGraphBarProps<T>,
) => ReactElement<HorizontalGraphBarProps<T>> = styled(HorizontalGraphBarBase)`
  width: 100%;
  height: 10px;

  padding: 0;
  margin: 0;

  border-radius: 5px;

  position: relative;
  font-size: 0;

  > span {
    position: absolute;
    font-size: 16px;
    color: ${({ theme }) => theme.textColor};
  }

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      intensity: theme.intensity,
      distance: 1,
    })};
` as any;
