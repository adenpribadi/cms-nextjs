"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  avatarUrl: string | null;
  rating: number;
};

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'var(--accent)', opacity: 0.05, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, background: 'var(--accent)', opacity: 0.05, borderRadius: '50%' }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', fontSize: '0.85rem' }}>Social Proof</p>
          <h2 className="font-heading" style={{ color: 'var(--text-primary)' }}>Apa Kata Mereka?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '16px auto 0' }}>
            Dengarkan pengalaman pelanggan yang telah mempercayakan kebutuhan mereka kepada kami.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          
          <div style={{ position: 'relative', overflow: 'hidden', padding: '20px 0' }}>
            <div 
              style={{ 
                display: 'flex', 
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} style={{ minWidth: '100%', padding: '0 16px' }}>
                  <div className="testimonial-card" style={{ textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                    <div style={{ color: '#FFD700', display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < testimonial.rating ? '#FFD700' : 'none'} stroke={i < testimonial.rating ? '#FFD700' : 'var(--border)'} />
                      ))}
                    </div>
                    
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '32px' }}>
                      "{testimonial.content}"
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      {testimonial.avatarUrl ? (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '3px solid var(--accent-light)' }}>
                          <Image src={testimonial.avatarUrl} alt={testimonial.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{testimonial.name}</h4>
                        {testimonial.role && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                style={{ position: 'absolute', top: '50%', left: '-20px', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: 'var(--text-secondary)', zIndex: 20 }}
                className="hover-lift"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: 'var(--text-secondary)', zIndex: 20 }}
                className="hover-lift"
              >
                <ChevronRight size={24} />
              </button>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    style={{ width: i === currentIndex ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === currentIndex ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
