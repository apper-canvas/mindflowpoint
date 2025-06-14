import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import Spinner from '@/components/atoms/Spinner';
import ErrorState from '@/components/molecules/ErrorState';
import { userProgressService } from '@/services';

const StatsOverview = ({ className = '' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const progressData = await userProgressService.getStats();
      setStats(progressData);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadStats} />;
  }

  const statCards = [
    {
      id: 'streak',
      label: 'Day Streak',
      value: stats?.streak || 0,
      icon: 'Flame',
      color: 'text-orange-500 bg-orange-100',
      description: 'Consecutive days'
    },
    {
      id: 'sessions',
      label: 'Total Sessions',
      value: stats?.totalSessions || 0,
      icon: 'Play',
      color: 'text-primary bg-purple-100',
      description: 'Completed activities'
    },
    {
      id: 'favorite',
      label: 'Favorite Type',
      value: stats?.favoriteType || 'meditation',
      icon: 'Heart',
      color: 'text-accent bg-pink-100',
      description: 'Most used',
      isText: true
    },
    {
      id: 'meditation',
      label: 'Meditations',
      value: stats?.sessionCounts?.meditation || 0,
      icon: 'Brain',
      color: 'text-secondary bg-blue-100',
      description: 'Sessions completed'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-card transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <ApperIcon name={stat.icon} size={20} />
              </div>
              {stat.id === 'streak' && stat.value > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ApperIcon name="Sparkles" size={16} className="text-yellow-500" />
                </motion.div>
              )}
            </div>

            <div className="space-y-1">
              <Text variant="h3" className="text-gray-900">
                {stat.isText ? stat.value.charAt(0).toUpperCase() + stat.value.slice(1) : stat.value}
              </Text>
              <Text weight="medium" color="muted">
                {stat.label}
              </Text>
              <Text size="sm" color="light">
                {stat.description}
              </Text>
            </div>

            {/* Progress indicator for sessions */}
            {stat.id === 'sessions' && stat.value > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress to next milestone</span>
                  <span>{stat.value % 10}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value % 10) * 10}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full"
                  />
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;