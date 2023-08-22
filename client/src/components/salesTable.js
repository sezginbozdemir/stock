import React from "react";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

const SalesTable = React.memo(
  ({
    isSaleProductNameEditEmpty,
    isSaleQuantityEditEmpty,
    isSalePriceEditEmpty,
    isClientNameEditEmpty,
    isSaleDateEditEmpty,
    saleRowIndex,
    setSaleRowIndex,
    saleCancelEdit,
    saleEdit,
    saleUpdate,
    isSaleProductNameValid,
    isSaleProductNameEmpty,
    isSaleQuantityEmpty,
    isSalePriceEmpty,
    isClientNameEmpty,
    isSaleDateEmpty,
    input,
    suggestionsSale,
    onSaleClick,
    value,
    suggestions,
    onSuggestionClick,
    sale_date,
    onSaleDateChange,
    sale_price,
    sale_quantity,
    onClientNameChange,
    onSalePriceChange,
    onSaleProductNameChange,
    onSaleQuantityChange,
    onCompleteSale,
    data,
    productData,
    handleDelete,
  }) => {
    function convertDate(mydate, displayFormat) {
      return format(new Date(mydate), displayFormat);
    }
    const saleChart = {
      labels: data.map((sales) => sales.sale_product_name),
      datasets: [
        {
          label: "Sales per product",
          data: data.map((sales) => sales.sale_quantity),
        },
      ],
    };

    return (
      <>
        <div className="chart-and">
          <div className="make-sale">
            <h2>Make Sale:</h2>
            <div className="input-container">
              <input
                type="date"
                className="input-field"
                name="sale-date"
                value={sale_date}
                onChange={onSaleDateChange}
              />
              <label htmlFor="input-field" className="input-label">
                Sale Date
              </label>
              <span className="input-highlight"></span>
            </div>
            {isSaleDateEmpty ? (
              <div className="error-message">Date can't be empty</div>
            ) : null}
            <div className="input-container">
              <input
                type="text"
                className={`input-field ${
                  isClientNameEmpty ? "input-field-red" : ""
                }`}
                id="input-box"
                value={value}
                onChange={onClientNameChange}
                placeholder={
                  isClientNameEmpty
                    ? "Client name can't be empty"
                    : "Client Name"
                }
                autoComplete="off"
              />
              <label htmlFor="input-field" className="input-label">
                Client Name
              </label>
              <span className="input-highlight"></span>
              <div className="result-box">
                {suggestions.map((suggestion) => (
                  <div
                    onClick={() => onSuggestionClick(suggestion)}
                    value={suggestion}
                    className="dropdown-clients"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
            <div className="input-container">
              <input
                type="text"
                className={`input-field ${
                  isSaleProductNameEmpty ? "input-field-red" : ""
                } ${!isSaleProductNameValid ? "input-field-red" : ""}`}
                id="input-box"
                value={input}
                onChange={onSaleProductNameChange}
                placeholder={
                  isSaleProductNameEmpty
                    ? "Product name can't be empty"
                    : "Product Name"
                }
                autoComplete="off"
              />
              <label htmlFor="input-field" className="input-label">
                Product Name
              </label>
              <span className="input-highlight"></span>
              <div className="result-box">
                {suggestionsSale.map((suggestionA) => (
                  <div
                    onClick={() => onSaleClick(suggestionA)}
                    value={suggestionA}
                    className="dropdown-clients"
                  >
                    {suggestionA}
                  </div>
                ))}
              </div>
            </div>
            {!isSaleProductNameValid ? (
              <div className="error-message">
                Product doesn't exist in the database
              </div>
            ) : null}
            <div className="input-container">
              <input
                type="text"
                className={`input-field ${
                  isSaleQuantityEmpty ? "input-field-red" : ""
                }`}
                name="sale-quantity"
                value={sale_quantity}
                onChange={onSaleQuantityChange}
                placeholder={
                  isSaleQuantityEmpty ? "Quantity can't be empty" : "Quantity"
                }
              />
              <label htmlFor="input-field" className="input-label">
                Sale Quantity
              </label>
              <span className="input-highlight"></span>
            </div>
            <div className="input-container">
              <input
                type="text"
                className={`input-field ${
                  isSalePriceEmpty ? "input-field-red" : ""
                }`}
                name="sale-price"
                value={sale_price}
                onChange={onSalePriceChange}
                placeholder={
                  isSalePriceEmpty ? "Price can't be empty" : "Price"
                }
              />
              <label htmlFor="input-field" className="input-label">
                Sale Price
              </label>
              <span className="input-highlight"></span>
            </div>
            <button
              type="button"
              className="button-add"
              onClick={onCompleteSale}
            >
              <span className="button-add__text">Add Sale</span>
              <span className="button-add__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="currentColor"
                  height="24"
                  fill="none"
                  className="svg"
                >
                  <line y2="19" y1="5" x2="12" x1="12"></line>
                  <line y2="12" y1="12" x2="19" x1="5"></line>
                </svg>
              </span>
            </button>
          </div>
          <div className="chart-container">
            <Line data={saleChart} />
          </div>
        </div>
        <div>
          <table className="sale-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Name</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Sale Price</th>
                <th>Total</th>
                <th>Profit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sale, i) => (
                <tr key={i}>
                  <td>
                    {saleRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="date"
                          className={`input-field ${
                            isSaleDateEditEmpty ? "input-field-red" : ""
                          }`}
                          value={convertDate(sale.sale_date, "dd/MM/yyyy")}
                          placeholder={
                            isSaleDateEditEmpty
                              ? "Sale Date"
                              : `${sale.sale_date}`
                          }
                          onChange={(e) => saleEdit(e, i, "sale_date")}
                        />
                      </div>
                    ) : (
                      convertDate(sale.sale_date, "dd/MM/yyyy")
                    )}
                  </td>
                  <td>
                    {saleRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          className={`input-field ${
                            isClientNameEditEmpty ? "input-field-red" : ""
                          }`}
                          value={sale.client_name}
                          placeholder={
                            isClientNameEditEmpty
                              ? "Client Name"
                              : `${sale.client_name}`
                          }
                          onChange={(e) => saleEdit(e, i, "client_name")}
                        />
                      </div>
                    ) : (
                      sale.client_name
                    )}
                  </td>
                  <td>
                    {saleRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          className={`input-field ${
                            isSaleProductNameEditEmpty ? "input-field-red" : ""
                          }`}
                          value={sale.sale_product_name}
                          placeholder={
                            isSaleProductNameEditEmpty
                              ? "Product Name"
                              : `${sale.sale_product_name}`
                          }
                          onChange={(e) => saleEdit(e, i, "sale_product_name")}
                        />
                      </div>

                    ) : (
                      sale.sale_product_name
                    )}
                  </td>
                  <td>
                    {saleRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          className={`input-field ${
                            isSaleQuantityEditEmpty ? "input-field-red" : ""
                          }`}
                          value={sale.sale_quantity}
                          placeholder={
                            isSaleQuantityEditEmpty
                              ? "Quantity"
                              : `${sale.sale_quantity}`
                          }
                          onChange={(e) => saleEdit(e, i, "sale_quantity")}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      </div>
                    ) : (
                      sale.sale_quantity
                    )}
                  </td>
                  <td>
                    {saleRowIndex === i ? (
                      <div className="input-container">
                        <input
                          type="text"
                          className={`input-field ${
                            isSalePriceEditEmpty ? "input-field-red" : ""
                          }`}
                          value={sale.sale_price}
                          placeholder={
                            isSalePriceEditEmpty
                              ? "Price"
                              : `${sale.sale_price}`
                          }
                          onChange={(e) => saleEdit(e, i, "sale_price")}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                          }}
                        />
                      </div>
                    ) : (
                      sale.sale_price
                    )}
                  </td>
                  <td>{sale.sale_quantity * sale.sale_price}</td>
                  <td>
                    {(() => {
                      const product = productData.find(
                        (product) =>
                          product.product_name.toLowerCase() ===
                          sale.sale_product_name.toLowerCase()
                      );
                      if (product) {
                        const profit =
                          (sale.sale_price -
                            product.base_price) *
                          sale.sale_quantity;
                        return profit.toFixed(2);
                      }
                      return "-";
                    })()}
                  </td>
                  <td>
                    {saleRowIndex === i ? (
                      <>
                        <button
                          className="save-icon-sale"
                          onClick={() => saleUpdate(i)}
                        ></button>
                        <button
                          className="cancel-icon-sale"
                          onClick={() => saleCancelEdit(i)}
                        ></button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-icon"
                          onClick={() => setSaleRowIndex(i)}
                        ></button>
                        <button
                          className="delete-icon"
                          onClick={() => handleDelete(sale._id)}
                        ></button>
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
);

export default SalesTable;
