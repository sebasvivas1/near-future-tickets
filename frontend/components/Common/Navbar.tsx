import React from 'react';
import Search from './Search';
  

export default function Navbar() {
  return (
    <div className="flex justify-start">
      <div className="self-center">
        <h2 className="mx-2 text-4xl font-semibold text-figma-300">NEAR Future Tickets</h2>
        </div>  
        
      <div>
      <div className="flex flex-nowrap">
          <div>   <button
          type="button"
          className="mx-6 text-figma-300 text-lg p-2 rounded-lg lg:px-4"
        >
          Home
        </button></div>         
         <div>   <button
          type="button"
          className="mx-6 text-figma-300 text-lg p-2 rounded-lg lg:px-4"
        >
          All Events
        </button></div>
        <div>   <button
          type="button"
          className="mx-6  text-figma-300 text-lg p-2 rounded-lg lg:px-4"
        >
          My Events 
        </button></div>
        <div><Search></Search></div>
        <div className="rounded-full  bg-figma-500 text-lg p-2 lg:px-4">Image</div>
        <div className=" font-semibold text-figma-300 p-2 ">mzterdox.near</div>
        </div>  
      </div>
    </div>

    
    );
}