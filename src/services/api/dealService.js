const dealService = {
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
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "CreatedOn" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
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
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "CreatedOn" } }
        ]
      };
      
      const response = await apperClient.getRecordById('deal', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
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
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [{
          FieldName: "contact_id",
          Operator: "EqualTo",
          Values: [parseInt(contactId, 10)]
        }]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact ID:", error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const params = {
        records: [{
          Name: dealData.title,
          value: parseFloat(dealData.value),
          stage: dealData.stage || 'Lead',
          contact_id: parseInt(dealData.contactId, 10),
          probability: parseInt(dealData.probability, 10),
          expected_close_date: dealData.expectedCloseDate,
          notes: dealData.notes || ''
        }]
      };
      
      const response = await apperClient.createRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create deal');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, dealData) {
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
      
      if (dealData.title !== undefined) updateData.Name = dealData.title;
      if (dealData.value !== undefined) updateData.value = parseFloat(dealData.value);
      if (dealData.stage !== undefined) updateData.stage = dealData.stage;
      if (dealData.contactId !== undefined) updateData.contact_id = parseInt(dealData.contactId, 10);
      if (dealData.probability !== undefined) updateData.probability = parseInt(dealData.probability, 10);
      if (dealData.expectedCloseDate !== undefined) updateData.expected_close_date = dealData.expectedCloseDate;
      if (dealData.notes !== undefined) updateData.notes = dealData.notes;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to update deal');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error updating deal:", error);
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
      
      const response = await apperClient.deleteRecord('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete deal');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  },

  async updateStage(id, stage) {
    return this.update(id, { stage });
  },

  async getByStage(stage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [{
          FieldName: "stage",
          Operator: "EqualTo",
          Values: [stage]
        }]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by stage:", error);
      throw error;
    }
  }
};

export default dealService;