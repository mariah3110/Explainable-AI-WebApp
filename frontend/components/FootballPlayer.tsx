"use client";

import {
  motion,
  useMotionValue,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";

type FootballPlayerProps = {
  color?: string;
  draggable?: boolean;
  className?: string;
  number?: string;
};

export default function FootballPlayer({
  color = "bg-blue-500",
  draggable = false,
  className = "",
  number = "",
}: FootballPlayerProps) {

  // Position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Geschwindigkeit
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);

  // Smoothes Nachschwingen
  const smoothVelocityX = useSpring(velocityX, {
    damping: 18,
    stiffness: 140,
    mass: 0.8,
  });

  const smoothVelocityY = useSpring(velocityY, {
    damping: 18,
    stiffness: 140,
    mass: 0.8,
  });

  // Arme
  const armRotate = useTransform(
    smoothVelocityX,
    [-1500, 1500],
    [-45, 45]
  );

  // Beine
  const legRotate = useTransform(
    smoothVelocityX,
    [-1500, 1500],
    [-45, 45]
  );

  // Körperrotation
  const bodyRotate = useTransform(
    smoothVelocityX,
    [-1500, 1500],
    [10, -10]
  );

  // Vertikale Bewegung
  const bodyY = useTransform(
    smoothVelocityY,
    [-1500, 1500],
    [8, -8]
  );

  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.12}
      dragConstraints={{
        left: -400,
        right: 400,
        top: -250,
        bottom: 250,
      }}
      style={draggable ? { x, y } : {}}
      whileDrag={{
        scale: 1.05,
        cursor: "grabbing",
        zIndex: 999,
      }}
      className={`relative z-30 cursor-${draggable ? "grab" : "default"} select-none ${className}`}
    >

      {/* GANZER SPIELER */}
      <motion.div
        style={{
          rotate: draggable ? bodyRotate : 0,
          y: draggable ? bodyY : 0,
        }}
        className="relative w-10 h-14 flex items-center justify-center"
      >

        {/* Kopf */}
        <div className={`absolute top-0 w-4 h-4 rounded-full ${color} shadow-lg`} />

        {/* Körper */}
        <div className={`absolute top-4 w-2 h-5 rounded-full ${color}`} >
          {number}
        </div>

        {/* Linker Arm */}
        <motion.div
          style={{ rotate: draggable ? armRotate : 0 }}
          className={`absolute top-5 left-3 w-1 h-4 ${color} rounded-full origin-top`}
        />

        {/* Rechter Arm */}
        <motion.div
          style={{ rotate: draggable ? armRotate : 0 }}
          className={`absolute top-5 right-3 w-1 h-4 ${color} rounded-full origin-top`}
        />

        {/* Linkes Bein */}
        <motion.div
          style={{ rotate: draggable ? legRotate : 0 }}
          className={`absolute bottom-0 left-[15px] w-1 h-5 ${color} rounded-full origin-top`}
        />

        {/* Rechtes Bein */}
        <motion.div
          style={{ rotate: draggable ? legRotate : 0 }}
          className={`absolute bottom-0 right-[15px] w-1 h-5 ${color} rounded-full origin-top`}
        />

      </motion.div>
    </motion.div>
  );
}