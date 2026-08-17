import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PageShell } from "../../components/layout/PageShell";
import { BookingPreview } from "../../components/booking/BookingPreview";
import { RoomCard } from "../../components/booking/RoomCard";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Reveal } from "../../components/ui/Reveal";
import { Accordion } from "../../components/ui/Accordion";
import { HeroCarouselSlot, type HeroSlide } from "../../components/ui/HeroCarouselSlot";
import { rooms } from "../../data/rooms";
import { brandImagery, roomImagery, roomVideos } from "../../data/imagery";
import { faqs } from "../../data/faq";
import { useSeo } from "../../hooks/useSeo";

gsap.registerPlugin(ScrollTrigger);

const waysToBook = [
  {
    icon: "☀️",
    title: "By the Session",
    detail: "Book a morning or afternoon session — pay only for the AM or PM slot you actually need.",
  },
  {
    icon: "🗓️",
    title: "Full Day",
    detail: "Take a room for the whole day — ideal for a full clinic list or a longer procedure.",
  },
  {
    icon: "🤝",
    title: "Combined Space",
    detail: "The Elm and Ash Rooms adjoin, so bigger sessions can spread across both at once.",
  },
];

const steps = [
  { number: "01", title: "Browse rooms", detail: "Compare all six rooms by amenities, photos and AM / PM / full-day pricing." },
  { number: "02", title: "Book and pay", detail: "Pick your session and pay online — no phone call, no waiting on a reply." },
  { number: "03", title: "Show up", detail: "Your booking auto-confirms the moment payment clears, so the room is simply ready." },
];

const nearbyHighlights = [
  { icon: "🏙️", label: "Manchester city centre", detail: "~25 minutes by road" },
  { icon: "✈️", label: "Manchester Airport", detail: "Under 10 minutes by road" },
  { icon: "🅿️", label: "On-site parking", detail: "Ample parking for practitioners and clients" },
];

const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("1 Brickworks, Adlington, Manchester, SK10 4NL");

const [combineA, combineB] = [
  rooms.find((r) => r.id === "room-4")!,
  rooms.find((r) => r.id === "room-5")!,
];

/** One slide per room, video where available — cycled across the three hero panels. */
const heroSlides: HeroSlide[] = rooms.map((room) => {
  const video = roomVideos.perRoom[room.id];
  return video ? { type: "video", src: video } : { type: "image", src: roomImagery[room.id] };
});

const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "AMK Consulting Hub",
  url: "https://amk-consulting-hub.netlify.app",
  telephone: "+447415893038",
  email: "info@amkconsultinghub.co.uk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1 Brickworks, Adlington",
    addressLocality: "Manchester",
    postalCode: "SK10 4NL",
    addressCountry: "GB",
  },
});

export function Home() {
  useSeo({
    title: "AMK Consulting Hub — Clinical Room Booking, Manchester",
    description:
      "Book AM, PM or full-day clinical and therapy rooms at AMK Consulting Hub, Manchester. Instant online booking, confirmed the moment payment clears.",
    path: "/",
  });

  const collageRef = useRef<HTMLDivElement>(null);
  const bigImgRef = useRef<HTMLDivElement>(null);
  const smallImg1Ref = useRef<HTMLDivElement>(null);
  const smallImg2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const makeTrigger = () => ({ trigger: collageRef.current, start: "top top", end: "+=700", scrub: 1 });
      gsap.to(bigImgRef.current, { y: -50, ease: "none", scrollTrigger: makeTrigger() });
      gsap.to(smallImg1Ref.current, { y: 40, ease: "none", scrollTrigger: makeTrigger() });
      gsap.to(smallImg2Ref.current, { y: -35, ease: "none", scrollTrigger: makeTrigger() });
    },
    { scope: collageRef },
  );

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLd }} />
      {/* Hero — photo collage with parallax drift, overlapping content card. */}
      <section className="bg-soft pt-8 sm:pt-10 pb-24 sm:pb-28 lg:pb-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div
            ref={collageRef}
            className="grid grid-cols-6 grid-rows-2 gap-3 sm:gap-4 h-[280px] sm:h-[380px] lg:h-[460px]"
          >
            <div className="col-span-4 row-span-2 relative overflow-hidden rounded-[28px]">
              <div ref={bigImgRef} className="absolute inset-x-0 -top-[15%] w-full h-[130%]">
                <HeroCarouselSlot slides={heroSlides} startIndex={0} />
              </div>
            </div>
            <div className="col-span-2 row-span-1 relative overflow-hidden rounded-[24px]">
              <div ref={smallImg1Ref} className="absolute inset-x-0 -top-[15%] w-full h-[130%]">
                <HeroCarouselSlot slides={heroSlides} startIndex={2} />
              </div>
            </div>
            <div className="col-span-2 row-span-1 relative overflow-hidden rounded-[24px]">
              <div ref={smallImg2Ref} className="absolute inset-x-0 -top-[15%] w-full h-[130%]">
                <HeroCarouselSlot slides={heroSlides} startIndex={4} />
              </div>
            </div>
          </div>

          <div className="relative z-10 -mt-16 sm:-mt-20 flex flex-col lg:flex-row lg:items-end gap-6 px-2 sm:px-0">
            <Reveal className="bg-white rounded-[28px] shadow-[var(--shadow-lift)] p-7 sm:p-10 max-w-lg">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge tone="teal">Manchester &middot; Clinical &amp; Therapy Rooms</Badge>
                <Badge tone="navy">CQC Registered</Badge>
              </div>
              <h1 className="font-display text-[2rem] sm:text-[2.5rem] leading-[1.08] font-extrabold text-balance text-navy mt-4 mb-4">
                Your Room. Your Hours. Your Practice.
              </h1>
              <p className="text-navy/60 leading-relaxed mb-6">
                Fully-equipped clinical and therapy rooms in Manchester, ready on your schedule.
                Choose AM, PM or full-day hire, pay securely online, and your booking confirms
                instantly.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Link to="/rooms">
                  <Button size="lg">Hire a room</Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="lg" variant="secondary">
                    Create an account
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-navy/45">
                <span>&#127973; CQC registered private medical clinic rooms</span>
                <span>&#128274; Cards never stored</span>
                <span>&#9889; Confirmed instantly</span>
                <span>&#128197; AM / PM / full day</span>
              </div>
            </Reveal>

            <Reveal delay={150} className="lg:mb-2">
              <BookingPreview />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Rooms strip — photo thumbnails, right under the hero. */}
      <section className="bg-white border-b border-border/70">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-6">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/40 mb-3">
            Six rooms, one hub
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {rooms.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.slug}`}
                className="shrink-0 flex items-center gap-2.5 bg-soft hover:bg-teal/10 rounded-full pl-1.5 pr-4 py-1.5 transition-colors"
              >
                <img src={roomImagery[room.id]} alt="" loading="lazy" className="w-9 h-9 rounded-full object-cover" />
                <span className="text-sm font-bold text-navy whitespace-nowrap">{room.name}</span>
                <span className="text-xs font-semibold text-teal-deep whitespace-nowrap">from &pound;{room.priceAm}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Three ways to book */}
      <section className="bg-soft">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold mb-2 text-center">Flexible ways to book</h2>
            <p className="text-navy/60 text-center max-w-xl mx-auto mb-10">
              Every practitioner's schedule is different — pick the option that fits yours.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {waysToBook.map((way, i) => (
              <Reveal key={way.title} delay={i * 100}>
                <div className="bg-white border border-border/60 rounded-[24px] p-7 h-full">
                  <span className="text-3xl" aria-hidden="true">{way.icon}</span>
                  <p className="font-display text-lg font-extrabold text-navy mt-3 mb-1.5">{way.title}</p>
                  <p className="text-sm text-navy/60 leading-relaxed">{way.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold mb-10 text-center">How it works</h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 120} className="relative text-center sm:text-left">
              <span className="text-4xl font-display font-extrabold text-teal/25">{step.number}</span>
              <p className="font-display text-lg font-extrabold text-navy mt-2 mb-1.5">{step.title}</p>
              <p className="text-sm text-navy/60 leading-relaxed">{step.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Rooms showcase */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <Reveal>
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display text-3xl font-extrabold mb-2">Six beautiful rooms</h2>
              <p className="text-navy/60 max-w-xl">
                Each independently priced and bookable — including a fully equipped dental
                treatment room. Names, pricing and photos below are sample content pending
                final client sign-off.
              </p>
            </div>
            <Link to="/rooms" className="hidden sm:block text-sm font-bold text-teal-deep hover:text-teal shrink-0">
              View all &rarr;
            </Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <Reveal key={room.id} delay={(i % 3) * 90}>
              <RoomCard room={room} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Combinable room feature */}
      <section className="gradient-navy-teal text-white relative overflow-hidden">
        <div className="float-glow absolute -top-32 right-0 w-96 h-96 rounded-full bg-teal-bright/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <Badge tone="teal">A room that adapts</Badge>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold mt-5 mb-5 text-balance">
              One of them is really two,
              <br />
              when you need it to be.
            </h2>
            <p className="text-white/70 leading-relaxed max-w-md mb-4">
              {combineA.name} and {combineB.name} stand alone for everyday sessions — or combine
              into one larger space when a session calls for it. Room pairing is confirmed directly
              with AMK Consulting Hub.
            </p>
            <p className="text-white/70 leading-relaxed max-w-md mb-6">
              Combined, it becomes a flexible multipurpose event space — well suited to meetings,
              training days, or conference-style events, not just clinical sessions.
            </p>
            <Link to={`/rooms/${combineA.slug}`}>
              <Button variant="secondary" className="!bg-white !text-navy !border-white hover:!bg-soft">
                See the combined room
              </Button>
            </Link>
          </Reveal>

          <Reveal delay={150} className="relative flex items-center justify-center py-6">
            <div className="flex items-center gap-0">
              <div
                className="w-32 h-40 sm:w-40 sm:h-48 rounded-l-3xl bg-cover bg-center flex items-end p-4 shadow-xl"
                style={{ backgroundImage: `url(${roomImagery[combineA.id]})` }}
              >
                <span className="font-display text-sm font-bold text-white drop-shadow">{combineA.name}</span>
              </div>
              <div className="w-10 h-40 sm:h-48 border-y-2 border-dashed border-teal-bright flex items-center justify-center bg-navy/40">
                <span className="text-teal-bright text-xl leading-none">&harr;</span>
              </div>
              <div
                className="w-32 h-40 sm:w-40 sm:h-48 rounded-r-3xl bg-cover bg-center flex items-end p-4 shadow-xl"
                style={{ backgroundImage: `url(${roomImagery[combineB.id]})` }}
              >
                <span className="font-display text-sm font-bold text-white drop-shadow">{combineB.name}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <Badge tone="teal">Where we are</Badge>
          <h2 className="font-display text-3xl font-extrabold mt-5 mb-4 text-balance">Easy to reach, easy to park.</h2>
          <p className="text-navy/60 leading-relaxed mb-4">
            Set in a quiet, semi-rural location just outside Manchester — close enough for an
            easy commute, far enough for a calmer setting to work in.
          </p>
          <address className="not-italic text-navy/70 leading-relaxed mb-6">
            1 Brickworks, Adlington
            <br />
            Manchester, SK10 4NL
          </address>
          <div className="flex flex-wrap gap-3 mb-6">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">Get directions</Button>
            </a>
            <a href="tel:+447415893038">
              <Button variant="ghost">07415 893038</Button>
            </a>
          </div>
        </Reveal>

        <Reveal delay={150} className="grid gap-3">
          {nearbyHighlights.map((item) => (
            <div key={item.label} className="flex items-center gap-4 bg-white border border-border/60 rounded-2xl p-5">
              <span className="text-2xl" aria-hidden="true">{item.icon}</span>
              <div>
                <p className="font-semibold text-navy">{item.label}</p>
                <p className="text-sm text-navy/55">{item.detail}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-soft">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold mb-10 text-center">Common questions</h2>
          </Reveal>
          <Reveal delay={100}>
            <Accordion items={faqs.slice(0, 4)} />
            <p className="text-center mt-6">
              <Link to="/faq" className="text-sm font-bold text-teal-deep">
                See all frequently asked questions &rarr;
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div
          className="ken-burns absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${brandImagery.reception})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/85" aria-hidden="true" />

        <Reveal className="relative max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28 text-center text-white">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold mb-4 text-balance">Ready to book your room?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Create a free account and book any room. Update it from your account any time.
          </p>
          <Link to="/sign-up">
            <Button size="lg">Get started</Button>
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
