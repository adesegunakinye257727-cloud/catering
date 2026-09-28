import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Quote, User, Heart, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import {
  TestimonialItem,
  subscribeToTestimonials,
  INITIAL_TESTIMONIALS,
} from '../services/testimonialsService';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((updated) => {
      const activeOnly = updated.filter((item) => item.active !== false);
      setTestimonials(activeOnly.length > 0 ? activeOnly : INITIAL_TESTIMONIALS);
    });
    return () => unsubscribe();
  }, []);

  const total = testimonials.length;

  // Advance card to the back (Swipe Left)
  const handleSwipeLeft = () => {
    if (isAnimating || total <= 1) return;
    setIsAnimating(true);
    setDragOffset(-180);

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % total);
      setDragOffset(0);
      setIsAnimating(false);
    }, 280);
  };

  // Move back to previous card (Swipe Right)
  const handleSwipeRight = () => {
    if (isAnimating || total <= 1) return;
    setIsAnimating(true);
    setDragOffset(180);

    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + total) % total);
      setDragOffset(0);
      setIsAnimating(false);
    }, 280);
  };

  // Touch Handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - (touchStartYRef.current || currentY);

    // If mainly horizontal, track drag offset
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setDragOffset(diffX * 0.7);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (dragOffset < -45) {
      // Swiped Left
      handleSwipeLeft();
    } else if (dragOffset > 45) {
      // Swiped Right
      handleSwipeRight();
    } else {
      // Snap back
      setDragOffset(0);
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Mouse drag handlers for desktop preview
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return;
    touchStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || touchStartXRef.current === null) return;
    const diffX = e.clientX - touchStartXRef.current;
    setDragOffset(diffX * 0.6);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (dragOffset < -45) {
      handleSwipeLeft();
    } else if (dragOffset > 45) {
      handleSwipeRight();
    } else {
      setDragOffset(0);
    }
    touchStartXRef.current = null;
  };

  if (total === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-28 bg-[#FBF9F5] text-stone-900 border-b border-stone-200/80 overflow-hidden select-none"
      aria-label="Client Testimonials"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-mono uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Honored Celebrants</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-3">
            What Our Clients Say
          </h2>

          <p className="font-sans text-stone-600 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
            Swipe left to browse verified feedback from weddings, milestone jubilees, and family celebrations across Ogun State.
          </p>
        </div>

        {/* 
          LAYERED CARD STACK CONTAINER
          - One active testimonial card in front.
          - Additional cards sit behind it in layered physical stacks.
          - Swipe left: Front card transitions to the back, revealing the next layer.
        */}
        <div className="relative w-full max-w-lg mx-auto h-[380px] sm:h-[360px] flex items-center justify-center">
          {testimonials.map((item, index) => {
            // Calculate relative offset from active index
            const relIndex = (index - activeIndex + total) % total;

            // Only render up to 3 cards in the layered stack for optimal performance
            if (relIndex > 2) return null;

            const isFront = relIndex === 0;
            const isSecond = relIndex === 1;
            const isThird = relIndex === 2;

            // Physics calculation for layers
            let translateY = 0;
            let scale = 1.0;
            let opacity = 1.0;
            let zIndex = 30;
            let rotate = 0;
            let translateX = 0;

            if (isFront) {
              translateY = 0;
              scale = 1.0;
              opacity = 1.0;
              zIndex = 30;
              translateX = dragOffset;
              rotate = dragOffset * 0.05;
            } else if (isSecond) {
              translateY = 16;
              scale = 0.94;
              opacity = 0.85;
              zIndex = 20;
              translateX = 0;
              rotate = 0;
            } else if (isThird) {
              translateY = 32;
              scale = 0.88;
              opacity = 0.65;
              zIndex = 10;
              translateX = 0;
              rotate = 0;
            }

            return (
              <div
                key={item.id}
                onTouchStart={isFront ? handleTouchStart : undefined}
                onTouchMove={isFront ? handleTouchMove : undefined}
                onTouchEnd={isFront ? handleTouchEnd : undefined}
                onMouseDown={isFront ? handleMouseDown : undefined}
                onMouseMove={isFront ? handleMouseMove : undefined}
                onMouseUp={isFront ? handleMouseUp : undefined}
                onClick={isFront ? handleSwipeLeft : undefined}
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                  opacity,
                  zIndex,
                  transition:
                    isDraggingRef.current && isFront
                      ? 'none'
                      : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
                }}
                className={`absolute inset-x-0 mx-auto w-full bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between cursor-pointer group will-change-transform ${
                  isFront ? 'hover:border-amber-400' : 'pointer-events-none'
                }`}
              >
                <div>
                  {/* Decorative Quote Mark & Event Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                      <Quote className="w-5 h-5 fill-current opacity-80" />
                    </div>

                    <div className="flex items-center gap-2">
                      {item.eventType && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 font-mono text-[11px] font-medium tracking-wide">
                          {item.eventType}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-stone-400 font-bold">
                        0{index + 1} / 0{total}
                      </span>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="font-sans text-stone-700 text-sm sm:text-base font-light leading-relaxed italic line-clamp-5 sm:line-clamp-4">
                    &ldquo;{item.testimonial}&rdquo;
                  </p>
                </div>

                {/* Client Info Footer */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.clientPhotoUrl ? (
                      <img
                        src={item.clientPhotoUrl}
                        alt={item.clientName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-xs shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-800 flex items-center justify-center font-bold text-sm font-cinzel shrink-0">
                        {item.clientName.charAt(0) || <User className="w-5 h-5" />}
                      </div>
                    )}

                    <div>
                      <h4 className="font-cinzel text-sm sm:text-base font-bold text-stone-950">
                        {item.clientName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 font-mono">
                        <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Verified Celebrant</span>
                      </div>
                    </div>
                  </div>

                  {isFront && (
                    <span className="text-[11px] font-mono text-stone-400 group-hover:text-amber-700 transition-colors">
                      Swipe &larr;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stack Navigation Controls (Swipe Left / Right buttons & Dot indicators) */}
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSwipeRight}
              aria-label="Previous testimonial"
              className="p-3 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-stone-200 shadow-xs">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Jump to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === activeIndex
                      ? 'w-6 bg-amber-600'
                      : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleSwipeLeft}
              aria-label="Next testimonial"
              className="p-3 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] font-mono text-stone-400">
            Swipe left or tap to reveal next review
          </p>
        </div>
      </div>
    </section>
  );
};
