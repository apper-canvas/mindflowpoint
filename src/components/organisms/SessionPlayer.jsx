import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import BreathingVisualizer from '@/components/molecules/BreathingVisualizer';
import JournalEditor from '@/components/molecules/JournalEditor';
import { journalEntryService, userProgressService } from '@/services';

const SessionPlayer = ({ session, onClose, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(session.duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState('');

  useEffect(() => {
    let interval;
    
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / session.duration);
          if (newProgress >= 100) {
            setIsCompleted(true);
            setIsPlaying(false);
            handleSessionComplete();
            return 100;
          }
          return newProgress;
        });

        setTimeRemaining(prev => {
          const newTime = prev - 1;
          return newTime <= 0 ? 0 : newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, session.duration]);

  const handleSessionComplete = async () => {
    try {
      await userProgressService.incrementSessions(session.type);
      await userProgressService.incrementStreak();
      
      if (session.type === 'journaling') {
        // Generate a journal prompt
        const prompt = await journalEntryService.generatePrompt('calm', 7);
        setShowJournalPrompt(prompt);
      } else {
        toast.success('Session completed! Great job!');
        onComplete();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Session completed, but failed to update progress');
      onComplete();
    }
  };

  const handleJournalSave = async (content) => {
    try {
      await journalEntryService.create({
        prompt: showJournalPrompt,
        content: content
      });
      toast.success('Journal entry saved!');
      onComplete();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry');
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (type) => {
    switch (type) {
      case 'meditation':
        return 'Brain';
      case 'breathing':
        return 'Wind';
      case 'journaling':
        return 'PenTool';
      default:
        return 'Play';
    }
  };

  // Show journal editor if journaling session is completed
  if (showJournalPrompt) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
      >
        <div className="min-h-screen p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={onClose}
                icon="ArrowLeft"
                iconPosition="left"
              >
                Back
              </Button>
            </div>
            <JournalEditor
              prompt={showJournalPrompt}
              onSave={handleJournalSave}
              onCancel={onClose}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Show breathing visualizer for breathing sessions
  if (session.type === 'breathing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 overflow-y-auto"
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <Button
              variant="ghost"
              onClick={onClose}
              icon="ArrowLeft"
              iconPosition="left"
            >
              Back
            </Button>
            <div className="text-center">
              <Text variant="h4">{session.title}</Text>
              <Text size="sm" color="muted">{formatTime(session.duration)}</Text>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>

          {/* Breathing Visualizer */}
          <div className="flex-1 flex items-center justify-center">
            <BreathingVisualizer
              pattern="4-7-8"
              onComplete={handleSessionComplete}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Default session player for meditation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-50 to-blue-50 z-50 overflow-y-auto"
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            onClick={onClose}
            icon="ArrowLeft"
            iconPosition="left"
          >
            Back
          </Button>
          <div className="text-center">
            <Text variant="h4">{session.title}</Text>
            <Text size="sm" color="muted" className="capitalize">
              {session.type} • {formatTime(session.duration)}
            </Text>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Session Icon */}
          <motion.div
            animate={{ 
              scale: isPlaying ? [1, 1.1, 1] : 1,
              rotate: isCompleted ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 2, repeat: isPlaying ? Infinity : 0 },
              rotate: { duration: 1 }
            }}
            className="w-32 h-32 mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-floating"
          >
            <ApperIcon 
              name={isCompleted ? 'Check' : getSessionIcon(session.type)} 
              size={48} 
              className="text-white" 
            />
          </motion.div>

          {/* Progress Circle */}
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6B5B95" />
                  <stop offset="100%" stopColor="#88B0D3" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Text variant="h2" className="text-primary">
                {formatTime(timeRemaining)}
              </Text>
              <Text size="sm" color="muted">
                {Math.round(progress)}% complete
              </Text>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-8 max-w-md">
            <Text color="muted" className="break-words">
              {session.description}
            </Text>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {!isCompleted ? (
              <>
                <Button
                  onClick={togglePlayPause}
                  size="lg"
                  icon={isPlaying ? 'Pause' : 'Play'}
                  className="px-8"
                >
                  {isPlaying ? 'Pause' : 'Start'}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  icon="Square"
                  size="lg"
                >
                  Stop
                </Button>
              </>
            ) : (
              <Button
                onClick={onComplete}
                size="lg"
                icon="Check"
                className="px-8"
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionPlayer;