import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="180" rx="42" fill="#F8FAFC" />
        <g transform="scale(.17578125)">
          <path d="M840.533 490.667l-17.066-85.334L554.667 460.8V170.667h-85.334v262.4L172.8 241.067l-46.933 72.533 324.266 209.067L200.533 849.067l68.267 51.2 241.067-315.734 179.2 270.934 72.533-46.934-179.2-266.666z" fill="#CBD7E6" />
          <circle cx="512" cy="512" r="149.333" fill="#2563EB" />
          <circle cx="512" cy="170.667" r="106.667" fill="#0F9F8F" />
          <circle cx="832" cy="448" r="106.667" fill="#0F9F8F" />
          <circle cx="149.333" cy="277.333" r="106.667" fill="#0F9F8F" />
          <circle cx="234.667" cy="874.667" r="106.667" fill="#0F9F8F" />
          <circle cx="725.333" cy="832" r="106.667" fill="#0F9F8F" />
        </g>
      </svg>
    ),
    size,
  );
}
