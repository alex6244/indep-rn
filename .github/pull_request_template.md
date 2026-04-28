## Summary
- <!-- What changed and why? -->

## UI / UX checklist
- [ ] No raw `#hex` colors in components (use `src/shared/theme/colors.ts` tokens)
- [ ] Touch targets: `minHeight >= 44` for interactive elements
- [ ] Toggle/tab-like controls have `accessibilityRole` + `accessibilityState.selected`
- [ ] Checked controls have `accessibilityRole` + `accessibilityState.checked`

## Test plan
- [ ] Lint (changed files or `npm run lint`)
- [ ] Smoke test key flows impacted by this PR

