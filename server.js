require('dotenv').config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const connection = require('./config/db');
initializeApp(firebaseConfig);

const userRoute = require('./routes/userRoutes');
const cartRoute = require('./routes/cartRoutes');
const testimonialRoute = require('./routes/testimonialRoutes');
// const requestRoute = require('./routes/requestRoutes');
const productRoute = require('./routes/productRoutes');
const orderRoute = require('./routes/orderRoutes');
const emailRoute = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/testimonial', testimonialRoute);
// app.use('/request', requestRoute);
app.use('/product', productRoute);
app.use('/order', orderRoute);
app.use('/email', emailRoute);

app.listen(PORT, () => {
    connection();
    console.log(`app listening on port ${PORT}`);
});