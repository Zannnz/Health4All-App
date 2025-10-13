import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Heart, TrendingUp, Mountain, Calendar, Trophy, ArrowRight } from "lucide-react";
import logoPath from "@assets/image_1760032114124.png";

const introSlides = [
  {
    id: 1,
    title: "Your Personal Wellness Journey",
    description: "Track your fitness, monitor your health, and achieve your goals with personalized workout plans and comprehensive wellness tracking.",
    icon: Activity,
  },
  {
    id: 2,
    title: "Smart Workout Planning",
    description: "Create custom workout schedules for chest day, leg day, or rest day. Track heart rate, calories, and progress with precision.",
    icon: Calendar,
  },
  {
    id: 3,
    title: "Adventure Tracking",
    description: "Hiking mode tracks distance, elevation gain, and calories burned on your outdoor adventures.",
    icon: Mountain,
  },
  {
    id: 4,
    title: "Progress & Insights",
    description: "Weekly and monthly reports with visual charts show your fitness journey and celebrate your achievements.",
    icon: TrendingUp,
  },
];

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const nextSlide = () => {
    if (currentSlide < introSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowIntro(false);
    }
  };

  const skipIntro = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    const slide = introSlides[currentSlide];
    const IconComponent = slide.icon;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header with logo */}
        <div className="p-6 flex justify-between items-center">
          <img src={logoPath} alt="Health4All" className="h-12 w-auto" data-testid="img-logo" />
          <Button 
            variant="ghost" 
            onClick={skipIntro}
            data-testid="button-skip-intro"
          >
            Skip
          </Button>
        </div>

        {/* Main intro content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Icon with animation */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* Title and description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground leading-tight" data-testid="text-slide-title">
                {slide.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-slide-description">
                {slide.description}
              </p>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center gap-2">
              {introSlides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
                  }`}
                  data-testid={`indicator-slide-${index}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="p-6">
          <Button 
            className="w-full min-h-12" 
            onClick={nextSlide}
            data-testid="button-next-slide"
          >
            {currentSlide === introSlides.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Authentication screen
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and welcome */}
        <div className="text-center space-y-4">
          <img 
            src={logoPath} 
            alt="Health4All" 
            className="h-16 w-auto mx-auto" 
            data-testid="img-auth-logo"
          />
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-welcome-title">
              Welcome to Health4All
            </h1>
            <p className="mt-2 text-muted-foreground" data-testid="text-welcome-subtitle">
              Start your wellness journey today
            </p>
          </div>
        </div>

        {/* Authentication buttons */}
        <div className="space-y-4">
          <Button 
            className="w-full min-h-12"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            <Heart className="mr-2 w-5 h-5" />
            Continue with Email
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or</span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full min-h-12 bg-card"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-google-login"
          >
            <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
