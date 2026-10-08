# Pod request access landing page

An implementation of the [Frontend Mentor Pod request access landing page challenge](https://www.frontendmentor.io/challenges/pod-request-access-landing-page-eyTmdkLSG), using its supplied photos, logos, dot pattern and copy, with layout taken from the decoded Figma frames (Desktop 1440, Tablet 768, Mobile 375, plus the hover and error states).

The email form is an honest demo. It validates with TanStack Form and Zod ("Oops! Please add your email" when empty, "Oops! Please check your email" when malformed), moves focus to the field when a submit fails, and shows a short busy state on the still-focusable button before confirming. Nothing leaves the browser, and the page says so next to the form.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome and own port 4551.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3, Tailwind 4.2.1, TanStack Form 1.33.5 and Zod 4.4.3 are pinned to the family baseline. Only the form is a client component.

## Sources and choices

- Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/` (the photo keeps its desktop, tablet and mobile crops as CSS backgrounds).
- Chivo is served through `next/font` as the variable font, so the Figma Light (300) and Bold (700) weights render from one file.
- The Figma mobile frame uses 14 px body and form text and a 12 px error. The family text floor is 16 px, so those sizes are raised to 16 px; the desktop and tablet sizes (48 px heading, 18 px body) match the Figma exactly.
- The visible "Demo only: nothing is sent." note sits inside the gap the Figma leaves above the platform logos on tablet and desktop, so the 654 px desktop row and the photo beside it keep the Figma height.
- The photo is decoration, so it is a CSS background at every size: a 10% backdrop on phones, and the art-directed tablet and desktop crops behind the navy panel. Earlier it was an `<img>` whose box sat under the credit, the error and the success message (width sweep and journeys, October 8, 2026).
- The desktop error ring is drawn as an inset shadow so the 448 × 52 pill does not shift when the error appears.
- A small footer credits Frontend Mentor and the author; the Figma has no footer.
