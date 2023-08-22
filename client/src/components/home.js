import React, { useState, useEffect } from "react";

const Home = React.memo(({ productData, salesData }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [clientTotals, setClientTotals] = useState([]);

  useEffect(() => {
    // Calculate total sales
    const salesTotal = salesData.reduce(
      (total, sale) => total + sale.sale_price * sale.sale_quantity,
      0
    );
    setTotalSales(salesTotal);

    // Calculate total profit
    const profitTotal = salesData.reduce((total, sale) => {
      const product = productData.find(
        (product) => product.product_name === sale.sale_product_name
      );
      if (product) {
        const profit =
          (sale.sale_price - product.base_price) * sale.sale_quantity;
        return total + profit;
      }
      return total;
    }, 0);
    setTotalProfit(profitTotal);

    // Calculate client totals
    const clientTotalsMap = salesData.reduce((totalsMap, sale) => {
      const existingTotal = totalsMap[sale.client_name] || 0;
      totalsMap[sale.client_name] =
        existingTotal + sale.sale_price * sale.sale_quantity;
      return totalsMap;
    }, {});

    const updatedClientTotals = Object.keys(clientTotalsMap).map(
      (clientName) => ({
        client_name: clientName,
        totalSales: clientTotalsMap[clientName],
      })
    );
    setClientTotals(updatedClientTotals);
  }, [productData, salesData]);

  return (
    <>
      <div className="home-page">
        <div className="box-container">
          <div className="box-text-container">
            <p className="box-text">Clients Total</p>
          </div>
          <div className="result-container">
            <table>
              <thead></thead>
              <tbody>
                {clientTotals.map((client, index) => (
                  <tr key={index}>
                    <td>{client.client_name}</td>
                    <td>{client.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="box-container">
          <div className="box-text-container">
            <p className="box-text">Total Sales</p>
          </div>
          <div className="result-text">{totalSales}</div>
        </div>
        <div className="box-container">
          <div className="box-text-container">
            <p className="box-text">Profit</p>
          </div>
          <div className="result-text">{totalProfit}</div>
        </div>
      </div>
    </>
  );
});

export default Home;
