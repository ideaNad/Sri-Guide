"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

interface HeroAnimationProps {
  kesbewaRef: React.RefObject<HTMLDivElement | null>;
  travelersRef: React.RefObject<HTMLDivElement | null>;
  toursRef: React.RefObject<HTMLDivElement | null>;
  hotelsRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

// --- ANIMATION CONFIGURATION ---
// Tweak these values to change the path, speed, and feel of the mascot journey
const CONFIG = {
  timeline: {
    delay: 1.5, // How long to wait before starting
  },
  initialFall: {
    duration: 1.0,
    ease: "back.out(1.2)",
    yOffset: -10, // Target slightly above the letter before landing
  },
  sSlide: {
    ledgeX: 0.15, // 15% of width (Top-Left)
    ledgeY: 0.05, // 5% of height
    duration: 0.5,
    ease: "power1.inOut",
    tilt: -10, // Rotation in degrees
  },
  logoGlow: {
    stagger: 0.15,
    duration: 0.8,
    color: "rgba(255, 255, 255, 0.8)",
  },
  jumps: {
    travelers: {
      durationAscent: 0.6,
      durationDescent: 0.5,
      arcHeight: 120, // Negative Y offset for the jump peak
      yOffset: -40, // Landing offset (original was -40)
    },
    tours: {
      durationAscent: 0.5,
      durationDescent: 0.4,
      arcHeight: 80,
      yOffset: -10,
    },
    hotels: {
      durationAscent: 0.5,
      durationDescent: 0.4,
      arcHeight: 60,
      yOffset: -10,
    },
  },
  buttonLanding: {
    jumpArc: 100,
    jumpDuration: 0.7,
    buttonSquishDuration: 0.1,
    buttonSquishScale: 0.9,
    buttonBounceScale: 1.05,
    buttonRestoreDuration: 0.4,
    mascotSettleDuration: 0.6,
  }
};

const HeroAnimation: React.FC<HeroAnimationProps> = ({
  kesbewaRef,
  travelersRef,
  toursRef,
  hotelsRef,
  buttonRef,
}) => {
  useEffect(() => {
    if (
      !kesbewaRef.current ||
      !travelersRef.current ||
      !toursRef.current ||
      !hotelsRef.current ||
      !buttonRef.current
    )
      return;

    const timeline = gsap.timeline({
      delay: CONFIG.timeline.delay,
    });

    // Get positions for landing points
    const getPos = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const parentRect = kesbewaRef.current!.parentElement!.getBoundingClientRect();
      return {
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top,
      };
    };

    const letter0 = document.getElementById('letter-0');
    if (!letter0) return;
    const sRect = letter0.getBoundingClientRect();
    const parentRect = kesbewaRef.current!.parentElement!.getBoundingClientRect();
    const sStartPos = {
      x: sRect.left - parentRect.left + (sRect.width * 0.5), // Top middle start (x: 50 in 100 viewBox)
      y: sRect.top - parentRect.top + CONFIG.initialFall.yOffset, // Just above letter
    };

    const navbarLogo = document.getElementById('navbar-logo');
    let startPos = { x: sStartPos.x, y: -200 }; // Default to vertical align

    if (navbarLogo) {
      const navRect = navbarLogo.getBoundingClientRect();
      // startPos.x = navRect.left - parentRect.left + navRect.width / 2; // This was overridden by sStartPos.x
      startPos.y = navRect.top - parentRect.top + navRect.height / 2;
    }

    const travelersPos = getPos(travelersRef.current);
    const toursPos = getPos(toursRef.current);
    const hotelsPos = getPos(hotelsRef.current);
    const buttonPos = getPos(buttonRef.current);

    // Initial positioning at Navbar logo
    gsap.set(kesbewaRef.current, {
      x: startPos.x,
      y: startPos.y,
      xPercent: -50,
      yPercent: -85, // Adjust vertical center so it "stands" on the path
      opacity: 0,
      scale: 0.5,
      willChange: "transform",
    });

    // STEP 0: FORCE VERTICAL ALIGNMENT FOR REALISTIC GRAVITY
    // Ensure the Navbar logo departure and S landing are on the same X-axis
    // startPos.x = sStartPos.x; // Already handled by initialization

    // Step 1: Initial fall from Navbar logo (Now perfectly vertical)
    timeline.to(kesbewaRef.current, {
      opacity: 1,
      scale: 1,
      x: sStartPos.x,
      y: sStartPos.y,
      ease: CONFIG.initialFall.ease,
      duration: CONFIG.initialFall.duration,
      onStart: () => {
        // Shake Navbar Logo on Start
        const navbarLogo = document.getElementById('navbar-logo');
        if (navbarLogo) {
          gsap.to(navbarLogo, {
            x: 'random(-4, 4)',
            y: 'random(-2, 2)',
            duration: 0.05,
            repeat: 12,
            yoyo: true,
            ease: "none",
            onComplete: () => { gsap.set(navbarLogo, { x: 0, y: 0 }); }
          });
        }
      }
    });

    // Step 2: Expert S-Curve Motion Path Refinement
    const letters = Array.from({ length: 9 }, (_, i) => document.getElementById(`letter-${i}`));
    
    // Define an authentic "S" path based on the actual bounding box of letter 'S'
    const leftX = sRect.left - parentRect.left;
    const topY = sRect.top - parentRect.top;
    
    // LAND ON S (Top-Middle)
    timeline.to(kesbewaRef.current, {
      y: sStartPos.y + 10, // Land on letter
      duration: 0.4,
      ease: "bounce.out",
      onStart: () => {
        // Subtle, Slow Sequential White Glows
        gsap.to(letters, {
          textShadow: `0 0 20px ${CONFIG.logoGlow.color}, 0 0 40px ${CONFIG.logoGlow.color}`,
          opacity: 1, 
          duration: CONFIG.logoGlow.duration, 
          yoyo: true, 
          repeat: 1,
          stagger: CONFIG.logoGlow.stagger,
          ease: "sine.inOut"
        });
      }
    });

    // Defining the 5 point path for the S-curve
    const sPath = [
      { x: leftX + sRect.width * 0.5, y: topY },           // Top-Middle (Start)
      { x: leftX + sRect.width * 0.15, y: topY + 10 },    // Top-Left (Ledge)
      { x: leftX + sRect.width * 0.85, y: topY + sRect.height * 0.45 }, // Middle-Right
      { x: leftX + sRect.width * 0.15, y: topY + sRect.height * 0.85 }, // Bottom-Left
      { x: leftX + sRect.width * 0.5, y: topY + sRect.height * 0.98 }   // Bottom-End (End)
    ];

    // PART 1: Slide to Top-Left Ledge (First two points of path)
    timeline.to(kesbewaRef.current, {
      motionPath: {
        path: sPath.slice(0, 2),
        curviness: 1,
      },
      duration: 0.6,
      ease: "power1.inOut",
    });

    // PART 2: LEDGE STOP EFFECT (The "Balancing" moment)
    // Mascot "breathes" and balances at the edge for realism
    timeline.to(kesbewaRef.current, {
      rotation: -15, // Tilt at edge
      scale: 1.05,  // Slight surge/breath
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
    });

    // PART 3: Slide down the "S" Curve to the bottom (Rest of the path)
    timeline.to(kesbewaRef.current, {
      motionPath: {
        path: sPath.slice(1), // From ledge to bottom
        curviness: 1,
        autoRotate: true,
      },
      duration: 1.0,
      ease: "power2.in", // Gravity feel
    });
      
    // Step 3: High-Arc Jump to Travelers (Continuing from Bottom End)
    timeline.to(kesbewaRef.current, {
      rotation: 0,
      x: travelersPos.x,
      y: travelersPos.y - CONFIG.jumps.travelers.arcHeight,
      duration: CONFIG.jumps.travelers.durationAscent,
      ease: "power2.out",
    });
    
    timeline.to(kesbewaRef.current, {
      y: travelersPos.y + CONFIG.jumps.travelers.yOffset,
      duration: CONFIG.jumps.travelers.durationDescent,
      ease: "power2.in",
    });

    timeline.to(kesbewaRef.current, {
      y: travelersPos.y - 10, // Final bounce landing
      ease: "bounce.out",
      duration: 0.5,
      onStart: () => {
        gsap.to(travelersRef.current, {
          textShadow: "0 0 20px rgba(255, 204, 0, 0.8), 0 0 40px rgba(255, 204, 0, 0.4)",
          color: "#FFCC00",
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
      }
    });

    // Step 4: Jump to Tours
    timeline.to(kesbewaRef.current, {
      x: toursPos.x,
      y: toursPos.y - CONFIG.jumps.tours.arcHeight,
      duration: CONFIG.jumps.tours.durationAscent,
      ease: "power1.out",
    });
    timeline.to(kesbewaRef.current, {
      y: toursPos.y + CONFIG.jumps.tours.yOffset,
      duration: CONFIG.jumps.tours.durationDescent,
      ease: "bounce.out",
      onStart: () => {
        gsap.to(toursRef.current, {
          textShadow: "0 0 20px rgba(255, 204, 0, 0.8), 0 0 40px rgba(255, 204, 0, 0.4)",
          color: "#FFCC00",
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
      }
    });

    // Step 5: Jump to Hotels
    timeline.to(kesbewaRef.current, {
      x: hotelsPos.x,
      y: hotelsPos.y - CONFIG.jumps.hotels.arcHeight,
      duration: CONFIG.jumps.hotels.durationAscent,
      ease: "power1.out",
    });
    timeline.to(kesbewaRef.current, {
      y: hotelsPos.y + CONFIG.jumps.hotels.yOffset,
      duration: CONFIG.jumps.hotels.durationDescent,
      ease: "bounce.out",
      onStart: () => {
        gsap.to(hotelsRef.current, {
          textShadow: "0 0 20px rgba(255, 204, 0, 0.8), 0 0 40px rgba(255, 204, 0, 0.4)",
          color: "#FFCC00",
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
      }
    });

    // Step 6: Move to Get Started button
    timeline.to(kesbewaRef.current, {
      x: buttonPos.x,
      y: buttonPos.y - CONFIG.buttonLanding.jumpArc,
      duration: CONFIG.buttonLanding.jumpDuration,
      ease: "power2.out",
    });

    // Step 7: Final landing on button
    timeline.to(kesbewaRef.current, {
      y: buttonPos.y - 20,
      scale: 1.3,
      duration: 0.4,
      ease: "power1.in",
      onComplete: () => {
        // Artistic Button Impact
        gsap.to(buttonRef.current, {
          scale: CONFIG.buttonLanding.buttonSquishScale,
          backgroundColor: "#secondary", // Quick color shift handle
          duration: CONFIG.buttonLanding.buttonSquishDuration,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(buttonRef.current, {
              scale: CONFIG.buttonLanding.buttonBounceScale,
              duration: 0.2,
              ease: "back.out(2)",
              onComplete: () => {
                gsap.to(buttonRef.current, {
                  scale: 1,
                  duration: CONFIG.buttonLanding.buttonRestoreDuration,
                  ease: "elastic.out(1, 0.3)",
                });
              }
            });
          }
        });

        // Mascot settle
        gsap.to(kesbewaRef.current, {
          scale: 1,
          y: buttonPos.y, // Settle exactly on the top border
          duration: CONFIG.buttonLanding.mascotSettleDuration,
          ease: "back.out(1.7)",
        });
      }
    });

    return () => {
      timeline.kill();
    };
  }, [kesbewaRef, travelersRef, toursRef, hotelsRef, buttonRef]);

  return (
    <div
      ref={kesbewaRef}
      className="absolute pointer-events-none z-50 w-16 h-16"
      style={{ left: 0, top: 0 }}
    >
      <img
        src="/kesbewa.png"
        alt="Kesbewa Mascot"
        className="w-full h-full object-contain drop-shadow-xl"
      />
    </div>
  );
};

export default HeroAnimation;
