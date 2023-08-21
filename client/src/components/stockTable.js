import React, { useState } from "react";
import { Bar } from "react-chartjs-2"

function Table({ 
  handleCancelEdit, isProductNameEditEmpty, isBasePriceEditEmpty, isQuantityEditEmpty, handleUpdate, setEditingRowIndex, editingRowIndex, handleEditChange, isQuantityEmpty, isBasePriceEmpty, isProductNameEmpty, input,onSaleClick, onSaleProductNameChange, suggestionsSale, base_price, quantity,  onBasePriceChange, onQuantityChange, onSubmit, data, handleDelete }) {


    const stockChart = {
      labels: data.map((products) => products.product_name),
      datasets: [{
        label: "Products",
        data:  data.map((products) => products.quantity)
      }]
    };
    

    return  (
      <>
      <div className="bar-and">
      <div className="add-products">
        <h2>Add products to stock:</h2>
        <div className="input-container">
            <input type="text" 
            className={`input-field ${isProductNameEmpty ? 'input-field-red' : ''}`}
            id="input-box" 
            value={input}
            onChange={onSaleProductNameChange}
            placeholder={isProductNameEmpty ? "Product name can't be left empty" : "Product Name"}
            autoComplete="off" />
            <label htmlFor="input-field" className="input-label">Product Name</label>
            <span className="input-highlight"></span>
             <div className="result-box">
                {suggestionsSale.map((suggestionA) => (<div onClick={() => onSaleClick(suggestionA)}  value={suggestionA} className="dropdown-clients">{suggestionA}</div>))}
        </div>
        </div>

    <div className="input-container">

      <input
        type="text"
        className={`input-field ${isQuantityEmpty ? 'input-field-red' : ''}`}
        name="quantity"
        value={quantity}
        onChange={onQuantityChange}
        placeholder={isQuantityEmpty ? "Quantity can't be left empty" : "Quantity"}
      />
      <label htmlFor="input-field" className="input-label">Quantity</label>
      <span className="input-highlight"></span>
    </div>
    <div className="input-container">
      <input
        type="text"
        className={`input-field ${isBasePriceEmpty ? 'input-field-red' : ''}`}
        name="base-price"
        value={base_price}
        onChange={onBasePriceChange}
        placeholder={isBasePriceEmpty ? "Base price can't be left empty" : "Base Price"}
      />
      <label htmlFor="input-field" className="input-label">Base Price</label>
      <span className="input-highlight"></span>
      </div>
      <button type="button" className="button-add" onClick={onSubmit}>
      <span className="button-add__text">Add Item</span>
      <span className="button-add__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
      </button>
    </div>
    <div className="products-chart">
    <Bar data={stockChart} />
    </div>
    </div>
      <div>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Base Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, i) => (
            <tr key={i}>
              <td>
                    {editingRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          value={product.product_name}
                          className={`input-field ${isProductNameEditEmpty ? 'input-field-red' : ''}`}
                          placeholder={isProductNameEditEmpty ? "Product Name" : `${product.product_name}`}
                          onChange={(e) => handleEditChange(e, i, "product_name")}
                        />
                      </div>
                    ) : (
                      product.product_name
                    )}
                  </td>
                  <td>
                    {editingRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          className={`input-field ${isQuantityEditEmpty ? 'input-field-red' : ''}`}
                          value={product.quantity}
                          placeholder={isQuantityEditEmpty ? "Quantity" : `${product.quantity}`}
                          onChange={(e) => handleEditChange(e, i, "quantity")}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                          }}
                        />
                      </div>
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td>
                    {editingRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          className={`input-field ${isBasePriceEditEmpty ? 'input-field-red' : ''}`}
                          value={product.base_price}
                          placeholder={isBasePriceEditEmpty ? "Base Price" : `${product.base_price}`}
                          onChange={(e) => handleEditChange(e, i, "base_price")}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                          }}
                        />
                      </div>
                    ) : (
                      product.base_price
                    )}
                  </td>
                  <td>{product.quantity * product.base_price}</td>
                  <td>
                    {editingRowIndex === i ? (
                      <>
                       <button className="save-icon" onClick={() => handleUpdate(i)}></button>
                       <button className="cancel-icon" onClick={() => handleCancelEdit(i)}></button>
                      </>
                    ) : (
                      <>
                      <button className="edit-icon" onClick={() => setEditingRowIndex(i)}></button>
                      <button className="delete-icon" onClick={() => handleDelete(product._id)}></button>
                      </>
                    )}
                  </td>


            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </>
    );
}

export default Table;