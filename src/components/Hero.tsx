import { Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-80" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 text-primary-purple/30 animate-float">
        <Music size={80} />
      </div>
      <div className="absolute bottom-32 right-32 text-primary-blue/30 animate-float" style={{ animationDelay: '2s' }}>
        <Music size={60} />
      </div>
      <div className="absolute top-32 right-20 text-primary-pink/30 animate-float" style={{ animationDelay: '4s' }}>
        <Music size={40} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">Rhythmic</span>
            <br />
            <span className="text-white">Tunes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover, stream, and experience music like never before. 
            Your perfect soundtrack awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="glass-card glow-effect group min-w-[200px]">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Listening
            </Button>
            <Button variant="outline" size="lg" className="glass-card border-white/20 text-white hover:bg-white/10 min-w-[200px]">
              Browse Music
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;