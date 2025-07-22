import { useState, useRef, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { PaymentScreen } from './PaymentScreen';

type Screen = 'welcome' | 'payment';

export const PhotoboothApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (currentScreen !== 'welcome') return;
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (currentScreen !== 'welcome' || isTransitioning) return;
    
    currentXRef.current = e.touches[0].clientX;
    const diff = startXRef.current - currentXRef.current;
    
    if (diff > 0 && containerRef.current) {
      // Swiping left (showing preview of next screen)
      const translateX = Math.min(diff, 100);
      containerRef.current.style.transform = `translateX(-${translateX}px)`;
      containerRef.current.style.opacity = `${Math.max(0.7, 1 - (translateX / 200))}`;
    }
  };

  const handleTouchEnd = () => {
    if (currentScreen !== 'welcome' || isTransitioning) return;
    
    const diff = startXRef.current - currentXRef.current;
    const threshold = 100; // Minimum swipe distance
    
    if (containerRef.current) {
      if (diff > threshold) {
        // Swipe successful, transition to payment screen
        handleSwipeNext();
      } else {
        // Swipe not far enough, reset position
        containerRef.current.style.transform = 'translateX(0)';
        containerRef.current.style.opacity = '1';
      }
    }
  };

  // Mouse event handlers for desktop support
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentScreen !== 'welcome') return;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (currentScreen !== 'welcome' || isTransitioning) return;
      
      currentXRef.current = e.clientX;
      const diff = startXRef.current - currentXRef.current;
      
      if (diff > 0 && containerRef.current) {
        const translateX = Math.min(diff, 100);
        containerRef.current.style.transform = `translateX(-${translateX}px)`;
        containerRef.current.style.opacity = `${Math.max(0.7, 1 - (translateX / 200))}`;
      }
    };
    
    const handleMouseUp = () => {
      if (currentScreen !== 'welcome' || isTransitioning) return;
      
      const diff = startXRef.current - currentXRef.current;
      const threshold = 100;
      
      if (containerRef.current) {
        if (diff > threshold) {
          handleSwipeNext();
        } else {
          containerRef.current.style.transform = 'translateX(0)';
          containerRef.current.style.opacity = '1';
        }
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSwipeNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (containerRef.current) {
      // Animate the swipe transition
      containerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
      containerRef.current.style.transform = 'translateX(-100%)';
      containerRef.current.style.opacity = '0';
      
      setTimeout(() => {
        setCurrentScreen('payment');
        if (containerRef.current) {
          containerRef.current.style.transition = '';
          containerRef.current.style.transform = 'translateX(0)';
          containerRef.current.style.opacity = '1';
        }
        setIsTransitioning(false);
      }, 500);
    } else {
      setCurrentScreen('payment');
      setIsTransitioning(false);
    }
  };

  const handleBack = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (containerRef.current) {
      // Animate the back transition
      containerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
      containerRef.current.style.transform = 'translateX(100%)';
      containerRef.current.style.opacity = '0';
      
      setTimeout(() => {
        setCurrentScreen('welcome');
        if (containerRef.current) {
          containerRef.current.style.transition = '';
          containerRef.current.style.transform = 'translateX(0)';
          containerRef.current.style.opacity = '1';
        }
        setIsTransitioning(false);
      }, 500);
    } else {
      setCurrentScreen('welcome');
      setIsTransitioning(false);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentScreen === 'welcome') {
        handleSwipeNext();
      } else if (e.key === 'ArrowLeft' && currentScreen === 'payment') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <div
        ref={containerRef}
        className="w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease' : 'none'
        }}
      >
        {currentScreen === 'welcome' && (
          <WelcomeScreen onSwipeNext={handleSwipeNext} />
        )}
        
        {currentScreen === 'payment' && (
          <PaymentScreen onBack={handleBack} />
        )}
      </div>
      
      {/* Loading overlay during transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};