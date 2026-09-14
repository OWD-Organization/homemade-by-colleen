# DESIGN.md

## Aesthetic lane
Warm neobrutalism. Named reference: Gumroad's 2021 flat-block rebrand crossed with a
farmers-market produce-crate stencil. Hard 3px ink borders, flat blocks of chartreuse and
saturated yellow on warm cream, hard offset shadows with no blur, rotated die-cut labels,
a strict visible grid. Not editorial-typographic. Not canonical cold neobrutalism:
ink is a deep blue-black, never #000; ground is cream, never #fff.

Architecture inherited from nicepest.com: 3-layer oklch color, semantic tracking tokens,
per-component variable namespaces, hard offset shadow via pseudo-element, tokenized
lift/press gestures, full prefers-reduced-motion coverage.

## Color  (strategy: Full palette, 4 named roles)
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

Hard rule: never light text on --c-green (2.01:1) or --c-yellow (1.49:1). Those blocks
always take ink text.

## Typography (2 families, 3 weights each)
Display: Bricolage Grotesque (variable, opsz 12-96, wght 400-800). Chosen because its design
premise is deliberate imperfection and DIY roughness: literally "homemade". Not a reflex pick.
Body: Hanken Grotesk 400/500/700. Humanist, warm, unfussy. Not Inter.

Semantic tracking tokens (from nicepest):
  --tr-display -0.03em | --tr-heading -0.015em | --tr-label 0.12em
  --tr-button 0.05em   | --tr-nav 0.02em       | --tr-numeral -0.05em
Scale: clamp() fluid, ratio >= 1.25. Body 65-75ch.
All-caps only on labels, buttons, nav. Source copy in caps is handled with text-transform.

## Elevation
No blur, ever. Hard offset shadow via ::after pseudo-element, solid ink.
  --sh-x -6px  --sh-y 6px    (blocks)
  --btn-sh-x -5px --btn-sh-y 5px  (buttons, press collapses to 0)
Borders: --bd-hard 3px solid var(--c-ink). Hairlines 1.5px for internal grid rules.
Radius: 0 everywhere except pills (999px).

## Components
--btn-*   primary (yellow fill), secondary (transparent + ink border), tertiary (underline)
--blk-*   flat color block with hard border + offset shadow
--lbl-*   kitchen label: rotated die-cut sticker, hard border, offset shadow.
          This is the named system that carries the source's repeated section labels.
          Varied rotation and fill per instance; never a tiny tracked caps line.
--pill-*  delivery-area tags

## Motion
ease-out-expo only, no bounce. Transform and opacity only, never layout properties.
Staggered entrance via IntersectionObserver. Button lift on hover, shadow collapse on press.
Full prefers-reduced-motion block disables all of it.
