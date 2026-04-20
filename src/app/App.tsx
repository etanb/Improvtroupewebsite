import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Shows } from "./components/Shows";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Shows />
      <Contact />
      <Footer />
    </div>
  );
}