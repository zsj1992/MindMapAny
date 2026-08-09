import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="180" rx="42" fill="#102f53" />
        <path d="M43 134V47l47 54 47-54v87" fill="none" stroke="#fff" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="90" cy="101" r="18" fill="#34d3be" stroke="#102f53" strokeWidth="6" />
      </svg>
    ),
    size,
  );
}
