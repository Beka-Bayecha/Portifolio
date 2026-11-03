/**
 * Run this once to seed Firestore with initial data.
 * Import and call seedFirestore() from a temporary button, or run it from the browser console.
 * After seeding, you can remove the call — data lives in Firestore.
 */
import { collection, writeBatch, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const projects = [
  {
    order: 0,
    title: "Shino Full Gospel Church Management",
    subtitle: "Enterprise Church Administration",
    description: "Full-stack administrative platform managing membership records, tithe accounting, and church operations.",
    tech: ["React", "Node.js", "MySQL", "Express"],
    imageKey: "church",
    liveUrl: "https://shinofullgospel-church.vercel.app/",
    githubUrl: "https://github.com/Beka-Bayecha/Church-",
    upcoming: false,
  },
  {
    order: 1,
    title: "School Management System",
    subtitle: "Academic Administration Platform",
    description: "Institutional portal for managing student records, grading matrices, and attendance tracking.",
    tech: ["React", "Node.js", "MongoDB", "Express"],
    imageKey: "school",
    liveUrl: "https://shinohigh-school.vercel.app/",
    githubUrl: "https://github.com/Beka-Bayecha/Full-Stuck-SHS",
    upcoming: false,
  },
  {
    order: 2,
    title: "Personal Portfolio",
    subtitle: "Developer Brand & Showcase",
    description: "Cinematic developer portfolio highlighting full-stack engineering projects and academic credentials.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    imageKey: "port",
    liveUrl: "",
    githubUrl: "",
    upcoming: false,
  },
  {
    order: 3,
    title: "Holy Bible App",
    subtitle: "Cross-Platform Mobile App",
    description: "A mobile application for reading the Bible with bookmarks, full-text search, and offline support.",
    tech: ["React Native", "Firebase"],
    imageKey: "",
    liveUrl: "",
    githubUrl: "",
    upcoming: true,
  },
];

const skills = [
  // ── Core / Featured skills (shown as large cards) ──────────────
  {
    order: 0,
    name: "TypeScript & JavaScript",
    icon: "typescript",
    category: "core",
    tag: "Core Daily",
    summary: "Type-safe web applications, scalable client systems, and modern ES6+ runtime logic.",
    subSkills: ["TypeScript", "JavaScript", "ES6+", "Async/Await"],
  },
  {
    order: 1,
    name: "React & Next.js",
    icon: "react",
    category: "core",
    tag: "Primary Client",
    summary: "Component systems, reactive user state, custom UI libraries, and sub-second renders.",
    subSkills: ["React 18", "Next.js", "Hooks", "Framer Motion"],
  },
  {
    order: 2,
    name: "Node.js & Express",
    icon: "nodejs",
    category: "core",
    tag: "Primary Server",
    summary: "Defensive RESTful web services, cryptographic JWT authentication, and route guards.",
    subSkills: ["Node.js", "Express.js", "REST APIs", "JWT Auth"],
  },
  {
    order: 3,
    name: "MySQL & MongoDB",
    icon: "mysql",
    category: "core",
    tag: "Primary Databases",
    summary: "Normalized relational schemas (InnoDB) and high-throughput document stores.",
    subSkills: ["MySQL (InnoDB)", "MongoDB", "Firestore", "Indexing"],
  },
  {
    order: 4,
    name: "Python",
    icon: "python",
    category: "core",
    tag: "Backend & Data",
    summary: "Backend automation, scripting, data pipelines, and algorithmic problem solving.",
    subSkills: ["Python 3", "Scripting", "Automation", "REST APIs"],
  },
  {
    order: 5,
    name: "Java & C++",
    icon: "cplusplus",
    category: "core",
    tag: "Academic Foundation",
    summary: "Rigorous OOP software engineering and data structures from Haramaya University IT.",
    subSkills: ["Java OOP", "C++", "Data Structures", "Algorithms"],
  },
  // ── Other / Extended ecosystem ─────────────────────────────────
  { order: 6,  name: "Tailwind CSS",  icon: "tailwindcss",  category: "other" },
  { order: 7,  name: "HTML5",         icon: "html",         category: "other" },
  { order: 8,  name: "CSS3",          icon: "css",          category: "other" },
  { order: 9,  name: "React Native",  icon: "reactnative",  category: "other" },
  { order: 10, name: "Flutter",       icon: "flutter",      category: "other" },
  { order: 11, name: "Firebase",      icon: "firebase",     category: "other" },
  { order: 12, name: "Git & GitHub",  icon: "github",       category: "other" },
  { order: 13, name: "Vercel",        icon: "vercel",       category: "other" },
  { order: 14, name: "PHP",           icon: "php",          category: "other" },
  { order: 15, name: "Redux",         icon: "redux",        category: "other" },
  { order: 16, name: "Vite",          icon: "vite",         category: "other" },
  { order: 17, name: "Postman",       icon: "postman",      category: "other" },
  { order: 18, name: "Linux",         icon: "linux",        category: "other" },
  { order: 19, name: "Docker",        icon: "docker",       category: "other" },
];

const services = [
  { order: 0, icon: "Globe", title: "Full Stack Web Development", desc: "End-to-end web applications with modern frameworks and responsive design." },
  { order: 1, icon: "Server", title: "Backend API Development", desc: "Robust REST APIs and server-side logic with Node.js and Express." },
  { order: 2, icon: "Smartphone", title: "Mobile App Development", desc: "Cross-platform mobile apps with React Native and Firebase." },
  { order: 3, icon: "Palette", title: "UI/UX Design", desc: "Clean, intuitive interfaces with attention to detail and user experience." },
];


const certificates = [
  {
    order: 0,
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta (Coursera)",
    issueDate: "2024",
    credentialId: "META-FE-892410",
    credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    category: "Frontend",
    skills: ["React", "JavaScript", "HTML5", "CSS3", "UI/UX", "Git"],
    featured: true,
    description: "Rigorous 9-course curriculum covering advanced React patterns, client-side routing, state management, testing, and responsive UI design principles.",
  },
  {
    order: 1,
    title: "Full Stack Web Development Program",
    issuer: "Haramaya University",
    issueDate: "2024",
    credentialId: "HU-IT-FS2024",
    credentialUrl: "https://www.haramaya.edu.et",
    category: "Full Stack",
    skills: ["React", "Node.js", "Express", "MySQL", "REST APIs", "System Architecture"],
    featured: true,
    description: "Comprehensive software engineering program focused on production-ready full-stack applications, database modeling, and server-side logic.",
  },
  {
    order: 2,
    title: "Backend Development & APIs Certification",
    issuer: "freeCodeCamp",
    issueDate: "2023",
    credentialId: "FCC-BE-58201",
    credentialUrl: "https://www.freecodecamp.org/certification/Beka-Bayecha/back-end-development-and-apis",
    category: "Backend & Cloud",
    skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST APIs"],
    featured: false,
    description: "Hands-on projects covering microservices, asynchronous execution, database CRUD, URL shorteners, and authentication pipelines.",
  },
  {
    order: 3,
    title: "Dean's Honor Roll & Academic Excellence",
    issuer: "Haramaya University - IT Department",
    issueDate: "2023 - 2024",
    credentialId: "HU-HONOR-2024",
    credentialUrl: "https://www.haramaya.edu.et",
    category: "Professional",
    skills: ["Data Structures", "Algorithms", "Object-Oriented Design", "Computer Networks"],
    featured: true,
    description: "Recognized for top academic ranking and outstanding practical software development contributions across the Information Technology department.",
  },
  {
    order: 4,
    title: "Responsive Web Design Certification",
    issuer: "freeCodeCamp",
    issueDate: "2023",
    credentialId: "FCC-RWD-34981",
    credentialUrl: "https://www.freecodecamp.org/certification/Beka-Bayecha/responsive-web-design",
    category: "Frontend",
    skills: ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Accessibility"],
    featured: false,
    description: "Mastery of modern mobile-first web design, semantic HTML, CSS animations, media queries, and responsive grid structures.",
  },
  {
    order: 5,
    title: "Relational Database & SQL Specialist",
    issuer: "IBM / Coursera",
    issueDate: "2023",
    credentialId: "IBM-SQL-77312",
    credentialUrl: "https://www.coursera.org",
    category: "Database",
    skills: ["MySQL", "Relational Databases", "Complex Queries", "Optimization"],
    featured: false,
    description: "Comprehensive training in relational database normalization, joins, indexing strategies, ACID compliance, and database management.",
  },
];

async function seedCollection(name: string, items: object[]) {
  const batch = writeBatch(db);
  items.forEach((item, i) => {
    batch.set(doc(collection(db, name), String(i)), item);
  });
  await batch.commit();
  console.log(`✅ Seeded ${name}`);
}

export async function seedFirestore() {
  try {
    await Promise.all([
      seedCollection("projects", projects),
      seedCollection("skills", skills),
      seedCollection("services", services),
      seedCollection("certificates", certificates),
    ]);
    console.log("🎉 Core collections seeded!");
  } catch (e) {
    console.error("Seed failed:", e);
  }
}

/** Patches only the githubUrl field on existing project documents */
export async function patchProjectGithubUrls() {
  const snap = await getDocs(collection(db, "projects"));

  const githubMap: Record<string, string> = {
    "Church Management System": "https://github.com/Beka-Bayecha/Church-",
    "School Management System": "https://github.com/Beka-Bayecha/Full-Stuck-SHS",
  };

  const updates = snap.docs
    .filter((d) => githubMap[(d.data() as { title: string }).title])
    .map((d) =>
      updateDoc(doc(db, "projects", d.id), {
        githubUrl: githubMap[(d.data() as { title: string }).title],
      })
    );

  await Promise.all(updates);
  console.log(`✅ Patched ${updates.length} project(s) with GitHub URLs`);
}
