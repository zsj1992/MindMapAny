import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="180" rx="42" fill="#102f53" />
        <g fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
          <path d="M56 90h36" />
          <path d="M92 90c0-23 8-36 34-36" />
          <path d="M92 90h34" />
          <path d="M92 90c0 23 8 36 34 36" />
        </g>
        <circle cx="45" cy="90" r="20" fill="#34d3be" stroke="#102f53" strokeWidth="6" />
        <g fill="#fff">
          <circle cx="138" cy="54" r="14" />
          <circle cx="138" cy="90" r="14" />
          <circle cx="138" cy="126" r="14" />
        </g>
      </svg>
    ),
    size,
  );
}
