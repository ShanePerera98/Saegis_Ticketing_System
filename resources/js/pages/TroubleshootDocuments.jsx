import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { troubleshootApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const TroubleshootDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Form states
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null,
  });

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
  });

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['troubleshoot-documents'],
    queryFn: troubleshootApi.list,
    select: (data) => data.data.documents || [],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      console.log('🚀 Starting upload mutation...');
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      try {
        const response = await troubleshootApi.upload(formData);
        console.log('✅ API response received:', response);
        return response;
      } catch (error) {
        console.error('❌ API call failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Upload successful, data:', data);
      queryClient.invalidateQueries(['troubleshoot-documents']);
      setShowUploadModal(false);
      setUploadForm({ title: '', description: '', file: null });
      showToastMessage('Document uploaded successfully!');
    },
    onError: (error) => {
      console.error('❌ Upload error:', error);
      console.error('❌ Error response:', error.response);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.file?.[0] ||
                          error.message || 
                          'Upload failed';
      showToastMessage(errorMessage, 'error');
    },
    onMutate: () => {
      console.log('🔄 Upload mutation triggered');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => troubleshootApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['troubleshoot-documents']);
      setShowEditModal(false);
      showToastMessage('Document updated successfully!');
    },
    onError: (error) => {
      showToastMessage(error.response?.data?.message || 'Update failed', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: troubleshootApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['troubleshoot-documents']);
      showToastMessage('Document deleted successfully!');
    },
    onError: (error) => {
      showToastMessage(error.response?.data?.message || 'Delete failed', 'error');
    },
  });

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleUpload = (e) => {
    console.log('📝 Upload form submitted');
    e.preventDefault();
    
    console.log('📝 Form data:', {
      title: uploadForm.title,
      description: uploadForm.description,
      fileExists: !!uploadForm.file,
      fileName: uploadForm.file?.name,
      fileSize: uploadForm.file?.size,
      fileType: uploadForm.file?.type
    });

    if (!uploadForm.title || !uploadForm.file) {
      console.log('❌ Missing required fields');
      showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    // Validate file size (100MB = 100 * 1024 * 1024 bytes)
    const maxSize = 100 * 1024 * 1024;
    if (uploadForm.file.size > maxSize) {
      console.log('❌ File too large:', uploadForm.file.size);
      showToastMessage('File size must be less than 100MB', 'error');
      return;
    }

    // Validate file type
    if (uploadForm.file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', uploadForm.file.type);
      showToastMessage('Please select a PDF file', 'error');
      return;
    }

    console.log('✅ Validation passed, creating FormData...');
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description || '');
    formData.append('file', uploadForm.file);

    console.log('🚀 Calling uploadMutation.mutate...');
    uploadMutation.mutate(formData);
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setEditForm({
      title: document.title,
      description: document.description || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: selectedDocument.id,
      data: editForm,
    });
  };

  const handleDelete = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(documentId);
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await troubleshootApi.download(document.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToastMessage('Download failed', 'error');
    }
  };

  const handleView = (document) => {
    const viewUrl = troubleshootApi.view(document.id);
    window.open(viewUrl, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return bytes + ' bytes';
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading documents</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Common Header */}
      <CommonHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Basic Troubleshoot Documents</h1>
              {user?.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Upload Document
                </button>
              )}
            </div>

      <div className="grid gap-6">
        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No troubleshoot documents available.</p>
            {user?.role === 'SUPER_ADMIN' && (
              <p className="mt-2">Upload your first document to get started.</p>
            )}
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {document.title}
                  </h3>
                  {document.description && (
                    <p className="text-gray-600 mb-3">{document.description}</p>
                  )}
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Size: {formatFileSize(document.file_size)}</p>
                    <p>Uploaded by: {document.uploader?.name}</p>
                    <p>Date: {new Date(document.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleView(document)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Download
                  </button>
                  {user?.role === 'SUPER_ADMIN' && (
                    <>
                      <button
                        onClick={() => handleEdit(document)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF File * (up to 100MB)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please upload a PDF file up to 100MB in size.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploadMutation.isPending && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{uploadMutation.isPending ? 'Uploading...' : 'Upload'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Document</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootDocuments;
