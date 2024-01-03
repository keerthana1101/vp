import React from 'react';
import Sidebar from './Sidebar';
import EmpHome from './EmpHome';
import imageSrc from './employee.jpg';

const Home = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '400px'}}>
        <img
          src={imageSrc}
          alt="Description of the image"
          style={{ width: '80%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default Home;
