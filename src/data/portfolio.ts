// Edit this file to update everything on the portfolio.
// Leave a link as "" to hide it until you have the real one.

export const profile = {
  name: "Tushar Gahlout",
  title: "Aspiring Backend Developer | B.Tech CSE (AI & ML) Student",
  intro:
    "Tushar Gahlout is a B.Tech Computer Science Engineering student specializing in Artificial Intelligence & Machine Learning, passionate about web development and aspiring to build a career as a Backend Engineer.",
  // Put a photo URL or imported image here to replace the initials placeholder.
  photo: "/profile.jpg",
  about: [
    "I am Tushar Gahlout, a B.Tech Computer Science Engineering student specializing in Artificial Intelligence & Machine Learning at Graphic Era Hill University, Bhimtal. I am currently in my 3rd semester and am passionate about web development, programming, databases, and problem solving.",
    "My primary career goal is to become a skilled Backend Engineer and build reliable, scalable, and efficient web applications. I keep learning and improving my technical skills through projects, coding practice, and problem solving.",
  ],
};

export const links = {
  email: "rajputtushar119@gmail.com",
  phone: "9389147847",
  github: "https://github.com/Tushar-Gahlout",
  linkedin: "",
  leetcode: "https://leetcode.com/u/Tushar_Gahlout/",
  website: "",
  resume: "",
  other: [] as { label: string; url: string }[],
};

export const skills: { category: string; items: string[] }[] = [
  { category: "Programming Languages", items: ["C", "C++", "Java", "Python", "JavaScript"] },
  { category: "Web Development", items: ["HTML", "CSS", "Tailwind CSS", "Node.js"] },
  { category: "Database", items: ["SQL"] },
  { category: "Tools & Platforms", items: ["Git", "GitHub", "VS Code"] },
  { category: "AI & ML", items: ["Machine Learning", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"] },
  { category: "Computer Science", items: ["Data Structures"] },
];

export const education = [
  {
    degree: "B.Tech in Computer Science Engineering — AI & ML Specialization",
    school: "Graphic Era Hill University, Bhimtal",
    details: ["Expected Graduation: 2029", "Current Semester: 3rd"],
  },
  { degree: "Class 12", school: "Baldev Singh Inter College, Jaspur", details: ["CBSE Affiliated"] },
  { degree: "Class 10", school: "Maria School, Jaspur", details: ["ICSE Affiliated"] },
];

export type Project = {
  name: string;
  description: string;
  tech: string[];
  image?: string;
  github?: string;
  demo?: string;
};

// Add projects here — cards appear automatically. Put images in public/projects/ and use "/projects/name.jpg".
// Example:
// { name: "My App", description: "What it does", tech: ["Node.js", "SQL"], image: "/projects/my-app.jpg", github: "https://github.com/...", demo: "https://..." }
export const projects: Project[] = [
  {
    name: "ChronoGen AI — Timetable Generator",
    description:
      "An AI-powered timetable generator that automatically creates clash-free class schedules for teachers, rooms and subjects.",
    tech: [],
    github: "",
    demo: "",
  },
  {
    name: "Bus Management System",
    description:
      "A system to manage buses, routes, schedules and bookings in one place, making bus operations easier to run and track.",
    tech: [],
    github: "",
    demo: "",
  },
  {
    name: "AI Railway Management System",
    description:
      "An AI-assisted railway management system for handling trains, schedules, reservations and passenger information.",
    tech: [],
    github: "",
    demo: "",
  },
];

export const careerInterests = [
  "Backend Development",
  "Web Development",
  "Server-side Programming",
  "Databases",
  "APIs",
  "Data Structures & Algorithms",
  "Building scalable web applications",
  "AI & ML Engineering",
];

export const journey = [
  { stage: "Currently", items: ["B.Tech CSE (AI & ML)"] },
  {
    stage: "Learning & Building",
    items: ["Web Development", "Backend Development", "Databases", "Data Structures & Algorithms"],
  },
  { stage: "Future Goal", items: ["Professional Backend Engineer", "AI & ML Engineer"] },
];

export const hackathons = [
  {
    name: "Geeks for Geeks × Miro Hackathon",
    level: "National Level",
    organizer: "Organised by GeeksforGeeks and Miro",
    result: "Consolation Prize",
    prize: "₹5,000",
    description: "Competed against teams from across the country and secured a consolation prize.",
    // Put photos in public/hackathons/ and list them here, e.g. ["/hackathons/gfg-1.jpg", "/hackathons/gfg-2.jpg"]
    photos: ["/hackathons/gfg-miro-hackathon.jpg"],
  },
  {
    name: "AWS Club Hackathon",
    level: "University / Internal",
    organizer: "Organised by the AWS Club of Graphic Era Hill University",
    result: "2nd Place",
    prize: "₹3,000",
    description: "Won second place in the university-level hackathon hosted by the AWS Club.",
    photos: ["/hackathons/aws-club-hackathon.jpg"],
  },
];

export type Certificate = {
  title: string;
  type: string;
  issuer: string;
  date: string;
  image: string;
};

// Add more certificates here. Put images in public/certificates/ and use "/certificates/name.jpg".
export const certificates: Certificate[] = [
  {
    title: "Watch the Code — National Level Hackathon",
    type: "Certificate of Achievement (Consolation Position)",
    issuer: "Tech Geeks Club, Graphic Era Hill University, Haldwani",
    date: "18–19 April 2026",
    image: "/certificates/watch-the-code-achievement.jpg",
  },
  {
    title: "Watch the Code — National Level Hackathon",
    type: "Certificate of Participation",
    issuer: "Tech Geeks Club, Graphic Era Hill University, Haldwani",
    date: "18–19 April 2026",
    image: "/certificates/watch-the-code-participation.jpg",
  },
  {
    title: "SAARTHI Hackathon 2025 (24 Hours National Level)",
    type: "Certificate of Participation",
    issuer: "Dept. of CSE & School of Computing, Graphic Era Hill University, Dehradun",
    date: "8–9 November 2025",
    image: "/certificates/saarthi-25.jpg",
  },
  {
    title: "Webathon 4.0",
    type: "Certificate of Participation",
    issuer: "Tech Geeks Club, Graphic Era Hill University, Haldwani",
    date: "21 September 2026",
    image: "/certificates/webathon-4.jpg",
  },
];