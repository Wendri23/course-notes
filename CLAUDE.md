# CLAUDE.md — Course notes (Quartz 5 + Obsidian)

Ce repo publie un vault Obsidian (`content/`) en site Quartz (`wendri23.github.io/course-notes`).
Le site est fait pour **lire et apprendre**. Toute l'UI autour des notes (titre, fil d'Ariane, chapitres,
concepts liés, progression, graphe, glossaire) est **générée par les plugins maison** à partir du
frontmatter, des dossiers et des liens. La note, elle, est rendue telle quelle.

> Règle d'or : **ce que le site génère déjà, la note ne l'écrit pas.**
> Avant d'ajouter un bloc dans une note, vérifier qu'il n'est pas déjà dans le tableau « Généré automatiquement » ci-dessous.

Spec de design : `ui-handoff/README.md` (+ `ui-handoff/tokens.css`, `ui-handoff/wireframes/`). Styles : `quartz/styles/custom.scss`.
Plugins maison : `plugins/*` (logique commune dans `plugins/course-context/dist/shared.js`).

---

## 1. Ce que le site génère (ne jamais le réécrire dans une note)

| Élément affiché | Généré par | Alimenté par |
|---|---|---|
| Titre H1 de la page | `course-context` (PageHead) | `title:` du frontmatter, sinon nom du fichier |
| Fil d'Ariane cours › chapitre | `course-context` | `course:` + `source:` |
| Méta « Draft · created … · updated … » | `course-context` | `status:`, `created:`, dates git |
| Intro de la page cours + stats + Continue | `course-context` | `description:` du `index.md` du cours |
| **On this page** (rail droit) | `table-of-contents` (profondeur max 3) | les titres `##` / `###` de la note |
| Lignes « Chapters » sur la page cours | `learning-path` | notes `type: chapter`, triées par `chapter:` |
| **Concepts in this chapter** (chips ✓/○) | `learning-path` | liens `[[Concept]]` du chapitre (dans l'ordre) + concepts dont `source:` = ce chapitre |
| Previous / Next chapter | `learning-path` | `chapter:` |
| **Related concepts** (chips ✓/○) | `course-context` (marque la ligne, masquée en CSS) + `learning-path` (chips) | tous les liens sortants vers un concept : dans le texte **et** dans la ligne `**Links** :` |
| **Mentioned in** | `learning-path` | backlinks (cours, chapitres, concepts) |
| Marques ✓/○ après chaque lien interne | `course-context` (style) | liens vers chapitres et concepts |
| ← Back to … (bas de la colonne principale, avant le footer) | `course-back` | `source:` puis `course:` |
| Bouton afficher / masquer le rail (état mémorisé, colonne centrée quand fermé) | `course-context` (PageHead) | localStorage `cn-rail` |
| Progression / opened ✓○ | `course-context` (localStorage) | — |
| Glossaire A–Z | `glossary` | tous les concepts + leurs `aliases:` |
| Pages topic | `tag-page` + `learning-path` | `tags:` |
| Graphe | `course-graph` | `type:`, `course:`, liens |
| Zoom plein écran des diagrammes | `diagram-viewer` | blocs ```` ```mermaid ```` |
| KaTeX | `latex-lazy` (chargé seulement si la page a des maths) | `$…$`, `$$…$$` |

Conséquences directes (les doublons à éviter) :

- **Pas de `# Titre` dans le corps** → doublon du H1 généré. Si le titre affiché doit différer du nom de fichier, utiliser `title:` (ou mieux : renommer le fichier).
- **Pas de section `## Outline`** dans les chapitres → doublon de *On this page* (les `## N. Section` forment déjà le plan) **et** de *Concepts in this chapter*.
- **Ligne `**Links** :`** : **obligatoire en bas d'un concept**. Sur le site elle n'apparaît pas telle quelle : elle est masquée et affichée en chips *Related concepts* sous la note (ses liens comptent quand même pour *Mentioned in* et le graphe). Elle doit commencer exactement par `**Links**` en début de paragraphe pour être reconnue. **Interdite dans un chapitre ou un cours** → doublon de Previous/Next, du lien Back et du fil d'Ariane.
- **Pas de tableau `## Chapters`** dans l'`index.md` d'un cours → doublon des lignes Chapters générées.
- **Ne pas répéter `description:`** en première phrase de l'`index.md` d'un cours → elle est déjà affichée en intro.
- Pas de « Voir aussi », « Backlinks », « Progress », sommaire manuel, temps de lecture, résumé auto, quiz, flashcards.

---

## 2. Structure du vault

```
content/
  index.md                 # accueil (title + description seulement)
  <Course>/
    index.md               # type: course  — MOC du cours
    Chapters/<Title>.md    # type: chapter — un fichier par chapitre du cours
    Concepts/<Title>.md    # type: concept — une notion atomique par fichier
  Templates/  Inbox/  Attachments/   # Templates et Inbox ne sont pas publiés
```

- **Une note concept = une notion.** Si une note couvre deux idées qu'on voudrait lier séparément, la scinder.
- **Noms de fichiers uniques dans tout le vault** (la résolution des liens est `shortest`). En cas de collision : `Title (Course)` + l'ancien nom dans `aliases:` (le template *New note* le fait).
- Nom de fichier = nom de la notion en anglais, en Title Case, sans préfixe numérique (`TCP Flow Control.md`, pas `4.3 flow control.md`).
- Toujours créer via les templates Templater **New course** / **New note** (ils posent le bon frontmatter et le bon dossier).

---

## 3. Frontmatter (contrat avec les plugins)

### Cours — `<Course>/index.md`
```yaml
---
title: Reseau             # titre affiché (H1, fil d'Ariane, dashboard)
type: course
course: Reseau            # identifiant ; doit être identique dans toutes les notes du cours
aliases: [Reseau]
description: "Une phrase, affichée en intro de la page cours et sur l'accueil."
created: 2026-11-10
---
```

### Chapitre
```yaml
---
type: chapter
course: Reseau
chapter: 4                # ordre sur le site (prev/next, lignes Chapters)
status: draft             # draft | to-review | reviewed
tags: [topic/protocol, topic/reliability]
aliases: []
created: 2026-11-11
---
```

### Concept
```yaml
---
type: concept
course: Reseau
status: draft
source: "[[Transport Layer]]"   # chapitre parent → fil d'Ariane, Back, Concepts in this chapter
tags: [topic/reliability]
aliases: [Receive window, RcvWindow]
created: 2026-11-11
---
```

Règles :
- `type`, `course` obligatoires partout ; `source` obligatoire sur un concept (sinon il « flotte » hors chapitre).
- `status` : seulement `draft`, `to-review`, `reviewed`.
- `aliases` : sigles, synonymes, noms alternatifs (ils alimentent le glossaire et rendent `[[RcvWindow]]` valide). Pas de variantes de casse inutiles.
- `tags` : **1 à 3 tags `topic/*`** pris dans le vocabulaire contrôlé ci-dessous. Ne pas créer de tag sans raison (chaque tag crée une page topic).
  `topic/protocol` · `topic/architecture` · `topic/performance` · `topic/security` · `topic/routing` · `topic/cryptography` · `topic/physical` · `topic/algorithm` · `topic/addressing` · `topic/reliability` · `topic/hardware` · `topic/wireless`
  AMSI : `topic/modelling` · `topic/uml` · `topic/requirements` · `topic/object-oriented`
- Ne pas mettre de champ qu'aucun plugin ne lit (ex. `color:` n'est lu par rien : le site est noir & blanc).

---

## 4. Gabarits de corps de note

### Concept
```markdown
**Term** : définition en une phrase, avec les mots-clés en **gras**.

<diagramme mermaid optionnel si un schéma explique mieux que le texte>

- fait clé, formule $RcvWindow = RcvBuffer - (LastByteRcvd - LastByteRead)$
- fait clé qui renvoie vers [[TCP Congestion Control]] là où c'est pertinent

## Sous-aspect
…

## X vs Y
| X | Y |
|---|---|
| … | … |

**Links** : [[TCP Segment Structure]] [[TCP Congestion Control]]
```
- Pas de titre. Ouvrir directement sur la définition.
- Les `##` sont des sous-aspects de la notion (ils nourrissent *On this page*). Une note courte peut n'avoir aucun `##`.
- Lier un concept **à sa mention dans le texte** quand il y est cité.
- Dernière ligne : `**Links** : [[A]] [[B]] …` (séparés par une espace, sans `---` avant) = les concepts voisins à explorer ensuite qui ne sont pas déjà liés dans le texte (inutile de les répéter). 2 à 6 liens, uniquement vers des concepts (pas vers le chapitre : c'est `source:`). Le bloc *Related concepts* reprend ses liens **et** ceux du texte.

### Chapitre
```markdown
Chapter 4 — <prof / source>. Une ou deux phrases de contexte (optionnel).

<flowchart mermaid optionnel : carte du chapitre>

## 1. Transport-layer services
- [[Transport Layer Services]] : logical communication between processes ; TCP, UDP, QUIC

## 2. Connection
- [[UDP]] : no frills, 8-byte header, checksum
- [[TCP Segment Structure]] : byte stream, seq/ACK numbers, flags

## Where each mechanism lives        ← section de synthèse, non numérotée
| Mechanism | UDP | TCP |
|---|---|---|

## Review questions
- Why choose UDP rather than TCP? → [[UDP]] (no setup delay, no state, small header)
```
- Les sections du cours sont des `## N. Titre` numérotés : **c'est le plan** (affiché dans *On this page*).
- Sous chaque section : une puce par concept, `- [[Concept]] : mots-clés`. L'ordre des liens = l'ordre des chips *Concepts in this chapter*.
- Sections de synthèse (tableaux comparatifs, diagrammes transverses) : `##` **non numérotés**, après les sections numérotées.
- `## Review questions` toujours en dernier, format unique :
  `- Question? → [[Concept]] (réponse courte)`. Une remarque sur la provenance des questions → blockquote simple juste après.
- Pas d'`## Outline`, pas de `**Links**`, pas de lien vers le cours ou les chapitres voisins (générés).

### Cours — `index.md`
```markdown
## Course map
<flowchart mermaid : chapitres et dépendances>

## Key concepts
**Basics** : [[What is the Internet]] · [[Packet Switching]] · …
**Security** : [[Hash Functions]] · …
```
- Seulement la carte et une sélection de concepts-clés groupés par thème (le reste est dans *All concepts* et le glossaire).

---

## 5. Style Markdown (aligné sur la DA)

DA : noir & blanc, **un seul accent vermillon** réservé à l'UI (progress, focus, hover, TOC active). Bordures 1px, angles droits. Corps 17px, 68ch.

- **Langue : anglais** pour les notes (titres, contenu, alias). Ponctuation actuelle conservée : ` : ` avec espace avant (`**Term** : …`), ` ; ` pour enchaîner.
- **Titres** : `##` pour les sections, `###` rarement, **jamais `####`** (hors TOC, profondeur 3). Pas de `#`.
- **Pas de `---`** dans le corps : l'espacement des `##` suffit (les séparateurs étaient appliqués de façon incohérente).
- **Gras** pour les mots-clés, *italique* pour les termes cités. **Pas de `==surlignage==`** (il utiliserait l'accent, hors budget).
- **Pas de callouts `> [!…]`** (blocs colorés, contraires à la DA). Une remarque → blockquote simple `> …`.
- **Tableaux** : pour toute comparaison « X vs Y » ou matrice ; ligne vide avant et après ; en-têtes courts (affichés en petites capitales).
- **Mermaid** : `flowchart TD/LR` ou `sequenceDiagram` (+ `classDiagram` pour les notes UML d'AMSI, **sans `<<stéréotype>>`** : le rendu repasse le source par `innerHTML` et le mange ; écrire `class A["A {abstract}"]`) ; libellés courts, `<br/>` pour couper ; **pas de `style` / `classDef` / couleurs** (le thème gère le N&B et le dark mode). Un diagramme par idée ; le viewer plein écran gère les gros schémas.
  - ⚠️ **Un libellé (nœud ou flèche) ne commence jamais par `1. `, `- `, `* `, `+ `, `# ` ou `> `** : Mermaid lit les libellés comme du Markdown et affiche « Unsupported markdown: list ». Numéroter avec ` · ` : `C1[1 · Internet overview]`, `-- "2 · certificate" -->` (même format que les lignes Chapters du site).
- **Maths** : `$…$` en ligne, `$$…$$` en bloc. Pas de LaTeX pour un simple nombre.
- **Code / valeurs littérales** : `` `gaia.cs.umass.edu` ``, numéros de port, noms de champs.
- **Liens** : toujours en wikilink `[[Note]]` ou `[[Note|libellé]]` ; pas de lien vers une note inexistante sauf si elle va être créée dans la foulée (lien cassé = rendu grisé pointillé).
- **Images** : dans `content/Attachments/`, intégrées avec `![[file.png]]`, seulement si un schéma mermaid ne suffit pas.

---

## 6. Workflow pour Claude

Quand on me demande d'écrire ou de retravailler une note :
1. Lire le chapitre `source:` et les concepts voisins pour réutiliser les noms existants (ne pas créer `TCP flow control` si `TCP Flow Control` existe ; ajouter un alias à la place).
2. Appliquer le gabarit du §4 et le frontmatter du §3 ; `created:` = date du jour.
3. Nouveau concept → l'ajouter aussi comme puce `- [[Concept]] : …` dans la bonne section du chapitre.
4. Vérifier avant de rendre la main (chaque commande doit ne rien afficher), puis un build : `npx quartz build`.
   ```bash
   grep -rlE '^# |^## Outline' content --include=*.md --exclude-dir=Templates
   ```
   ```bash
   grep -l '^\*\*Links\*\*' content/*/Chapters/*.md content/*/index.md
   ```
   ```bash
   grep -L '^\*\*Links\*\*' content/*/Concepts/*.md
   ```
   ```bash
   awk 'FNR==1{n=0} /^---$/{n++} n==3{print FILENAME; nextfile}' content/*/*/*.md
   ```
5. Ne pas toucher aux plugins ni au CSS pour « faire rentrer » une note : c'est la note qui s'adapte au contrat.

---

## 7. Écarts connus

- Le handoff parle d'un champ `order` pour les chapitres : le code utilise `chapter:` (c'est `chapter:` qui fait foi).
- Le dossier du cours est suivi par git en `content/reseau/` (minuscules) alors qu'il s'appelle `Reseau` sur disque : les URLs déployées sont en `/reseau/…`.

Migration v1 faite le 2026-11-12 : templates nettoyés, H1 / `## Outline` / `---` / `**Links**` retirés des chapitres, review questions en puces, `color:` supprimé. Ligne `**Links**` des concepts masquée et rendue en chips *Related concepts* (`course-context` + `learning-path` + `custom.scss`).
