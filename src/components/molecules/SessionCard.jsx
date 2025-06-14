import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';

const SessionCard = ({ session, recommended = false, onStart, className = '' }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getTypeIcon = (type) => {
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'meditation':
        return 'text-primary bg-purple-100';
      case 'breathing':
        return 'text-secondary bg-blue-100';
      case 'journaling':
        return 'text-accent bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card
      variant="default"
      hover={true}
      className={`relative overflow-hidden ${className}`}
    >
      {recommended && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-accent to-pink-400 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Sparkles" size={12} />
            <span>AI Recommended</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${getTypeColor(session.type)}`}>
            <ApperIcon name={getTypeIcon(session.type)} size={20} />
          </div>
          <div className="text-right">
            <Text size="sm" color="muted" className="capitalize">
              {session.type}
            </Text>
            <Text size="sm" weight="semibold" color="muted">
              {formatDuration(session.duration)}
            </Text>
          </div>
        </div>

        <div className="mb-4">
          <Text variant="h4" className="mb-2 break-words">
            {session.title}
          </Text>
          <Text color="muted" className="text-sm break-words">
            {session.description}
          </Text>
        </div>

        <Button
          onClick={() => onStart(session)}
          className="w-full"
          icon="Play"
          iconPosition="left"
        >
          Start Session
        </Button>
      </div>
    </Card>
  );
};

export default SessionCard;