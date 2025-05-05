import React, { createContext, useState, useEffect } from "react";

// 1. Create context
export const ShopContext = createContext(null);

// 2. Default cart setup function
const getDefaultCart = () => {
  return {}; // start with empty cart, since products aren't loaded yet
};

// 3. Context provider component
const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  
  useEffect(() => {
    fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => setAll_Product(data));
      if (localStorage.getItem('auth token')) {
        fetch('http://localhost:4000/getcart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',  // Corrected to application/json
                'auth-token': `${localStorage.getItem('auth token')}`,  // Fixed the template literal
                'Content-Type': 'application/json',
            },
            body: "",  // No need for any body here; you're just checking the cart data
        })
        .then((res) => res.json())
        .then((data) => setCartItems(data))
        .catch((error) => {
            console.error('Error fetching cart data:', error);
        });
    }
    
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1, // handle undefined values
    }));

    if (localStorage.getItem('auth token')) {
      fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json', // changed to correct content type
          'auth-token': `${localStorage.getItem('auth token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: itemId,
        }),
      })
        .then((res) => res.json())  // Fixed .json() usage
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    }
  };

  const removeToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) - 1,
    }));
    if(localStorage.getItem('auth token')){

      fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/json', // changed to correct content type
          'auth-token': `${localStorage.getItem('auth token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: itemId,
        }),
      })
        .then((res) => res.json())  // Fixed .json() usage
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    }
  };

  const getTotalCartAmt = () => {
    let totalAmt = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find((pro) => pro.id === Number(item));
        if (itemInfo) {
          totalAmt += itemInfo.new_price * cartItems[item];
        } else {
          console.warn(`Item with ID ${item} not found in all_product`);
        }
      }
    }
    return totalAmt;
  };

  const getTotalCartItems = () => {
    let tot = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        tot += cartItems[item];
      }
    }
    return tot;
  };

  const contextValue = {
    all_product,
    setAll_Product,
    cartItems,
    addToCart,
    removeToCart,
    getTotalCartAmt,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;



