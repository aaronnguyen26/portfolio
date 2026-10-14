"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { Mail, Copy, Check, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export function Contact() {
  const { links } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    // Client-side submission handling
    const mailtoUrl = `mailto:${links.email}?subject=Message from ${encodeURIComponent(
      formData.name || "Portfolio Visitor"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-blue-400 uppercase mb-3 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30">
              <Mail className="w-3.5 h-3.5" />
              <span>Let&apos;s Connect</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Get In Touch
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              I am actively looking for <strong className="text-slate-200">Summer 2027 Software Engineering internships</strong>, campus research labs, or hackathon team collaborations. My inbox is always open!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            
            {/* Left Box: Quick Contacts & Direct Copy */}
            <div className="md:col-span-2 space-y-4">
              {/* Copy Email Card */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-2">
                  Direct Email
                </span>
                <div className="text-sm font-medium text-slate-200 break-all mb-3">
                  {links.email}
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 active:scale-[0.98]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Email Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy Email Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Profiles */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Social Channels
                </span>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  <GithubIcon className="w-4 h-4 text-blue-400" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  <LinkedinIcon className="w-4 h-4 text-sky-400" />
                  <span>LinkedIn Network</span>
                </a>
              </div>
            </div>

            {/* Right Box: Interactive Message Form */}
            <div className="md:col-span-3 rounded-2xl bg-slate-900/70 border border-slate-800/90 p-6 sm:p-7">
              {formSubmitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Opening Email Client...</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Your message has been pre-filled into your default mail app. If it didn&apos;t open automatically, feel free to email me directly at{" "}
                    <span className="text-blue-400 font-medium">{links.email}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Email <span className="text-blue-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="recruiter@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Message <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      placeholder="Hi Minh, I saw your portfolio and would love to chat about an internship opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
