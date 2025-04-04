import React, { useState, useEffect } from 'react';
import { ColorRing } from 'react-loader-spinner';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <div className='d-flex justify-content-center align-items-center preloader'>
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{ backgroundColor: 'transparent' }} 
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div>
    </div>
  );
};

export default Preloader
