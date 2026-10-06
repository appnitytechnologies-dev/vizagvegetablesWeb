'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Cta = { href: string; label: string; variant: 'primary' | 'ghost' };
type Slide = {
  badge: string;
  title: React.ReactNode;
  sub: string;
  image: string;
  alt: string;
  tagIcon: string;
  tagBold: string;
  tagLabel: string;
  ctas: [Cta, Cta];
};

const SLIDES: Slide[] = [
  {
    badge: 'Direct from Vizag Rythu Bazar',
    title: <>Daily <span className="telugu-display">రైతు బజార్</span> rates,<br />market updates &amp;<br /><span className="serif-it">fresh shopping.</span></>,
    sub: 'Live wholesale prices from all 4 Visakhapatnam Rythu Bazars, our own farm-fresh products, and morning delivery — all in one place.',
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=1800&q=80&auto=format&fit=crop',
    alt: 'Fresh organic vegetables at a farm stand',
    tagIcon: '🚚',
    tagBold: '45 min',
    tagLabel: 'avg delivery time',
    ctas: [{ href: '/shop', label: 'Shop Now', variant: 'primary' }, { href: '/prices', label: "Today's prices", variant: 'ghost' }],
  },
  {
    badge: 'Farm Direct, No Middlemen',
    title: <>Fresh picks,<br /><span className="serif-it">fair prices.</span></>,
    sub: 'Produce sourced straight from farmer vendors — no markup, no haggling, just honest Rythu Bazar rates delivered to your door.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1800&q=80&auto=format&fit=crop',
    alt: 'A colourful bowl of fresh chopped vegetables',
    tagIcon: '🌱',
    tagBold: 'Picked',
    tagLabel: 'at 5 AM, same day',
    ctas: [{ href: '/shop', label: 'Shop Now', variant: 'primary' }, { href: '/markets', label: 'See Markets', variant: 'ghost' }],
  },
  {
    badge: 'Morning Delivery, Daily',
    title: <>Order tonight,<br />fresh by<br /><span className="serif-it">breakfast.</span></>,
    sub: 'Order by 9 PM and wake up to fresh vegetables and fruits delivered to your doorstep, anywhere in Visakhapatnam.',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1800&q=80&auto=format&fit=crop',
    alt: 'An assortment of fresh fruits',
    tagIcon: '📦',
    tagBold: '2,000+',
    tagLabel: 'Vizag families trust us',
    ctas: [{ href: '/shop', label: 'Shop Now', variant: 'primary' }, { href: '/prices', label: "Today's prices", variant: 'ghost' }],
  },
];

const AUTO_ADVANCE_MS = 6000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const go = (next: number) => setIndex((next + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[index];

  return (
    <section
      className="hero-village"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-banner">
        {/* Full-bleed background photo */}
        <img key={`img-${index}`} src={slide.image} alt={slide.alt} className="hero-banner-bg hero-slide-fade" />
        <div className="hero-banner-scrim" />

        {/* Text overlaid on the left */}
        <div key={`text-${index}`} className="hero-banner-content hero-slide-fade">
          <span className="chip-soft">
            <span className="chip-dot" />
            {slide.badge}
          </span>
          <h1 className="hero-banner-title">{slide.title}</h1>
          <p className="hero-banner-sub">{slide.sub}</p>
          <div className="hero-village-cta">
            {slide.ctas.map(cta => (
              <Link key={cta.label} href={cta.href} className={cta.variant === 'primary' ? 'btn-primary' : 'btn-ghost-light'}>
                {cta.label}
                {cta.variant === 'primary' && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </Link>
            ))}
          </div>

          <div className="hero-slider-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                className={`hero-slider-dot light${i === index ? ' active' : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>

        {/* Floating tag, bottom-right over the image */}
        <div className="hero-slider-tag hero-slider-tag-bottom-right">
          <span style={{ fontSize: '1.4rem' }}>{slide.tagIcon}</span>
          <div>
            <b>{slide.tagBold}</b>
            <span>{slide.tagLabel}</span>
          </div>
        </div>

        <button aria-label="Previous slide" className="hero-slider-arrow hero-slider-arrow-left" onClick={() => go(index - 1)}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#0E1612" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button aria-label="Next slide" className="hero-slider-arrow hero-slider-arrow-right" onClick={() => go(index + 1)}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#0E1612" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  );
}
