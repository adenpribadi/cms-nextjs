"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  buttonText?: string | null;
  buttonLink?: string | null;
}

export default function HeroSlider({ banners, siteName, siteDesc }: { banners: Banner[], siteName?: string, siteDesc?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    // Fallback if no banners are active
    return (
      <section className="section bg-pattern" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="text-gradient font-heading" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>
              {siteName || "Kualitas Terbaik Untuk Anda"}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              {siteDesc || "Kami menghadirkan kurasi produk terbaik untuk mendukung gaya hidup modern Anda."}
            </p>
            <Link href="/products" className="btn btn-primary" style={{ padding: '16px 40px' }}>
              Lihat Katalog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', height: 'auto', minHeight: '600px', background: '#000' }}>
      {banners.map((banner, index) => (
        <div 
          key={banner.id} 
          className={`slider-slide ${index === current ? 'active' : ''}`}
          style={{ 
            position: index === current ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === current ? 1 : 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* Background Image with Overlay */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: -1 
          }}>
            <img 
              src={banner.imageUrl} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)' 
            }}></div>
          </div>

          <div className="container" style={{ padding: '100px 20px', position: 'relative', zIndex: 10 }}>
            <div className="animate-fade-up" style={{ maxWidth: '700px', color: 'white' }}>
              {banner.subtitle && (
                <span style={{ 
                  display: 'inline-block', 
                  padding: '6px 16px', 
                  background: 'var(--accent)', 
                  color: 'white', 
                  borderRadius: '4px', 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  marginBottom: '24px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  {banner.subtitle}
                </span>
              )}
              <h1 className="font-heading" style={{ 
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
                lineHeight: 1.1, 
                marginBottom: '24px' 
              }}>
                {banner.title}
              </h1>
              {banner.description && (
                <p style={{ 
                  fontSize: '1.2rem', 
                  opacity: 0.9, 
                  marginBottom: '40px', 
                  lineHeight: 1.6,
                  maxWidth: '600px'
                }}>
                  {banner.description}
                </p>
              )}
              {banner.buttonText && (
                <Link 
                  href={banner.buttonLink || "#"} 
                  className="btn btn-primary"
                  style={{ 
                    padding: '18px 48px', 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {banner.buttonText} <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button 
            onClick={prev}
            style={{ 
              position: 'absolute', 
              left: '20px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              zIndex: 20, 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '15px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            style={{ 
              position: 'absolute', 
              right: '20px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              zIndex: 20, 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '15px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div style={{ 
            position: 'absolute', 
            bottom: '30px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 20, 
            display: 'flex', 
            gap: '12px' 
          }}>
            {banners.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrent(i)}
                style={{ 
                  width: i === current ? '30px' : '10px', 
                  height: '10px', 
                  borderRadius: '5px', 
                  background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </>
      )}

      <style jsx global>{`
        .slider-slide.active .animate-fade-up {
          animation: fadeInUp 0.8s ease backwards 0.3s;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
