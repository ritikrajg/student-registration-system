// src/components/StudentRegistration.js
import React, { useState } from 'react';
import Modal from './common/Modal';

const StudentRegistration = ({ registrations, setRegistrations, courseOfferings, courseTypes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [formData, setFormData] = useState({
    offeringId: '',
    studentName: '',
    studentEmail: '',
    studentPhone: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.offeringId) {
      newErrors.offeringId = 'Course offering is required';
    }
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Student email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Email is invalid';
    }
    if (!formData.studentPhone.trim()) {
      newErrors.studentPhone = 'Student phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const offering = courseOfferings.find(co => co.id === formData.offeringId);
    
    const newRegistration = {
      id: Date.now().toString(),
      offeringId: formData.offeringId,
      offeringName: offering.name,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      studentPhone: formData.studentPhone,
      registrationDate: new Date().toISOString()
    };

    setRegistrations([...registrations, newRegistration]);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      offeringId: '',
      studentName: '',
      studentEmail: '',
      studentPhone: ''
    });
    setErrors({});
  };

  const getFilteredOfferings = () => {
    if (!selectedCourseType) return courseOfferings;
    return courseOfferings.filter(co => co.courseTypeId === selectedCourseType);
  };

  const getRegistrationsByOffering = (offeringId) => {
    return registrations.filter(reg => reg.offeringId === offeringId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Student Registration</h2>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          disabled={courseOfferings.length === 0}
        >
          Register Student
        </button>
      </div>

      {courseOfferings.length === 0 && (
        <div className="warning-message">
          Please add at least one course offering before registering students.
        </div>
      )}

      <div className="filter-section">
        <label htmlFor="courseTypeFilter">Filter by Course Type:</label>
        <select
          id="courseTypeFilter"
          value={selectedCourseType}
          onChange={(e) => setSelectedCourseType(e.target.value)}
        >
          <option value="">All Course Types</option>
          {courseTypes.map(ct => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>
      </div>

      <div className="offerings-list">
        {getFilteredOfferings().map(offering => {
          const offeringRegistrations = getRegistrationsByOffering(offering.id);
          
          return (
            <div key={offering.id} className="offering-card">
              <div className="offering-header">
                <h3>{offering.name}</h3>
                <span className="registration-count">
                  {offeringRegistrations.length} student(s) registered
                </span>
              </div>
              
              {offeringRegistrations.length > 0 ? (
                <div className="students-list">
                  <h4>Registered Students:</h4>
                  <div className="students-table">
                    <div className="table-header">
                      <span>Name</span>
                      <span>Email</span>
                      <span>Phone</span>
                      <span>Registration Date</span>
                    </div>
                    {offeringRegistrations.map(reg => (
                      <div key={reg.id} className="table-row">
                        <span>{reg.studentName}</span>
                        <span>{reg.studentEmail}</span>
                        <span>{reg.studentPhone}</span>
                        <span>{formatDate(reg.registrationDate)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-students">No students registered for this offering yet.</p>
              )}
            </div>
          );
        })}
        
        {getFilteredOfferings().length === 0 && courseOfferings.length > 0 && (
          <p className="no-items">No course offerings match the selected filter.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>Register Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="offeringId">Course Offering:</label>
            <select
              id="offeringId"
              value={formData.offeringId}
              onChange={(e) => setFormData({ ...formData, offeringId: e.target.value })}
              className={errors.offeringId ? 'error' : ''}
            >
              <option value="">Select Course Offering</option>
              {courseOfferings.map(offering => (
                <option key={offering.id} value={offering.id}>{offering.name}</option>
              ))}
            </select>
            {errors.offeringId && <span className="error-text">{errors.offeringId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studentName">Student Name:</label>
            <input
              type="text"
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className={errors.studentName ? 'error' : ''}
              placeholder="Enter student name"
            />
            {errors.studentName && <span className="error-text">{errors.studentName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studentEmail">Student Email:</label>
            <input
              type="email"
              id="studentEmail"
              value={formData.studentEmail}
              onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
              className={errors.studentEmail ? 'error' : ''}
              placeholder="Enter student email"
            />
            {errors.studentEmail && <span className="error-text">{errors.studentEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studentPhone">Student Phone:</label>
            <input
              type="tel"
              id="studentPhone"
              value={formData.studentPhone}
              onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
              className={errors.studentPhone ? 'error' : ''}
              placeholder="Enter student phone"
            />
            {errors.studentPhone && <span className="error-text">{errors.studentPhone}</span>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCloseModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Register Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentRegistration;