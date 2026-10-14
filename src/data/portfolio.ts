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
  category: "Full Stack" | "CS Fundamentals" | "Campus Utility" | "API / Tool";
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
    name: "Minh Nguyen",
    headline: "Computer Science Freshman & Aspiring Software Engineer",
    subheadline:
      "Building clean, accessible web applications and exploring distributed systems. Passionate about turning complex real-world problems into intuitive software.",
    university: "University of California",
    major: "B.S. in Computer Science",
    gradYear: "Class of 2028",
    location: "California, USA (Open to Relocation & Remote)",
    status: {
      seeking: "Seeking Summer 2027 Software Engineering Internships",
      available: true,
    },
    bio: [
      "I am a first-year Computer Science student passionate about software engineering, web architectures, and algorithms. My journey started with curiosity about how software powers everyday experiences, which quickly grew into building full-stack web applications and participating in collegiate hackathons.",
      "As a freshman, I prioritize learning velocity, clean code standards, and practical problem-solving. Outside of lectures, you can find me collaborating with peers on campus utility projects, exploring modern web frameworks, or diving into open-source repositories.",
    ],
    currentlyLearning: [
      "Systems programming & memory safety in Rust",
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
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "minh.nguyen@example.edu",
    twitter: "https://twitter.com",
    resumePdf: "/resume.pdf",
  },
  skills: [
    {
      title: "Languages",
      skills: [
        { name: "Python", highlight: true },
        { name: "TypeScript", highlight: true },
        { name: "JavaScript", highlight: true },
        { name: "Java", highlight: true },
        { name: "C / C++" },
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
        { name: "Node.js & Express" },
        { name: "FastAPI" },
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
        { name: "Vercel / Netlify" },
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
      id: "course-pilot",
      title: "CoursePilot",
      tagline: "Intelligent degree progression and conflict-free schedule planner",
      description:
        "A full-stack campus utility designed to eliminate schedule registration conflicts and help students map multi-year degree graduation tracks.",
      bullets: [
        "Architected responsive calendar grid interface supporting real-time drag-and-drop course scheduling.",
        "Implemented graph-based prerequisite validation algorithm to prevent scheduling invalid course sequences.",
        "Integrated Supabase PostgreSQL database for persistent schedule saving and shareable read-only links.",
        "Adopted by 180+ fellow undergraduates during fall course enrollment season.",
      ],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
      demoUrl: "https://example.com/course-pilot",
      githubUrl: "https://github.com/example/course-pilot",
      featured: true,
      category: "Campus Utility",
    },
    {
      id: "algosight",
      title: "AlgoSight",
      tagline: "Interactive 60fps graph and sorting algorithm visualizer",
      description:
        "An educational tool providing intuitive, step-by-step visualizations of fundamental computer science algorithms with speed and state controls.",
      bullets: [
        "Visualizes Dijkstra's shortest path, A* pathfinding, BFS/DFS, and 4 classic sorting algorithms in real time.",
        "Engineered custom step-through execution engine allowing users to pause, reverse, and inspect call stacks.",
        "Built responsive canvas rendering with accessible color modes and variable step-latency throttles.",
      ],
      techStack: ["React", "TypeScript", "HTML5 Canvas", "Tailwind CSS", "Vite"],
      demoUrl: "https://example.com/algosight",
      githubUrl: "https://github.com/example/algosight",
      featured: true,
      category: "CS Fundamentals",
    },
    {
      id: "git-pulse",
      title: "GitPulse",
      tagline: "GitHub contribution analyzer and pull request metrics dashboard",
      description:
        "Developer utility that queries the GitHub REST API to surface actionable insights on commit velocity, code review cadence, and repository activity.",
      bullets: [
        "Consumes GitHub REST API with cached client-side requests to avoid rate limits.",
        "Generates interactive charts for weekly code volume, review turnaround, and language distribution.",
        "Includes exportable markdown badges that developers can embed directly into their repository READMEs.",
      ],
      techStack: ["TypeScript", "Next.js", "Chart.js", "GitHub API", "Tailwind CSS"],
      demoUrl: "https://example.com/git-pulse",
      githubUrl: "https://github.com/example/git-pulse",
      featured: true,
      category: "API / Tool",
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
