import React, { useState } from "react";

const ClientTable = React.memo(function ClientTable({
  toggleClient,
  expandedClient,
  paymentData,
  paymentDate,
  isPaymentDataEmpty,
  isPaymentDateEmpty,
  setPaymentData,
  setPaymentDate,
  submitPayment,
  clientData,
  handleDelete
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = Object.keys(clientData).filter((clientName) =>
    clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="clients-table">
      <div className="input-container" id="clientSearch">
        <input
          className="input-field"
          type="text"
          placeholder="Search by client name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <label htmlFor="input-field" className="input-label">
          Search Client
        </label>
        <span className="input-highlight"></span>
      </div>
      <div className="clients-container">
        {filteredClients.map((clientName, index) => (
          <button
            key={index}
            className="button-name"
            onClick={() => toggleClient(clientName)}
          >
            <h2 className="cl_name">{clientName}</h2>
          </button>
        ))}
      </div>
      {expandedClient && (
        <div className="sales-table-container">
          {clientData[expandedClient]?.length > 0 && (
            <table className="stock-table">
              <thead>
                <tr>
                  <td colSpan="2">
                    <div className="input-container">
                      <input
                        className={`input-field ${
                          isPaymentDataEmpty ? "input-field-red" : ""
                        }`}
                        type="text"
                        value={paymentData}
                        onChange={(e) => setPaymentData(e.target.value)}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                        }}
                        placeholder={
                          isPaymentDataEmpty ? "Payment Amount" : "Payment Amount"
                        }
                      />
                    </div>
                  </td>
                  <td colSpan={4}>
                    <button
                      type="button"
                      className="button-add"
                      onClick={submitPayment}>
                      <span className="button-add__text">Payment</span>
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
                  </td>
                </tr>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Sale Price</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientData[expandedClient].map((sale, i) => (
                  <tr key={i}>
                    <td>{sale.sale_product_name}</td>
                    <td>{sale.sale_quantity}</td>
                    <td>{sale.sale_price}</td>
                    <td>{sale.sale_quantity * sale.sale_price}</td>
                    <td>
                      <button
                        className="delete-icon"
                        onClick={() => handleDelete(sale._id)}
                      ></button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3"></td>
                  <td>
                    <strong>
                      Total:{" "}
                      {clientData[expandedClient].reduce(
                        (total, sale) =>
                          total + sale.sale_quantity * sale.sale_price,
                        0
                      )}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
});

export default ClientTable;
