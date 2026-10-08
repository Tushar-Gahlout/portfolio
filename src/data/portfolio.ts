// Edit this file to update everything on the portfolio.
// Leave a link as "" to hide it until you have the real one.

export const profile = {
  name: "Tushar Gahlout",
  title: "Web & Backend Developer | AI/ML",
  intro:
    "Computer Science Engineering student pursuing a B.Tech (Hons.) with a specialization in Artificial Intelligence & Machine Learning. Hands-on experience in web and backend development using JavaScript, React.js, Node.js, Express.js, REST APIs, and databases. Experienced in building practical applications and contributing to award-winning technical events.",
  // Put a photo URL or imported image here to replace the initials placeholder.
  photo: "/profile.jpg",
  about: [
    "I am Tushar Gahlout, a B.Tech (Hons.) Computer Science Engineering student specializing in Artificial Intelligence & Machine Learning at Graphic Era Hill University, Bhimtal (2025–2029) with a current CGPA of 8.34/10.",
    "Passionate about web and backend development, I build practical, scalable applications using JavaScript, React.js, Node.js, Express.js, REST APIs, and databases. Experienced in building real-world solutions and contributing to award-winning technical events.",
  ],
};

export const links = {
  email: "rajputtushar119@gmail.com",
  phone: "9389147847",
  github: "https://github.com/Tushar-Gahlout",
  linkedin: "",
  leetcode: "https://leetcode.com/u/Tushar_Gahlout/",
  website: "https://aitime-tablegenerator.vercel.app/",
  resume: "/Tushar_Gahlout_Resume.pdf",
  other: [] as { label: string; url: string }[],
};

export const skills: { category: string; items: string[] }[] = [
  { category: "Programming Languages", items: ["C", "C++", "Java", "Python", "JavaScript"] },
  { category: "Frontend Development", items: ["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS"] },
  { category: "Backend Development", items: ["Node.js", "Express.js", "REST APIs"] },
  { category: "Databases", items: ["MongoDB", "MySQL", "Supabase"] },
  { category: "AI & ML", items: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn", "TensorFlow"] },
  { category: "Tools & Platforms", items: ["Git", "GitHub", "VS Code", "Vercel"] },
];

export const education = [
  {
    degree: "B.Tech (Hons.) in Computer Science & Engineering — Specialization in AI & ML",
    school: "Graphic Era Hill University, Bhimtal",
    details: ["Duration: 2025–2029", "CGPA: 8.34 / 10", "Current Semester: 3rd"],
  },
  {
    degree: "Class XII",
    school: "Baldev Singh Inter College, Jaspur",
    details: ["CBSE Affiliated", "Score: 84%"],
  },
  {
    degree: "Class X",
    school: "Maria School, Jaspur",
    details: ["ICSE Affiliated", "Score: 88.6%"],
  },
];

export type Project = {
  name: string;
  description: string;
  tech: string[];
  image?: string | undefined;
  github?: string | undefined;
  demo?: string | undefined;
  category?: string | undefined;
  featured?: boolean | undefined;
};

// Add projects here — cards appear automatically. Put images in public/projects/ and use "/projects/name.jpg".
export const projects: Project[] = [
  {
    name: "AI Time Table Generator",
    description: "Automated scheduling application that generates clash-free timetables for colleges and organizations, targeting common scheduling conflicts. Deployed on Vercel and maintained through GitHub.",
    tech: ["React.js", "Node.js", "JavaScript", "Tailwind CSS", "Vercel", "AI Scheduling"],
    demo: "https://aitime-tablegenerator.vercel.app/",
    category: "AI & Web",
    featured: true,
  },
  {
    name: "College Bus Management System",
    description: "Built a college bus management solution for monitoring student transportation and live attendance. Focused on user interface, application workflow, and route management. Secured 2nd Position in Innovate 1.0 Ideathon by AWS Club.",
    tech: ["React.js", "JavaScript", "Tailwind CSS", "REST APIs", "Node.js"],
    github: "https://github.com/Tushar-Gahlout/College_Bus_Management_System.git",
    category: "Web Application",
    featured: true,
  },
];

export const careerInterests = [
  "Backend Development",
  "Web Development",
  "Server-side Programming",
  "Databases (MongoDB, MySQL, Supabase)",
  "REST APIs",
  "Data Structures & Algorithms",
  "AI & ML Engineering",
];

export const journey = [
  { stage: "Currently", items: ["B.Tech (Hons.) CSE (AI & ML) — CGPA 8.34/10", "3rd Semester @ GEHU Bhimtal"] },
  {
    stage: "Building & Competing",
    items: ["AI Time Table Generator", "College Bus Management System", "Hackathon Podiums (GFG × Miro, AWS Club)"],
  },
  { stage: "Future Goal", items: ["Professional Web & Backend Developer", "AI/ML Solutions Engineer"] },
];

export const hackathons = [
  {
    name: "Watch the Code — National-Level Hackathon (2026)",
    level: "National Level",
    organizer: "Organized by GeeksforGeeks and Miro",
    result: "Consolation Prize (Team Tech4All)",
    prize: "₹5,000",
    description: "Backend Developer for Team Tech4All; competed against teams from across the country and secured a ₹5,000 consolation prize.",
    photos: ["/hackathons/gfg-miro-hackathon.jpg"],
  },
  {
    name: "Innovate 1.0 — Ideathon (2026)",
    level: "University / Internal",
    organizer: "Organized by the AWS Club of Graphic Era Hill University, Bhimtal",
    result: "2nd Position",
    prize: "₹3,000",
    description: "Backend Developer for College Bus Management System; pitched and built solution securing 2nd position in the university ideathon.",
    photos: ["/hackathons/aws-club-hackathon.jpg"],
  },
];

export const coreStrengths = [
  "Problem Solving",
  "Teamwork",
  "Communication",
  "Adaptability",
  "Fast Learning",
];

export const languages = ["English", "Hindi"];

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
