import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { all_product, cartItems, addToCart, removeToCart,getTotalCartAmt  } = useContext(ShopContext);

  return (
    <div className='cartitems'>
      <div className="cartitem-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {
        all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            return (
              <div key={e.id}>
                <div className="cartitems-format cartitem-format-main">
                  <img src={e.image} alt="" className='carticon-product-icon' />
                  <p>{e.name}</p>
                  <p>${e.new_price}</p>
                  <button className='quantity'>{cartItems[e.id]}</button>
                  <p>${e.new_price * cartItems[e.id]}</p>
                  <img src={remove_icon} className='remove'onClick={() => removeToCart(e.id)} alt="remove" />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })
      }
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-items"><p>Subtotal</p>
            <p>${getTotalCartAmt()}</p></div>
            <hr />
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item"><h3>Total</h3>
          <h3>${getTotalCartAmt()}</h3>
          </div>
          </div>
          <button>PROCEED</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
