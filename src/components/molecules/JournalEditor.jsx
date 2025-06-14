import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const JournalEditor = ({ prompt, initialContent = '', onSave, onCancel }) => {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleSave = async () => {
    if (content.trim().length === 0) return;
    
    setIsSaving(true);
    try {
      await onSave(content.trim());
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = content.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-soft p-6 max-w-full overflow-hidden"
    >
      {/* Prompt */}
      {prompt && (
        <div className="mb-6 p-4 bg-surface rounded-lg border-l-4 border-primary">
          <div className="flex items-start space-x-2">
            <ApperIcon name="Lightbulb" size={20} className="text-primary mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Text weight="medium" className="text-primary mb-1">
                Writing Prompt
              </Text>
              <Text color="muted" className="break-words">
                {prompt}
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            rows={12}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none transition-colors duration-200 text-base leading-relaxed max-w-full"
            style={{ minHeight: '300px' }}
          />
          
          {/* Word count */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
            {wordCount} words
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onCancel}
            icon="X"
            iconPosition="left"
          >
            Cancel
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setContent('')}
              disabled={content.length === 0}
              icon="RotateCcw"
              iconPosition="left"
            >
              Clear
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              loading={isSaving}
              icon="Save"
              iconPosition="left"
            >
              Save Entry
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEditor;