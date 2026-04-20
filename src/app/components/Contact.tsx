import { useState } from "react";
import { Send } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="inline-block bg-accent px-8 py-4 border-4 border-primary transform rotate-1 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
        </div>

        <p className="text-xl mb-8 leading-relaxed">
          Want to collaborate? Have a venue? Just wanna say hi? We'd love to hear from you!
        </p>

        {submitted ? (
          <div className="bg-secondary border-4 border-primary p-8 text-center transform -rotate-1">
            <p className="text-2xl font-bold">Thanks for reaching out!</p>
            <p className="text-lg mt-2">We'll get back to you soon!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-4 border-primary bg-input-background focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-4 border-primary bg-input-background focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border-4 border-primary bg-input-background focus:border-secondary focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-destructive text-destructive-foreground px-8 py-4 border-4 border-primary transform -rotate-1 hover:rotate-0 transition-transform flex items-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
