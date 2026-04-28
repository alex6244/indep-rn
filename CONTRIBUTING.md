## UI / Styling standards

- **Colors**: Use `src/shared/theme/colors.ts` as the single source of truth.
  - Prefer semantic tokens like `colors.text.primary`, `colors.surface.primary`, `colors.brand.primary`.
  - **Do not** use raw `#hex` values inside components.
  - Allowed exceptions: platform-specific shadow presets or third-party APIs that require a literal color string (document with a short inline note).

- **Spacing / radius**: Prefer `spacing` and `radius` tokens over raw numbers when practical.

- **Touch targets**: For interactive elements (buttons/chips/icon buttons) keep **`minHeight >= 44`** (48 for primary actions when possible).

- **A11y (RN)**:
  - For toggle/tab-like controls add `accessibilityRole` and `accessibilityState={{ selected: ... }}`.
  - For checkboxes/radios add `accessibilityRole` + `accessibilityState={{ checked: ... }}`.

## PR checklist (required)

- [ ] No raw `#hex` colors in components (use `colors.ts` tokens)
- [ ] Interactive elements have comfortable touch targets (`minHeight >= 44`)
- [ ] Toggle/tab controls expose selected state via accessibility props
- [ ] Lint passes for changed files

