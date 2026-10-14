# 🎓 Freshman CS Portfolio & Personal Website

A high-performance, modern personal portfolio and website designed specifically for a first-year Computer Science / Engineering college student. Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Key Features

- **Built for Recruiter Psychology**: Focuses on learning velocity, working proof-of-work, and clean CS fundamentals.
- **Single-Source-of-Truth Data**: All personal information, bio, projects, coursework, and links are managed in a single typed configuration file: [`src/data/portfolio.ts`](./src/data/portfolio.ts).
- **Interactive Project Showcase**: Filterable by category (*Campus Utility*, *CS Fundamentals*, *API / Tool*) with bullet points covering the problem solved, technical implementation, and metrics.
- **Interactive Terminal Preview**: Proof-of-work card on the hero screen showcasing your developer profile.
- **No Arbitrary Skill Bars**: Uses categorized tags for Languages, Frameworks, Developer Tools, and Core CS Fundamentals.
- **Academic Coursework Tracker**: Displays completed and currently in-progress university classes.
- **Campus & Pre-College Leadership**: Highlighting ACM involvement, peer tutoring, and high school engineering milestones (FIRST Robotics, etc.).
- **Mobile Responsive & Accessible**: Clean glassmorphism header, mobile hamburger drawer, and high-contrast dark theme.
- **Direct PDF Resume Support**: Direct link to [`/public/resume.pdf`](./public/resume.pdf) without Google Drive permission barriers.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## ✏️ How to Customize for Yourself (In 5 Minutes)

### 1. Update Your Data
Open [`src/data/portfolio.ts`](./src/data/portfolio.ts) and edit:
- **`personal`**: Your name, university, graduation year (e.g. `Class of 2028`), and elevator pitch.
- **`links`**: Your GitHub profile, LinkedIn URL, email, and social handles.
- **`projects`**: Add your own project titles, descriptions, live demo links, and GitHub repositories.
- **`skills` & `coursework`**: Update with your programming languages and current university schedule.
- **`experiences`**: Add your campus clubs, hackathons attended, or tutoring roles.

### 2. Add Your Real Resume
Replace the placeholder file in `public/resume.pdf` with your actual 1-page PDF resume:
```bash
cp /path/to/Your_Resume.pdf public/resume.pdf
```

---

## 🌐 Free 1-Click Deployment (Vercel)

1. Push this repository to your personal GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete freshman portfolio setup"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **Add New Project** &rarr; Select your `portfolio` repository.
4. Click **Deploy**. Vercel will build and assign you a free `yourname.vercel.app` domain with automated SSL.
5. *(Optional)* Add a custom domain such as `yourname.dev` or `yourname.me` in the Vercel project settings.
