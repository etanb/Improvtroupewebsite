import { useState } from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import allShows from "../../data/shows.json";

// Split and sort based on today's date
const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingShows = allShows
  .filter((s) => new Date(s.date) >= today)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 2);

const pastShows = allShows
  .filter((s) => new Date(s.date) < today)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function Shows() {
  const [next, second] = upcomingShows;
  const [hovered, setHovered] = useState(false);

  return (
    <section id="shows" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="inline-block bg-secondary px-8 py-4 border-4 border-primary transform -rotate-1 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">Our Shows</h2>
        </div>

        {/* Coming Up */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-accent px-4 py-2 border-4 border-primary">
              <h3 className="text-2xl md:text-3xl font-bold">Coming Up</h3>
            </div>
            <div className="h-1 flex-1 bg-primary"></div>
          </div>

          <div className="relative" style={{ marginTop: second ? "60px" : "0" }}>

            {/* Second card — peeks 60px above the front card */}
            {second && (
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  left: "8px",
                  right: "8px",
                  zIndex: 20,
                  transform: hovered
                    ? "translateY(calc(-100% + 60px)) rotate(-1.5deg)"
                    : "rotate(-1.5deg)",
                  transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease",
                  boxShadow: hovered ? "6px 6px 0px 0px #1a1a1a" : "2px 2px 0px 0px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <a
                  href={second.ticketUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border-4 border-primary cursor-pointer"
                >
                  {/* Peek strip */}
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-destructive shrink-0" size={18} />
                      <span className="text-lg font-bold">{formatDate(second.date)}</span>
                      {second.time && (
                        <span className="text-sm text-muted-foreground ml-1">{second.time}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-7">
                      <MapPin className="text-destructive shrink-0" size={14} />
                      <span className="text-sm font-bold">{second.venue}</span>
                    </div>
                  </div>
                  {/* Rest of card */}
                  <div className="px-5 pb-4 border-t-2 border-primary/20 pt-3">
                    <div className="border-t-2 border-primary pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-destructive font-bold mr-2">w/</span>
                        {second.guests.map((g, i) => (
                          <span key={i} className="text-xs after:content-['_·_'] last:after:content-none">{g}</span>
                        ))}
                      </div>
                      {second.ticketUrl && (
                        <span className="ml-4 shrink-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 border-2 border-primary flex items-center gap-1">
                          tickets <ArrowRight size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* Front card — next show */}
            {next && (
              <a
                href={next.ticketUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block bg-white border-4 border-primary p-6 md:p-8 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-150"
                style={{ zIndex: 30 }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="text-destructive mt-1 shrink-0" size={28} />
                    <div>
                      <div className="text-3xl md:text-4xl font-bold">{formatDate(next.date)}</div>
                      {next.time && <div className="text-xl mt-1">{next.time}</div>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-destructive mt-1 shrink-0" size={22} />
                    <div className="text-2xl font-bold">{next.venue}</div>
                  </div>
                  {next.ticketUrl && (
                    <div className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 border-4 border-primary font-bold text-lg self-start">
                      get tickets <ArrowRight size={20} />
                    </div>
                  )}
                </div>
                <div className="border-t-2 border-primary mt-5 pt-4">
                  <span className="text-sm text-destructive font-bold mr-2">w/</span>
                  {next.guests.map((g, i) => (
                    <span key={i} className="text-sm after:content-['_·_'] last:after:content-none">{g}</span>
                  ))}
                </div>
              </a>
            )}

            {!next && (
              <div className="bg-white border-4 border-primary p-8 text-center text-muted-foreground text-lg">
                No upcoming shows right now — check back soon!
              </div>
            )}
          </div>
        </div>

        {/* Past Shows */}
        {pastShows.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-secondary px-4 py-2 border-4 border-primary">
                <h3 className="text-2xl md:text-3xl font-bold">Past Shows</h3>
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pastShows.map((show, idx) => (
                <a
                  key={idx}
                  href={show.ticketUrl || undefined}
                  target={show.ticketUrl ? "_blank" : undefined}
                  rel={show.ticketUrl ? "noopener noreferrer" : undefined}
                  className="block bg-white border-4 border-primary p-4 transform hover:rotate-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-150"
                >
                  <div className="text-lg font-bold mb-2">{formatDate(show.date)}</div>
                  <div className="text-sm font-bold text-muted-foreground mb-3">{show.venue}</div>
                  <div className="text-sm">
                    <span className="text-destructive font-bold mr-1">w/</span>
                    {show.guests.join(" · ")}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
