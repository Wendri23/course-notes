<%*
// Files a new note into <Course>/Concepts or <Course>/Chapters with the right frontmatter.
// Courses = top-level folders that contain an index.md (create one with the "New course" template).
const cache = app.metadataCache;
const courses = app.vault.getRoot().children
  .filter(f => f.children && f.children.some(c => c.name === "index.md"))
  .map(f => f.name)
  .sort();
if (courses.length === 0) { new Notice("No course yet: run the 'New course' template first."); return; }

let title = tp.file.title;
if (title.startsWith("Untitled") || title.startsWith("Sans titre")) {
  title = await tp.system.prompt("Note's title");
  if (!title) return;
}
const course = courses.length === 1 ? courses[0] : await tp.system.suggester(courses, courses, false, "Course");
if (!course) return;
const type = await tp.system.suggester(["Concept", "Chapter"], ["concept", "chapter"], false, "Type");
if (!type) return;

const fmOf = f => cache.getFileCache(f)?.frontmatter ?? {};
const chapters = app.vault.getMarkdownFiles()
  .filter(f => f.path.startsWith(course + "/Chapters/"))
  .sort((a, b) => (fmOf(a).chapter ?? 99) - (fmOf(b).chapter ?? 99));

// Note names must be unique across courses: on a collision, add the course in brackets.
const aliases = [];
const clash = cache.getFirstLinkpathDest(title, "");
if (clash && clash.path !== tp.file.path(true)) {
  aliases.push(title);
  title = `${title} (${course})`;
  new Notice(`"${aliases[0]}" already exists, renamed to "${title}"`);
}

const today = tp.date.now("YYYY-MM-DD");
let fm;
if (type === "chapter") {
  const next = Math.max(0, ...chapters.map(f => Number(fmOf(f).chapter) || 0)) + 1;
  const n = await tp.system.prompt("Chapter number", String(next));
  fm = [
    "type: chapter",
    `course: ${course}`,
    `chapter: ${Number(n) || next}`,
    "status: draft",
    "tags: []",
    `aliases: [${aliases.join(", ")}]`,
    `created: ${today}`,
  ];
} else {
  const names = ["(none)", ...chapters.map(f => `${fmOf(f).chapter ?? "?"}. ${f.basename}`)];
  const values = ["", ...chapters.map(f => f.basename)];
  const source = await tp.system.suggester(names, values, false, "Source chapter");
  fm = [
    "type: concept",
    `course: ${course}`,
    "status: draft",
    `source: "[[${source ?? ""}]]"`,
    "tags: []",
    `aliases: [${aliases.join(", ")}]`,
    `created: ${today}`,
  ];
}

await tp.file.move(`/${course}/${type === "chapter" ? "Chapters" : "Concepts"}/${title}`);
tR += "---\n" + fm.join("\n") + "\n---\n";
tR += type === "chapter"
  ? "## 1. \n- [[]] : \n\n## Review questions\n- ? → [[]] ()\n"
  : "**" + (aliases[0] ?? title) + "** : \n\n**Links** : \n";
%>