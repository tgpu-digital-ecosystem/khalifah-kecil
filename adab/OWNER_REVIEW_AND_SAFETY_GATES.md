# Khalifah Kecil — Adab Corner owner review and child-safety release gates

Status: DRAFT only. This checklist documents the existing PR #18; it does not authorise a merge, release, publication of Islamic curricula, or collection of children's personal information.

## Verified source facts (21 October 2026)
- Main site's existing curiosity and invention missions stay unchanged by PR #18.
- New `/adab/` route contains five teacher/parent-facilitated conversation topics, two prompts per topic, and optional localStorage reflection notes. No server integration, messaging, public replies, media capture, social profiles, or file upload is present in the new route's HTML/JS.
- Local safety CI is isolated from Azure deployment: `.github/workflows/khalifah-adab-checks.yml` runs syntax and `tests/adab-safety.test.cjs`.
- Azure PR preview deployment has failed because its Static Web Apps staging-environment quota was reached. Do not delete unknown environments or push to production to work around this.
- The EXISTING main site's `tgpu-feedback.js` is different from the new adab route. It can collect user-entered text, optional name/contact, and device/browser metadata, send it to Supabase and queue unsuccessful submissions for future retransmission. Security controls and age/guardian suitability were not verified. This is a release blocker for child-facing expansion, not evidence of a confirmed data breach.

## Required privacy and child safety checks
- [ ] Define intended ages, parent/teacher facilitation model, and child-directed privacy notice in appropriate language.
- [ ] Audit feedback access and whether children can enter identifiers. Prefer guardian-submitted product feedback and disable child-entered contact fields. Assess already queued submissions and avoid data loss or inappropriate retry.
- [ ] Verify server authorization/RLS, limited staff access, retention/deletion, upload-free moderation, spam handling, and any relevant consent handling before collecting information.
- [ ] Check all new content for accidental collection of full names, school, contact details, locations, photos, audio or health information.
- [ ] No open child-to-child chat, DM, leaderboard, public submissions or automatic sharing with Academy.
- [ ] Qualified educator reviews the religious claims and teaching prompts; record source, reviewer and approval.
- [ ] Parent/teacher and actual device review: iPhone Safari and Android Chrome, keyboard and screen-reader journeys, 390/768/1440 layouts, text zoom, BM legibility and local note delete/persistence.
- [ ] Check accessibility of prompt updates and a reassuring non-punitive learning tone.

## Azure preview path — no destructive cleanup
1. Inventory Azure Static Web Apps environments and their PR owners/last use under the correct Azure subscription.
2. Identify the exact quota and whether any preview environment is unused, with evidence. Do not delete without owner confirmation when usage is uncertain.
3. Use an Actions artifact containing the standalone `adab/` files for source review while Azure remains blocked. This is NOT equivalent to a hosted staging deployment or a verified phone/browser test.
4. After staging capacity is legitimately available, rerun PR preview deployment and test private review URL; keep PR draft.
5. Merge/publish only after founder approval, educational review, privacy and device acceptance.

Status vocabulary: SOURCE UPDATED / LOCAL CI PASSED / AZURE PREVIEW BLOCKED / DEVICE QA AWAITING / OWNER APPROVAL AWAITING / NOT RELEASED.
