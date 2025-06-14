import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import SessionCard from '@/components/molecules/SessionCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import MoodCheckInModal from '@/components/organisms/MoodCheckInModal';
import SessionPlayer from '@/components/organisms/SessionPlayer';
import { moodCheckInService, sessionService, userProgressService } from '@/services';

const Home = () => {
  const [todaysMood, setTodaysMood] = useState(null);
  const [recommendedSessions, setRecommendedSessions] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moodData, progressData] = await Promise.all([
        moodCheckInService.getTodaysMood(),
        userProgressService.get()
      ]);

      setTodaysMood(moodData);
      setUserProgress(progressData);

      // Get recommended sessions based on mood
      let sessions = [];
      if (moodData) {
        sessions = await sessionService.getRecommended(moodData.intensity, moodData.emotion);
      } else {
        // Default recommendations for new users
        sessions = await sessionService.getAll();
        sessions = sessions.slice(0, 3);
      }
      setRecommendedSessions(sessions);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmitted = async (newMood) => {
    setTodaysMood(newMood);
    
    // Refresh recommended sessions based on new mood
    try {
      const sessions = await sessionService.getRecommended(newMood.intensity, newMood.emotion);
      setRecommendedSessions(sessions);
    } catch (error) {
      console.error('Error loading recommended sessions:', error);
    }
  };

  const handleStartSession = (session) => {
    setSelectedSession(session);
  };

  const handleSessionComplete = async () => {
    setSelectedSession(null);
    toast.success('Great job! Session completed!');
    
    // Refresh user progress
    try {
      const progressData = await userProgressService.get();
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  };

  const getMoodEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      calm: '😌',
      grateful: '🙏',
      anxious: '😰',
      stressed: '😤',
      sad: '😢'
    };
    return emojis[emotion] || '😊';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <SkeletonLoader variant="text" />
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorState message={error} onRetry={loadHomeData} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <Text variant="display" className="mb-2">
              {getGreeting()}! ✨
            </Text>
            <Text color="muted" size="lg">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </Text>
          </motion.div>

          {/* Mood Check-in Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-0">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <ApperIcon name="Heart" size={24} className="text-white" />
                  </div>
                  <div>
                    {todaysMood ? (
                      <>
                        <div className="flex items-center space-x-2 mb-1">
                          <Text variant="h4">Today's Mood</Text>
                          <span className="text-2xl">{getMoodEmoji(todaysMood.emotion)}</span>
                        </div>
                        <Text color="muted">
                          Feeling {todaysMood.emotion} • Intensity: {todaysMood.intensity}/10
                        </Text>
                        {todaysMood.notes && (
                          <Text size="sm" color="light" className="mt-1 italic max-w-md break-words">
                            "{todaysMood.notes}"
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        <Text variant="h4" className="mb-1">Daily Check-in</Text>
                        <Text color="muted">How are you feeling today?</Text>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {userProgress && (
                    <div className="text-center">
                      <div className="flex items-center space-x-1 mb-1">
                        <ApperIcon name="Flame" size={16} className="text-orange-500" />
                        <Text weight="bold" className="text-lg">{userProgress.streak}</Text>
                      </div>
                      <Text size="sm" color="muted">Day streak</Text>
                    </div>
                  )}
                  <Button
                    onClick={() => setShowMoodModal(true)}
                    icon={todaysMood ? "Edit" : "Plus"}
                    iconPosition="left"
                  >
                    {todaysMood ? "Update Mood" : "Check In"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-accent to-pink-300 rounded-lg">
                <ApperIcon name="Sparkles" size={20} className="text-white" />
              </div>
              <div>
                <Text variant="h3">
                  {todaysMood ? 'Recommended for You' : 'Popular Sessions'}
                </Text>
                <Text color="muted">
                  {todaysMood 
                    ? `AI-curated based on your ${todaysMood.emotion} mood`
                    : 'Start your wellness journey with these sessions'
                  }
                </Text>
              </div>
            </div>

            {recommendedSessions.length === 0 ? (
              <EmptyState
                icon="Brain"
                title="No sessions available"
                description="Check back later for personalized recommendations"
                actionLabel="Browse All Sessions"
                onAction={() => navigate('/sessions')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <SessionCard
                      session={session}
                      recommended={true}
                      onStart={handleStartSession}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          {userProgress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Card className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-primary">
                  <ApperIcon name="Play" size={32} />
                </div>
                <Text variant="h4">{userProgress.totalSessions}</Text>
                <Text size="sm" color="muted">Total Sessions</Text>
              </Card>

              <Card className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-secondary">
                  <ApperIcon name="Brain" size={32} />
                </div>
                <Text variant="h4">{userProgress.sessionCounts?.meditation || 0}</Text>
                <Text size="sm" color="muted">Meditations</Text>
              </Card>

              <Card className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-info">
                  <ApperIcon name="Wind" size={32} />
                </div>
                <Text variant="h4">{userProgress.sessionCounts?.breathing || 0}</Text>
                <Text size="sm" color="muted">Breathing</Text>
              </Card>

              <Card className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-accent">
                  <ApperIcon name="PenTool" size={32} />
                </div>
                <Text variant="h4">{userProgress.sessionCounts?.journaling || 0}</Text>
                <Text size="sm" color="muted">Journal Entries</Text>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MoodCheckInModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onMoodSubmitted={handleMoodSubmitted}
      />

      {selectedSession && (
        <SessionPlayer
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onComplete={handleSessionComplete}
        />
      )}
    </>
  );
};

export default Home;