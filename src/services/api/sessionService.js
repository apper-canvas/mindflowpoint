const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SessionService {
  constructor() {
    this.storageKey = 'mindflow_sessions';
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
    
    // Load initial mock data
    const mockData = require('../mockData/session.json');
    this.saveData(mockData);
    return mockData;
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving sessions:', error);
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

  async create(session) {
    await delay(400);
    const newSession = {
      ...session,
      id: Date.now().toString()
    };
    this.data.push(newSession);
    this.saveData(this.data);
    return { ...newSession };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Session not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    this.saveData(this.data);
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Session not found');
    }
    this.data.splice(index, 1);
    this.saveData(this.data);
    return true;
  }

  async getByType(type) {
    await delay(250);
    return this.data.filter(session => session.type === type).map(item => ({ ...item }));
  }

  async getRecommended(moodIntensity, emotion) {
    await delay(300);
    // Simple AI recommendation logic based on mood
    let recommendedSessions = [...this.data];

    if (moodIntensity <= 4) {
      // Low mood - prioritize calming sessions
      recommendedSessions = this.data.filter(s => 
        s.type === 'meditation' || s.type === 'breathing'
      );
    } else if (moodIntensity >= 7) {
      // High mood - include journaling
      recommendedSessions = this.data.filter(s => 
        s.type === 'journaling' || s.type === 'meditation'
      );
    }

    // Sort by relevance (meditation first for stressed states)
    if (emotion === 'stressed' || emotion === 'anxious') {
      recommendedSessions.sort((a, b) => {
        if (a.type === 'breathing') return -1;
        if (b.type === 'breathing') return 1;
        if (a.type === 'meditation') return -1;
        if (b.type === 'meditation') return 1;
        return 0;
      });
    }

    return recommendedSessions.slice(0, 3).map(item => ({ ...item }));
  }
}

export default new SessionService();