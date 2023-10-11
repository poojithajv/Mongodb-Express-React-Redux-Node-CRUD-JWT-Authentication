require('dotenv').config()
const express=require('express')
const cors=require('cors')
const connection =require('./DbConnection/db')
const userRoute=require('./routes/usersRoute')
const logger=require('./util/logger')
const WooCommerceRestApi=require("@woocommerce/woocommerce-rest-api").default;

connection()

const app=express()
app.use(express.json())
app.use(cors())

app.use("/api", userRoute);

// Create a new instance of the WooCommerce API
const api = new WooCommerceRestApi({
    url: "http://testsample.local",
  
     // Enter your api key
    consumerKey: 'ck_7897ce4b295b78bce62f12284fda459953d4d991',
  
    // Enter your secret given by woocommerce
    consumerSecret: 'cs_a93e4db6d4a427338427db6234f4a791b53d4ea0',
    version: "wc/v3" // Set the API version
});

// Make a request to the WooCommerce API to 
// retrieve a list of products
  
api.get("products")
    .then((response) => {
  
        // Log the response data to the console
        console.log(response.data);
    })
    .catch((error) => {
  
        // Log the error response data to the console
        console.log(error.response.data); 
    });

//  Create a new product
const productData = {
    name: 'New Product1',
    regular_price: '9.00',
};
  
api.post('products', productData)
    .then((response) => {
  
        // Log the response data to the console
        console.log(response.data); 
    })
    .catch((error) => {
  
        // Log the error response data to the console
        console.log(error.response.data); 
    });

//     api.put('products/2119', {
//         name:'Pooji'
//     })
//     .then((response) => {
  
//         // Log the response data to the console
//         console.log(response.data); 
//     })
//     .catch((error) => {
  
//         // Log the error response data to the console
//         console.log(error.response.data); 
//     });
//     api.delete('products/2120', {
//         name:'Pooji'
//     })
//     .then((response) => {
  
//         // Log the response data to the console
//         console.log(response.data); 
//     })
//     .catch((error) => {
  
//         // Log the error response data to the console
//         console.log(error.response.data); 
//     });
module.exports = api;


app.listen(3002,()=>{
    logger.info('Server is running at 3001')
})