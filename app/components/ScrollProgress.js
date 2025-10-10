'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress({
  color = '#fff',
  height = 3,
  position = 'top' // 'top' or 'bottom'
}) {
  const progressRef = useRef(null);

  useEffect(() => {
    const progress = progressRef.current;

    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'max',
        scrub: 0.3,
        invalidateOnRefresh: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === progress) trigger.kill();
      });
    };
  }, []);

  return (
    <div
      ref={progressRef}
      className="fixed left-0 w-full z-[10000] pointer-events-none"
      style={{
        [position]: 0,
        height: `${height}px`,
        backgroundColor: color,
        transformOrigin: 'left',
        transform: 'scaleX(0)'
      }}
    />
  );
}
