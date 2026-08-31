"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";

export type CollectionCarouselSlide = {
  src: string;
  alt: string;
  label: string;
};

type CollectionCarouselProps = {
  slides: CollectionCarouselSlide[];
};

export function CollectionCarousel({ slides }: CollectionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides.length) return null;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="binder-feature__image binder-feature__carousel" role="region" aria-roledescription="carousel" aria-label="Featured collections">
      <div className="binder-feature__slides">
        {slides.map((slide, index) => (
          <div
            className={`binder-feature__slide${index === activeIndex ? " is-active" : ""}`}
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              preload={index === 0}
              sizes="(max-width: 860px) 100vw, 58vw"
            />
          </div>
        ))}
      </div>

      <Link className="button button--yellow binder-feature__action" href="/collections">
        View all collections <ArrowRight size={18} />
      </Link>

      <div className="binder-feature__controls" aria-label="Collection carousel controls">
        <button className="binder-feature__control" type="button" onClick={showPrevious} aria-label="Previous collection">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <div className="binder-feature__dots" aria-label="Choose a collection">
          {slides.map((slide, index) => (
            <button
              className={`binder-feature__dot${index === activeIndex ? " is-active" : ""}`}
              type="button"
              key={slide.src}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${slide.label}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
        <button className="binder-feature__control" type="button" onClick={showNext} aria-label="Next collection">
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
