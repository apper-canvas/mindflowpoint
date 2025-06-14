import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const BreathingVisualizer = ({ pattern = '4-7-8', onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(4);

  // Breathing patterns
  const patterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 1 },
    'box': { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    'simple': { inhale: 4, hold: 0, exhale: 6, pause: 2 }
  };

  const currentPattern = patterns[pattern] || patterns['4-7-8'];

  useEffect(() => {
    let interval;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 0.1);
      }, 100);
    } else if (isActive && timeLeft <= 0) {
      // Move to next phase
      if (phase === 'inhale') {
        if (currentPattern.hold > 0) {
          setPhase('hold');
          setTimeLeft(currentPattern.hold);
        } else {
          setPhase('exhale');
          setTimeLeft(currentPattern.exhale);
        }
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(currentPattern.exhale);
      } else if (phase === 'exhale') {
        if (currentPattern.pause > 0) {
          setPhase('pause');
          setTimeLeft(currentPattern.pause);
        } else {
          // Start new cycle
          setCycle(prev => prev + 1);
          setPhase('inhale');
          setTimeLeft(currentPattern.inhale);
        }
      } else if (phase === 'pause') {
        setCycle(prev => prev + 1);
        setPhase('inhale');
        setTimeLeft(currentPattern.inhale);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, currentPattern]);

  useEffect(() => {
    if (cycle >= totalCycles && isActive) {
      setIsActive(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [cycle, totalCycles, isActive, onComplete]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(currentPattern.inhale);
    setCycle(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(0);
    setCycle(0);
  };

  const getCircleScale = () => {
    if (phase === 'inhale') {
      return 1 + (0.5 * (1 - timeLeft / currentPattern.inhale));
    } else if (phase === 'exhale') {
      return 1.5 - (0.5 * (1 - timeLeft / currentPattern.exhale));
    }
    return phase === 'hold' ? 1.5 : 1;
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'pause':
        return 'Pause';
      default:
        return 'Ready?';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-secondary';
      case 'hold':
        return 'from-purple-400 to-primary';
      case 'exhale':
        return 'from-pink-400 to-accent';
      case 'pause':
        return 'from-gray-300 to-gray-400';
      default:
        return 'from-primary to-secondary';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: isActive ? getCircleScale() : 1,
          }}
          transition={{ 
            duration: isActive ? timeLeft : 0.5,
            ease: "easeInOut"
          }}
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-floating flex items-center justify-center`}
        >
          <motion.div
            animate={{ opacity: isActive ? [0.3, 1, 0.3] : 0.5 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center"
          >
            <ApperIcon name="Wind" size={32} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Timer Ring */}
        {isActive && (
          <svg className="absolute w-56 h-56 -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="104"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="112"
              cy="112"
              r="104"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 - (timeLeft / currentPattern[phase]) }}
              transition={{ duration: 0.1, ease: "linear" }}
              style={{ pathLength: 1 - (timeLeft / currentPattern[phase]) }}
            />
          </svg>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <Text variant="h2" className="text-gray-800">
          {getInstructions()}
        </Text>
        {isActive && (
          <Text color="muted">
            Cycle {cycle + 1} of {totalCycles}
          </Text>
        )}
        <Text size="sm" color="muted" className="capitalize">
          {pattern.replace('-', '-')} Pattern
        </Text>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        {!isActive ? (
          <Button
            onClick={startBreathing}
            icon="Play"
            size="lg"
            className="px-8"
          >
            Start Breathing
          </Button>
        ) : (
          <Button
            onClick={stopBreathing}
            variant="outline"
            icon="Square"
            size="lg"
            className="px-8"
          >
            Stop
          </Button>
        )}
      </div>

      {/* Pattern Info */}
      <div className="bg-surface rounded-lg p-4 text-center">
        <Text size="sm" color="muted" className="mb-2">
          Pattern: Inhale {currentPattern.inhale}s
          {currentPattern.hold > 0 && ` → Hold ${currentPattern.hold}s`}
          → Exhale {currentPattern.exhale}s
          {currentPattern.pause > 0 && ` → Pause ${currentPattern.pause}s`}
        </Text>
      </div>
    </div>
  );
};

export default BreathingVisualizer;