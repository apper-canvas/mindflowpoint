import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import SessionCard from '@/components/molecules/SessionCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SessionPlayer from '@/components/organisms/SessionPlayer';
import { sessionService } from '@/services';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  const sessionTypes = [
    { id: 'all', label: 'All Sessions', icon: 'Grid3X3' },
    { id: 'meditation', label: 'Meditation', icon: 'Brain' },
    { id: 'breathing', label: 'Breathing', icon: 'Wind' },
    { id: 'journaling', label: 'Journaling', icon: 'PenTool' }
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, selectedType]);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getAll();
      setSessions(data);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    if (selectedType === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.type === selectedType));
    }
  };

  const handleStartSession = (session) => {
    setSelectedSession(session);
  };

  const handleSessionComplete = () => {
    setSelectedSession(null);
    toast.success('Great job! Session completed!');
  };

  const getTypeStats = (type) => {
    if (type === 'all') return sessions.length;
    return sessions.filter(session => session.type === type).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <SkeletonLoader variant="text" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SkeletonLoader variant="card" count={4} />
          </div>
          <SkeletonLoader variant="card" count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorState message={error} onRetry={loadSessions} />
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
              Wellness Sessions 🧘‍♀️
            </Text>
            <Text color="muted" size="lg">
              Choose from meditation, breathing exercises, and journaling prompts
            </Text>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {sessionTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedType === type.id
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <ApperIcon name={type.icon} size={18} />
                <span>{type.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedType === type.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {getTypeStats(type.id)}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Sessions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredSessions.length === 0 ? (
              <EmptyState
                icon="Search"
                title="No sessions found"
                description={`No ${selectedType === 'all' ? '' : selectedType} sessions available at the moment`}
                actionLabel="View All Sessions"
                onAction={() => setSelectedType('all')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <SessionCard
                      session={session}
                      onStart={handleStartSession}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Session Type Info */}
          {selectedType !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-r from-surface to-white">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary rounded-lg">
                    <ApperIcon 
                      name={sessionTypes.find(t => t.id === selectedType)?.icon || 'Play'} 
                      size={24} 
                      className="text-white" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text variant="h4" className="mb-2 capitalize">
                      About {selectedType} Sessions
                    </Text>
                    <Text color="muted" className="break-words">
                      {selectedType === 'meditation' && 
                        'Guided meditations help you develop mindfulness, reduce stress, and cultivate inner peace through various techniques and practices.'}
                      {selectedType === 'breathing' && 
                        'Breathing exercises use specific patterns to calm your nervous system, reduce anxiety, and improve focus through controlled breath work.'}
                      {selectedType === 'journaling' && 
                        'Journaling sessions provide thoughtful prompts to help you process emotions, gain clarity, and develop self-awareness through writing.'}
                    </Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Session Player Modal */}
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

export default Sessions;