const express = require('express');
const router = express.Router();
const {  createfeeCategory,  getAllfeeCategory, deleteFeeCategory, getOneFee,updateFeeCategory}=require('../controllers/feeCategoryController')
const {validateFee,validateUpdateFee}=require('../middlewares/validateFeeCategory')


router.post('/newfeeCategory',validateFee,createfeeCategory);
router.get('/AllCategory', getAllfeeCategory);
router.delete('/deleteFeeCategory/:id', deleteFeeCategory);
router.put('/updateFeeCategory/:id',validateUpdateFee,updateFeeCategory)
router.get('/getOneFee/:id',getOneFee)



module.exports = router;













module.exports = router;
