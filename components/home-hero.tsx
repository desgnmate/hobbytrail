"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__visual" aria-hidden="true">
        <Image
          className="home-hero__poster"
          src="/assets/hobby-trail-hero-final.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <video
          className="home-hero__media"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/assets/hobby-trail-hero-final.png"
        >
          <source src="/assets/new-hero-video.mp4" type="video/mp4" />
          Your browser does not support background video.
        </video>
      </div>
      <div className="home-hero__content">
        <div className="home-hero__copy">
          <h1 id="home-hero-title">
            <span>Where hobbies bring</span>
            <span>people together.</span>
          </h1>
          <p>
            Discover events, explore new interests, meet communities, and find more ways to enjoy the
            hobbies you love.
          </p>
          <div className="button-row">
            <Link className="button button--yellow" href="/events#tickets" prefetch={true}>
              Buy tickets <ArrowRight size={19} weight="bold" />
            </Link>
            <Link className="button button--light" href="/collections" prefetch={true}>
              Explore collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
