"use client";

import { useRef, type RefObject } from "react";
import {
  motion,
  animate,
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
  dropTargets?: RefObject<HTMLElement | null>[];
  /** Wird mit true/false aufgerufen, sobald sich der Hover-Status über einer Drop-Zone ändert */
  onDropTargetHover?: (isOver: boolean) => void;
};

export default function FootballPlayer({
  color = "bg-blue-500",
  draggable = false,
  className = "",
  number = "",
  dropTargets = [],
  onDropTargetHover,
}: FootballPlayerProps) {

  const wrapperRef     = useRef<HTMLDivElement>(null);
  const wasOverTarget  = useRef(false); // damit wir Parent nur bei Wechsel benachrichtigen

  // Position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Geschwindigkeit + Nachschwingen
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);
  const smoothVelocityX = useSpring(velocityX, { damping: 18, stiffness: 140, mass: 0.8 });
  const smoothVelocityY = useSpring(velocityY, { damping: 18, stiffness: 140, mass: 0.8 });

  const armRotate  = useTransform(smoothVelocityX, [-1500, 1500], [-45, 45]);
  const legRotate  = useTransform(smoothVelocityX, [-1500, 1500], [-45, 45]);
  const bodyRotate = useTransform(smoothVelocityX, [-1500, 1500], [10, -10]);
  const bodyY      = useTransform(smoothVelocityY, [-1500, 1500], [8, -8]);

  // Hit-Test: ist der MITTELPUNKT DES SPIELERS in einer der Drop-Zonen?
  const isPlayerOverDropTarget = (): boolean => {
    const el = wrapperRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;

    return dropTargets.some((ref) => {
      const t = ref.current;
      if (!t) return false;
      const tr = t.getBoundingClientRect();
      return cx >= tr.left && cx <= tr.right && cy >= tr.top && cy <= tr.bottom;
    });
  };

  const handleDrag = () => {
    const over = isPlayerOverDropTarget();
    if (over !== wasOverTarget.current) {
      wasOverTarget.current = over;
      onDropTargetHover?.(over);
    }
  };

  const handleDragEnd = () => {
    const over = isPlayerOverDropTarget();
    onDropTargetHover?.(false);
    wasOverTarget.current = false;

    if (!over) {
      const spring = { type: "spring" as const, stiffness: 320, damping: 26 };
      animate(x, 0, spring);
      animate(y, 0, spring);
    }
    // sonst: einfach liegen lassen — die Motion-Values behalten ihre Position
  };

  return (
    <motion.div
      ref={wrapperRef}
      drag={draggable}
      dragMomentum={false}
      style={draggable ? { x, y } : {}}
      onDrag={draggable ? handleDrag : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 999 }}
      className={`relative z-30 cursor-${draggable ? "grab" : "default"} select-none ${className}`}
    >
      {/* GANZER SPIELER */}
      <motion.div
        style={{
          rotate: draggable ? bodyRotate : 0,
          y:      draggable ? bodyY      : 0,
        }}
        className="relative w-10 h-14 flex items-center justify-center"
      >
        {/* Kopf */}
        <div className={`absolute top-0 w-4 h-4 rounded-full ${color} shadow-lg`} />
        {/* Körper */}
        <div className={`absolute top-4 w-2 h-5 rounded-full ${color}`}>{number}</div>
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