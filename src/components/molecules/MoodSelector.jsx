import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const MoodSelector = ({ onMoodSelect, initialMood = null }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(initialMood?.emotion || '');
  const [intensity, setIntensity] = useState(initialMood?.intensity || 5);
  const [notes, setNotes] = useState(initialMood?.notes || '');

  const emotions = [
    { id: 'happy', label: 'Happy', icon: 'Smile', color: 'text-yellow-500' },
    { id: 'calm', label: 'Calm', icon: 'Waves', color: 'text-blue-400' },
    { id: 'grateful', label: 'Grateful', icon: 'Heart', color: 'text-pink-500' },
    { id: 'anxious', label: 'Anxious', icon: 'Zap', color: 'text-orange-500' },
    { id: 'stressed', label: 'Stressed', icon: 'AlertTriangle', color: 'text-red-500' },
    { id: 'sad', label: 'Sad', icon: 'CloudRain', color: 'text-gray-500' }
  ];

  const handleSubmit = () => {
    if (selectedEmotion && onMoodSelect) {
      onMoodSelect({
        emotion: selectedEmotion,
        intensity,
        notes: notes.trim()
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Emotion Wheel */}
      <div>
        <Text variant="h4" className="mb-4 text-center">How are you feeling?</Text>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emotions.map((emotion, index) => (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEmotion(emotion.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedEmotion === emotion.id
                  ? 'border-primary bg-purple-50 shadow-soft'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`${emotion.color} ${selectedEmotion === emotion.id ? 'animate-pulse' : ''}`}>
                  <ApperIcon name={emotion.icon} size={28} />
                </div>
                <Text size="sm" weight="medium" className={selectedEmotion === emotion.id ? 'text-primary' : 'text-gray-700'}>
                  {emotion.label}
                </Text>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <Text variant="h5" className="mb-2">Intensity Level</Text>
            <div className="px-4">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #6B5B95 0%, #6B5B95 ${(intensity - 1) * 11.11}%, #e5e7eb ${(intensity - 1) * 11.11}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span className="text-primary font-semibold">{intensity}/10</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Text variant="h5" className="mb-2">Notes (Optional)</Text>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none transition-colors duration-200"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full"
            icon="ArrowRight"
            iconPosition="right"
          >
            Continue
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MoodSelector;