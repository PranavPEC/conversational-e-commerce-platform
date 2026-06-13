import React from 'react';
import { useSelector } from 'react-redux';

function Home() {
  const { userData } = useSelector((state) => state.auth);

  return (
    <div>
      {userData?.name || "Loading..."}
    </div>
  );
}

export default Home;