
const { FeeCategory} = require('../models');
const createfeeCategory = async (req, res) => {
    try {
        const {name,dueDate, amount} = req.body;
        const existingfeeCategory = await FeeCategory.findOne({where: {name}});
         
        if (existingfeeCategory) {
            return res.status(400).json({
                message:"feeCategory already exist"
            })
        }
        const newfeeCategory = await  FeeCategory.create({
            name,
            amount,
            dueDate
        })

        res.status(200).json({
            message:"feeCategory created sucessfully",
            data:newfeeCategory
        })

    
    } catch (error) {
        res.status(500).json({
         message: error.message
        })
    }
}
const getOneFee= async(req,res)=>{
    const id=req.params.id
    const findId= await FeeCategory.findByPk(id)

    if(!findId){
     return  res.status(404).json({
            message:"fee category not found"
        })
    }

res.status(200).json({
    message:"fee found sucessfully",
    data:findId
})

}
const getAllfeeCategory = async (req, res) => {
    try {
        const feeCategory = await FeeCategory.findAll();

        res.status(200).json({
            message:`all fees found in the database are ${feeCategory.length}`,
          value:feeCategory
        });

    } catch (error) {
           res.status(500).json({
            message:"there is a server error",
            data:error.message
           })
    }
}

const deleteFeeCategory= async(req,res)=>{
    try{
  const id=req.params.id
const findFeeCategory= await FeeCategory.findByPk(id)
if(!findFeeCategory){
    return res.status(404).json({
        message:"fee categories with this id does not exist"
    })
}

const deleteFee= await FeeCategory.destroy({where:{id}})

res.status(200).json({
    message:"fee has been deleted sucessfully",
    data:deleteFee
})


    }catch(e){
      res.status(500).json({
            message:"there is a server error",
            data:error.message
           })
    }
}

const updateFeeCategory=async(req,res)=>{
try{
    const{dueDate, amount,name}=req.body
 const id=req.params.id
const findId= await FeeCategory.findByPk(id)

if(!findId){
    
return res.status(404).json({
    message:"fee category does not exits"
})
}

const updateFee= await FeeCategory.update({ amount,dueDate,name},{where:{id}})

res.status(200).json({
    message:"user updated sucessfully",
    data:updateFee
})

}catch(e){
    res.status(500).json({
        message:"there is a server error",
       err:e.message
    })
}

}

module.exports = {
    createfeeCategory,
    getAllfeeCategory,
    deleteFeeCategory,
    getOneFee,
    updateFeeCategory
}











