import React from 'react';

const ProfileTest = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      padding: '20px',
      fontSize: '18px'
    }}>
      <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>
        Profile Management Test
      </h1>
      <p style={{ color: '#4b5563' }}>
        This is a basic test to see if the profile route is working.
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Test Content</h2>
        <p>If you can see this, the profile route is working!</p>
      </div>
    </div>
  );
};

export default ProfileTest;
