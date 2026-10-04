import type { SVGProps } from "react";

type TruckIconProps = SVGProps<SVGSVGElement> & {
  /** Если передать — иконка станет доступной для скринридеров */
  title?: string;
  /** Убрать линию «земли» под грузовиком */
  withoutGround?: boolean;
};

export default function TruckIcon({
  title,
  withoutGround = false,
  ...props
}: TruckIconProps) {
  return (
    <svg
      viewBox="0 0 320 128"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      {/* Будка */}
      <rect x="73" y="6" width="235" height="88" rx="3" />

      {/* Кабина + вырез окна (evenodd) */}
      <path
        fillRule="evenodd"
        d="M68 94V32H44q-5 0-7.6 4.6L26.5 56Q24 60.6 24 65v21q0 8 8 8h36Zm-21-56h15v18H38Z"
      />

      {/* Рама / топливный отсек между осями */}
      <rect x="80" y="94" width="92" height="10" rx="2" />

      {/* Задний брызговик */}
      <rect x="302" y="94" width="6" height="12" rx="1" />

      {/* Колёса: шина + прозрачный диск + ступица (evenodd) */}
      <path
        fillRule="evenodd"
        d="M36 104a16 16 0 1 0 32 0 16 16 0 1 0-32 0m7 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0m5 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0
           M184 104a16 16 0 1 0 32 0 16 16 0 1 0-32 0m7 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0m5 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0
           M220 104a16 16 0 1 0 32 0 16 16 0 1 0-32 0m7 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0m5 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0"
      />

      {/* Земля */}
      {!withoutGround && (
        <path
          d="M8 121.5h304"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

