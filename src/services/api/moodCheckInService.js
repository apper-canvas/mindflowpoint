import mockMoodCheckInData from '@/services/mockData/moodCheckIn.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MoodCheckInService {
  constructor() {
    this.storageKey = 'mindflow_mood_checkins';
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading mood check-ins:', error);
    }
    
    // Load initial mock data
    this.saveData(mockMoodCheckInData);
    return mockMoodCheckInData;
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving mood check-ins:', error);
    }
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(item => item.id === id);
    return item ? { ...item } : null;
  }

  async create(moodCheckIn) {
    await delay(400);
    const newMoodCheckIn = {
      ...moodCheckIn,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.data.unshift(newMoodCheckIn);
    this.saveData(this.data);
    return { ...newMoodCheckIn };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Mood check-in not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    this.saveData(this.data);
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Mood check-in not found');
    }
    this.data.splice(index, 1);
    this.saveData(this.data);
    return true;
  }

  async getRecent(limit = 7) {
    await delay(200);
    return [...this.data].slice(0, limit);
  }

  async getTodaysMood() {
    await delay(200);
    const today = new Date().toDateString();
    const todaysMood = this.data.find(mood => 
      new Date(mood.timestamp).toDateString() === today
    );
    return todaysMood ? { ...todaysMood } : null;
  }
}

export default new MoodCheckInService();