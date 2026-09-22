# Project images

Images referenced from `src/content/projects/*.md` are resolved against this
directory. A content path of `/assets/struct/dashboard.png` maps to
`src/assets/struct/dashboard.png`.

Until a file exists, the page renders a designed placeholder in its place.
Drop the file in and rebuild; nothing else needs to change.

Expected files (see each project's `hero` field):

```
src/assets/
  struct/
    dashboard.svg
  variable-reach-arm/
    arm_image.svg
  blueprintcad/
    viewer.svg
  work/
    (placeholders only; internal tools are not published)
```

PNG / JPG / WebP files are run through Astro's image pipeline (resized,
converted to WebP, given a `srcset`). GIF and SVG files are copied through
unchanged.
