<%*
// Scaffolds a course: <Course>/index.md (course MOC), <Course>/Chapters, <Course>/Concepts.
// The course appears on the site's dashboard automatically (read from index.md frontmatter).
const name = (await tp.system.prompt("Course name (e.g. AMSI)"))?.trim();
if (!name) return;
if (app.vault.getAbstractFileByPath(name + "/index.md")) { new Notice(`Course "${name}" already exists`); return; }

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
description: "${description.replace(/"/g, "'")}"
created: ${tp.date.now("YYYY-MM-DD")}
---
## Course map
\`\`\`mermaid
flowchart TD
C1[1 · First chapter] --> C2[2 · Next chapter]
\`\`\`

## Key concepts
`;
%>