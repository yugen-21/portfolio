import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu";

/**
 * The three "where to find me" cards at the foot of the landing page.
 * `bg` / `fg` are the card face and its text; `accent` tints the glow in the
 * icon panel; `light` flips the hairlines and badge for a pale face.
 */
export const CONTACT = [
  {
    name: "GitHub",
    handle: "yugen-21",
    role: "Code",
    description: "The code behind most of the projects on this site.",
    href: "https://github.com/yugen-21",
    external: true,
    bg: "var(--ink-400)",
    fg: "var(--white-warm)",
    accent: "var(--violet-400)",
    icon: <LuGithub aria-hidden="true" />,
  },
  {
    name: "LinkedIn",
    handle: "a-shama-anjum",
    role: "Work history",
    description: "Roles, projects and the teams I have built with.",
    href: "https://www.linkedin.com/in/a-shama-anjum/",
    external: true,
    bg: "var(--violet-700)",
    fg: "var(--white-warm)",
    accent: "var(--lilac-300)",
    icon: <LuLinkedin aria-hidden="true" />,
  },
  {
    name: "Email",
    handle: "shamaazath@gmail.com",
    role: "Say hello",
    description: "The quickest way to reach me about a role or a project.",
    href: "mailto:shamaazath@gmail.com",
    external: false,
    bg: "var(--violet-050)",
    fg: "var(--ink-500)",
    accent: "var(--violet-400)",
    light: true,
    icon: <LuMail aria-hidden="true" />,
  },
];
