// src/components/CourseManager.js
import React, { useState } from 'react';
import Modal from './common/Modal';

const CourseManager = ({ courses, setCourses, courseOfferings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    if (formData.name.length > 50) {
      newErrors.name = 'Course name must be less than 50 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, name: formData.name }
          : c
      ));
    } else {
      const newCourse = {
        id: Date.now().toString(),
        name: formData.name
      };
      setCourses([...courses, newCourse]);
    }

    handleCloseModal();
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({ name: course.name });
    setIsModalOpen(true);
  };

  const handleDelete = (courseId) => {
    const isUsed = courseOfferings.some(co => co.courseId === courseId);
    if (isUsed) {
      alert('Cannot delete course that is used in course offerings');
      return;
    }

    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({ name: '' });
    setErrors({});
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Courses Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Course
        </button>
      </div>

      <div className="items-grid">
        {courses.map(course => (
          <div key={course.id} className="item-card">
            <h3>{course.name}</h3>
            <div className="item-actions">
              <button 
                className="btn-secondary"
                onClick={() => handleEdit(course)}
              >
                Edit
              </button>
              <button 
                className="btn-danger"
                onClick={() => handleDelete(course.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="no-items">No courses found. Add your first course!</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Course Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className={errors.name ? 'error' : ''}
              placeholder="e.g., Hindi, English, Urdu"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCourse ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManager;