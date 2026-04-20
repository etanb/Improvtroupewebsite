import { Calendar, MapPin, DollarSign } from "lucide-react";

const upcomingShows = [
  {
    id: 1,
    date: "May 15, 2026",
    time: "7:30 PM",
    venue: "Black Lodge",
    address: "429 Eastlake Ave E",
    price: "$10 cover on DICE",
    guests: ["Stay Silly", "Certified Nonsense: A Clown Collective", "a Laure Yamagawa sketch"],
  },
  {
    id: 2,
    date: "June 8, 2026",
    time: "8:00 PM",
    venue: "The Comedy Underground",
    address: "109 S Washington St",
    price: "$12 at the door",
    guests: ["Improv Friends", "The Silly Squad"],
  },
];

const pastShows = [
  {
    id: 1,
    date: "March 9, 2026",
    venue: "Black Lodge",
    guests: ["Jone Dehuff", "ABC&D Improv", "a Laure Yamagawa sketch"],
  },
  {
    id: 2,
    date: "February 9, 2026",
    venue: "Black Lodge",
    guests: ["Stay Silly", "Certified Nonsense: A Clown Collective", "a Laure Yamagawa sketch"],
  },
  {
    id: 3,
    date: "January 12, 2026",
    venue: "The Pocket Theater",
    guests: ["Wild Card Improv", "The Comedy Collective"],
  },
];

export function Shows() {
  return (
    <section id="shows" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="inline-block bg-secondary px-8 py-4 border-4 border-primary transform -rotate-1 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">Our Shows</h2>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-accent px-4 py-2 border-4 border-primary">
              <h3 className="text-2xl md:text-3xl font-bold">Coming Up</h3>
            </div>
            <div className="h-1 flex-1 bg-primary"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingShows.map((show) => (
              <div
                key={show.id}
                className="bg-white border-4 border-primary p-6 transform hover:-rotate-1 transition-transform"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Calendar className="text-destructive mt-1" size={24} />
                  <div>
                    <div className="text-2xl font-bold">{show.date}</div>
                    <div className="text-lg">{show.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="text-destructive mt-1" size={24} />
                  <div>
                    <div className="text-xl font-bold">{show.venue}</div>
                    <div className="text-muted-foreground">{show.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="text-destructive mt-1" size={24} />
                  <div className="text-lg">{show.price}</div>
                </div>

                <div className="border-t-2 border-primary pt-4">
                  <div className="text-sm mb-2 text-destructive font-bold">w/</div>
                  {show.guests.map((guest, idx) => (
                    <div key={idx} className="text-sm mb-1">
                      - {guest}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-secondary px-4 py-2 border-4 border-primary">
              <h3 className="text-2xl md:text-3xl font-bold">Past Shows</h3>
            </div>
            <div className="h-1 flex-1 bg-primary"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {pastShows.map((show) => (
              <div
                key={show.id}
                className="bg-white border-4 border-primary p-4"
              >
                <div className="text-lg font-bold mb-2">{show.date}</div>
                <div className="text-sm text-muted-foreground mb-3">{show.venue}</div>
                <div className="text-sm">
                  {show.guests.map((guest, idx) => (
                    <div key={idx} className="mb-1">
                      - {guest}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
