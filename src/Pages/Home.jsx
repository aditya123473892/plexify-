import React, { useState } from 'react';
import NomineeForm from '../Forms/Nomineeform';
import Sidebar from '../Components/Sidebar';

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); 
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    
    </div>
  );
}

export default Home;
