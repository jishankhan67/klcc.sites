import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PtcLandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>PTC Landing Page</h1>
      <p>PTC Ads System</p>
    </div>
  );
};