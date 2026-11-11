<%*
// Scaffolds a course: <Course>/index.md (course MOC), <Course>/Chapters, <Course>/Concepts.
// The course appears on the site's dashboard automatically (read from index.md frontmatter).
const name = (await tp.system.prompt("Course name (e.g. AMSI)"))?.trim();
if (!name) return;
if (app.vault.getAbstractFileByPath(name + "/index.md")) { new Notice(`Course "${name}" already exists`); return; }

const palette = {
  "Teal": "#0f766e", "Violet": "#7c3aed", "Amber": "#c2410c", "Rose": "#be123c",
  "Blue": "#1d4ed8", "Green": "#15803d", "Fuchsia": "#a21caf", "Slate": "#475569",
};
let color = await tp.system.suggester(
  [...Object.keys(palette).map(k => `${k} ${palette[k]}`), "Custom hex…"],
  [...Object.values(palette), "custom"], false, "Accent colour");
if (!color) return;
if (color === "custom") color = (await tp.system.prompt("Hex colour", "#0f766e"))?.trim() || "#0f766e";
const description = (await tp.system.prompt("One-line description", "")) ?? "";

for (const sub of ["", "/Chapters", "/Concepts"]) {
  if (!app.vault.getAbstractFileByPath(name + sub)) await app.vault.createFolder(name + sub);
}
await tp.file.move(`/${name}/index`);
tR += `---
title: ${name}
type: course
course: ${name}
aliases: [${name}]
color: "${color}"
description: "${description.replace(/"/g, "'")}"
created: ${tp.date.now("YYYY-MM-DD")}
---
## Chapters
| # | Chapter | Topic |
|---|---|---|

## Course map
\`\`\`mermaid
flowchart TD
C1[1. First chapter] --> C2[2. Next chapter]
\`\`\`

## Key concepts
`;
%>