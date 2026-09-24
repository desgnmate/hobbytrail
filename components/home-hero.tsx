"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

// Video total duration: 21.33 seconds
// 9:20 mark (~9.20s): sunset/night transition starts -> gradual shift from black to white
// 17:28 mark (~17.28s): sunrise/day transition starts -> gradual shift from white to black
const NIGHT_START_TIME = 9.2;
const DAY_START_TIME = 17.28;

export function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let callbackId: number | null = null;
    let isMounted = true;

    const evaluateTime = (currentTime: number) => {
      const night = currentTime >= NIGHT_START_TIME && currentTime < DAY_START_TIME;
      setIsNight((prev) => (prev !== night ? night : prev));
    };

    const handleTimeUpdate = () => {
      evaluateTime(video.currentTime);
    };

    // Primary: requestVideoFrameCallback for exact frame-level accuracy
    const rVFC =
      "requestVideoFrameCallback" in video
        ? (video as unknown as {
            requestVideoFrameCallback: (
              cb: (now: DOMHighResTimeStamp, metadata: { mediaTime: number }) => void
            ) => number;
            cancelVideoFrameCallback?: (id: number) => void;
          })
        : null;

    if (rVFC) {
      const onVideoFrame = (_now: DOMHighResTimeStamp, metadata: { mediaTime: number }) => {
        if (!isMounted) return;
        evaluateTime(metadata.mediaTime);
        callbackId = rVFC.requestVideoFrameCallback(onVideoFrame);
      };
      callbackId = rVFC.requestVideoFrameCallback(onVideoFrame);
    }

    // Fallbacks and scrub/loop listeners
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleTimeUpdate);
    video.addEventListener("seeked", handleTimeUpdate);

    // Initial check
    evaluateTime(video.currentTime);

    return () => {
      isMounted = false;
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleTimeUpdate);
      video.removeEventListener("seeked", handleTimeUpdate);
      if (callbackId !== null && rVFC?.cancelVideoFrameCallback) {
        rVFC.cancelVideoFrameCallback(callbackId);
      }
    };
  }, []);

  return (
    <section
      className={`home-hero ${isNight ? "home-hero--night" : ""}`}
      data-theme={isNight ? "night" : "day"}
      aria-labelledby="home-hero-title"
    >
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
          ref={videoRef}
          className="home-hero__media"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/assets/hobby-trail-hero-final.png"
        >
          <source src="/assets/0925.mp4" type="video/mp4" />
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
