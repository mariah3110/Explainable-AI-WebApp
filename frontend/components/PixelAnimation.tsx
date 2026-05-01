"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  frames: string[];
  interval?: number; // Geschwindigkeit (ms)
  className?: string;
};

export default function PixelAnimation({
  frames,
  interval = 400,
  className = "",
}: Props) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, interval);

    return () => clearInterval(id);
  }, [frames, interval]);

  return (
    <div className={`relative w-32 h-32 md:w-52 md:h-52 ${className}`}>
      <Image
        src={frames[frame]}
        alt="Pixel Animation"
        fill
        sizes="(max-width: 768px) 128px, 208px"
        className="object-contain"
      />
    </div>
  );
}