import React, { type FC } from "react";

interface IconProps {
  name: string;
  size?: number;
}

const icons: Record<string, (s: number) => React.JSX.Element> = {
  plus: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  trash: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19,6l-1,14H6L5,6" />
      <path d="M10,11v6M14,11v6" />
    </svg>
  ),
  pie: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.21,15.89A10,10,0,1,1,8,2.83" />
      <path d="M22,12A10,10,0,0,0,12,2v10z" />
    </svg>
  ),
  bolt: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
    </svg>
  ),
  shield: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12,22s8-4,8-10V5l-8-3-8,3v7c0,6,8,10,8,10z" />
    </svg>
  ),
  refresh: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,4 23,10 17,10" />
      <path d="M20.49,15a9,9,0,1,1-2.12-9.36L23,10" />
    </svg>
  ),
  x: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  history: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="1,4 1,10 7,10" />
      <path d="M3.51,15a9,9,0,1,0,.49-3.82" />
    </svg>
  ),
  signal: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1.42,9a16,16,0,0,1,21.16,0" />
      <path d="M5,12.55a11,11,0,0,1,14.08,0" />
      <path d="M8.53,16.11a6,6,0,0,1,6.95,0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  key: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21,2l-2,2m-7.61,7.61a5.5,5.5,0,1,1-7.778,7.778,5.5,5.5,0,0,1,7.777-7.777Zm0,0L15.5,7.5m0,0,3,3L22,7l-3-3m-3.5,3.5L19,4" />
    </svg>
  ),
  wifi: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1.42,9a16,16,0,0,1,21.16,0" />
      <path d="M5,12.55a11,11,0,0,1,14.08,0" />
      <path d="M8.53,16.11a6,6,0,0,1,6.95,0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  chart: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  ),
  trend: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  ),
  edit: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

export const Icon: FC<IconProps> = ({ name, size = 16 }) => {
  const render = icons[name];
  if (!render) return null;
  return render(size);
};
