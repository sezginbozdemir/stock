const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db = require("./dataBase.js");
const Data = require("./dataModel.js");
const Data2 = require("./dataModel2.js");
const userData = require("./userModel.js");
const PORT = process.env.PORT || 5055;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
app.use(express.json());

/* app.use('/api', apiRoutes); */

app.use(cors());

app.post("/login", async (req, res) => {
  console.log("Request body:", req.body);
  const { username, password } = req.body;

  try {
    const user = await userData.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If credentials are valid, create a JWT token
    const token = jwt.sign({ userId: user._id }, "polyxena", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error processing login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put(`/sale/:saleId`, express.json(), async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const {
      sale_date,
      client_name,
      sale_product_name,
      sale_price,
      sale_quantity,
    } = req.body;

    const updatedProduct = await Data2.findByIdAndUpdate(
      saleId,
      { sale_date, client_name, sale_product_name, sale_price, sale_quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated succesfully" });
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({ error: "An error occured" });
  }
});

app.put("/products/:productId", express.json(), async (req, res) => {
  try {
    const productId = req.params.productId;
    const { product_name, base_price, quantity } = req.body;

    const updatedProduct = await Data.findByIdAndUpdate(
      productId,
      { product_name, base_price, quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated succesfully" });
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({ error: "An error occured" });
  }
});

app.post("/products", express.json(), async (req, res) => {
  try {
    const { product_name, base_price, quantity } = req.body;

    const newProduct = new Data({
      product_name,
      base_price,
      quantity,
    });

    await newProduct.save();

    res.json({ message: "Product added succesfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "An error occured" });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    await Data.findByIdAndRemove(productId);
    res.json({ message: "Product deleted succesfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const data = await Data.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/sale", async (req, res) => {
  try {
    const salesData = await Data2.find({});
    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/sale/:saleId", async (req, res) => {
  const saleId = req.params.saleId;

  try {
    await Data2.findByIdAndRemove(saleId);
    res.json({ message: "Sale deleted succesfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting sale" });
  }
});

app.post("/sale", express.json(), async (req, res) => {
  try {
    const {
      sale_date,
      client_name,
      sale_product_name,
      sale_price,
      sale_quantity,
    } = req.body;

    if (sale_product_name.toLowerCase() === "payment") {
      // Handling the "Payment" case separately
      const newSale = new Data2({
        sale_date,
        client_name,
        sale_product_name,
        sale_price,
        sale_quantity,
      });

      await newSale.save();

      res.json({ message: "Payment added successfully" });
    } else {
      // Handling regular product sales
      const newSale = new Data2({
        sale_date,
        client_name,
        sale_product_name,
        sale_price,
        sale_quantity,
      });

      await newSale.save();

      const product = await Data.findOne({
        product_name: { $regex: new RegExp(sale_product_name.trim(), "i") },
      });

      if (!product) {
        console.warn("Product was not found", sale_product_name);
        return res.status(404).json({ message: "Product not found" });
      }

      product.quantity -= sale_quantity;
      await product.save();

      res.json({ message: "Sale added successfully" });
    }
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
