import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="180" rx="42" fill="#102f53" />
        <path d="M25 48l42-14 46 17 42-14v96l-42 14-46-17-42 14z" fill="#fff" stroke="#fff" strokeWidth="8" strokeLinejoin="round" />
        <path d="M67 34v96M113 51v96" fill="none" stroke="#102f53" strokeWidth="8" strokeLinejoin="round" />
        <circle cx="90" cy="90" r="23" fill="#34d3be" stroke="#102f53" strokeWidth="8" />
        <circle cx="90" cy="90" r="7" fill="#fff" />
      </svg>
    ),
    size,
  );
}
