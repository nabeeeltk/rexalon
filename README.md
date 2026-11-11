# Rexalon Digital Solutions — Marketing Website

A complete, single-page marketing website for **Rexalon Digital Solutions**, a full-service digital agency offering apps, web development, custom software, UI/UX design, graphic design, and branding.

## How to Run

1. **Double-click** `index.html` in a browser — no server, build step, or npm required.
2. Or serve locally for best results:
   ```bash
   # Python 3
   cd rexalon
   python3 -m http.server 8000
   # Open http://localhost:8000
   ```

## File Structure

```
/rexalon
  index.html              → Single-page website (14 sections)
  /css/style.css           → Complete stylesheet (tokens, base, components, sections, responsive)
  /js/main.js              → All interactive behavior (navbar, reveal, counters, filter, carousel, form)
  /assets/
    favicon.svg            → SVG favicon
    logo.svg               → Standalone logo file
  README.md                → This file
```

## Tech Stack

- **HTML5** — Semantic markup, one `<h1>`, logical heading order
- **CSS3** — Custom properties, fluid typography (`clamp()`), CSS Grid, Flexbox
- **Vanilla JavaScript (ES6)** — IntersectionObserver, touch events, requestAnimationFrame
- **Google Fonts** — Montserrat 600/700/800, Inter 400/500/600, Playfair Display 500/600
- No frameworks, no npm, no build step.

## Sections

| # | Section | ID |
|---|---------|-----|
| 1 | Navbar | `#home` |
| 2 | Hero | `#hero-section` |
| 3 | Trust Strip (Counters) | — |
| 4 | Services | `#services` |
| 5 | Why Rexalon / About | `#about` |
| 6 | Process | `#process` |
| 7 | Technologies | — |
| 8 | Portfolio | `#portfolio` |
| 9 | Industries | — |
| 10 | Pricing | `#pricing` |
| 11 | Testimonials | `#testimonials` |
| 12 | CTA Banner | — |
| 13 | Contact | `#contact` |
| 14 | Footer | `#footer` |

## Replace Before Launch

All placeholders are tagged with `<!-- TODO: REPLACE ... -->` HTML comments. Find and replace these before going live:

### Contact & Business Info
- [ ] **Email address**: Replace `hello@yourdomain.com` with actual email
- [ ] **Phone number**: Replace `+91 XXXXX XXXXX` with actual phone
- [ ] **WhatsApp number**: Replace `91XXXXXXXXXX` in the `wa.me/` link
- [ ] **Physical address**: Replace `[Your City, State, Country]`
- [ ] **Social media URLs**: Replace all `PLACEHOLDER` in Facebook, Instagram, LinkedIn, Twitter/X links

### SEO & Domain
- [ ] **Canonical URL**: Replace `https://www.yourdomain.com/` with your live domain
- [ ] **Open Graph image**: Create and upload `og-image.png` (1200×630px recommended)
- [ ] **Twitter card image**: Same as OG image
- [ ] **JSON-LD Organization schema**: Update URL, logo URL, telephone, email, and `sameAs` social profiles

### Content
- [ ] **Counter numbers**: Edit `data-target` attributes in the Trust Strip section (currently: 50+, 30+, 5+, 24/7)
- [ ] **Portfolio projects**: Replace 6 `[Project Name]` placeholders with real project titles, descriptions, and links
- [ ] **Testimonials**: Replace 3 `[Client Name]`, `[Role]`, `[Company Name]` placeholders with real client quotes
- [ ] **Pricing**: Replace `From ₹ XX,XXX [PLACEHOLDER]` with actual prices or "Contact for pricing"
- [ ] **Google Maps**: Replace the map placeholder `div` with a Google Maps `<iframe>` embed

### Form Backend
- [ ] **Form action URL**: Replace `https://formspree.io/f/PLACEHOLDER` with your actual form endpoint
  - Options: [Formspree](https://formspree.io), [EmailJS](https://emailjs.com), or your own API
  - Fallback: `mailto:hello@yourdomain.com`

### Legal
- [ ] **Privacy Policy**: Link to actual privacy policy page
- [ ] **Terms of Service**: Link to actual terms page

## Accessibility

- Skip-to-content link
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`)
- WCAG AA contrast ratios
- `aria-label` / `aria-expanded` / `aria-pressed` / `aria-live` attributes
- Visible focus rings
- Full keyboard navigation
- Mobile menu focus trap
- `prefers-reduced-motion` respected — all animations disabled
- Form labels linked to inputs with `for`/`id`
- Touch targets ≥ 44px

## Performance Notes

- No layout shifts (dimensions set on images/SVGs)
- CSS animations use `transform` and `opacity` only (GPU-composited)
- Lazy IntersectionObserver initialization
- Minimal JavaScript (~400 lines)
- No external images (all inline SVG/CSS)

## Suggested Next Improvements

1. **Add a real backend for the contact form** — Connect to Formspree, EmailJS, or build a serverless function (Netlify/Vercel/Firebase)
2. **Add real portfolio images** — Replace CSS gradient cards with actual project screenshots using `<picture>` with WebP/AVIF + fallback
3. **Add page transitions & micro-interactions** — Implement a lightbox for portfolio items, add loading states, and consider adding a blog section for SEO content marketing

---

© 2026 Rexalon Digital Solutions
