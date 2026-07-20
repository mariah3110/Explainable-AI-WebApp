"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
};

export default function Character({
  src,
  alt = "Pixel",
  className = "w-[40vw] h-[40vw] md:w-[25vw] md:h-[25vw] max-w-[280px] max-h-[280px]",
  sizes = "(max-width: 768px) 40vw, 25vw",
  loading,
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        loading={loading}
        draggable={false}
      />
    </div>
  );
}