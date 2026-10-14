export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  techStack: string[];
  demoUrl?: string;
  githubUrl: string;
  featured: boolean;
  category: "Full Stack" | "Desktop & Systems" | "CS Fundamentals" | "API / Tool";
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  type: "Campus" | "Leadership" | "Academic" | "High School Highlight";
  bullets: string[];
}

export interface SkillCategory {
  title: string;
  skills: { name: string; highlight?: boolean }[];
}

export interface PortfolioData {
  personal: {
    name: string;
    preferredName?: string;
    headline: string;
    subheadline: string;
    university: string;
    major: string;
    minor?: string;
    gradYear: string;
    location: string;
    status: {
      seeking: string;
      available: boolean;
    };
    bio: string[];
    currentlyLearning: string[];
    interests: string[];
  };
  links: {
    github: string;
    linkedin: string;
    email: string;
    twitter?: string;
    resumePdf: string;
  };
  skills: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  coursework: {
    completed: string[];
    inProgress: string[];
  };
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Aaron Nguyen",
    headline: "Computer Science Freshman & Full-Stack Developer",
    subheadline:
      "Building high-performance web applications, desktop tools, and scalable software. Driven by rapid prototyping, clean architecture, and computer science fundamentals.",
    university: "University of California",
    major: "B.S. in Computer Science",
    gradYear: "Class of 2028",
    location: "California, USA (Open to Relocation & Remote)",
    status: {
      seeking: "Seeking Summer 2027 Software Engineering Internships",
      available: true,
    },
    bio: [
      "I am a first-year Computer Science student passionate about software engineering, web architectures, and algorithms. My journey started with curiosity about how software powers everyday experiences, which quickly grew into building full-stack web applications, desktop software with Tauri, and participating in hackathons.",
      "As a freshman, I prioritize learning velocity, clean code standards, and practical problem-solving. Outside of lectures, you can find me building developer utilities, exploring modern reactive frameworks, and contributing to open-source projects.",
    ],
    currentlyLearning: [
      "Systems programming & desktop runtimes with Rust & Tauri",
      "Relational database design & PostgreSQL indexing",
      "Cloud deployments with Docker and CI/CD workflows",
    ],
    interests: [
      "Collegiate Hackathons",
      "Distance Running & Fitness",
      "Mechanical Keyboards",
      "Specialty Coffee Brewing",
    ],
  },
  links: {
    github: "https://github.com/aaronnguyen26",
    linkedin: "https://linkedin.com",
    email: "aaronnguyen.dev@gmail.com",
    twitter: "https://twitter.com",
    resumePdf: "/resume.pdf",
  },
  skills: [
    {
      title: "Languages",
      skills: [
        { name: "TypeScript", highlight: true },
        { name: "JavaScript", highlight: true },
        { name: "Python", highlight: true },
        { name: "Java", highlight: true },
        { name: "C / C++" },
        { name: "Rust (Basics)" },
        { name: "SQL (PostgreSQL)" },
        { name: "HTML5 & CSS3" },
      ],
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "React", highlight: true },
        { name: "Next.js (App Router)", highlight: true },
        { name: "Tailwind CSS", highlight: true },
        { name: "Tauri", highlight: true },
        { name: "Node.js & Express" },
        { name: "Motion & GSAP" },
        { name: "REST APIs" },
      ],
    },
    {
      title: "Developer Tools",
      skills: [
        { name: "Git & GitHub", highlight: true },
        { name: "Linux / Bash CLI", highlight: true },
        { name: "VS Code" },
        { name: "Postman" },
        { name: "Vercel" },
        { name: "Docker (Basics)" },
      ],
    },
    {
      title: "Core CS Fundamentals",
      skills: [
        { name: "Data Structures & Algorithms", highlight: true },
        { name: "Object-Oriented Design (OOP)" },
        { name: "Time & Space Complexity (Big-O)" },
        { name: "Discrete Mathematics" },
        { name: "Relational Database Design" },
      ],
    },
  ],
  projects: [
    {
      id: "pulsejam",
      title: "PulseJam",
      tagline: "High-performance multimedia & developer productivity platform",
      description:
        "A desktop and web experience built with Next.js and Tauri, featuring smooth 60fps animations, local sidecar processes, and intuitive media controls.",
      bullets: [
        "Architected modern desktop and web application using Next.js 16, React 19, and Tauri v2 framework.",
        "Engineered smooth fluid motion using Lenis, GSAP, and Motion for zero-jank interactive transitions.",
        "Implemented local Python and Node.js sidecar service integration for high-throughput background tasks.",
      ],
      techStack: ["Next.js", "Tauri", "TypeScript", "React", "Tailwind CSS", "GSAP"],
      demoUrl: "https://pulsejam.vercel.app",
      githubUrl: "https://github.com/aaronnguyen26/pulsejam",
      featured: true,
      category: "Desktop & Systems",
    },
    {
      id: "resumehack",
      title: "ResumeHack",
      tagline: "Full-stack resume optimization workspace and browser companion",
      description:
        "Comprehensive tooling ecosystem featuring a Next.js web application, Chrome extension, and automated backend analysis engine for tech resumes.",
      bullets: [
        "Constructed multi-package monorepo containing a web dashboard, browser extension, and Node.js backend.",
        "Implemented targeted keyword scoring algorithm matching applicant resumes against live job descriptions.",
        "Integrated automated test suite with Vitest ensuring consistent extraction and analysis accuracy.",
      ],
      techStack: ["TypeScript", "Next.js", "Node.js", "Chrome Extension", "Tailwind CSS"],
      demoUrl: "https://resumehack-sand.vercel.app",
      githubUrl: "https://github.com/aaronnguyen26",
      featured: true,
      category: "Full Stack",
    },
    {
      id: "algosight",
      title: "AlgoSight",
      tagline: "Interactive graph and sorting algorithm visualizer",
      description:
        "An educational tool providing intuitive, step-by-step visualizations of fundamental computer science algorithms with speed and state controls.",
      bullets: [
        "Visualizes Dijkstra's shortest path, A* pathfinding, BFS/DFS, and 4 classic sorting algorithms in real time.",
        "Engineered custom step-through execution engine allowing users to pause, reverse, and inspect call stacks.",
        "Built responsive canvas rendering with accessible color modes and variable step-latency throttles.",
      ],
      techStack: ["React", "TypeScript", "HTML5 Canvas", "Tailwind CSS"],
      githubUrl: "https://github.com/aaronnguyen26",
      featured: true,
      category: "CS Fundamentals",
    },
  ],
  experiences: [
    {
      id: "acm-officer",
      role: "Hackathon Organizer & Committee Member",
      organization: "ACM Student Chapter",
      period: "Sep 2026 – Present",
      location: "On Campus",
      type: "Leadership",
      bullets: [
        "Co-organizing annual collegiate hackathon for 350+ student builders, coordinating mentors and workshop schedules.",
        "Facilitating weekly peer coding sessions covering LeetCode algorithms and web development starter projects.",
      ],
    },
    {
      id: "cs-tutor",
      role: "Undergraduate CS Peer Tutor",
      organization: "Department of Computer Science",
      period: "Oct 2026 – Present",
      location: "On Campus",
      type: "Academic",
      bullets: [
        "Hosting bi-weekly office hours assisting 30+ students in introductory Computer Science (Python/Java).",
        "Clarifying foundational concepts including recursion, pointer abstraction, complexity analysis, and debugging.",
      ],
    },
    {
      id: "robotics-lead",
      role: "Software Team Lead (High School)",
      organization: "FIRST Robotics Competition Team",
      period: "Aug 2024 – May 2026",
      location: "High School Highlight",
      type: "High School Highlight",
      bullets: [
        "Led 6-student software team programming autonomous robot driving routines in Java using WPILib and PID controllers.",
        "Engineered vision-based AprilTag tracking utilizing OpenCV for high-accuracy target alignment during regional tournaments.",
      ],
    },
  ],
  coursework: {
    completed: [
      "Introduction to Computer Science (Python & Java)",
      "Discrete Mathematics for Computer Science",
      "Calculus I & II",
    ],
    inProgress: [
      "Data Structures and Algorithms (C++ / Java)",
      "Computer Organization & Assembly",
      "Linear Algebra",
    ],
  },
};
