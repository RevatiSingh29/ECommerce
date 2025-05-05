import React, { useContext } from 'react'
import './ProductDisplay.css' 
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'
const ProductDisplay = (props) => {
  const {product}=props;
  const {addToCart}=useContext(ShopContext);
  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list"><img src={product.image} alt="" />
        <img src={product.image} alt="" />
        <img src={product.image} alt="" />
        <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
        <img className='productdisplay-main-img'src={product.image} alt="" />
        </div>
      </div>
    
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>
           (122) 
          </p>
        </div>
        <div className="product-display-right-price">
        <div className="product-display-right-price-old">${product.old_price}</div>
        <div className="product-display-right-price-new">${product.new_price}</div>
        </div>
        <div className="product-display-right-desc">A lightweight outfit crafted for effortless style and comfort. Designed with fine, delicately tapered sleeves, this piece offers a sleek silhouette perfect for wearing. 
</div>
<div className="product-display-right-size">
  <h1>Select size
  </h1>
  <div className="product-display-right-size">
    <div>S</div>
    <div>M</div>
    <div>L</div>
    <div>XL</div>
    <div>XXL</div>
    
  </div>
  
</div>
<button className='but' onClick={()=>{
  addToCart(product.id)
}}>ADD TO CART</button>

      
      </div>
    </div>
  )
}

export default ProductDisplay