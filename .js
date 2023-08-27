/* import React from "react";
import { useEffect, useState } from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sideBar";
import TopBar from "./components/topBar";
import Table from "./components/stockTable";
import SalesTable from "./components/salesTable";
import ClientTable from "./components/clientTable";
import Home from "./components/home";

function App() {

  const [productData, setProductData] = useState([{}]);
  const [salesData, setSalesData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [availableProductNames, setAvailableProductNames] = useState([]);
  const [availableClientNames, setAvailableClientNames] = useState([]);
  
  useEffect(() => {
    fetchProductData();
    fetchAvailableProducts();
    fetchSalesData();
    fetchAvailableClients();
  }, []);

  useEffect(() => {
    fetchClientData();
  }, [salesData]);

  const fetchAvailableClients = () => {
    fetch("/sale")
      .then(response => response.json())
      .then(data => {
    const clientNames = data.map(sale => sale.client_name);
    const uniqueClientNames = [...new Set(clientNames)];
    setAvailableClientNames(uniqueClientNames);
  })
  .catch(error => console.error("Error fetching client names:", error));
};

  

  
  const fetchAvailableProducts = () => {
    fetch("/products")
      .then(response => response.json())
      .then(data => {
        const productNames = data.map(product => product.product_name);
        setAvailableProductNames(productNames);
      })
      .catch(error => console.error("Error fetching product names:", error));
  };


const fetchClientData = () => {

const clientData = salesData.reduce((acc, sale) => {
  const clientId = sale.client_name;
  if (!acc[clientId]) {
    acc[clientId] = [];
  }
  acc[clientId].push(sale);
  return acc;
}, {});

setClientData(clientData);

};


  function fetchProductData () {

    fetch("/products").then(
      response => response.json()
    ).then(
      data => {
        setProductData(data)
      }
    ).catch((error) => {
      console.error("Error fetching products", error);
    });

  };


  function fetchSalesData () {

    fetch("/sale").then(
      response => response.json()
    ).then(
      res => {
        setSalesData(res)
      }
    ).catch((error) => {
      console.error("Error fetching sales:" , error);
    });


  };


  const handleRemove = (saleId) => {
    fetch(`/sale/${saleId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error deleting sale');
      }
    })
    .then(data => {
      // Remove the sale from the salesData array
      fetchSalesData();
      fetchAvailableClients();
      
      // Find the product associated with the deleted sale
      const deletedSale = salesData.find(sale => sale._id === saleId);
      const deletedProductName = deletedSale.sale_product_name.toLowerCase();
  
      // Find the corresponding product in the productData array
      const productToUpdate = productData.find(product => product.product_name.toLowerCase() === deletedProductName);
  
      // Update the quantity of the product
      if (productToUpdate) {
        const newQuantity = productToUpdate.quantity + parseFloat(deletedSale.sale_quantity);
        productToUpdate.quantity = newQuantity;
        
        // Send a PUT request to update the product's quantity
        fetch(`/products/${productToUpdate._id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productToUpdate)
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error updating product quantity');
          }
        })
        .then(updatedProduct => {
          fetchProductData();
          fetchAvailableProducts();
          setSuggestions([]);
          setSuggestionsSale([]);
        })
        .catch(error => console.error('Error updating product quantity:', error));
      }
    })
    .catch(error => console.error('Error deleting sale:', error));
  };
  

  const handleDelete = (productId) => {
    fetch(`/products/${productId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // Just return the text
      } else {
        throw new Error('Error deleting product');
      }
    })
    .then(data => {

        fetchProductData();
        fetchAvailableProducts();
        setInput([]);
      setSuggestionsSale([]);
      
    })
    .catch(error => console.error('Error deleting product:', error));
  };

  const [product_name, setProductName] = useState("");
  const [base_price, setBasePrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [isProductNameEmpty, setIsProductNameEmpty] = useState(false);
  const [isQuantityEmpty, setIsQuantityEmpty] = useState(false);
  const [isBasePriceEmpty, setIsBasePriceEmpty] = useState(false);

  function submitData() { 

    let isThisValid = true;

    const existingProductIndex = productData.findIndex(
      (product) => 
      new RegExp(product_name.trim(), 'i').test(product.product_name.trim()) &&
    product.base_price === parseFloat(base_price));

    

      if ( existingProductIndex !== -1)  { 
        isThisValid = false;
        const existingProduct = productData[existingProductIndex];
      
        const updatedProduct = {
          product_name: existingProduct.product_name.toLowerCase(),
          base_price: existingProduct.base_price,
          quantity: existingProduct.quantity + parseFloat(quantity),
        };
      

        fetch(`/products/${existingProduct._id}`, {
          method: "PUT", // or PATCH depending on your API design
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct)
        }).then((resp) => {
          resp.json().then((result) => {
            fetchProductData();
            fetchAvailableProducts();
            setProductName(""); 
            setBasePrice("");
            setQuantity("");
            setInput([]);
            setSuggestionsSale([]);
            setIsProductNameEmpty(false);
            setIsQuantityEmpty(false);
            setIsBasePriceEmpty(false);
            
          });
        });
      }  if (!product_name) {
        setIsProductNameEmpty(true);
        isThisValid = false;
      }  if (!quantity) {
        setIsQuantityEmpty(true);
        isThisValid = false;
      }  if (!base_price) {
        setIsBasePriceEmpty(true);
        isThisValid = false;
      }
      
     

    let data = {
      product_name,
      base_price,
      quantity,
    };
    if (isThisValid) {

    fetch("/products", {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(data)

    }).then((resp) => {
      resp.json().then((result) => {
        fetchProductData();
        fetchAvailableProducts();
        setProductName(""); 
        setBasePrice("");
        setQuantity("");
        setInput([]);
        setSuggestionsSale([]);
        setIsProductNameEmpty(false);
        setIsQuantityEmpty(false);
        setIsBasePriceEmpty(false);
      })
    })
    }}
  
  const [saleProductName, setSaleProductName] = useState("");
  const [saleQuantity, setSaleQuantity] = useState("");
  const [clientName, setClientName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState(new Date());

  const [isSaleProductNameEmpty, setIsSaleProductNameEmpty] = useState(false);
  const [isSaleQuantityEmpty, setIsSaleQuantityEmpty] = useState(false);
  const [isSalePriceEmpty, setIsSalePriceEmpty] = useState(false);
  const [isClientNameEmpty, setIsClientNameEmpty] = useState(false);
  const [isSaleDateEmpty, setIsSaleDateEmpty] = useState(false);
  const [isSaleProductNameValid, setIsSaleProductNameValid] = useState(true);

  const handleSale = () => {
   let valid = true;
    
    if (!saleProductName) {
      setIsSaleProductNameEmpty(true);
      valid = false;
    }  else if (!productData.some(product => product.product_name.trim() === saleProductName.trim())) {
      setIsSaleProductNameValid(false);
      valid = false;
    } if (saleProductName.toLowerCase() === "payment") {
      setIsSaleProductNameValid(true);
    } if (!saleQuantity) { 
      setIsSaleQuantityEmpty(true);
      valid = false;
    }  if (!clientName) {
      setIsClientNameEmpty(true);
      valid = false;
    }  if (!salePrice) {
      setIsSalePriceEmpty(true);
      valid = false;
    }  if (!saleDate) {
      setIsSaleDateEmpty(true);
      valid = false;
    }
    const data = {
      sale_product_name: saleProductName.toLowerCase(),
      sale_quantity: saleQuantity,
      client_name: clientName.toLowerCase(),
      sale_price: salePrice,
      sale_date: saleDate,
    };

    if (valid) {

    fetch("/sale", {
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(data)

    }).then((resp) => {
      resp.json().then((result) => {
      fetchSalesData();
      fetchProductData();
      fetchAvailableClients();
      setSaleProductName("");
      setSaleQuantity("");
      setClientName("");
      setSalePrice("");
      setSaleDate("");
      setValue([]);
      setSuggestions([]);
      setInput([]);
      setSuggestionsSale([]);
      setIsSaleProductNameEmpty(false);
      setIsSaleProductNameValid(true);
      setIsSaleQuantityEmpty(false);
      setIsClientNameEmpty(false);
      setIsSaleDateEmpty(false);
      setIsSalePriceEmpty(false);
      })
      
    });
  }
  };


  const uniqueClientNames = new Set(availableClientNames);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState([]);
  const [suggestionsSale, setSuggestionsSale] = useState([]);
  const [input, setInput] = useState("");


  const handleClientNameChange = (event) => {
    const selectedClientName = event.target.value;
    setValue(selectedClientName);
    if(!selectedClientName) {
      setSuggestions([]);
    } else {

    const filteredSuggestions = [...uniqueClientNames].filter(
      suggestion => suggestion.toLowerCase().includes(selectedClientName.toLowerCase())
    );
    console.log(suggestions);
      setSuggestions(filteredSuggestions);
      setClientName(selectedClientName); 

  }};

  const onSuggestionClick = (suggestion) => {
  setValue(suggestion);
  setSuggestions([]);
  setClientName(suggestion); 
};

const handleSaleProduct = (event) => {
  const selectedProductName = event.target.value;

  setInput(selectedProductName);


  if(!selectedProductName) {
    setSuggestionsSale([]);
  } else {

  const filteredSuggestionsB = [...availableProductNames].filter(
    suggestionA => suggestionA.toLowerCase().includes(selectedProductName.toLowerCase())
  );
    setSuggestionsSale(filteredSuggestionsB);
    setSaleProductName(selectedProductName.toLowerCase()); 
    setProductName(selectedProductName.toLowerCase()); 

}};

const onSaleClick = (suggestionA) => {
setInput(suggestionA);
setSuggestionsSale([]);
setSaleProductName(suggestionA); 
setProductName(suggestionA); 
};
const isMobile = window.matchMedia('(max-width: 767px)').matches;
const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
  };

 
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);



  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState([...productData]);
  const [isProductNameEditEmpty, setIsProductNameEditEmpty] = useState(false);
  const [isQuantityEditEmpty, setIsQuantityEditEmpty] = useState(false);
  const [isBasePriceEditEmpty, setIsBasePriceEditEmpty] = useState(false);


  const handleCancelEdit = (index) => {
    setEditingRowIndex(null);
  
    editedData[index].product_name = productData[index].product_name;
    editedData[index].quantity = productData[index].quantity;
  
    fetchProductData();
    fetchAvailableProducts();
  }
  const handleEditChange = (e, i, key) => {

    const updatedProducts = productData.map(item => {
      if (item._id === editedData[i]._id) {
        return {...item, [key]: e.target.value}
      } 
      return item;
    })
  
    setProductData(updatedProducts);
  
  }
  useEffect(() => {
    setEditedData(productData); 
  }, [productData])

    const handleUpdate = (i) => {
      const updatedProduct = {
        product_name: editedData[i].product_name,
        base_price: editedData[i].base_price,
        quantity: editedData[i].quantity,
      };

      let isValid = true;

      if (!updatedProduct.product_name) {
        setIsProductNameEditEmpty(true);
        isValid = false;
      }
      
      if (!updatedProduct.quantity) {
        setIsQuantityEditEmpty(true);
        isValid = false;
      }
      
      if (!updatedProduct.base_price) {
        setIsBasePriceEditEmpty(true);
        isValid = false;
      } 
      if (isValid) {
    
      fetch(`/products/${editedData[i]._id}`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      }).then((resp) => {
        resp.json().then((result) => {

          setEditingRowIndex(null);
          fetchProductData();
          fetchAvailableProducts();
        });
      });
    };
    };



const [saleRowIndex, setSaleRowIndex] = useState(null);
const [editedSaleData, setEditedSaleData] = useState([...salesData]);
const [isSaleProductNameEditEmpty, setIsSaleProductNameEditEmpty] = useState(false);
const [isSaleQuantityEditEmpty, setIsSaleQuantityEditEmpty] = useState(false);
const [isSalePriceEditEmpty, setIsSaleBasePriceEditEmpty] = useState(false);
const [isClientNameEditEmpty, setIsClientNameEditEmpty] = useState(false);
const [isSaleDateEditEmpty, setIsSaleDateEditEmpty] = useState(false);

const saleCancelEdit = (i) => {
    setSaleRowIndex(null);

    editedSaleData[i].sale_product_name = salesData[i].sale_product_name;
    editedSaleData[i].sale_quantity = salesData[i].sale_quantity;
    editedSaleData[i].sale_price = salesData[i].sale_price;
    editedSaleData[i].sale_date = salesData[i].sale_date;   
    editedSaleData[i].client_name = salesData[i].client_name;

    fetchSalesData();
    fetchProductData();
    fetchClientData();
};


const saleEdit = (e, i, key) => {
    const updatedSale = salesData.map(item => {
        if (item._id === editedSaleData[i]._id) {
            item[key] = e.target.value;
        }  
        return item;
        
    })
    setSalesData(updatedSale);
}

useEffect(() => {
    setEditedSaleData(salesData);

}, [salesData])

const saleUpdate = (i) => {

    const updatedSaleData = {
        sale_product_name: editedSaleData[i].sale_product_name,
        sale_quantity: editedSaleData[i].sale_quantity,
        sale_date: editedSaleData[i].sale_date,
        client_name: editedSaleData[i].client_name,
        sale_price: editedSaleData[i].sale_price,
    };

    let validSale = true;

      if (!updatedSaleData.sale_product_name) {
        setIsSaleProductNameEditEmpty(true);
        validSale = false;
    } if (!productData.some(product => product.product_name.trim() === editedSaleData[i].sale_product_name.trim())) {
      validSale = false;
    } if (!updatedSaleData.sale_quantity) {
        setIsSaleQuantityEditEmpty(true);
        validSale = false;
    }
    if (!updatedSaleData.sale_price) {
        setIsSaleBasePriceEditEmpty(true);
        validSale = false;
    }
    if (!updatedSaleData.client_name) {
        setIsClientNameEditEmpty(true);
        validSale = false;
    }
    if (!updatedSaleData.sale_date) {
        setIsSaleDateEditEmpty(true);
        validSale = false;
    }
    if (validSale) {
        fetch(`/sale/${editedSaleData[i]._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(updatedSaleData)
        }).then((resp) => {
            resp.json().then((result) => {
                setSaleRowIndex(null);
                fetchSalesData();
                fetchProductData();
                fetchClientData();
            });
        
        });
    };
};

const [paymentData, setPaymentData] = useState([]);
const [paymentDate, setPaymentDate] = useState(new Date()); 
const [isPaymentDataEmpty, setIsPaymentDataEmpty] = useState(false);
const [isPaymentDateEmpty, setIsPaymentDateEmpty] = useState(false);
const [expandedClient, setExpandedClient] = useState(null);



const toggleClient = (clientName) => {
  if (expandedClient === clientName) {
    setExpandedClient(null);
  } else {
    setExpandedClient(clientName);
  }
};


function submitPayment() {
  let validPayment = true;

  if (!paymentData) {
    setIsPaymentDataEmpty(true);
    validPayment = false;
  }
  if (!paymentDate) {
    setIsPaymentDateEmpty(true);
    validPayment = false;
  } 

  const data = {
    sale_product_name: "Payment",
    sale_quantity: -parseFloat(paymentData),
    sale_price: 1,
    client_name: expandedClient,
    sale_date: paymentDate,
  };

  if (validPayment) {

    fetch("/sale", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      return resp.json();
    })
    .then((result) => {
      fetchSalesData();
      fetchClientData();
      fetchProductData();
      setPaymentData("");
      setPaymentDate(new Date());
      setIsPaymentDataEmpty(false);
      setIsPaymentDateEmpty(false);
      setIsSaleProductNameValid(true);  
    })
    .catch((error) => {
      console.error("Error submitting payment:", error);
    });
  }
}


  return (
    <>
    <BrowserRouter>
      <div className="app-container">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`${sidebarOpen ? "section" : "section-extended"}`}>
          <TopBar toggleSidebar={toggleSidebar} />
          <div className="contentCenter">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stocks" element={<Table
            handleCancelEdit={handleCancelEdit}
            isProductNameEditEmpty={isProductNameEditEmpty} isQuantityEditEmpty={isQuantityEditEmpty} isBasePriceEditEmpty={isBasePriceEditEmpty}
            setData={setProductData} setEditingRowIndex={setEditingRowIndex} editingRowIndex={editingRowIndex}
            handleEditChange={handleEditChange} handleUpdate={handleUpdate}
            isProductNameEmpty={isProductNameEmpty} isQuantityEmpty={isQuantityEmpty}  isBasePriceEmpty={isBasePriceEmpty}
            onSaleProductNameChange={handleSaleProduct}
            input={input} onSaleClick={onSaleClick} suggestionsSale={suggestionsSale}
            data={productData} handleDelete={handleDelete} product_name={product_name}
            base_price={base_price} quantity={quantity} 
            availableProductNames={availableProductNames}
            onBasePriceChange={(e) => {
              const newValue = parseFloat(e.target.value) || "";
              if (/^\d*\.?\d*$/.test(newValue)) {
                setBasePrice(newValue);
              }
            }}
            onQuantityChange={(e) => {
              const newValue = parseFloat(e.target.value) || "";
              if (/^\d*\.?\d*$/.test(newValue)) {
                setQuantity(newValue);
              }
              
            }}
            onSubmit={submitData} />} />
            <Route path="/purchases" element={<SalesTable
            isSaleProductNameEditEmpty={isSaleProductNameEditEmpty} isSaleQuantityEditEmpty={isSaleQuantityEditEmpty} isSalePriceEditEmpty={isSalePriceEditEmpty}
            isSaleDateEditEmpty={isSaleDateEditEmpty} isClientNameEditEmpty={isClientNameEditEmpty}
            saleCancelEdit={saleCancelEdit} saleEdit={saleEdit} saleUpdate={saleUpdate}
            saleRowIndex={saleRowIndex} setSaleRowIndex={setSaleRowIndex} isSaleProductNameValid={isSaleProductNameValid}
            isSaleDateEmpty={isSaleDateEmpty} isClientNameEmpty={isClientNameEmpty} isSaleProductNameEmpty={isSaleProductNameEmpty}
            isSaleQuantityEmpty={isSaleQuantityEmpty} isSalePriceEmpty={isSalePriceEmpty}
            input={input} onSaleClick={onSaleClick} suggestionsSale={suggestionsSale}
            value={value} suggestions={suggestions} onSuggestionClick={onSuggestionClick}
            data={salesData} handleDelete={handleRemove} productData={productData}
            sale_date={saleDate} sale_product_name={saleProductName} sale_quantity={saleQuantity} sale_price={salePrice} client_name={clientName}
            availableProductNames={availableProductNames}  onSaleDateChange={(e) => setSaleDate(e.target.value)}
            onSaleQuantityChange={(e) => {
              const newValue = parseFloat(e.target.value) || "";
              if (/^\d*\.?\d*$/.test(newValue)) {
                setSaleQuantity(newValue);
              }
            
            }} 
            onSaleProductNameChange={handleSaleProduct}
            onClientNameChange={handleClientNameChange} 
            onSalePriceChange={(e) => {
              const newValue = parseFloat(e.target.value) || "";
              if (/^\d*\.?\d*$/.test(newValue)) {
                setSalePrice(newValue);
              }
            
            }} 
            onCompleteSale={handleSale}  />} />
            <Route path="/clients" element={<ClientTable
            toggleClient={toggleClient} expandedClient={expandedClient}
             paymentData={paymentData} paymentDate={paymentDate} submitPayment={submitPayment} clientData={clientData} handleDelete={handleRemove}
             isPaymentDataEmpty={isPaymentDataEmpty} isPaymentDateEmpty={isPaymentDateEmpty} setPaymentData={setPaymentData} setPaymentDate={setPaymentDate}/>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;