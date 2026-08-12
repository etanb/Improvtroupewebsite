import quotes from "../../data/quotes.json";
import star1 from "../../imports/star-doodle.png";
import star2 from "../../imports/star-doodle-2.png";
import star3 from "../../imports/star-doodle-3.png";
import star4 from "../../imports/star-doodle-4.png";

const stars = [
  { src: star1, className: "star-swoop-1", size: 44, top: "10%",   left: "5%",   opacity: 0.85 },
  { src: star2, className: "star-swoop-2", size: 32, top: "8%",    right: "8%",  opacity: 0.7  },
  { src: star3, className: "star-swoop-3", size: 52, bottom: "12%",left: "18%",  opacity: 0.75 },
  { src: star4, className: "star-swoop-4", size: 36, bottom: "8%", right: "12%", opacity: 0.8  },
  { src: star1, className: "star-swoop-5", size: 26, top: "50%",   left: "2%",   opacity: 0.5  },
  { src: star3, className: "star-swoop-2", size: 30, top: "20%",   right: "22%", opacity: 0.45 },
  { src: star2, className: "star-swoop-4", size: 40, bottom: "20%",right: "3%",  opacity: 0.6  },
];

// Quotes are synced from Airtable into src/data/quotes.json by a scheduled
// GitHub Actions job (scripts/syncQuote.mjs), the same way shows.json is
// kept in sync with rolodex.lol. That means the array below is already
// bundled into the page — no fetch, no loading state, no pop-in.
//
// The "quote of the day" rotation is still live: this is just local date
// math against the bundled array, so which quote shows still changes daily
// without needing a rebuild.
const quote =
  quotes.length > 0
    ? quotes[Math.floor(Date.now() / 86400000) % quotes.length]
    : null;

export function Quote() {
  if (!quote) return null;

  return (
    <section className="bg-primary text-primary-foreground py-10 md:py-14 overflow-hidden relative">
      {stars.map((star, i) => (
        <div
          key={i}
          className={`${star.className} absolute pointer-events-none`}
          style={{ top: star.top, left: star.left, right: (star as any).right, bottom: star.bottom, opacity: star.opacity }}
        >
          <img src={star.src} alt="" width={star.size} height={star.size} />
        </div>
      ))}

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="inline-block bg-secondary text-secondary-foreground px-4 py-1 border-4 border-secondary-foreground text-sm font-bold tracking-widest uppercase transform -rotate-1">
            ★ Troupe Wisdom ★
          </div>
        </div>

        <div className="text-center transform rotate-1" style={{ minHeight: "8rem" }}>
          <p className="text-2xl md:text-4xl font-bold text-secondary leading-tight mb-6">
            "{quote.text}"
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-secondary opacity-50" />
            <div>
              <p className="font-bold text-lg">{quote.author}</p>
              <p className="text-sm opacity-60 tracking-wide">Late For Work</p>
            </div>
            <div className="h-px w-12 bg-secondary opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}
