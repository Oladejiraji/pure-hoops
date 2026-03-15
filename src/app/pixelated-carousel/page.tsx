"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { PixelatedCarouselExperience } from "@/components/shared/pixelated-carousel-experience";
import { AnimatePresence, motion } from "framer-motion";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useControls } from "leva";
import styles from "./pixelated-carousel.module.scss";

const collections = [
  {
    name: "Ember Drift",
    season: "SS26",
    director: "Kael Morrow",
    dp: "Rina Vasquez",
    description:
      "Heat distortion captured at the edge of the Sahel. Wind-sculpted dunes meeting industrial decay.",
    location: "Ouarzazate, MA",
    duration: "2:47",
  },
  {
    name: "Void Frequency",
    season: "AW25",
    director: "Yuki Tanabe",
    dp: "Oskar Lund",
    description:
      "An echo chamber of light and silence. Brutalist interiors filmed at 4am under sodium vapor.",
    location: "Tallinn, EE",
    duration: "3:12",
  },
  {
    name: "Salt & Iron",
    season: "SS25",
    director: "Adaeze Obi",
    dp: "Tomás Herrera",
    description:
      "Coastal erosion meets forged metal. The tension between what the sea takes and what hands build.",
    location: "Essaouira, MA",
    duration: "2:58",
  },
  {
    name: "Neon Liturgy",
    season: "AW26",
    director: "Soren Velde",
    dp: "Mika Osei",
    description:
      "Sacred geometry refracted through nightclub optics. Stained glass reimagined in LED.",
    location: "Seoul, KR",
    duration: "3:31",
  },
];

const ease = [0.76, 0, 0.24, 1] as const;

// Title finishes around 0.4s — details appear after
const TITLE_DURATION = 0.4;
const DETAILS_BASE_DELAY = 0.45;

// Letter-by-letter stagger for the title
function SplitTitle({ text }: { text: string }) {
  const perChar = Math.min(0.02, 0.3 / text.length);
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{
            duration: TITLE_DURATION,
            ease,
            delay: i * perChar,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}

// Slide-up reveal for metadata values — staggered after title
function slideUp(staggerIndex = 0) {
  return {
    initial: { y: "100%", opacity: 0 },
    animate: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.35,
        ease,
        delay: DETAILS_BASE_DELAY + staggerIndex * 0.06,
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.2, ease },
    },
  };
}

// Fade for description — appears right after title
const fadeVariant = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: DETAILS_BASE_DELAY },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

function PostProcessing() {
  const { opacity } = useControls("Noise", {
    opacity: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });

  return (
    <EffectComposer>
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={opacity}
      />
    </EffectComposer>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [inNav, setInNav] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      const el = e.target as HTMLElement;
      setInNav(!!el.closest("nav"));
    };

    window.addEventListener("mousemove", handleMouseMove);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.12);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      style={{ opacity: inNav ? 0 : 1 }}
    >
      <div className={styles.cursorDot} />
      <span className={styles.cursorLabel}>Enter</span>
    </div>
  );
}

export default function PixelatedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const collection = collections[activeIndex];
  const indexLabel = String(activeIndex + 1).padStart(3, "0");

  return (
    <div className={styles.hero}>
      <CustomCursor />
      <Canvas className={styles.canvas}>
        <Suspense fallback={null}>
          <PixelatedCarouselExperience onIndexChange={handleIndexChange} />
          <PostProcessing />
        </Suspense>
      </Canvas>

      <div className={styles.overlay}>
        {/* NAV */}
        <nav className={styles.nav}>
          <span className={styles.navBrand}>
            <span className={styles.brandBase}>L</span>
            <span className={styles.brandReveal}>u</span>
            <span className={styles.brandBase}>m</span>
            <span className={styles.brandReveal}>ina</span>
          </span>
          <ul className={styles.navLinks}>
            {["Work", "Archive", "About", "Contact"].map((label) => (
              <li key={label} className={styles.navLink}>
                <span className={styles.navLinkText}>{label}</span>
                <span className={styles.navLinkClone}>{label}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* SCATTERED LABEL — left vertical */}
        {/* <span className={`${styles.scatterLabel} ${styles.labelMidLeft}`}>
          Directed Motion
        </span> */}

        {/* TITLE BLOCK — top right area */}
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <AnimatePresence mode="wait">
              <motion.h1 className={styles.title} key={activeIndex}>
                <SplitTitle text={collection.name} />
              </motion.h1>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              className={styles.productionCopy}
              key={`desc-${activeIndex}`}
              {...fadeVariant}
            >
              {collection.description}
            </motion.p>
          </AnimatePresence>

          <div className={styles.productionMeta}>
            <div className={styles.productionMetaItem}>
              <span className={styles.metaLabel}>Director</span>
              <div className={styles.metaValueClip}>
                <AnimatePresence mode="wait">
                  <motion.span
                    className={styles.metaValue}
                    key={`dir-${activeIndex}`}
                    {...slideUp(0)}
                  >
                    {collection.director}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className={styles.productionMetaItem}>
              <span className={styles.metaLabel}>DP</span>
              <div className={styles.metaValueClip}>
                <AnimatePresence mode="wait">
                  <motion.span
                    className={styles.metaValue}
                    key={`dp-${activeIndex}`}
                    {...slideUp(1)}
                  >
                    {collection.dp}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTENT */}
        <div className={styles.bottom}>
          {/* LEFT — index + duration */}
          <div className={styles.left}>
            <div className={styles.bottomMeta}>
              <div className={styles.metaValueClip}>
                <AnimatePresence mode="wait">
                  <motion.span
                    className={styles.indexDisplay}
                    key={`idx-${activeIndex}`}
                    {...slideUp(0)}
                  >
                    {indexLabel}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className={styles.indexTotal}>
                / {String(collections.length).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* RIGHT — metadata row */}
          <div className={styles.right}>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Season</span>
                <div className={styles.metaValueClip}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      className={styles.metaValue}
                      key={`season-${activeIndex}`}
                      {...slideUp(1)}
                    >
                      {collection.season}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Location</span>
                <div className={styles.metaValueClip}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      className={styles.metaValue}
                      key={`loc-${activeIndex}`}
                      {...slideUp(2)}
                    >
                      {collection.location}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration</span>
                <div className={styles.metaValueClip}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      className={styles.metaValue}
                      key={`dur-${activeIndex}`}
                      {...slideUp(3)}
                    >
                      {collection.duration}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
