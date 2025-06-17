import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activitiesData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id, 10));
    return activity ? { ...activity } : null;
  },

  async getByContactId(contactId) {
    await delay(250);
    const contactActivities = activities.filter(a => a.contactId === parseInt(contactId, 10));
    return [...contactActivities];
  },

  async getByDealId(dealId) {
    await delay(250);
    const dealActivities = activities.filter(a => a.dealId === parseInt(dealId, 10));
    return [...dealActivities];
  },

  async create(activityData) {
    await delay(400);
    const highestId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: highestId + 1,
      timestamp: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Activity not found');
    
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id, 10) // Prevent Id modification
    };
    activities[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Activity not found');
    
    const deletedActivity = activities[index];
    activities.splice(index, 1);
    return { ...deletedActivity };
  }
};

export default activityService;