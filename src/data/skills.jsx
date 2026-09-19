import { LuSparkles, LuCompass, LuRocket } from "react-icons/lu";

/**
 * The single image the skill cards split out of: a cat on a ledge under a
 * swirling violet sky, stored already turned to landscape. The position keeps
 * the cat in frame where a narrow card crops the sides.
 */
export const SKILLS_COVER = "/images/cat-starry-sky.webp";
export const SKILLS_COVER_POSITION = "12% 70%";

const ICON = { size: 22, "aria-hidden": true };

export const SKILLS = [
  {
    title: "AI native product building",
    description:
      "AI at the core, not bolted on: recommendation engines that explain their picks, and a hospital platform you can question in plain English.",
    bgColor: "var(--violet-050)",
    textColor: "var(--ink-500)",
    icon: <LuSparkles {...ICON} />,
  },
  {
    title: "Product context, research and ideation",
    description:
      "Turning a founder's business goals into technical requirements, scope documents, pitch decks and a UI worth building.",
    bgColor: "var(--violet-700)",
    textColor: "var(--white-warm)",
    icon: <LuCompass {...ICON} />,
  },
  {
    title: "Shipping, deployment and pipelining",
    description:
      "Sole developer from first commit to production: CI/CD automation, Azure Cloud deployments and MVPs shipped end to end.",
    bgColor: "var(--ink-400)",
    textColor: "var(--white-warm)",
    icon: <LuRocket {...ICON} />,
  },
];
