import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

// Pixel-perfect MingCute Icons (https://www.mingcute.com/)
export const MgcTelegram: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.69c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.28-.431z" />
  </svg>
);

export const MgcSend: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M3.4 20.4 20.85 12.92a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.39 1.16L3.8 11h7.2v2H3.8l-1.79 6.24a1 1 0 0 0 1.39 1.16z" />
  </svg>
);

export const MgcSearch: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="m18.031 16.617 4.283 4.282-1.414 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
  </svg>
);

export const MgcFire: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2c.877 1.838 1.427 3.322 1.65 4.45.334 1.693-.24 3.232-1.724 4.615-.815.76-1.926 1.797-3.333 3.111C7.11 15.58 6 17.07 6 18.666 6 20.507 7.493 22 9.333 22c2.518 0 4.254-1.378 5.207-4.133.456-1.319.46-2.52.013-3.604-.447-1.084-1.332-1.986-2.656-2.707 1.666.216 3.037-.179 4.113-1.185C17.086 9.366 17.5 7.747 17.25 5.512 18.948 7.393 20 9.805 20 12.455c0 4.72-3.826 8.545-8.545 8.545-4.72 0-8.545-3.826-8.545-8.545C2.91 7.218 6.545 2.91 12 2z" />
  </svg>
);

export const MgcCheckCircle: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6 7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" />
  </svg>
);

export const MgcShield: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18 6 2.25v4.66c0 4.09-2.67 7.91-6 8.91-3.33-1-6-4.82-6-8.91V6.43l6-2.25z" />
  </svg>
);

export const MgcExternalLink: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.414l-7.293 7.293-1.414-1.414L17.586 5H13V3h8z" />
  </svg>
);

export const MgcAdd: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </svg>
);

export const MgcSubtract: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M5 11h14v2H5z" />
  </svg>
);

export const MgcTime: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z" />
  </svg>
);

export const MgcEye: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

export const MgcFlash: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M13 2 3 14h8v8l10-12h-8V2z" />
  </svg>
);

export const MgcClose: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="m12 10.586 4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z" />
  </svg>
);

export const MgcCopy: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3zm2 0h7a1 1 0 0 1 1 1v7h2V4H9v2zm-4 3v11h10V9H5z" />
  </svg>
);

export const MgcCheck: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="m10 15.172 9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
  </svg>
);

export const MgcArrowRight: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="m13.172 12-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
  </svg>
);

export const MgcThumbUp: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M2 10h4v10H2V10zm20 2c0 .55-.22 1.05-.59 1.41.37.36.59.86.59 1.41 0 .55-.22 1.05-.59 1.41.37.36.59.86.59 1.41 0 1.1-.9 2-2 2h-6.31c-.95 0-1.82-.5-2.28-1.32L9.2 14.88V9.17l3.41-6.82C12.83 2.12 13.18 2 13.54 2c1.08 0 1.96.88 1.96 1.96v4.04h4.5c1.1 0 2 .9 2 2z" />
  </svg>
);

export const MgcMessage: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2C6.477 2 2 6.141 2 11.25c0 2.508 1.096 4.78 2.879 6.425L4 21.5l4.316-.957C9.47 20.825 10.707 21 12 21c5.523 0 10-4.141 10-9.25S17.523 2 12 2zm0 2c4.418 0 8 3.246 8 7.25S16.418 18.5 12 18.5c-1.127 0-2.203-.212-3.176-.598l-.488-.194-2.455.545.474-2.128-.352-.397C4.747 14.314 4 12.844 4 11.25 4 7.246 7.582 4 12 4z" />
  </svg>
);

export const MgcQuestion: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm1-9c1.933 0 3.5 1.567 3.5 3.5 0 1.298-.706 2.432-1.758 3.036L13.5 13H11v-1.5l1.004-.576C12.596 10.584 13 9.878 13 9c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5H8c0-2.209 1.791-4 4-4z" />
  </svg>
);

export const MgcHeadphone: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2a10 10 0 0 0-10 10v6a3 3 0 0 0 3 3h2v-8H5v-1a7 7 0 0 1 14 0v1h-2v8h2a3 3 0 0 0 3-3v-6a10 10 0 0 0-10-10zm-5 13v4H5a1 1 0 0 1-1-1v-3h3zm13 3a1 1 0 0 1-1 1h-2v-4h3v3z" />
  </svg>
);
