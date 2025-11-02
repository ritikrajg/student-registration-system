// src/components/CourseTypeManager.js
import React, { useState } from 'react';
import Modal from './common/Modal';

const CourseTypeManager = ({ courseTypes, setCourseTypes, courseOfferings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseType, setEditingCourseType] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Course type name is required';
    }
    if (formData.name.length > 50) {
      newErrors.name = 'Course type name must be less than 50 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCourseType) {
      setCourseTypes(courseTypes.map(ct => 
        ct.id === editingCourseType.id 
          ? { ...ct, name: formData.name }
          : ct
      ));
    } else {
      const newCourseType = {
        id: Date.now().toString(),
        name: formData.name
      };
      setCourseTypes([...courseTypes, newCourseType]);
    }

    handleCloseModal();
  };

  const handleEdit = (courseType) => {
    setEditingCourseType(courseType);
    setFormData({ name: courseType.name });
    setIsModalOpen(true);
  };

  const handleDelete = (courseTypeId) => {
    const isUsed = courseOfferings.some(co => co.courseTypeId === courseTypeId);
    if (isUsed) {
      alert('Cannot delete course type that is used in course offerings');
      return;
    }

    if (window.confirm('Are you sure you want to delete this course type?')) {
      setCourseTypes(courseTypes.filter(ct => ct.id !== courseTypeId));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourseType(null);
    setFormData({ name: '' });
    setErrors({});
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Course Types Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Course Type
        </button>
      </div>

      <div className="items-grid">
        {courseTypes.map(courseType => (
          <div key={courseType.id} className="item-card">
            <h3>{courseType.name}</h3>
            <div className="item-actions">
              <button 
                className="btn-secondary"
                onClick={() => handleEdit(courseType)}
              >
                Edit
              </button>
              <button 
                className="btn-danger"
                onClick={() => handleDelete(courseType.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {courseTypes.length === 0 && (
          <p className="no-items">No course types found. Add your first course type!</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingCourseType ? 'Edit Course Type' : 'Add New Course Type'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Course Type Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className={errors.name ? 'error' : ''}
              placeholder="e.g., Individual, Group, Special"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCourseType ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseTypeManager;