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
  phone: "",
  github: "",
  linkedin: "",
  leetcode: "",
  website: "",
  resume: "",
  other: [] as { label: string; url: string }[],
};

export const skills: { category: string; items: string[] }[] = [
  { category: "Programming Languages", items: ["C", "C++", "Java", "Python"] },
  { category: "Web Development", items: ["HTML", "CSS", "Node.js"] },
  { category: "Database", items: ["SQL"] },
  { category: "Tools & Platforms", items: ["Git", "GitHub"] },
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
export const projects: Project[] = [];

export const careerInterests = [
  "Backend Development",
  "Web Development",
  "Server-side Programming",
  "Databases",
  "APIs",
  "Data Structures & Algorithms",
  "Building scalable web applications",
];

export const journey = [
  { stage: "Currently", items: ["B.Tech CSE (AI & ML)"] },
  {
    stage: "Learning & Building",
    items: ["Web Development", "Backend Development", "Databases", "Data Structures & Algorithms"],
  },
  { stage: "Future Goal", items: ["Professional Backend Engineer"] },
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
    photos: [] as string[],
  },
  {
    name: "AWS Club Hackathon",
    level: "University / Internal",
    organizer: "Organised by the AWS Club of Graphic Era Hill University",
    result: "2nd Place",
    prize: "₹3,000",
    description: "Won second place in the university-level hackathon hosted by the AWS Club.",
    photos: [] as string[],
  },
];
