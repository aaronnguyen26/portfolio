"use client";

import React, { useState } from "react";
import TurnLink from "@/components/TurnLink";
import ContactForm from "@/components/ContactForm";
import { nav, site } from "@/data/site";

export default function MobileContactLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-contact-container">
      {/* Top Bar with Persistent Brand Mark */}
      <div className="mobile-contact-header">
        <button
          type="button"
          className="mobile-minimal-brand"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {site.name}
        </button>

        {/* Floating Popover Navigation Drawer */}
        {isMenuOpen && (
          <>
            <div
              className="mobile-home-menu-backdrop"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav className="mobile-home-nav-drawer" aria-label="Mobile Navigation">
              <ul>
                {nav.map((item) => {
                  const isActive = item.href === "/contact";
                  return (
                    <li key={item.href}>
                      <TurnLink
                        href={item.href}
                        className={`mobile-home-nav-link ${isActive ? "active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="mobile-home-nav-n">{item.n}</span>
                        <span>{item.label}</span>
                      </TurnLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Hero Section */}
      <div className="mobile-contact-hero">
        <h1 className="mobile-contact-title">
          Let’s <span className="hl">talk</span>.
        </h1>
        <p className="mobile-contact-lede">
          recruiter, classmate, or curious builder? send a note, i read and reply to everything.
        </p>
      </div>

      {/* Primary Dispatch Form Card */}
      <div className="mobile-contact-card">
        <div className="mobile-contact-washi-tape" aria-hidden="true" />

        {/* Handwritten reply note */}
        <div className="mobile-contact-handnote">
          <p className="mobile-contact-handnote-text hand">
            usually reply within a day or two!
          </p>
        </div>

        {/* Embedded Contact Form */}
        <div className="mobile-contact-form-wrapper">
          <ContactForm />
        </div>
      </div>

      {/* Open Editorial Directory (Directly on Paper, No Card Box) */}
      <div className="mobile-contact-directory">
        <div className="mobile-contact-directory-header">
          <span className="mobile-contact-directory-tag">DIRECT CHANNELS</span>
          <span className="mobile-contact-directory-rule" aria-hidden="true" />
          <span className="mobile-contact-directory-meta">EST. 2026</span>
        </div>

        <div className="mobile-contact-directory-list">
          <a
            href="mailto:aaronngu@usc.edu"
            className="mobile-contact-directory-item"
            style={{ backgroundColor: "rgba(154, 42, 42, 0.05)", borderRadius: 6 }}
          >
            <div className="mobile-contact-directory-left">
              <span className="mobile-contact-directory-idx" style={{ color: "var(--cardinal)" }}>01</span>
              <span className="mobile-contact-directory-label" style={{ color: "var(--cardinal)" }}>Direct Email</span>
              <span className="mobile-contact-directory-desc">aaronngu@usc.edu</span>
            </div>
            <span className="mobile-contact-directory-arrow" style={{ color: "var(--cardinal)" }}>✉</span>
          </a>

          <a
            href="https://github.com/aaronnguyen26"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-contact-directory-item"
          >
            <div className="mobile-contact-directory-left">
              <span className="mobile-contact-directory-idx">02</span>
              <span className="mobile-contact-directory-label">GitHub</span>
              <span className="mobile-contact-directory-desc">code &amp; open source</span>
            </div>
            <span className="mobile-contact-directory-arrow">↗</span>
          </a>

          <a
            href="https://linkedin.com/in/aaronnguyen26"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-contact-directory-item"
          >
            <div className="mobile-contact-directory-left">
              <span className="mobile-contact-directory-idx">03</span>
              <span className="mobile-contact-directory-label">LinkedIn</span>
              <span className="mobile-contact-directory-desc">career &amp; network</span>
            </div>
            <span className="mobile-contact-directory-arrow">↗</span>
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-contact-directory-item"
          >
            <div className="mobile-contact-directory-left">
              <span className="mobile-contact-directory-idx">04</span>
              <span className="mobile-contact-directory-label">Instagram</span>
              <span className="mobile-contact-directory-desc">visual notes &amp; moments</span>
            </div>
            <span className="mobile-contact-directory-arrow">↗</span>
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-contact-directory-item"
          >
            <div className="mobile-contact-directory-left">
              <span className="mobile-contact-directory-idx">05</span>
              <span className="mobile-contact-directory-label">Resume</span>
              <span className="mobile-contact-directory-desc">curriculum vitae (pdf)</span>
            </div>
            <span className="mobile-contact-directory-arrow">↓</span>
          </a>
        </div>
      </div>

      {/* Clean Footer Spacing (Bottom action buttons deleted as requested) */}
      <footer className="mobile-home-footer" style={{ marginTop: 32 }} />
    </div>
  );
}
