export const PROJECTS = [
  {
    year: "2023",
    name: "University Outpass System",
    caption: "Student Dashboard",
    art: "outpass",
    bg: "linear-gradient(155deg,#1b0b3a 0%,#2d1063 55%,#160732 100%)",
    role: "Student-side dashboard",
    problem:
      "Hostel out-pass approvals run on paper, so a student has no way to see where their request stands, and overlapping leave dates slip through unnoticed.",
    blurb:
      "An out-pass management system for university hostels. I worked only on the student-side dashboard: creating a pass, tracking it through approval, and showing it at the gate.",
    bullets: [
      "Six states to an out-pass, and you always know which one you are in",
      "The form already knows who you are, and it refuses dates that clash with a pass you already hold",
      "Show an approved pass at the gate straight from your phone",
      "Staying out longer? Extend it. Changed your mind? Cancel it. No starting over",
    ],
    stack: ["React JS", "CSS", "Node.js", "Express", "MySQL"],
    links: [{ label: "GitHub", href: "https://github.com/yugen-21/Out-pass-system-student-dashboard" }],
  },
  {
    year: "2024",
    name: "Votechain",
    caption: "32-Hour Hackathon",
    art: "votechain",
    bg: "#0b0416",
    role: "32-hour hackathon build",
    problem:
      "Digital voting only counts for something if the record cannot be quietly altered afterwards, and if one person cannot vote twice.",
    blurb:
      "A decentralised voting web application, built in a 32 hour hackathon. Votes are cast through a smart contract, so the record is transparent and tamper resistant.",
    bullets: [
      "Voter ID, Aadhaar, an OTP to your registered number and a geolocation check, all before you get near a ballot",
      "You only ever see your own constituency",
      "The session closes itself, and the count stays open to everyone",
      "Built end to end in 32 hours, and it placed second in the blockchain domain among 100 teams",
    ],
    stack: ["React JS", "styled-components", "Node.js", "MySQL"],
    links: [{ label: "GitHub", href: "https://github.com/smruthi49/VoteChain" }],
  },
  {
    year: "2025",
    name: "Medibase",
    caption: "Encrypted Medical Records",
    art: "medibase",
    bg: "linear-gradient(165deg,#e9dcff 0%,#c8b0f0 60%,#a98ede 100%)",
    light: true,
    role: "Encrypted medical file storage and sharing",
    problem:
      "Families juggling several specialists keep medical records across WhatsApp, email and paper, so documents go missing and the same history gets explained again. Once a record is sent it is gone, with no way to take the access back, and healthcare data has one of the highest breach rates of any industry.",
    blurb:
      "A fully patient controlled medical file management system. Every record lives in one place, encrypted, and every piece of access to it is granted by the patient, to one doctor, for one session.",
    bullets: [
      "Your records, your call: who sees them, which ones, and for how long",
      "Files sit encrypted and decrypt only at the moment you open them",
      "A doctor gets a verified, view only link that works for one person at a time",
      "Every share is a session you can watch and close",
    ],
    stack: ["React JS", "Node.js", "MongoDB", "styled-components", "CSS"],
    links: [{ label: "GitHub", href: "https://github.com/yugen-21/Medibase" }],
  },
  {
    year: "2025",
    name: "Adloom AI",
    caption: "Billboard Marketplace",
    art: "adloom",
    bg: "linear-gradient(200deg,#6d28d9 0%,#3b0f7a 48%,#12042a 100%)",
    role: "Recommendation engine + platform features",
    problem:
      "Booking outdoor advertising means calling suppliers one by one, and brands have no way of knowing which billboards actually suit them.",
    blurb:
      "A billboard marketplace for brands that want to do outdoor advertising easily. I specifically built the recommendation engine.",
    bullets: [
      "Give it a brand, get back a bundle of billboards with the reasoning attached",
      "It works out who the brand sells to, then picks frequency or visibility: several boards along a route for McDonald's, one large board in the right place for Gucci",
      "Proximity matching on Google Places and geohash, then semantic ranking on how well each board fits",
      "Built on a proprietary location database covering the whole of the UAE, demographic by demographic",
    ],
    stack: ["React JS", "Tailwind CSS", "Python FastAPI", "PostgreSQL"],
    links: [{ label: "View live", href: "https://adloom.ai/" }],
  },
  {
    year: "2025",
    name: "Shelvefy AI",
    caption: "Retail Shelf Space",
    art: "shelvefy",
    bg: "#100526",
    role: "Recommendation engine + platform features",
    problem: "Large FMCG brands hold contracts with the stores, so a new brand has almost no way into physical retail.",
    blurb:
      "A retail shelf space marketplace for brands expanding into physical stores, where large FMCG contracts make it hard for a new brand to enter.",
    bullets: [
      "Tells a new brand exactly where it belongs: which aisle, which store, which part of which city",
      "Not just shops. A mall space, a salon reception for a cosmetic, a gym reception for a protein powder",
      "Weighs demographic fit, footfall, location and space type in a single call",
      "Semantic search on pgvector, with HNSW indexing cutting search time by 60%",
    ],
    stack: ["React JS", "Tailwind CSS", "Python FastAPI", "PostgreSQL"],
    links: [],
  },
  {
    year: "2026",
    name: "MedullaAI",
    caption: "Built Solo",
    art: "medulla",
    bg: "#07020f",
    role: "Sole engineer, built head to toe",
    problem:
      "Hospital governance is fragmented, reactive and manual. Ten disconnected tools, ten owners, ten reports: each holds a fragment and nobody holds the picture, so incidents, risks and complaints surface too late.",
    blurb:
      "An AI governance platform for hospitals. It sits between what the organisation senses and what its leadership knows, so one event enters once and cascades into a safety record, a risk register entry, a regulatory notification and a board KPI, all raised together.",
    bullets: [
      "Nine intelligence domains, from clinical safety to cybersecurity, built solo",
      "One event enters once and lands everywhere it matters: a safety record, a risk entry, a regulatory notification and a board KPI, raised together",
      "A near miss in pharmacy is survey ready before anyone starts assembling evidence",
      "Ask it anything in plain English. It answers from real records, and says so when it is not sure",
    ],
    stack: ["React JS", "Tailwind CSS", "Storybook", "Python FastAPI", "PostgreSQL", "Azure Cloud"],
    links: [{ label: "View live", href: "https://medulla-ai-frontend.vercel.app" }],
  },
  {
    year: "2026",
    name: "BlockMove",
    caption: "Breakbulk Logistics",
    art: "blockmove",
    bg: "linear-gradient(145deg,#2a1052 0%,#0d0320 70%)",
    role: "Freight forwarder workspace",
    problem:
      "Quotes for non containerised cargo are built by phone and PDF, and every change restarts the clock, so a quoting cycle runs three weeks. A single move spans five agencies, three police forces and two crane operators, all coordinating over WhatsApp, and a project can carry 200 to 2,000 moves with no shared system.",
    blurb:
      "A coordination platform for cargo that does not fit in a container: project cargo, breakbulk, out of gauge and heavy lift. Freight forwarders and EPC contractors run one workspace per move, from quote through to confirmed delivery.",
    bullets: [
      "42 stakeholder types, 243 documents and 7 phases, modelled into one workflow",
      "Quoting cycles that ran three weeks on phone and PDF now run in hours",
      "An AI risk heatmap per job, showing what actually sits on the critical path",
      "See who has gone silent, flag it, and switch to someone else",
    ],
    stack: ["React JS", "Tailwind CSS", "Python FastAPI", "PostgreSQL", "Azure Cloud"],
    links: [{ label: "View live", href: "https://blockmove-frontend.vercel.app/" }],
  },
];

export const ROLES = ["Full Stack", "Software", "Product First", "Founding", "AI First"];
