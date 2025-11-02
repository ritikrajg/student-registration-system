// src/components/CourseOfferingManager.js
import React, { useState } from 'react';
import Modal from './common/Modal';

const CourseOfferingManager = ({ courseOfferings, setCourseOfferings, courseTypes, courses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [formData, setFormData] = useState({ courseTypeId: '', courseId: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseTypeId) {
      newErrors.courseTypeId = 'Course type is required';
    }
    if (!formData.courseId) {
      newErrors.courseId = 'Course is required';
    }
    
    // Check for duplicate offering
    const isDuplicate = courseOfferings.some(co => 
      co.courseTypeId === formData.courseTypeId && 
      co.courseId === formData.courseId &&
      (!editingOffering || co.id !== editingOffering.id)
    );
    
    if (isDuplicate) {
      newErrors.general = 'This course offering already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const courseType = courseTypes.find(ct => ct.id === formData.courseTypeId);
    const course = courses.find(c => c.id === formData.courseId);

    if (editingOffering) {
      setCourseOfferings(courseOfferings.map(co => 
        co.id === editingOffering.id 
          ? { 
              ...co, 
              courseTypeId: formData.courseTypeId,
              courseId: formData.courseId,
              name: `${courseType.name} - ${course.name}`
            }
          : co
      ));
    } else {
      const newOffering = {
        id: Date.now().toString(),
        courseTypeId: formData.courseTypeId,
        courseId: formData.courseId,
        name: `${courseType.name} - ${course.name}`
      };
      setCourseOfferings([...courseOfferings, newOffering]);
    }

    handleCloseModal();
  };

  const handleEdit = (offering) => {
    setEditingOffering(offering);
    setFormData({
      courseTypeId: offering.courseTypeId,
      courseId: offering.courseId
    });
    setIsModalOpen(true);
  };

  const handleDelete = (offeringId) => {
    if (window.confirm('Are you sure you want to delete this course offering?')) {
      setCourseOfferings(courseOfferings.filter(co => co.id !== offeringId));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffering(null);
    setFormData({ courseTypeId: '', courseId: '' });
    setErrors({});
  };

  const getCourseTypeName = (courseTypeId) => {
    return courseTypes.find(ct => ct.id === courseTypeId)?.name || 'Unknown';
  };

  const getCourseName = (courseId) => {
    return courses.find(c => c.id === courseId)?.name || 'Unknown';
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Course Offerings Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          disabled={courseTypes.length === 0 || courses.length === 0}
        >
          Add New Course Offering
        </button>
      </div>

      {courseTypes.length === 0 && (
        <div className="warning-message">
          Please add at least one course type before creating course offerings.
        </div>
      )}

      {courses.length === 0 && (
        <div className="warning-message">
          Please add at least one course before creating course offerings.
        </div>
      )}

      <div className="items-grid">
        {courseOfferings.map(offering => (
          <div key={offering.id} className="item-card">
            <h3>{offering.name}</h3>
            <div className="item-details">
              <p><strong>Course Type:</strong> {getCourseTypeName(offering.courseTypeId)}</p>
              <p><strong>Course:</strong> {getCourseName(offering.courseId)}</p>
            </div>
            <div className="item-actions">
              <button 
                className="btn-secondary"
                onClick={() => handleEdit(offering)}
              >
                Edit
              </button>
              <button 
                className="btn-danger"
                onClick={() => handleDelete(offering.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {courseOfferings.length === 0 && (courseTypes.length > 0 && courses.length > 0) && (
          <p className="no-items">No course offerings found. Add your first course offering!</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingOffering ? 'Edit Course Offering' : 'Add New Course Offering'}</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <div className="mb-2 error-text">{errors.general}</div>}
          
          <div className="form-group">
            <label htmlFor="courseTypeId">Course Type:</label>
            <select
              id="courseTypeId"
              value={formData.courseTypeId}
              onChange={(e) => setFormData({ ...formData, courseTypeId: e.target.value })}
              className={errors.courseTypeId ? 'error' : ''}
            >
              <option value="">Select Course Type</option>
              {courseTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.name}</option>
              ))}
            </select>
            {errors.courseTypeId && <span className="error-text">{errors.courseTypeId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="courseId">Course:</label>
            <select
              id="courseId"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className={errors.courseId ? 'error' : ''}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            {errors.courseId && <span className="error-text">{errors.courseId}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingOffering ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseOfferingManager;