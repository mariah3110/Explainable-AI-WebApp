"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  frames: string[];
  interval?: number; // Geschwindigkeit (ms)
  className?: string;
  size?: string; // Größe (z.B. "w-32 h-32")
};

export default function PixelAnimation({
  frames,
  interval = 400,
  className = "",
  size = "w-[20vw] h-[20vw] sm:w-[15vw] sm:h-[15vw] md:w-[10vw] md:h-[10vw] lg:w-[15vw] lg:h-[15vw] xl:w-[15vw] xl:h-[15vw] max-w-[200px]"
}: Props) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, interval);

    return () => clearInterval(id);
  }, [frames, interval]);

  return (
    <div className={`relative w-[30vw] h-[30vw] md:w-[20vw] md:h-[20vw] max-w-[290px] ${size} ${className}`}>
      <Image
        src={frames[frame]}
        alt="Pixel Animation"
        fill
        sizes="(max-width: 768px) 40vw, 25vw"
        className="object-contain"
        priority
      />
    </div>
  );
}