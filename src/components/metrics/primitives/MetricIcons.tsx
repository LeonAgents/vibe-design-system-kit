import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from 'react';

export type MetricIcon = ElementType<
  ComponentPropsWithoutRef<'svg'> & { strokeWidth?: number }
>;

export const CommentMetricIcon = forwardRef<
  SVGSVGElement,
  ComponentPropsWithoutRef<'svg'>
>(function CommentMetricIcon({ className, strokeWidth = 1.75, ...props }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path
        d="M21 11.5C21 15.6421 16.9706 19 12 19C10.9235 19 9.89122 18.8424 8.93463 18.5534L4 21L5.39748 16.8312C3.9133 15.4617 3 13.5828 3 11.5C3 7.35786 7.02944 4 12 4C16.9706 4 21 7.35786 21 11.5Z"
      />
      <path d="M8.5 10H15.5" />
      <path d="M8.5 13H13.5" />
    </svg>
  );
});

export const ShareMetricIcon = forwardRef<
  SVGSVGElement,
  ComponentPropsWithoutRef<'svg'>
>(function ShareMetricIcon({ className, strokeWidth = 1.75, ...props }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 4H20V9" />
      <path d="M10 14L20 4" />
      <path d="M20 13V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H11" />
    </svg>
  );
});
