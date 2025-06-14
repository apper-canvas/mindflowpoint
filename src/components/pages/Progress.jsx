import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import ProgressChart from '@/components/molecules/ProgressChart';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import StatsOverview from '@/components/organisms/StatsOverview';
import { moodCheckInService, userProgressService, journalEntryService } from '@/services';

const Progress = () => {
  const [moodData, setMoodData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moods, entries, stats] = await Promise.all([
        moodCheckInService.getRecent(30), // Last 30 days
        journalEntryService.getRecentEntries(10),
        userProgressService.getStats()
      ]);

      setMoodData(moods);
      setJournalEntries(entries);
      setUserStats(stats);
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const getMoodInsights = () => {
    if (moodData.length === 0) return null;

    const last7Days = moodData.slice(0, 7);
    const avgIntensity = last7Days.reduce((sum, mood) => sum + mood.intensity, 0) / last7Days.length;
    
    const emotionCounts = last7Days.reduce((counts, mood) => {
      counts[mood.emotion] = (counts[mood.emotion] || 0) + 1;
      return counts;
    }, {});

    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return {
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      mostFrequentEmotion,
      totalCheckIns: last7Days.length
    };
  };

  const getActivitySummary = () => {
    if (!userStats) return null;

    const thisWeekStart = startOfWeek(new Date());
    const thisWeekEnd = endOfWeek(new Date());
    
    // This is a simplified calculation - in a real app you'd track sessions by date
    const weeklyTarget = 5; // sessions per week
    const currentWeekSessions = Math.min(userStats.totalSessions % 7, weeklyTarget);

    return {
      weeklyProgress: (currentWeekSessions / weeklyTarget) * 100,
      currentWeekSessions,
      weeklyTarget,
      streak: userStats.streak
    };
  };

  const insights = getMoodInsights();
  const activity = getActivitySummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <SkeletonLoader variant="text" />
          <SkeletonLoader variant="card" count={4} />
          <SkeletonLoader variant="card" className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorState message={error} onRetry={loadProgressData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          <Text variant="display" className="mb-2">
            Your Progress 📊
          </Text>
          <Text color="muted" size="lg">
            Track your wellness journey and celebrate your growth
          </Text>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsOverview />
        </motion.div>

        {/* Weekly Summary */}
        {activity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success rounded-lg">
                    <ApperIcon name="Target" size={20} className="text-white" />
                  </div>
                  <div>
                    <Text variant="h4">This Week's Progress</Text>
                    <Text color="muted">
                      {format(startOfWeek(new Date()), 'MMM d')} - {format(endOfWeek(new Date()), 'MMM d')}
                    </Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text variant="h3" className="text-success">
                    {activity.currentWeekSessions}/{activity.weeklyTarget}
                  </Text>
                  <Text size="sm" color="muted">Sessions</Text>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <Text color="muted">Weekly Goal Progress</Text>
                  <Text weight="medium">{Math.round(activity.weeklyProgress)}%</Text>
                </div>
                <div className="w-full bg-white rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activity.weeklyProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-success to-info h-3 rounded-full"
                  />
                </div>
                
                {activity.streak > 0 && (
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <ApperIcon name="Flame" size={16} className="text-orange-500" />
                    <Text size="sm" weight="medium">
                      {activity.streak} day{activity.streak !== 1 ? 's' : ''} streak! Keep it up! 🔥
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Mood Insights */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-secondary" />
              </div>
              <Text variant="h3" className="mb-1">
                {insights.avgIntensity}/10
              </Text>
              <Text weight="medium" color="muted" className="mb-1">
                Average Mood
              </Text>
              <Text size="sm" color="light">
                Last 7 days
              </Text>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Heart" size={24} className="text-primary" />
              </div>
              <Text variant="h3" className="mb-1 capitalize">
                {insights.mostFrequentEmotion || 'N/A'}
              </Text>
              <Text weight="medium" color="muted" className="mb-1">
                Most Common
              </Text>
              <Text size="sm" color="light">
                This week
              </Text>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-success" />
              </div>
              <Text variant="h3" className="mb-1">
                {insights.totalCheckIns}
              </Text>
              <Text weight="medium" color="muted" className="mb-1">
                Check-ins
              </Text>
              <Text size="sm" color="light">
                Last 7 days
              </Text>
            </Card>
          </motion.div>
        )}

        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProgressChart moodData={moodData} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-accent rounded-lg">
                <ApperIcon name="Activity" size={20} className="text-white" />
              </div>
              <div>
                <Text variant="h4">Recent Journal Entries</Text>
                <Text color="muted">Your latest reflections and insights</Text>
              </div>
            </div>

            {journalEntries.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="BookOpen" size={32} className="text-gray-300 mx-auto mb-4" />
                <Text color="muted">No journal entries yet</Text>
                <Text size="sm" color="light">Start writing to see your thoughts here</Text>
              </div>
            ) : (
              <div className="space-y-4">
                {journalEntries.slice(0, 3).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <ApperIcon name="Calendar" size={14} className="text-gray-400" />
                      <Text size="sm" color="muted">
                        {format(new Date(entry.timestamp), 'MMM d, yyyy')}
                      </Text>
                    </div>
                    <Text className="break-words">
                      {entry.content.length > 150 
                        ? `${entry.content.substring(0, 150)}...` 
                        : entry.content
                      }
                    </Text>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <ApperIcon name="Award" size={20} className="text-white" />
              </div>
              <div>
                <Text variant="h4">Achievements</Text>
                <Text color="muted">Celebrate your wellness milestones</Text>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* First Session */}
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Play" size={16} className="text-success" />
                </div>
                <div>
                  <Text size="sm" weight="medium">First Session</Text>
                  <Text size="xs" color="muted">
                    {userStats?.totalSessions > 0 ? 'Completed' : 'Pending'}
                  </Text>
                </div>
              </div>

              {/* Week Streak */}
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Flame" size={16} className="text-orange-500" />
                </div>
                <div>
                  <Text size="sm" weight="medium">7-Day Streak</Text>
                  <Text size="xs" color="muted">
                    {userStats?.streak >= 7 ? 'Completed' : `${userStats?.streak || 0}/7`}
                  </Text>
                </div>
              </div>

              {/* Journal Writer */}
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="PenTool" size={16} className="text-primary" />
                </div>
                <div>
                  <Text size="sm" weight="medium">Journal Writer</Text>
                  <Text size="xs" color="muted">
                    {journalEntries.length > 0 ? 'Completed' : 'Pending'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;