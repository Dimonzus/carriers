import type { SVGProps } from "react";

type BusIconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function BusIcon({ title, ...props }: BusIconProps) {
  return (
    <svg
      viewBox="0 0 500 220"
      fill="none"
      stroke="currentColor"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      {/* Основной контур кузова фургона */}
      <path
        d="M 90 170 
           A 32 32 0 0 1 154 170 
           L 346 170 
           A 32 32 0 0 1 410 170 
           L 430 170 
           Q 445 170 445 155 
           L 440 45 
           Q 438 30 420 30 
           L 185 30 
           Q 150 30 135 55 
           L 95 110 
           Q 85 125 80 140
           L 80 155 
           Q 80 170 90 170 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Передняя фара */}
      <path
        d="M 83 125 A 15 15 0 0 1 100 110 L 105 120 A 12 12 0 0 1 89 133 Z"
        fill="currentColor"
      />

      {/* Боковое окно кабины */}
      <path
        d="M 195 45 
           L 155 45 
           Q 140 45 133 55 
           L 110 90 
           Q 105 97 113 103
           L 150 113
           Q 160 115 168 110
           L 195 70
           Q 200 62 195 45 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Переднее колесо (внешняя шина, диск и центр) */}
      <circle cx="122" cy="170" r="28" fill="none" stroke="currentColor" strokeWidth={8} />
      <circle cx="122" cy="170" r="14" fill="none" stroke="currentColor" strokeWidth={5} />
      <circle cx="122" cy="170" r="4" fill="currentColor" />

      {/* Заднее колесо (внешняя шина, диск и центр) */}
      <circle cx="378" cy="170" r="28" fill="none" stroke="currentColor" strokeWidth={8} />
      <circle cx="378" cy="170" r="14" fill="none" stroke="currentColor" strokeWidth={5} />
      <circle cx="378" cy="170" r="4" fill="currentColor" />
    </svg>
  );
}