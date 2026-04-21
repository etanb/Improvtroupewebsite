import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Quote } from "./components/Quote";
import { Shows } from "./components/Shows";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Quote />
      <Shows />
      <Contact />
      <Footer />
    </div>
  );
}