import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealsData];

const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id, 10));
    return deal ? { ...deal } : null;
  },

  async getByContactId(contactId) {
    await delay(250);
    const contactDeals = deals.filter(d => d.contactId === parseInt(contactId, 10));
    return [...contactDeals];
  },

  async create(dealData) {
    await delay(400);
    const highestId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: highestId + 1,
      createdAt: new Date().toISOString(),
      stage: dealData.stage || 'Lead'
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Deal not found');
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id, 10) // Prevent Id modification
    };
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Deal not found');
    
    const deletedDeal = deals[index];
    deals.splice(index, 1);
    return { ...deletedDeal };
  },

  async updateStage(id, stage) {
    await delay(200);
    return this.update(id, { stage });
  },

  async getByStage(stage) {
    await delay(250);
    const stageDeals = deals.filter(d => d.stage === stage);
    return [...stageDeals];
  }
};

export default dealService;