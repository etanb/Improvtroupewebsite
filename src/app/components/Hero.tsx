import { useState } from "react";
import heroImage1 from "../../imports/[image]_-_994202.jpeg";
import heroImage2 from "../../imports/[image]_-_5621944.jpeg";
import heroImage3 from "../../imports/[image]_-_9487263.jpeg";

const CARDS = [
  { src: heroImage1, alt: "Late for Work show poster",    rot: "-7deg",  top: "0%",  left: "0%",   baseZ: 10 },
  { src: heroImage3, alt: "Late for Work lamp poster",    rot: "5deg",   top: "8%",  left: "28%",  baseZ: 30 },
  { src: heroImage2, alt: "Late for Work coffee mug art", rot: "-3deg",  top: "4%",  left: "52%",  baseZ: 20 },
];

function getTransform(i: number, hovered: number | null, rot: string) {
  if (hovered === null) return `rotate(${rot})`;
  if (hovered === i)    return `rotate(${rot}) translateY(-14px) scale(1.07)`;
  // Cards to the left of hovered nudge left, cards to the right nudge right
  const nudge = i < hovered ? -22 : 22;
  return `rotate(${rot}) translateX(${nudge}px) translateY(3px)`;
}

export function Hero() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left: text */}
        <div>
          <div className="inline-block bg-accent px-6 py-3 border-4 border-primary transform rotate-1 mb-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Late For Work
            </h1>
          </div>

          <p className="text-2xl md:text-3xl mb-8 leading-relaxed">
            Improv comedy that's worth being late for
          </p>

          <p className="text-lg mb-8 leading-relaxed text-muted-foreground">
            We are invested in collaborating with artists and performers across ALL forms of comedy.
            Interested in sharing a stage with us? DARLING, REACH OUT!! We wanna hear from you, funny folks.
          </p>

          <a
            href="#contact"
            className="inline-block bg-destructive text-destructive-foreground px-8 py-4 border-4 border-primary transform -rotate-1 hover:rotate-0 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer"
          >
            Get in Touch
          </a>
        </div>

        {/* Right: overlapping Polaroids */}
        <div className="relative h-80 md:h-96">
          {CARDS.map((card, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute block w-44 md:w-52 border-4 border-primary p-2 bg-white"
              style={{
                top: card.top,
                left: card.left,
                zIndex: hovered === i ? 40 : card.baseZ,
                transform: getTransform(i, hovered, card.rot),
                boxShadow: hovered === i
                  ? "6px 6px 0px 0px #1a1a1a"
                  : "2px 2px 0px 0px rgba(0,0,0,0.25)",
                transition: "transform 0.3s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <img src={card.src} alt={card.alt} className="w-full block" />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
