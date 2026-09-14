# AGENTS.md

Homemade By Colleen. Single source of truth for this site: hard rules, product
brief and design system. Replaces the former DESIGN.md and PRODUCT.md.

---

# 1. HARD RULES

These are not preferences. A change that breaks one of them is wrong even if it
looks right.

### 1.1 Never use an em dash
The character U+2014 is banned everywhere: visible copy, headings, comments,
section banners, commit messages, alt text, meta descriptions. This holds even
when the source copy from the old WordPress site used one. Rewrite the sentence
instead:

| Instead of an em dash | Use |
|---|---|
| Parenthetical aside | commas, or parentheses |
| Sentence that pivots | a period and a new sentence |
| Label followed by explanation | a colon |
| Items in a list | a comma |

Check before every commit:

    grep -rnP '\x{2014}' . --include=*.html --include=*.css --include=*.js --include=*.md \
      --exclude-dir=scrape --exclude-dir=.git

Any output at all means the commit is not ready.

### 1.2 The code is English only
Every comment, identifier, class name, string, filename and commit message is in
English. No exceptions, including throwaway comments and scratch scripts that end
up committed. The conversation may be in Spanish; the repository is not.

### 1.3 Verify before reporting
Do not describe a layout as fixed without having measured it. Render the page in
headless Chrome, read the geometry out of the DOM, and report the numbers.
Screenshots of the full page are unreliable in this setup (blank captures under
virtual time); they only work on a small standalone test page with no scrolling.
Two known measurement traps:

- Under `--virtual-time-budget`, CSS transitions do not advance, so a `.reveal`
  element reads as `opacity: 0` even when it is working. Check for the `in` class
  instead.
- A grid row is sized by its own items, so an image left in flow feeds its
  intrinsic height back into the row it is supposed to be matching.

### 1.4 Do not invent content
Text and data come from the real site. Nothing is merged, padded, summarised or
added. A table stays a table. Repeated CTAs stay repeated.

---

# 2. PRODUCT

register: brand

## Purpose
Homemade By Colleen is a family-run meal prep and delivery service in the South
Hills of Pittsburgh, PA. Fresh, never-frozen, home-cooked meals delivered weekly.
No subscription: customers order only when they want. Roughly 500 families
served, 30,000+ meals/year, 8+ years operating. The homepage has one job: get a
first order started ($15 off).

## Users
Primary: mothers 30-45 in the South Hills running a full household, short on
time, unwilling to feed their family takeout. Secondary: travelling professionals
and retirees who want real food without shopping and cooking. They arrive on
mobile, mid-day, often deciding "do I cook tonight?"

Scene sentence: a Pittsburgh mom, 38, checking this on her phone at 4:50pm in a
bright minivan in the school pickup line, one hand free, glare on the screen,
deciding whether to cook tonight. This gives us light theme, very high contrast,
oversized touch targets, one dominant CTA per fold.

## Brand voice
Warm, plain-spoken, first-person. Colleen speaks directly ("Hey Momma, YOU don't
have to do it all alone"). Proudly small and local; explicitly anti-industrial
(names Sysco as the enemy). Family recipes across 3 generations. Never corporate,
never clinical, never precious.

Three physical-object words: warm, sturdy, hand-labeled. Like a jar of preserves
with a hand-written label, or a chalkboard menu at a farmers market stall.

## Anti-references
- The current WordPress site: Astra + Elementor template, 3 Google Font families
  at every weight, 43 stylesheets, keyword-stuffed duplicate H2s, 8 flat
  competing CTAs, zero food photography.
- National meal-kit brands (HelloFresh, Factor): clean white, sage green, rounded
  cards, soft shadows, stock-smiling models. Colleen is the opposite of a factory
  and must not look like one.
- The sage-green-plus-script-serif "artisanal food" reflex. Colleen's real
  palette is already high-chroma lime and saturated yellow; that is the voice.

## Strategic principles
1. One dominant action: START YOUR ORDER. Everything else is secondary or
   tertiary.
2. Food must be visible. A meal service that shows no meals cannot sell.
3. Local specificity is the moat: 8 named towns, a real street address, a real
   phone number.
4. Colleen is a person, not a logo. Her voice and face carry more weight than any
   badge.

---

# 3. DESIGN

## Aesthetic lane
Warm neobrutalism. Named reference: Gumroad's 2021 flat-block rebrand crossed
with a farmers-market produce-crate stencil. Hard 3px ink borders, flat blocks of
chartreuse and saturated yellow on warm cream, hard offset shadows with no blur,
rotated die-cut labels, a strict visible grid. Not editorial-typographic. Not
canonical cold neobrutalism: ink is a deep blue-black, never #000; ground is
cream, never #fff.

Architecture inherited from nicepest.com: 3-layer oklch color, semantic tracking
tokens, per-component variable namespaces, hard offset shadow via pseudo-element,
tokenized lift/press gestures, full prefers-reduced-motion coverage.

## Color (strategy: full palette, 4 named roles)
All oklch. Contrast measured, not assumed.

Primitives

    --c-ink            oklch(20.0% 0.040 252)   #071728
    --c-ink-soft       oklch(42.0% 0.030 252)   #414e5d
    --c-cream          oklch(97.4% 0.014 84.6)  #fbf6ec
    --c-cream-2        oklch(94.5% 0.022 84.6)  #f4ecdd
    --c-paper          oklch(99.5% 0.004 84.6)  #fffdfa
    --c-green          oklch(75.9% 0.209 131.7) #7dca04   (brand, unchanged)
    --c-green-deep     oklch(46.0% 0.130 138)   #2e6813
    --c-yellow         oklch(86.5% 0.177 92.8)  #fbce01   (brand, unchanged)
    --c-yellow-pale    oklch(95.5% 0.070 92.8)  #fff0bb

Measured contrast (all AA or better)

    ink on cream        16.79:1      ink on green        8.89:1
    ink on cream-2      15.41:1      ink on yellow      12.00:1
    ink on paper        17.84:1      ink on yellow-pale 15.87:1
    ink-soft on cream    7.83:1      cream on ink       16.79:1
    paper on green-deep  6.68:1

Hard rule: never light text on `--c-green` (2.01:1) or `--c-yellow` (1.49:1).
Those blocks always take ink text.

## Typography (2 families, 3 weights each)
Display: Bricolage Grotesque (variable, opsz 12-96, wght 400-800). Chosen because
its design premise is deliberate imperfection and DIY roughness: literally
"homemade". Not a reflex pick.
Body: Hanken Grotesk 400/500/700. Humanist, warm, unfussy. Not Inter.

Semantic tracking tokens (from nicepest):

    --tr-display -0.03em | --tr-heading -0.015em | --tr-label 0.12em
    --tr-button 0.05em   | --tr-nav 0.02em       | --tr-numeral -0.05em

Scale: clamp() fluid, ratio >= 1.25. Body 65-75ch. All-caps only on labels,
buttons and nav. Source copy that arrives in caps is handled with
`text-transform`.

## Elevation
No blur, ever. Hard offset shadow via `::after` pseudo-element, solid ink.

    --sh-x -6px  --sh-y 6px           (blocks)
    --btn-sh-x -5px --btn-sh-y 5px    (buttons, press collapses to 0)

Borders: `--bd-hard` 3px solid `var(--c-ink)`. Hairlines 1.5px for internal grid
rules. Radius: 0 everywhere except pills (999px).

## Components
    --btn-*   primary (yellow fill), secondary (transparent + ink border),
              tertiary (underline)
    --blk-*   flat color block with hard border + offset shadow
    --lbl-*   kitchen label: rotated die-cut sticker, hard border, offset shadow.
              The named system that carries the source's repeated section labels.
              Varied rotation and fill per instance; never a tiny tracked caps
              line.
    --pill-*  delivery-area tags

## Motion
ease-out-expo only, no bounce. Transform and opacity only, never layout
properties. Staggered entrance via IntersectionObserver. Button lift on hover,
shadow collapse on press. A full prefers-reduced-motion block disables all of it.

---

# 4. STRUCTURE

Flat files at the repo root; no directory per page.

    index.html                        home
    meal-prep-delivery-service.html   internal page, linked from "How it works"
    styles.css                        shared design system, linked by every page
    build-assets/                     images and SVGs
    sitemap_index.xml + *-sitemap.xml mirror of the WordPress sitemap (20 URLs)
    robots.txt
    vercel.json                       cleanUrls: true
    scrape/                           reference only, excluded from the deploy

Page-specific components live in that page's own inline `<style>` block, placed
after the `styles.css` link so the cascade lets a page override a shared rule
where it genuinely differs. Anything two pages share belongs in `styles.css`.

Internal links are relative file paths (`meal-prep-delivery-service.html`), never
absolute (`/meal-prep-delivery-service/`). An absolute path resolves to the
filesystem root when the file is opened directly, which breaks local navigation.
`trailingSlash` must stay off in vercel.json for the same reason.

No breadcrumbs anywhere on the site.
