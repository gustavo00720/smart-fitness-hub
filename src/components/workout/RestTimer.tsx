import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from "lucide-react";

interface RestTimerProps {
  seconds: number;
  onComplete: () => void;
  onClose: () => void;
}

const RestTimer = ({ seconds, onComplete, onClose }: RestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdW5xZXJocX59gpSAeoqGc3V7cW1/eH+HdXtxeX98hX17gnlzfIJ+f3l2bm9zdHl0f4F+fIR9foB5e3Z2cm9ucG1zdHl8f4SFhX+Ee3p4eHRxdXV2d3Z2d3d4eXp7fH5/gICAf35+fX59fn9/f39/f4CAgICAgICAgICBgYGBgYGBgYGBgYKCgoKCgoKCgoKCgoODg4ODg4ODg4ODg4SEhISEhISEhISEhISEhYWFhYWFhYWFhYWFhYaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhg==");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      playSound();
      onComplete();
      return;
    }

    if (timeLeft <= 3 && timeLeft > 0) {
      playSound();
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRunning, onComplete, playSound]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const progress = ((seconds - timeLeft) / seconds) * 100;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center p-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X className="w-6 h-6" />
        </Button>

        <p className="text-muted-foreground text-lg mb-4">Descanso</p>
        
        {/* Circular Progress */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
                <stop offset="100%" stopColor="hsl(15, 90%, 55%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-display font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-12 h-12 rounded-full"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="hero"
            size="lg"
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="w-12 h-12 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onComplete}
          className="mt-6"
        >
          Pular descanso
        </Button>
      </div>
    </div>
  );
};

export default RestTimer;
