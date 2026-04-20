import heroImage1 from "../../imports/[image]_-_994202.jpeg";
import heroImage2 from "../../imports/[image]_-_5621944.jpeg";
import heroImage3 from "../../imports/[image]_-_9487263.jpeg";

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
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
            className="inline-block bg-destructive text-destructive-foreground px-8 py-4 border-4 border-primary transform -rotate-1 hover:rotate-0 transition-transform"
          >
            Get in Touch
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-4 border-primary p-2 bg-white transform rotate-2">
            <img src={heroImage1} alt="Late for Work show poster" className="w-full" />
          </div>
          <div className="border-4 border-primary p-2 bg-white transform -rotate-1 mt-8">
            <img src={heroImage2} alt="Late for Work coffee mug art" className="w-full" />
          </div>
          <div className="border-4 border-primary p-2 bg-white transform -rotate-2 -mt-4 col-span-2">
            <img src={heroImage3} alt="Late for Work lamp poster" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
