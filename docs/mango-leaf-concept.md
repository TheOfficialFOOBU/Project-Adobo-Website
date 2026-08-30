# Mango-leaf SVG concept (ink-brush leaf)

#

# Design: a single closed path representing a stylized mango leaf,

# with a small stem and one internal vein line. Rendered as ink

# (stroke only, no fill) so it reads as a brush mark rather than

# a botanical illustration.

#

# The path is asymmetric and slightly curved — a real leaf shape,

# not a generic ellipse. The stem anchors the shape to a base.

# The internal vein runs from the stem up through the body of the

# leaf.

#

# Two design options below — both follow the same brief. The second

# is the chosen one (more organic, less symmetric).

# Option A — symmetric leaf

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- body: pointed-tip leaf, slightly asymmetric -->
    <path d="M20 36 C 12 30, 8 22, 12 12 C 16 6, 22 4, 24 4 C 26 8, 30 16, 28 24 C 26 30, 22 34, 20 36 Z" transform="rotate(-4 20 20)" />
    <!-- stem -->
    <path d="M20 36 L 20 38" stroke-width="1.25" />
    <!-- midrib / vein -->
    <path d="M20 36 L 21 14" stroke-width="0.75" stroke-opacity="0.65" transform="rotate(-4 20 20)" />
  </g>
</svg>

# Option B — chosen, more organic, single brush stroke

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- body: a single calligraphic stroke that loops back on itself.
         Slightly wider on the lower half (leaf-shaped) and pointed at the top. -->
    <path d="
      M 21 37
      C 18 36, 14 33, 12 27
      C 10 21, 11 14, 16 9
      C 20 5, 25 5, 26 7
      C 27 11, 27 18, 25 24
      C 23 30, 21 35, 21 37
      Z
    " transform="rotate(-3 20 20)" />
    <!-- stem -->
    <path d="M 21 37 L 21 38.5" stroke-width="1.25" />
    <!-- midrib: a single calligraphic curve up through the leaf -->
    <path d="
      M 21 36
      C 20 28, 19 19, 21 11
    " stroke-width="0.75" stroke-opacity="0.55" transform="rotate(-3 20 20)" />
  </g>
</svg>
