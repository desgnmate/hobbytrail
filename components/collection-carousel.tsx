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

  const [loadedIndices, setLoadedIndices] = useState<number[]>([0]);

  if (!slides.length) return null;

  const showPrevious = () => {
    setActiveIndex((current) => {
      const prev = (current - 1 + slides.length) % slides.length;
      setLoadedIndices((indices) => (indices.includes(prev) ? indices : [...indices, prev]));
      return prev;
    });
  };

  const showNext = () => {
    setActiveIndex((current) => {
      const next = (current + 1) % slides.length;
      setLoadedIndices((indices) => (indices.includes(next) ? indices : [...indices, next]));
      return next;
    });
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setLoadedIndices((indices) => (indices.includes(index) ? indices : [...indices, index]));
  };

  return (
    <div className="binder-feature__image binder-feature__carousel" role="region" aria-roledescription="carousel" aria-label="Featured collections">
      <div className="binder-feature__slides">
        {slides.map((slide, index) => {
          const shouldRender = loadedIndices.includes(index) || index === activeIndex;
          return (
            <div
              className={`binder-feature__slide${index === activeIndex ? " is-active" : ""}`}
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
              aria-hidden={index !== activeIndex}
            >
              {shouldRender && (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 860px) 100vw, 58vw"
                />
              )}
            </div>
          );
        })}
      </div>

      <Link className="button button--yellow binder-feature__action" href="/collections">
        View all collections <ArrowRight size={18} />
      </Link>

      <div className="binder-feature__controls" aria-label="Collection carousel controls">
        <button className="binder-feature__control" type="button" onClick={showPrevious} aria-label="Previous collection">
          <ArrowLeft size={14} weight="bold" />
        </button>
        <div className="binder-feature__dots" aria-label="Choose a collection">
          {slides.map((slide, index) => (
            <button
              className={`binder-feature__dot${index === activeIndex ? " is-active" : ""}`}
              type="button"
              key={slide.src}
              onClick={() => goToSlide(index)}
              aria-label={`Show ${slide.label}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
        <button className="binder-feature__control" type="button" onClick={showNext} aria-label="Next collection">
          <ArrowRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
