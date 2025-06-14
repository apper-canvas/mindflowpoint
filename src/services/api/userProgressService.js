import userProgressMockData from '@/services/mockData/userProgress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.storageKey = 'userProgress';
    this.data = null;
  }

  async init() {
    if (!this.data) {
      this.data = await this.loadData();
    }
    return this.data;
  }

  async saveData(data) {
    try {
      await delay(100); // Simulate API delay
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  async loadData() {
    try {
      await delay(100); // Simulate API delay
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
      // Load initial mock data using ES6 import
      const mockData = userProgressMockData;
      await this.saveData(mockData);
      return mockData;
    } catch (error) {
      console.error('Error loading user progress data:', error);
      // Return default data structure if loading fails
      return {
        streak: 0,
        totalSessions: 0,
        favoriteType: "meditation",
        lastCheckIn: null,
        sessionCounts: {
          meditation: 0,
          breathing: 0,
          journaling: 0
}
      };
    }
  }

  async get() {
    await this.init();
    await delay(200);
    return { ...this.data };
  }

  async update(updates) {
    await this.init();
    await delay(300);
    this.data = { ...this.data, ...updates };
    await this.saveData(this.data);
    return { ...this.data };
  }

async incrementStreak() {
    await this.init();
    await delay(250);
    const today = new Date().toDateString();
    const lastCheckIn = this.data.lastCheckIn ? new Date(this.data.lastCheckIn).toDateString() : null;
    
    if (lastCheckIn !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      // If last check-in was yesterday, increment streak; otherwise reset
      if (lastCheckIn === yesterdayStr) {
        this.data.streak = (this.data.streak || 0) + 1;
      } else {
        this.data.streak = 1;
      }
      
      this.data.lastCheckIn = new Date().toISOString();
      await this.saveData(this.data);
    }
    
    return { ...this.data };
  }

  async incrementSessions(sessionType) {
    await this.init();
    await delay(250);
    
    // Update favorite session type based on usage
    const sessionCounts = this.data.sessionCounts || {};
    sessionCounts[sessionType] = (sessionCounts[sessionType] || 0) + 1;
    
    // Find most used session type
    let maxCount = 0;
    let favoriteType = 'meditation';
for (const [type, count] of Object.entries(sessionCounts)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteType = type;
      }
    }
    
    this.data.favoriteType = favoriteType;
    this.data.sessionCounts = sessionCounts;
    this.data.totalSessions = (this.data.totalSessions || 0) + 1;
    await this.saveData(this.data);
    
    return { ...this.data };
  }

  async getStats() {
    await this.init();
    await delay(200);
    const stats = {
      favoriteType: this.data.favoriteType || 'meditation',
      sessionCounts: this.data.sessionCounts || {},
      lastCheckIn: this.data.lastCheckIn
    };
    return stats;
  }
}

export default new UserProgressService();