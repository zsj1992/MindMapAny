import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="180" rx="42" fill="#102f53" />
        <g fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round">
          <path d="M48 48l28 28M132 48l-28 28M48 132l28-28M132 132l-28-28" />
        </g>
        <g fill="#fff">
          <rect x="27" y="27" width="42" height="42" rx="14" />
          <rect x="111" y="27" width="42" height="42" rx="14" />
          <rect x="27" y="111" width="42" height="42" rx="14" />
          <rect x="111" y="111" width="42" height="42" rx="14" />
        </g>
        <rect x="62" y="62" width="56" height="56" rx="18" fill="#34d3be" stroke="#102f53" strokeWidth="8" />
      </svg>
    ),
    size,
  );
}
