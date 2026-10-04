// export default function TractorCraneIcon({ className = "w-6 h-6" }: { className?: string }) {
//   return (
//     <svg 
//       xmlns="http://www.w3.org/2000/svg" 
//       viewBox="0 0 400 250" 
//       className={className}
//       fill="currentColor"
//     >
//       <path d="M 40 150 L 40 100 L 75 100 L 95 130 L 95 150 Z" />
//       <path d="M 48 108 L 70 108 L 85 130 L 48 130 Z" fill="white" stroke="currentColor" strokeWidth="2"/>
//       <rect x="95" y="140" width="230" height="25" />
//       <rect x="115" y="165" width="8" height="25" />
//       <rect x="105" y="188" width="28" height="5" />
//       <rect x="110" y="130" width="18" height="15" />
//       <polygon points="115,130 125,130 320,50 315,45" />
//       <line x1="318" y1="48" x2="318" y2="80" stroke="currentColor" strokeWidth="4"/>
//       <path d="M 312 80 Q 318 88 324 80" fill="none" stroke="currentColor" strokeWidth="4"/>
//       <rect x="300" y="85" width="36" height="28" rx="2" />
//       <circle cx="65" cy="175" r="18" />
//       <circle cx="65" cy="175" r="8" fill="white" stroke="currentColor" strokeWidth="2"/>
//       <circle cx="230" cy="175" r="18" />
//       <circle cx="230" cy="175" r="8" fill="white" stroke="currentColor" strokeWidth="2"/>
//       <circle cx="275" cy="175" r="18" />
//       <circle cx="275" cy="175" r="8" fill="white" stroke="currentColor" strokeWidth="2"/>
//     </svg>
//   );
// }

import type { SVGProps } from "react";

type CraneTruckIconProps = SVGProps<SVGSVGElement> & {
  /** Если передать — иконка станет доступной для скринридеров */
  title?: string;
};

export default function CraneTruckIcon({ title, ...props }: CraneTruckIconProps) {
  return (
    <svg
      viewBox="0 0 500 300"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      {/* КАБИНА И ШАССИ */}
      {/* Основная кабина */}
      <path d="M 65 170 L 65 190 Q 65 210 80 210 L 132 210 L 132 122 L 77 122 Q 72 122 70 128 L 65 155 Z" />

      {/* Окно кабины (вырез) */}
      <rect x="85" y="137" width="32" height="28" fill="#ffffff" rx="2" />

      {/* Нижняя часть шасси и длинная грузовая платформа */}
      <path d="M 132 162 L 420 162 Q 425 162 425 167 L 425 195 Q 425 200 420 200 L 132 200 Z" />

      {/* КРАН-МАНИПУЛЯТОР (СТРЕЛА И ГРУЗ) */}
      {/* Вертикальное основание крана за кабиной */}
      <rect x="135" y="122" width="12" height="60" rx="3" />

      {/* Шарнир стрелы */}
      <circle cx="141" cy="115" r="14" />

      {/* Толстое основание стрелы */}
      <path d="M 138 127 L 152 103 L 235 68 L 225 53 L 130 92 Z" />

      {/* Выдвижная часть стрелы (тонкая) */}
      <path d="M 230 63 L 400 23 L 406 35 L 235 73 Z" />

      {/* Трос и крюк */}
      <line
        x1="403"
        y1="29"
        x2="403"
        y2="70"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 398 67 Q 403 62 408 67 Q 411 72 404 77 Q 398 82 398 75"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Подвешенный груз */}
      <rect x="370" y="77" width="66" height="46" rx="6" />

      {/* ВЫДВИЖНАЯ ОПОРА (АУТРИГЕР) */}
      <rect x="150" y="180" width="8" height="35" />
      <rect x="142" y="215" width="24" height="6" rx="1" />

      {/* КОЛЕСА */}
      {/* Переднее колесо */}
      <circle cx="95" cy="212" r="24" />
      <circle cx="95" cy="212" r="12" fill="#ffffff" />
      <circle cx="95" cy="212" r="5" />

      {/* Заднее первое колесо */}
      <circle cx="280" cy="212" r="24" />
      <circle cx="280" cy="212" r="12" fill="#ffffff" />
      <circle cx="280" cy="212" r="5" />

      {/* Заднее второе колесо */}
      <circle cx="340" cy="212" r="24" />
      <circle cx="340" cy="212" r="12" fill="#ffffff" />
      <circle cx="340" cy="212" r="5" />
    </svg>
  );
}