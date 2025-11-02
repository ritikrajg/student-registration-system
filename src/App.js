// src/App.js
import React, { useState, useEffect } from 'react';
import CourseTypeManager from './components/CourseTypeManager';
import CourseManager from './components/CourseManager';
import CourseOfferingManager from './components/CourseOfferingManager';
import StudentRegistration from './components/StudentRegistration';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('courseTypes');
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCourseTypes = localStorage.getItem('courseTypes');
    const savedCourses = localStorage.getItem('courses');
    const savedCourseOfferings = localStorage.getItem('courseOfferings');
    const savedRegistrations = localStorage.getItem('registrations');

    if (savedCourseTypes) setCourseTypes(JSON.parse(savedCourseTypes));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedCourseOfferings) setCourseOfferings(JSON.parse(savedCourseOfferings));
    if (savedRegistrations) setRegistrations(JSON.parse(savedRegistrations));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('courseTypes', JSON.stringify(courseTypes));
  }, [courseTypes]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('courseOfferings', JSON.stringify(courseOfferings));
  }, [courseOfferings]);

  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  const tabs = [
    { id: 'courseTypes', label: 'Course Types' },
    { id: 'courses', label: 'Courses' },
    { id: 'courseOfferings', label: 'Course Offerings' },
    { id: 'registrations', label: 'Student Registration' }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Registration System</h1>
        <nav className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'courseTypes' && (
          <CourseTypeManager
            courseTypes={courseTypes}
            setCourseTypes={setCourseTypes}
            courseOfferings={courseOfferings}
          />
        )}
        {activeTab === 'courses' && (
          <CourseManager
            courses={courses}
            setCourses={setCourses}
            courseOfferings={courseOfferings}
          />
        )}
        {activeTab === 'courseOfferings' && (
          <CourseOfferingManager
            courseOfferings={courseOfferings}
            setCourseOfferings={setCourseOfferings}
            courseTypes={courseTypes}
            courses={courses}
          />
        )}
        {activeTab === 'registrations' && (
          <StudentRegistration
            registrations={registrations}
            setRegistrations={setRegistrations}
            courseOfferings={courseOfferings}
            courseTypes={courseTypes}
          />
        )}
      </main>
    </div>
  );
}

export default App;