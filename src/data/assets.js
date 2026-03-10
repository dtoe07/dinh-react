import {
  GraduationCap,
  Bot,
  Activity,
  Leaf,
  Briefcase,
  Wifi,
} from "lucide-react";

export const ASSETS = [
  {
    id: "psu",
    type: "school",
    name: "Portland State University",
    icon: GraduationCap,
    x: 600,
    width: 300,
    height: 180,
    themeColor: "rgb(16,185,129)",
    bgGradient: "from-emerald-950/60",
    details: {
      degree: "B.S. in Computer Science",
      description:
        "I am a passionate Computer Science graduate from Portland State University, eager to apply my skills in software engineering. Throughout my academic journey, I have honed my abilities in developing both low and high level languages, working on various projects that showcase my proficiency in C++, Python, Java, JavaScript, and modern frameworks. I enjoy collaborative environments and am always in pursuit of solving everyday problems with the knowledge I have gained to create efficient and innovative solutions.",
      highlights: [
        "Software Engineering",
        "Graduated 2025",
        "Data Structures & Algorithms",
      ],
    },
  },
  {
    id: "proj1",
    type: "project",
    name: "Oregon Liquor Checker Bot",
    icon: Bot,
    x: 1300,
    width: 250,
    height: 160,
    themeColor: "rgb(59,130,246)",
    bgGradient: "from-blue-950/60",
    details: {
      description:
        "An automated web scraper running continuously since 2021 to monitor high-demand inventory. It parses daily data, generates interactive stock maps on GitHub Pages, and sends email alerts—running entirely free via GitHub Actions.",
      tech: ["Python", "BeautifulSoup", "Folium", "GitHub Actions"],
      github: "https://github.com/dtoe07/Oregon-Liquor-Checker-Public",
    },
  },
  {
    id: "proj2",
    type: "project",
    name: "Wi-Fi Network Penetration",
    icon: Wifi,
    x: 2100,
    width: 280,
    height: 200,
    themeColor: "rgb(168,85,247)",
    bgGradient: "from-purple-950/60",
    details: {
      description:
        "Assessed network security posture by capturing WPA2 handshakes with Bettercap and executing dictionary attacks via Hashcat. Conducted comprehensive Nmap scans for port enumeration and service identification to analyze vulnerabilities.",
      tech: ["Bettercap", "Hashcat", "Nmap"],
      github:
        "https://github.com/dtoe07/cs496-network-security/blob/main/hw3/hw3.md",
    },
  },
  {
    id: "proj3",
    type: "project",
    name: "Providence Productivity Tracker",
    icon: Activity,
    x: 3000,
    width: 320,
    height: 180,
    themeColor: "rgb(249,115,22)",
    bgGradient: "from-orange-950/60",
    details: {
      description:
        "Built a custom, standalone web tool for the Providence Preregistration team to log daily tasks, measure time, and optimize workflows. Designed for voluntary offline use, the tool features daily productivity calculations and a department contact search function that significantly improved team adoption.",
      tech: ["HTML/CSS", "JavaScript", "UI/UX"],
      github: "https://github.com/dtoe07/Providence-Productivity-Tracker",
    },
  },
  {
    id: "work1",
    type: "work", // Changed from 'school' to 'work'
    name: "Providence Health & Services",
    icon: Briefcase,
    x: 3900,
    width: 320,
    height: 200,
    themeColor: "rgb(225,29,72)", // Rose color to fit healthcare/work
    bgGradient: "from-rose-950/60",
    details: {
      degree: "Registrar", // Renders as the bold role title
      description:
        "Reached out to patients prior to visits to update demographic and insurance information while providing strong customer support and caregiver services. Handled accurate entry of sensitive data following HIPAA standards and collaborated with the team to complete daily queues efficiently. I also developed the Providence Productivity Tracker tool during my time here.",
      highlights: [
        "Patient Communication",
        "HIPAA Data Compliance",
        "Built Productivity Tracker",
      ],
    },
  },
];
