import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AdminNavigation from '../components/AdminNavigation';

const TemplateBuilder = () => {
  const { user } = useAuth();
  
  // Debug authentication first
  console.log('🔍 TemplateBuilder - User:', user);
  console.log('🔍 TemplateBuilder - Token:', localStorage.getItem('token') || sessionStorage.getItem('token'));
  
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    is_active: true,
    category_id: '',
    fields: [],
  });

  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'TEXT',
    is_required: false,
    options: [],
    validation_rules: '',
    order: 0,
  });

  const { data: templates, isLoading: templatesLoading, error: templatesError } = useQuery({
    queryKey: ['ticket-templates'],
    queryFn: () => {
      console.log('🔍 Making templates API call...');
      console.log('🔍 User:', user);
      console.log('🔍 Token in localStorage:', localStorage.getItem('token'));
      console.log('🔍 Token in sessionStorage:', sessionStorage.getItem('token'));
      return ticketApi.getTemplates();
    },
    enabled: !!user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),
    retry: 3,
    onError: (error) => {
      console.error('❌ Templates query error:', error);
      console.error('❌ Error response:', error.response);
    }
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ticketApi.getCategories(),
    retry: 3,
    onError: (error) => {
      console.error('Categories query error:', error);
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: ticketApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-templates']);
      resetForm();
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => ticketApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-templates']);
      resetForm();
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: ticketApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-templates']);
    },
  });

  const fieldTypes = [
    { value: 'TEXT', label: 'Text Input' },
    { value: 'TEXTAREA', label: 'Text Area' },
    { value: 'SELECT', label: 'Dropdown' },
    { value: 'RADIO', label: 'Radio Buttons' },
    { value: 'CHECKBOX', label: 'Checkbox' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'NUMBER', label: 'Number' },
    { value: 'DATE', label: 'Date' },
    { value: 'FILE', label: 'File Upload' },
  ];

  const resetForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setTemplateData({
      name: '',
      description: '',
      is_active: true,
      category_id: '',
      fields: [],
    });
    setNewField({
      name: '',
      label: '',
      type: 'TEXT',
      is_required: false,
      options: [],
      validation_rules: '',
      order: 0,
    });
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateData({
      name: template.name,
      description: template.description,
      is_active: template.is_active,
      category_id: template.category_id,
      fields: template.fields || [],
    });
    setShowForm(true);
  };

  const handleAddField = () => {
    const field = {
      ...newField,
      id: Date.now(), // Temporary ID
      order: templateData.fields.length,
    };
    setTemplateData(prev => ({
      ...prev,
      fields: [...prev.fields, field],
    }));
    setNewField({
      name: '',
      label: '',
      type: 'TEXT',
      is_required: false,
      options: [],
      validation_rules: '',
      order: 0,
    });
  };

  const handleRemoveField = (fieldId) => {
    setTemplateData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
  };

  const handleMoveField = (fieldId, direction) => {
    const fields = [...templateData.fields];
    const index = fields.findIndex(field => field.id === fieldId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
    fields.forEach((field, idx) => {
      field.order = idx;
    });

    setTemplateData(prev => ({ ...prev, fields }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTemplate) {
      updateTemplateMutation.mutate({
        id: editingTemplate.id,
        data: templateData,
      });
    } else {
      createTemplateMutation.mutate(templateData);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(templateId);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <div className="text-center py-8">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Builder</h1>
              <p className="text-gray-600">Create and manage ticket templates with custom fields</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Template
            </button>
          </div>
          
          {/* Navigation */}
          <AdminNavigation />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {(templatesError || categoriesError) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {templatesError && <p>Templates: {templatesError.message}</p>}
                  {categoriesError && <p>Categories: {categoriesError.message}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(templatesLoading || categoriesLoading) && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading templates...</p>
          </div>
        )}

        {/* Templates List */}
        {!templatesLoading && !templatesError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(templates?.data || templates)?.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <div>Category: {template.category?.name || 'None'}</div>
                <div>Fields: {template.fields?.length || 0}</div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Template Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-medium mb-6">
                  {editingTemplate ? 'Edit Template' : 'Create Template'}
                </h3>
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      required
                      value={templateData.name}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={templateData.category_id}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      {categories?.data?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={templateData.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={templateData.is_active}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active Template</span>
                  </label>
                </div>

                {/* Fields Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium mb-4">Template Fields</h4>
                  
                  {/* Add New Field */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h5 className="text-sm font-medium mb-3">Add New Field</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Field Name"
                        value={newField.name}
                        onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Field Label"
                        value={newField.label}
                        onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      />
                      <select
                        value={newField.type}
                        onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {(newField.type === 'SELECT' || newField.type === 'RADIO') && (
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Options (comma separated)"
                          value={newField.options.join(', ')}
                          onChange={(e) => setNewField(prev => ({ 
                            ...prev, 
                            options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean) 
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newField.is_required}
                          onChange={(e) => setNewField(prev => ({ ...prev, is_required: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Required Field</span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={handleAddField}
                        disabled={!newField.name || !newField.label}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>

                  {/* Existing Fields */}
                  <div className="space-y-4">
                    {templateData.fields.map((field, index) => (
                      <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">{field.label}</span>
                              <span className="text-sm text-gray-500">({field.type})</span>
                              {field.is_required && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">Name: {field.name}</div>
                            {field.options?.length > 0 && (
                              <div className="text-sm text-gray-600">Options: {field.options.join(', ')}</div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleMoveField(field.id, 'up')}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveField(field.id, 'down')}
                              disabled={index === templateData.fields.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveField(field.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateBuilder;
