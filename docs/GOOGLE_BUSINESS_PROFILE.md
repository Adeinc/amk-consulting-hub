# Google Business Profile — Content Pack for Freda

Everything below is ready to copy/paste into Google Business Profile. I can't create or verify
the listing myself — Google requires the actual business owner (or someone with physical access
to the address) to claim it, and verification is usually a postcard mailed to the business
address, sometimes phone/email for eligible categories. This is Freda's step.

Setup starts at **business.google.com**.

## Business name

```
AMK Consulting Hub
```

Must match what's on your signage/branding exactly — Google's policy checks for this.

## Address

```
1 Brickworks
Adlington
Manchester
SK10 4NL
```

Set this as a physical, visitable location (not "service area only") — practitioners come to the
rooms, so a storefront-style listing is right.

## Phone

```
07415 893038
```

## Website

```
https://amk-consulting-hub.netlify.app
```

Swap this for `amkconsultinghub.co.uk` once the custom domain is connected — same as the DNS
step still pending elsewhere.

## Category

Google assigns categories from its own list as you type — I can't guarantee an exact string
exists, so search for these and pick the closest live match:

- **Primary**: try "Medical clinic" first, given the CQC registration — if that doesn't feel
  right once you see how it displays, "Room rental agency" or "Meeting room facility rental" are
  the fallback options, since the actual service sold is room hire, not treatment.
- **Secondary** (Google allows several): "Room rental agency", "Conference center" (the Elm/Ash
  combined space use case).

Worth trying a couple and seeing which one shows the right map-pin icon and search behaviour —
this affects what searches you show up for, so it's worth getting right rather than picking the
first match.

## Business description (750 character limit — this is 618)

```
AMK Consulting Hub offers six independently priced clinical and therapy rooms for hire in
Adlington, near Manchester — book AM, PM or full-day sessions online, with your booking
confirming the moment payment clears. We're CQC registered, and our Elm and Ash rooms can
combine into a larger space for bigger sessions, training days or events. One room is a fully
equipped dental treatment suite. Set in a semi-rural location around 25 minutes from Manchester
city centre by road and under 10 minutes from Manchester Airport, with ample on-site parking.
Built for practitioners who need a professional, reliable space without the hassle of long-term
leases.
```

## Services to list

```
Room hire — AM session
Room hire — PM session
Room hire — Full-day session
Combined space hire (Elm & Ash rooms)
Dental treatment room hire (Rowan room)
```

## "Book" button

GBP lets you add a direct booking link on the profile. Point it at:

```
https://amk-consulting-hub.netlify.app/rooms
```

— straight to the room list, not the homepage, so it drops people right where they can act.

## Attributes to select

- ✅ **On-site parking** — confirmed, safe to check.
- ⛔ **Wheelchair accessibility / accessible entrance / accessible restroom** — do **not** select
  any of these yet. No physical-accessibility facts have been confirmed for this site (this is
  the same rule the website itself follows — see `PRODUCT.md`). Selecting one of these on Google
  is a factual claim visitors will rely on; only turn it on once you know it's actually true.
- Leave anything else you're not 100% sure of unchecked — easier to add attributes later than to
  walk back a wrong one.

## Hours

Not something I can fill in — I don't have confirmed opening hours anywhere in the project.
Freda needs to set these directly based on when the building/rooms are actually accessible.

## Photos

- **Logo**: use `public/logo-transparent.png` from this repo, or the on-brand icon at
  `public/apple-touch-icon.png` — both are the real brand mark.
- **Do not** upload the stock photography currently used as placeholders on the website
  (`src/data/imagery.ts`, sourced from Unsplash) — those aren't real photos of this location, and
  Google's policy is that Business Profile photos should represent the actual place. Using stock
  photos here (unlike on the website, where it's clearly labelled "sample") would mislead anyone
  searching, and Google does sometimes remove profiles for this.
- The profile can go live with just the logo for now and get real interior/exterior/room photos
  added once the photographer/videographer shoot happens — same real photography that's already
  needed for the website itself (`docs/ROADMAP.md`, Milestone 2).

## After it's live

- Respond to the postcard/phone verification promptly — an unverified listing doesn't show up
  properly in Maps/local search.
- Ask early practitioners for reviews once real bookings start — there are currently zero
  reviews/testimonials anywhere for this business, and none should be invented in the meantime.
- Keep the profile's hours/services in sync with the website as pricing and room details get
  finalised.
