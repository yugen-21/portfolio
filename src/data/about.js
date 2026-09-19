/**
 * The quotes the annotated-quote section cycles through, each with Shama's own
 * note in the margin beside it. All three are The Office.
 *
 * `via` is a second attribution, for a quote being quoted by somebody who
 * thought it was theirs — on screen the Gretzky line is a whiteboard gag, with
 * Michael's name written under Gretzky's.
 */
export const QUOTES = [
  {
    text: "I knew exactly what to do. But in a much more real sense, I had no idea what to do.",
    attribution: "Michael Scott",
    note: "Week one as the only developer on a real product. I had never touched Azure. I learnt it on the job, and the pipeline was live by the end of the month.",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    attribution: "Wayne Gretzky",
    via: "Michael Scott",
    note: "I said yes to being the sole developer on two B2B products, end to end, for the same founding team. Both of them shipped.",
  },
  {
    text: "And for my next trick, I will make my career disappear.",
    attribution: "Jim Halpert",
    note: "The one I am never saying. Seven products since 2023, and my name goes on all of them.",
  },
];

export const WORK_HISTORY = [
  {
    when: "Apr 2026, now",
    what: "Full Stack Engineer, contract",
    where: "Independent contract with founding team, Dubai, remote",
    note:
      "Sole developer, end to end, on two early-stage B2B SaaS products for the same founding team: Medulla AI, a hospital governance and compliance platform for the GCC and UAE, and BlockMove, a logistics coordination platform for non-containerized cargo. Set up the CI/CD automation, and learnt Azure Cloud on the job.",
  },
  {
    when: "Sep 2025, Feb 2026",
    what: "Founding Engineer",
    where: "Venture Cube, Dubai, remote",
    note:
      "Built multiple MVPs end to end, at least four of them. On Shelvefy, a retail shelf discovery platform, and Adloom, a billboard marketplace, I was the sole developer of the recommendation engine, including the entire database behind it.",
  },
  {
    when: "Apr 2025, Aug 2025",
    what: "Full Stack Web Developer, internship",
    where: "Venture Cube, Dubai, remote",
    note: "Worked with a team on version one of Deals24, a distressed asset platform for the UAE market.",
  },
  {
    when: "Jun 2024",
    what: "Research Intern",
    where: "IISc Bangalore, remote",
    note: "Built a Python package that extracts data from chromatograms into a JSON database, using line detection and optical character recognition.",
  },
];

export const EDUCATION = [
  {
    when: "Sep 2021, Jul 2025",
    what: "B.Tech, Computer Science and Engineering",
    where: "Shiv Nadar University Chennai",
    note: "Specialisation in Internet of Things. CGPA 9.236 of 10, first class with distinction.",
    list: [
      "Overall Academic Excellence Award for the class of 2021 to 2025",
      "Semester topper in semesters 3, 5 and 6",
      "Merit scholarship for academic performance in 2024 to 2025",
    ],
  },
  {
    when: "2019, 2021",
    what: "Higher secondary education",
    where: "Suguna PIP School, Coimbatore",
    note: "95.6%.",
  },
  {
    when: "2017, 2019",
    what: "Secondary school education",
    where: "Suguna PIP School, Coimbatore",
    note: "94.2%.",
  },
];

const ICON = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@12/icons/${slug}.svg`;

const mk = (pairs) =>
  pairs.map(([slug, title]) => ({ src: ICON(slug), alt: title, title, filter: "brightness(0) invert(1)" }));

export const TECH = mk([
  ["react", "React JS"],
  ["tailwindcss", "Tailwind CSS"],
  ["fastapi", "Python FastAPI"],
  ["postgresql", "PostgreSQL"],
  ["nodedotjs", "Node.js"],
  ["express", "Express"],
  ["mysql", "MySQL"],
  ["mongodb", "MongoDB"],
  ["storybook", "Storybook"],
  ["css3", "CSS"],
  ["microsoftazure", "Azure Cloud"],
]);
