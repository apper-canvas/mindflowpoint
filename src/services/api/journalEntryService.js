const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Import mock data using ES module syntax
import mockJournalData from '../mockData/journalEntry.json';

class JournalEntryService {
  constructor() {
    this.entries = this.loadData();
  }

  // Get all journal entries
  async getEntries() {
    await delay(500); // Simulate API delay
    return this.entries;
  }

  // Get a specific entry by ID
  async getEntry(id) {
    await delay(300);
    return this.entries.find(entry => entry.id === id);
  }

  // Load initial mock data
  loadData() {
    try {
      // Use imported JSON data instead of require()
      const mockData = mockJournalData || [];
      this.saveData(mockData);
      return mockData;
    } catch (error) {
      console.error('Failed to load journal data:', error);
      return [];
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving journal entries:', error);
    }
  }

  async getAll() {
    await delay(300);
    return [...this.data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(item => item.id === id);
    return item ? { ...item } : null;
  }

  async create(entry) {
    await delay(400);
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.data.unshift(newEntry);
    this.saveData(this.data);
    return { ...newEntry };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    this.saveData(this.data);
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    this.data.splice(index, 1);
    this.saveData(this.data);
    return true;
  }

  async getRecentEntries(limit = 5) {
    await delay(250);
    return [...this.data]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(item => ({ ...item }));
  }

  async generatePrompt(emotion, intensity) {
    await delay(200);
    
    const prompts = {
      happy: [
        "What moments brought you joy today? How can you create more of these experiences?",
        "Describe a person who made you smile recently. What did they do that touched your heart?",
        "What accomplishment, no matter how small, are you proud of today?"
      ],
      sad: [
        "What emotions are you feeling right now? Allow yourself to express them freely.",
        "Write a letter to yourself with the same compassion you'd show a dear friend.",
        "What would comfort you most right now? How can you give that to yourself?"
      ],
      anxious: [
        "What thoughts are creating anxiety for you? Can you examine them with curiosity rather than judgment?",
        "Describe three things you can see, hear, and feel right now. Ground yourself in the present moment.",
        "What would you tell a friend who was experiencing what you're going through?"
      ],
      stressed: [
        "What aspects of your current situation are within your control? What isn't?",
        "How has your body been responding to stress? What does it need from you right now?",
        "What's one small step you can take today to reduce your stress load?"
      ],
      calm: [
        "What helps you maintain this sense of peace? How can you remember this feeling when you need it?",
        "Describe your ideal peaceful environment. What elements create tranquility for you?",
        "What wisdom would you share with someone who is struggling to find calm?"
      ],
      grateful: [
        "List three specific things you're grateful for today and why they matter to you.",
        "Who in your life deserves appreciation? What would you want them to know?",
        "How has gratitude changed your perspective on a challenging situation?"
      ]
    };

    const emotionPrompts = prompts[emotion] || prompts.calm;
    const randomPrompt = emotionPrompts[Math.floor(Math.random() * emotionPrompts.length)];
    
    return randomPrompt;
  }
}

export default new JournalEntryService();