import { useState, useEffect } from "react";

const BEHOLD_URL = "https://feeds.behold.so/qAzM0CUN4ODlHwG8vgtS";

const CARD_META = [
  { rot: "-7deg", top: "0%",  left: "0%",  baseZ: 10 },
  { rot: "5deg",  top: "8%",  left: "28%", baseZ: 30 },
  { rot: "-3deg", top: "4%",  left: "52%", baseZ: 20 },
];

interface BeholdPost {
  id: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
}

function getTransform(i: number, hovered: number | null, rot: string) {
  if (hovered === null) return `rotate(${rot})`;
  if (hovered === i)    return `rotate(${rot}) translateY(-14px) scale(1.07)`;
  const nudge = i < hovered ? -22 : 22;
  return `rotate(${rot}) translateX(${nudge}px) translateY(3px)`;
}

export function Hero() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [cards, setCards] = useState<{ src: string; alt: string; permalink: string }[]>([]);

  useEffect(() => {
    fetch(BEHOLD_URL)
      .then((r) => r.json())
      .then((data: { posts: BeholdPost[] }) => {
        const top3 = data.posts.slice(0, 3).map((p) => ({
          src: p.mediaType === "VIDEO" ? (p.thumbnailUrl ?? p.mediaUrl) : p.mediaUrl,
          alt: p.caption ? p.caption.slice(0, 80) : "Late for Work on Instagram",
          permalink: p.permalink,
        }));
        if (top3.length > 0) setCards(top3);
      })
      .catch((err) => {
        console.error("Behold feed failed to load:", err);
      });
  }, []);

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
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-block bg-destructive text-destructive-foreground px-8 py-4 border-4 border-primary transform -rotate-1 hover:rotate-0 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer"
          >
            Get in Touch
          </a>
        </div>

        {/* Right: overlapping Polaroids — frames always visible, images fade in */}
        <div className="relative h-80 md:h-96">
          {CARD_META.map((meta, i) => {
            const card = cards[i];
            return (
              <a
                key={i}
                href={card?.permalink ?? "https://instagram.com/late.for.work.improv"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute block w-44 md:w-52 border-4 border-primary p-2 bg-white"
                style={{
                  top: meta.top,
                  left: meta.left,
                  zIndex: hovered === i ? 40 : meta.baseZ,
                  transform: getTransform(i, hovered, meta.rot),
                  boxShadow: hovered === i
                    ? "6px 6px 0px 0px #1a1a1a"
                    : "2px 2px 0px 0px rgba(0,0,0,0.25)",
                  transition: "transform 0.3s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Placeholder shown until image loads */}
                <div className="w-full aspect-square bg-muted relative overflow-hidden">
                  {card && (
                    <img
                      src={card.src}
                      alt={card.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      style={{ opacity: 0 }}
                      onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = "1"; }}
                    />
                  )}
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
