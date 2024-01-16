const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    add,
    getAll,
    getByID,
    update,
    deleteById,
    getAllByCategory,
} = require('../controllers/productController');

const isAuthenticated = require("../middlewares/auth");

router.post('/add', upload.single('image'), isAuthenticated(['admin']), add);
router.delete('/delete/:ID', isAuthenticated(['admin']), deleteById);
router.get('/getById/:ID', getByID);
router.get('/getAll', getAll);
router.put('/update/:ID', upload.single('image'), isAuthenticated(['admin']), update);
router.get('/categoryByName/:categoryName', getAllByCategory);

module.exports = router;