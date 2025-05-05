import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const imgHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const addProduct = async () => {
    console.log(productDetails);
    let responseData;

    const formData = new FormData();
    formData.append('product', image);

    // Upload the image
    await fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        responseData = data;
      });

    if (responseData.success) {
      productDetails.image = responseData.image_url;//image_url from backend response
      console.log(productDetails);

      // Add product to the database
      await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDetails),
      }).then((res) => res.json())
        .then((data) => console.log('Product added:', data))
        .catch((err) => console.error('Error adding product:', err));
    }
  };

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          type="text"
          value={productDetails.name}
          onChange={changeHandler}
          name='name'
          placeholder='Type here'
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="text"
            value={productDetails.old_price}
            onChange={changeHandler}
            name='old_price'
            placeholder='Type here'
          />
          <p>Offer Price</p>
          <input
            type="text"
            name='new_price'
            value={productDetails.new_price}
            onChange={changeHandler}
            placeholder='Type here'
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className='upload'
          />
        </label>
        <input
          type="file"
          onChange={imgHandler}
          name='image'
          id='file-input'
          hidden
        />
      </div>

      <button onClick={addProduct} className="but">ADD</button>
    </div>
  );
};

export default AddProduct;

