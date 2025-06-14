import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';
import JournalEditor from '@/components/molecules/JournalEditor';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { journalEntryService, moodCheckInService } from '@/services';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await journalEntryService.getAll();
      setEntries(data);
    } catch (err) {
      setError(err.message || 'Failed to load journal entries');
      toast.error('Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = async () => {
    try {
      // Get today's mood to generate relevant prompt
      const todayMood = await moodCheckInService.getTodaysMood();
      const prompt = await journalEntryService.generatePrompt(
        todayMood?.emotion || 'calm',
        todayMood?.intensity || 5
      );
      
      setCurrentPrompt(prompt);
      setEditingEntry(null);
      setShowEditor(true);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setCurrentPrompt('What thoughts and feelings would you like to explore today?');
      setShowEditor(true);
    }
  };

  const handleEditEntry = (entry) => {
    setCurrentPrompt(entry.prompt);
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleSaveEntry = async (content) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const updated = await journalEntryService.update(editingEntry.id, { 
          content,
          prompt: currentPrompt 
        });
        setEntries(prev => prev.map(entry => 
          entry.id === editingEntry.id ? updated : entry
        ));
        toast.success('Journal entry updated!');
      } else {
        // Create new entry
        const newEntry = await journalEntryService.create({
          prompt: currentPrompt,
          content
        });
        setEntries(prev => [newEntry, ...prev]);
        toast.success('Journal entry saved!');
      }
      setShowEditor(false);
      setEditingEntry(null);
      setCurrentPrompt('');
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await journalEntryService.delete(entryId);
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Entry deleted');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const getWordCount = (content) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowEditor(false)}
              icon="ArrowLeft"
              iconPosition="left"
            >
              Back to Journal
            </Button>
          </div>
          <JournalEditor
            prompt={currentPrompt}
            initialContent={editingEntry?.content || ''}
            onSave={handleSaveEntry}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <SkeletonLoader variant="text" />
          <SkeletonLoader variant="list" count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorState message={error} onRetry={loadEntries} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
        >
          <div>
            <Text variant="display" className="mb-2">
              Journal 📖
            </Text>
            <Text color="muted" size="lg">
              Reflect, process, and grow through mindful writing
            </Text>
          </div>
          <Button
            onClick={handleNewEntry}
            icon="Plus"
            iconPosition="left"
            size="lg"
          >
            New Entry
          </Button>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <ApperIcon name="BookOpen" size={20} className="text-primary" />
                  <Text variant="h4">{entries.length}</Text>
                </div>
                <Text color="muted">Total Entries</Text>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <ApperIcon name="FileText" size={20} className="text-secondary" />
                  <Text variant="h4">
                    {entries.reduce((total, entry) => total + getWordCount(entry.content), 0)}
                  </Text>
                </div>
                <Text color="muted">Words Written</Text>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <ApperIcon name="Calendar" size={20} className="text-accent" />
                  <Text variant="h4">
                    {entries.length > 0 ? format(new Date(entries[0].timestamp), 'MMM d') : '-'}
                  </Text>
                </div>
                <Text color="muted">Last Entry</Text>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Entries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {entries.length === 0 ? (
            <EmptyState
              icon="PenTool"
              title="Start your journaling journey"
              description="Writing helps you process emotions, gain clarity, and track your personal growth over time."
              actionLabel="Write First Entry"
              onAction={handleNewEntry}
            />
          ) : (
            <div className="space-y-6">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-card transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                          <Text size="sm" color="muted">
                            {format(new Date(entry.timestamp), 'EEEE, MMMM d, yyyy • h:mm a')}
                          </Text>
                        </div>
                        
                        {entry.prompt && (
                          <div className="mb-4 p-3 bg-surface rounded-lg border-l-4 border-primary">
                            <div className="flex items-start space-x-2">
                              <ApperIcon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                              <Text size="sm" color="muted" className="italic break-words">
                                {entry.prompt}
                              </Text>
                            </div>
                          </div>
                        )}
                        
                        <Text className="break-words leading-relaxed">
                          {entry.content.length > 300 
                            ? `${entry.content.substring(0, 300)}...` 
                            : entry.content
                          }
                        </Text>
                        
                        <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <ApperIcon name="FileText" size={14} />
                            <Text size="xs">{getWordCount(entry.content)} words</Text>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          onClick={() => handleEditEntry(entry)}
                          icon="Edit"
                          className="!p-2"
                        />
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteEntry(entry.id)}
                          icon="Trash2"
                          className="!p-2 text-error hover:bg-red-50"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Writing Tips */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-info rounded-lg">
                  <ApperIcon name="Lightbulb" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text variant="h5" className="mb-2">
                    Journaling Tips
                  </Text>
                  <div className="space-y-2">
                    <Text size="sm" color="muted">
                      • Write without editing yourself - let thoughts flow naturally
                    </Text>
                    <Text size="sm" color="muted">
                      • Focus on how you feel, not just what happened
                    </Text>
                    <Text size="sm" color="muted">
                      • Try to write regularly, even if it's just a few sentences
                    </Text>
                    <Text size="sm" color="muted">
                      • Be honest and compassionate with yourself
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Journal;