import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

export const IconMenu = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconX = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconSun = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path
      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M12 2v2M12 20v2M22 12h-2M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M19.07 4.93 17.66 6.34M6.34 17.66l-1.41 1.41M19.07 19.07 17.66 17.66M6.34 6.34 4.93 4.93"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const IconMoon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path
      d="M21 13.2A8 8 0 0 1 10.8 3a6.5 6.5 0 1 0 10.2 10.2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconChevronLeft = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M14 6 8 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronRight = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M10 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLayout = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path
      d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M9 3v18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const IconBox = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path
      d="M12 2 20 6v12l-8 4-8-4V6l8-4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M12 2v20M20 6l-8 4-8-4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const IconUser = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const IconSettings = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path
      d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19.4 15a8.9 8.9 0 0 0 .1-1l2-1.2-2-3.4-2.3.5a8.4 8.4 0 0 0-1.7-1L15 6 9 6l-.5 2.9a8.4 8.4 0 0 0-1.7 1L4.5 9.4 2.5 12.8 4.5 14a8.9 8.9 0 0 0 .1 1l-2 1.2 2 3.4 2.3-.5c.5.4 1.1.7 1.7 1L9 22h6l.5-2.9c.6-.3 1.2-.6 1.7-1l2.3.5 2-3.4-2-1.2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconLogout = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 12h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 8l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSearchX = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="m13.5 8.5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="m8.5 8.5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconAlertTriangle = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTrash = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

