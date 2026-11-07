const express = require('express');
const router = express.Router();
const { createInvoice,deleteInvoice,updateInvoice,getAllInvoice,getOneInvoiceForStudent } = require('../controllers/invoiceController');
const { createInvoiceValidation } = require('../middlewares/validateInvoice');

router.post('/createInvoice',createInvoiceValidation, createInvoice);
router.delete('/deleteInvoice/:id', deleteInvoice);
router.put('/updateInvoice/:id', updateInvoice);
router.get('/getAllInvoice', getAllInvoice);
router.get('/getOneInvoiceForStudent/:id', getOneInvoiceForStudent);





module.exports = router;
