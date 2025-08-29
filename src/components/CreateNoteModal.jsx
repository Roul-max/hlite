import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Button from './Button';
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';

const CreateNoteModal = ({ onClose, onSave }) => {
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!noteData.title.trim()) {
      setError('Note title is required');
      return;
    }
    if (!noteData.content.trim()) {
      setError('Note content is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(noteData);
    } catch (err) {
      setError(err.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Note</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <InputField
            type="text"
            name="title"
            placeholder="Enter note title"
            value={noteData.title}
            onChange={handleInputChange}
            required
          />

          <div>
            <textarea
              name="content"
              placeholder="Write your note content here..."
              value={noteData.content}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-500 resize-none"
              required
            />
          </div>

          <InputField
            type="text"
            name="category"
            placeholder="Category (optional)"
            value={noteData.category}
            onChange={handleInputChange}
          />

          {error && <ErrorMessage message={error} />}

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;