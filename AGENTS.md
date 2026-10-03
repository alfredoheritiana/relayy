<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS

- The site is a single-page marketing site for MJ Holidays (Akalana House); sections live in `src/components/<section>/` and are composed in `src/components/site/MJHolidaysPage.tsx`, rendered by `src/routes/index.tsx` — keeps the imported project's structure recognizable.
- Static content (properties, FAQ, reviews) lives in `src/data/index.ts` — single source for copy edits.
- Booking hands off to external booking engines via `window.open`; no backend booking logic — the hotels' engines own reservations.
