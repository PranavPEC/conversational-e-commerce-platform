import React from 'react'
import { useContext } from 'react'
import { dataContext } from '../context/userContext';


function Home() {
    let {userData,setUserData}=useContext(dataContext);
  return (
    <div>
      {userData.name || "Loading.."}
    </div>
  )
}

export default Home
