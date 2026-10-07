# Recreate Tushar's portfolio and fix messaging

## Build
- Recompose the single-page portfolio around the supplied monochrome reference: compact availability header, oversized outlined/solid name, centered portrait area, role summary, and vertical profile links.
- Keep Tushar's existing biography, education, skills, journey, and projects content, restyled as clean editorial sections below the opening screen.
- Preserve responsive navigation and accessible mobile behavior.

## Contact form
- Replace the unreliable browser-to-third-party request with a same-origin server endpoint.
- Validate name, email, and message on both the page and server.
- Forward valid messages to the configured delivery service, return honest activation/error states, and keep direct email as a fallback.

## Verification
- Test desktop and mobile layouts.
- Submit invalid and valid contact-form data and confirm the visible result matches the server response.
- Confirm the current preview builds without errors.

## Technical details
- Continue using TanStack Start, semantic Tailwind tokens, and existing portfolio data.
- Use a TanStack public API route for form delivery so browser restrictions do not block submission.
