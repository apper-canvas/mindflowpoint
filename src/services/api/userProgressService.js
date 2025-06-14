const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.storageKey = 'mindflow_user_progress';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
    
    // Load initial mock data
    const mockData = require('../mockData/userProgress.json');
    this.saveData(mockData);
    return mockData;
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  async get() {
    await delay(200);
    return { ...this.data };
  }

  async update(updates) {
    await delay(300);
    this.data = { ...this.data, ...updates };
    this.saveData(this.data);
    return { ...this.data };
  }

  async incrementStreak() {
    await delay(250);
    const today = new Date().toDateString();
    const lastCheckIn = this.data.lastCheckIn ? new Date(this.data.lastCheckIn).toDateString() : null;
    
    if (lastCheckIn !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      // If last check-in was yesterday, increment streak; otherwise reset
      if (lastCheckIn === yesterdayStr) {
        this.data.streak += 1;
      } else if (lastCheckIn !== today) {
        this.data.streak = 1;
      }
      
      this.data.lastCheckIn = new Date().toISOString();
      this.saveData(this.data);
    }
    
    return { ...this.data };
  }

  async incrementSessions(sessionType) {
    await delay(250);
    this.data.totalSessions += 1;
    
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
    this.saveData(this.data);
    
    return { ...this.data };
  }

  async getStats() {
    await delay(200);
    const stats = {
      streak: this.data.streak || 0,
      totalSessions: this.data.totalSessions || 0,
      favoriteType: this.data.favoriteType || 'meditation',
      sessionCounts: this.data.sessionCounts || {},
      lastCheckIn: this.data.lastCheckIn
    };
    return stats;
  }
}

export default new UserProgressService();