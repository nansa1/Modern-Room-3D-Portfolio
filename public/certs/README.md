# Certificate images

The Education panel (see src/components/ContentPanel.tsx's `CertCard`) shows
one card per certificate: image on top, details below. It reads image paths
from `src/data/content.ts`'s `certifications` array. Drop scans/exports of
the real certificates here with these exact filenames and they'll appear
automatically — no code changes needed:

    public/certs/php-mysql.jpg
    public/certs/computer-networks.jpg
    public/certs/aws-beginners.jpg

Until a file exists, that card shows a "drop the image here" placeholder
instead of a broken image.

## Also worth filling in
`certifications` in `src/data/content.ts` has a few `// TODO` fields
(`issuer`, `date`, and optionally `credentialUrl`) that were left blank or
guessed — fill those in with the exact values off each certificate. Add a
`credentialUrl` to any entry that links to a verification page (e.g. AWS
Skill Builder, Spoken Tutorial) and a "View credential ↗" link appears on
that card automatically.

## Prepping the images
A clean phone photo or PDF-to-JPG export of the certificate works fine.
Rough guide:
1. Crop tight to the certificate itself (no desk/background).
2. Export/resize to roughly 1000px on the long edge — plenty sharp for a
   card thumbnail, keeps the file small.
3. Save as `.jpg` with the filenames above (or update the `image` path in
   `content.ts` if you'd rather use `.png`).
