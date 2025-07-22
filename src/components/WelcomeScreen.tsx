import { Camera, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import curtainsBg from '@/assets/curtains-bg.jpg';
import cameraIcon from '@/assets/camera-icon.jpg';

interface WelcomeScreenProps {
  onSwipeNext: () => void;
}

export const WelcomeScreen = ({ onSwipeNext }: WelcomeScreenProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with curtains */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${curtainsBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Curtain overlay effect */}
      <div className="absolute inset-0 bg-gradient-curtain opacity-20" />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 rounded-full bg-gradient-maroon p-4 shadow-2xl animate-pulse">
            <img 
              src={cameraIcon} 
              alt="Photobooth Camera" 
              className="w-full h-full object-contain opacity-90"
            />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-gold animate-bounce" />
          </div>
        </div>

        {/* Welcome text */}
        <div className="mb-12 space-y-4">
          <h1 className="text-6xl font-bold text-foreground tracking-wide">
            Selamat Datang
          </h1>
          <h2 className="text-4xl font-semibold text-accent">
            Di Photobooth Kami
          </h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
            Abadikan momen indah Anda dengan foto profesional berkualitas tinggi
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-6">
          <Button
            onClick={onSwipeNext}
            size="lg"
            className="bg-gradient-maroon hover:bg-maroon-light text-2xl py-6 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-gold/30"
          >
            <Camera className="mr-4 h-8 w-8" />
            Mulai Photoshoot
            <ChevronRight className="ml-4 h-8 w-8" />
          </Button>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span className="text-lg">Geser ke kanan untuk melanjutkan</span>
            <ChevronRight className="h-6 w-6 animate-bounce" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-gold rounded-full animate-ping" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-accent rounded-full animate-ping delay-150" />
        <div className="absolute bottom-20 left-16 w-2 h-2 bg-gold rounded-full animate-ping delay-300" />
      </div>

      {/* Touch indicator for mobile */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center text-muted-foreground">
        <div className="flex space-x-1 mb-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-150" />
        </div>
        <span className="text-sm">Swipe →</span>
      </div>
    </div>
  );
};