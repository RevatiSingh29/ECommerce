import React, { useState, useEffect } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {
  const [newc, setnewc] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
      .then((res) => res.json())  // Fix: Add parentheses to invoke json() method
      .then((data) => setnewc(data))
      .catch((error) => console.error('Error fetching data:', error));  // Optional: Add error handling
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newc.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price} 
          />
        ))}
      </div>
    </div>
  );
}

export default NewCollections;
