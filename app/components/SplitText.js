'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitText({
  children,
  type = 'chars', // 'chars', 'words', 'lines'
  animation = 'fadeUp', // 'fadeUp', 'fadeIn', 'scale', 'rotate'
  stagger = 0.03,
  className = ''
}) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Split du texte
    const text = element.textContent;
    element.innerHTML = '';

    let items = [];

    if (type === 'chars') {
      items = text.split('').map((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        return span;
      });
    } else if (type === 'words') {
      items = text.split(' ').map((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.3em';
        return span;
      });
    }

    items.forEach(item => element.appendChild(item));

    // Animations selon le type
    const animations = {
      fadeUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1, duration: 0.6, ease: 'power2.out' }
      },
      scale: {
        from: { opacity: 0, scale: 0 },
        to: { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      },
      rotate: {
        from: { opacity: 0, rotationX: -90 },
        to: { opacity: 1, rotationX: 0, duration: 0.8, ease: 'power3.out' }
      }
    };

    const anim = animations[animation];

    gsap.set(items, anim.from);

    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(items, {
          ...anim.to,
          stagger: stagger
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) trigger.kill();
      });
    };
  }, [type, animation, stagger]);

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
}
