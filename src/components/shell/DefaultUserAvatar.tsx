export function DefaultUserAvatar({ size = 28 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <g id="组合 1645">
        <g id="组合 535">
          <g id="组合 105">
            <circle id="默认头像" cx="14" cy="14" r="14" fill="var(--color-chart-2)" />
            <path
              id="矢量 356"
              d="M13.947 14.0648C16.2035 14.0648 18.0396 12.2563 18.0394 10.0324C18.0394 7.80868 16.2035 6 13.947 6C11.6906 6 9.85461 7.80931 9.85461 10.0324C9.85459 12.2556 11.6905 14.0648 13.947 14.0648ZM15.6335 14.4531L12.5671 14.4531C9.71759 14.4531 7.3999 16.7352 7.3999 19.5411L7.3999 19.8431C7.3999 21.31 9.6805 21.31 12.5671 21.31L15.6335 21.31C18.4065 21.31 20.8011 21.31 20.8011 19.8431L20.8011 19.5411C20.8011 16.7359 18.4831 14.4531 15.6335 14.4531Z"
              fill="var(--highlight-foreground)"
              fillRule="nonzero"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
