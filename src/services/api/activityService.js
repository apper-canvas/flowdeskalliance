const activityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } }
        ]
      };
      
      const response = await apperClient.getRecordById('Activity1', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error);
      return null;
    }
  },

  async getByContactId(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } }
        ],
        where: [{
          FieldName: "contact_id",
          Operator: "EqualTo",
          Values: [parseInt(contactId, 10)]
        }]
      };
      
      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact ID:", error);
      throw error;
    }
  },

  async getByDealId(dealId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } }
        ],
        where: [{
          FieldName: "deal_id",
          Operator: "EqualTo",
          Values: [parseInt(dealId, 10)]
        }]
      };
      
      const response = await apperClient.fetchRecords('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal ID:", error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: activityData.name || `${activityData.type} activity`,
          contact_id: parseInt(activityData.contactId, 10),
          deal_id: activityData.dealId ? parseInt(activityData.dealId, 10) : null,
          type: activityData.type,
          description: activityData.description,
          timestamp: activityData.timestamp || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create activity');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (activityData.name !== undefined) updateData.Name = activityData.name;
      if (activityData.contactId !== undefined) updateData.contact_id = parseInt(activityData.contactId, 10);
      if (activityData.dealId !== undefined) updateData.deal_id = activityData.dealId ? parseInt(activityData.dealId, 10) : null;
      if (activityData.type !== undefined) updateData.type = activityData.type;
      if (activityData.description !== undefined) updateData.description = activityData.description;
      if (activityData.timestamp !== undefined) updateData.timestamp = activityData.timestamp;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to update activity');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('Activity1', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete activity');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
};

export default activityService;