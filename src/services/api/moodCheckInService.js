import mockMoodCheckInData from '@/services/mockData/moodCheckIn.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MoodCheckInService {
  constructor() {
    this.storageKey = 'mindflow_mood_checkins';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Validate that parsed data is an array
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
        console.warn('Stored mood check-in data is not an array, resetting to mock data');
      }
    } catch (error) {
      console.error('Error loading mood check-ins from localStorage:', error);
    }
    
    // Load initial mock data and save it
    const initialData = [...mockMoodCheckInData];
    this.saveData(initialData);
    return initialData;
  }

  saveData(data) {
    try {
      if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving mood check-ins to localStorage:', error);
      throw new Error('Failed to save mood check-in data');
    }
  }

  async getAll() {
    try {
      await delay(300);
      if (!Array.isArray(this.data)) {
        console.error('Data is not properly initialized');
        this.data = this.loadData();
      }
      return [...this.data];
    } catch (error) {
      console.error('Error getting all mood check-ins:', error);
      throw new Error('Failed to retrieve mood check-ins');
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      
      await delay(200);
      if (!Array.isArray(this.data)) {
        this.data = this.loadData();
      }
      
      const item = this.data.find(item => item.id === id);
      return item ? { ...item } : null;
    } catch (error) {
      console.error('Error getting mood check-in by ID:', error);
      throw new Error('Failed to retrieve mood check-in');
    }
  }

  async create(moodCheckIn) {
    try {
      if (!moodCheckIn || typeof moodCheckIn !== 'object') {
        throw new Error('Valid mood check-in data is required');
      }
      
      if (!moodCheckIn.emotion || typeof moodCheckIn.intensity !== 'number') {
        throw new Error('Mood check-in must have emotion and intensity');
      }
      
      await delay(400);
      
      if (!Array.isArray(this.data)) {
        this.data = this.loadData();
      }
      
      const newMoodCheckIn = {
        ...moodCheckIn,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      
      this.data.unshift(newMoodCheckIn);
      this.saveData(this.data);
      return { ...newMoodCheckIn };
    } catch (error) {
      console.error('Error creating mood check-in:', error);
      throw new Error('Failed to create mood check-in: ' + error.message);
    }
  }

  async update(id, updates) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      
      if (!updates || typeof updates !== 'object') {
        throw new Error('Valid update data is required');
      }
      
      await delay(300);
      
      if (!Array.isArray(this.data)) {
        this.data = this.loadData();
      }
      
      const index = this.data.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error('Mood check-in not found');
      }
      
      // Prevent overwriting critical fields
      const filteredUpdates = { ...updates };
      delete filteredUpdates.id;
      delete filteredUpdates.timestamp;
      
      this.data[index] = { ...this.data[index], ...filteredUpdates };
      this.saveData(this.data);
      return { ...this.data[index] };
    } catch (error) {
      console.error('Error updating mood check-in:', error);
      throw new Error('Failed to update mood check-in: ' + error.message);
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      
      await delay(300);
      
      if (!Array.isArray(this.data)) {
        this.data = this.loadData();
      }
      
      const index = this.data.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error('Mood check-in not found');
      }
      
      this.data.splice(index, 1);
      this.saveData(this.data);
      return true;
    } catch (error) {
      console.error('Error deleting mood check-in:', error);
      throw new Error('Failed to delete mood check-in: ' + error.message);
    }
  }

  async getRecent(limit = 7) {
    try {
      if (typeof limit !== 'number' || limit < 1) {
        limit = 7;
      }
      
      await delay(200);
      
      if (!Array.isArray(this.data)) {
        this.data = this.loadData();
      }
      
      return [...this.data].slice(0, limit);
    } catch (error) {
      console.error('Error getting recent mood check-ins:', error);
      throw new Error('Failed to retrieve recent mood check-ins');
    }
  }

  async getTodaysMood() {
    try {
      await delay(200);
      
      if (!Array.isArray(this.data)) {
        this.data = this.loadData();
      }
      
      const today = new Date().toDateString();
      const todaysMood = this.data.find(mood => {
        try {
          return new Date(mood.timestamp).toDateString() === today;
        } catch (dateError) {
          console.warn('Invalid timestamp in mood data:', mood.timestamp);
          return false;
        }
      });
      
      return todaysMood ? { ...todaysMood } : null;
    } catch (error) {
      console.error('Error getting today\'s mood:', error);
      throw new Error('Failed to retrieve today\'s mood');
    }
  }
}

export default new MoodCheckInService();