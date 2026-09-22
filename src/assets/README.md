# Project images

Images referenced from `src/content/projects/*.md` are resolved against this
directory. A content path of `/assets/struct/dashboard.png` maps to
`src/assets/struct/dashboard.png`.

Until a file exists, the page renders a designed placeholder in its place.
Drop the file in and rebuild; nothing else needs to change.

Expected files (see each project's `hero` and `gallery` fields):

```
src/assets/
  struct/
    dashboard.png
    schema-builder.png
    simulator.png
    webhooks.png
  variable-reach-arm/
    arm_motion.gif              <- from the repo: cad/animations/arm_motion.gif
    arm_motion_catch_fast.gif   <- from the repo: cad/animations/arm_motion_catch_fast.gif
    assembly.png
    simulation.png
  blueprintcad/
    viewer.png
    dashboard.png
    storefront.png
    explore.png
  work/
    (placeholders only; internal tools are not published)
```

PNG / JPG / WebP files are run through Astro's image pipeline (resized,
converted to WebP, given a `srcset`). GIF and SVG files are copied through
unchanged.
