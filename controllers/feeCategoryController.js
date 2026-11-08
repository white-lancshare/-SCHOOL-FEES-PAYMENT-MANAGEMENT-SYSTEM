
const { FeeCategory, Invoice} = require('../models');
const createfeeCategory = async (req, res) => {
    try {
        const {name, amount} = req.body;
        const existingfeeCategory = await FeeCategory.findOne({where: {name}});
         
        if (existingfeeCategory) {
            return res.status(409).json({
              message: "A fee category with this name already exists",
            });
        }
        const newfeeCategory = await  FeeCategory.create({
            name,
            amount
        })

        res.status(201).json({
          message: "Fee category created successfully",
          data: newfeeCategory,
        });

    
    } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "An unexpected server error occurred." });
    }
};


const getOneFee = async (req, res) => {
  try {
    const id = req.params.id;

    const findId = await FeeCategory.findByPk(id);

    if (!findId) {
      return res.status(404).json({
        message: "Fee category not found",
      });
    }

    res.status(200).json({
      message: "Fee category retrieved successfully",
      data: findId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};


const getAllfeeCategory = async (req, res) => {
    try {
        const feeCategory = await FeeCategory.findAll();

        res.status(200).json({
          message: `All fee categories retrieved successfully and the total is ${feeCategory.length}`,
          data: feeCategory,
        });

    } catch (error) {
           console.error(error);
           res
             .status(500)
             .json({ message: "An unexpected server error occurred." });
    }
}

const deleteFeeCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const findFeeCategory = await FeeCategory.findByPk(id);
    if (!findFeeCategory) {
      return res.status(404).json({
        message: "Fee category not found",
      });
    }

    const invoiceCount = await Invoice.count({ where: { feeCategoryId: id } });

    if (invoiceCount > 0) {
      return res.status(409).json({
        message: "This fee category is used by invoices and cannot be deleted.",
      });
    }

    await FeeCategory.destroy({ where: { id } });

    res.status(200).json({
      message: "Fee category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};


const updateFeeCategory=async(req,res)=>{
try {
  const { amount, name } = req.body;
  const id = req.params.id;
  const findId = await FeeCategory.findByPk(id);

  if (!findId) {
    return res.status(404).json({
      message: "Fee category not found",
    });
  }

  if (name) {
    const nameOwner = await FeeCategory.findOne({ where: { name } });

    if (nameOwner && nameOwner.id !== id) {
      return res.status(400).json({
        message: "A fee category with this name already exists",
      });
    }
  }

  await FeeCategory.update({ name, amount }, { where: { id } });

  const updatedFee = await FeeCategory.findByPk(id);

  res.status(200).json({
    message: "Fee category updated successfully",
    data: updatedFee,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
}

}

module.exports = {
    createfeeCategory,
    getAllfeeCategory,
    deleteFeeCategory,
    getOneFee,
    updateFeeCategory
}