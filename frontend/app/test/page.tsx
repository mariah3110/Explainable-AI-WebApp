"use client";

import {
  motion,
  useMotionValue,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";

export default function Test() {

  // Position des Spielers
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Geschwindigkeit der Bewegung
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

  // Arme schwingen horizontal entgegengesetzt
  const armRotate = useTransform(
    smoothVelocityX,
    [-1500, 1500],
    [-45, 45]
  );

  // Beine schwingen leicht mit
  const legRotate = useTransform(
    smoothVelocityX,
    [-1500, 1500],
    [-45, 45]
  );

  // Körper kippt horizontal
  const bodyRotate = useTransform(
    smoothVelocityX,
    [-1500, 1500],
    [10, -10]
  );

  // Körper bewegt sich leicht vertikal mit
  const bodyY = useTransform(
    smoothVelocityY,
    [-1500, 1500],
    [8, -8]
  );

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4 py-10 z-20">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold">
          Test
        </h1>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-5xl">

        {/* MODEL */}
        <div className="w-full min-h-[500px] flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">

          {/* Spielfläche */}
          <div className="relative w-full h-full flex items-center justify-center">

            {/* DRAGGABLE PLAYER */}
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0.12}
              dragConstraints={{
                left: -400,
                right: 400,
                top: -180,
                bottom: 180,
              }}
              style={{ x, y }}
              whileDrag={{
                scale: 1.05,
                cursor: "grabbing",
              }}
              className="cursor-grab select-none"
            >

              {/* GANZER SPIELER */}
              <motion.div
                style={{
                  rotate: bodyRotate,
                  y: bodyY,
                }}
                className="relative w-24 h-36 flex items-center justify-center"
              >

                {/* Kopf */}
                <div className="absolute top-0 w-10 h-10 rounded-full bg-blue-500 shadow-lg" />

                {/* Körper */}
                <div className="absolute top-10 w-5 h-12 rounded-full bg-blue-500 shadow-md" />

                {/* LINKER ARM */}
                <motion.div
                  style={{ rotate: armRotate }}
                  className="absolute top-12 left-7 w-2 h-10 bg-blue-500 rounded-full origin-top"
                />

                {/* RECHTER ARM */}
                <motion.div
                  style={{ rotate: armRotate }}
                  className="absolute top-12 right-7 w-2 h-10 bg-blue-500 rounded-full origin-top"
                />

                {/* LINKES BEIN */}
                <motion.div
                  style={{ rotate: legRotate }}
                  className="absolute bottom-3 left-[38px] w-2 h-11 bg-blue-500 rounded-full origin-top"
                />

                {/* RECHTES BEIN */}
                <motion.div
                  style={{ rotate: legRotate }}
                  className="absolute bottom-3 right-[38px] w-2 h-11 bg-blue-500 rounded-full origin-top"
                />

              </motion.div>

            </motion.div>

          </div>
        </div>
      </div>

    </main>
  );
}