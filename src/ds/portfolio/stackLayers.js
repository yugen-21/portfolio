/** The layers a project stack is sorted into, in display order. */
export const LAYERS = [
  ["Frontend", ["React JS", "Tailwind CSS", "Bootstrap", "CSS", "styled-components", "Storybook"]],
  ["Backend", ["Node.js", "Express", "Python FastAPI"]],
  ["Data", ["MySQL", "PostgreSQL", "MongoDB"]],
  ["AI", ["Claude"]],
  ["Infra", ["Azure Cloud"]],
];
/** A project's stack sorted into [label, items] rows by layer, unknowns last under "Other". */
export function groupStack(stack = [], layers = LAYERS) {
  const rows = layers
    .map(([label, members]) => [label, stack.filter((s) => members.indexOf(s) !== -1)])
    .filter((r) => r[1].length);
  const known = layers.reduce((all, l) => all.concat(l[1]), []);
  const other = stack.filter((s) => known.indexOf(s) === -1);
  if (other.length) rows.push(["Other", other]);
  return rows;
}
