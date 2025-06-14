import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MoodSelector from '@/components/molecules/MoodSelector';
import { moodCheckInService } from '@/services';

const MoodCheckInModal = ({ isOpen, onClose, onMoodSubmitted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSelect = async (moodData) => {
    setIsSubmitting(true);
    try {
      const newMoodCheckIn = await moodCheckInService.create(moodData);
      toast.success('Mood check-in saved!');
      onMoodSubmitted(newMoodCheckIn);
      onClose();
    } catch (error) {
      console.error('Error saving mood check-in:', error);
      toast.error('Failed to save mood check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-floating max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Heart" size={20} className="text-white" />
                  </div>
                  <div>
                    <Text variant="h4">Daily Check-in</Text>
                    <Text size="sm" color="muted">How are you feeling today?</Text>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  icon="X"
                  className="!p-2"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {isSubmitting ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 mx-auto mb-4"
                    >
                      <ApperIcon name="Loader2" size={48} className="text-primary" />
                    </motion.div>
                    <Text>Saving your mood...</Text>
                  </div>
                ) : (
                  <MoodSelector onMoodSelect={handleMoodSelect} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoodCheckInModal;