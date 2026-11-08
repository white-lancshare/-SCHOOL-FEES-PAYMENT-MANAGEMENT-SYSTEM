const {Invoice,FeeCategory, Student, Payment}=require('../models')


const createInvoice= async(req,res)=>{
try {
  const { studentId, feeCategoryId, amount, dueDate } = req.body;

  const student = await Student.findByPk(studentId);
  if (!student) {
    return res.status(404).json({
      message: "Student not found ",
    });
  }

  const fee = await FeeCategory.findByPk(feeCategoryId);

  if (!fee) {
    return res.status(404).json({
      message: "Fee category not found",
    });
  }

  const newInvoice = await Invoice.create({
    studentId,
    feeCategoryId,
    amount,
    dueDate,
  });

  res.status(201).json({
    message: "Invoice created succesfully ",
    data: newInvoice,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
}
}

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const paymentCount = await Payment.count({ where: { invoiceId: id } });

    if (paymentCount > 0) {
      return res.status(409).json({
        message: "This invoice has payments and cannot be deleted.",
      });
    }

    await Invoice.destroy({ where: { id } });

    res.status(200).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, dueDate } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const payments = await Payment.findAll({ where: { invoiceId: id } });

    const totalPaid = payments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);

    if (amount !== undefined && amount < totalPaid) {
      return res.status(400).json({
        message: `Amount: ${amount} cannot be less than the total already paid: ${totalPaid}`,
      });
    }

    await Invoice.update({ amount, dueDate }, { where: { id } });

    const newAmount = amount || invoice.amount;

    let newStatus = "Partially Paid";

    if (totalPaid === 0) {
      newStatus = "Unpaid";
    } else if (totalPaid === newAmount) {
      newStatus = "Fully Paid";
    }

    await Invoice.update({ status: newStatus }, { where: { id } });

    const updatedInvoice = await Invoice.findByPk(id);

    res.status(200).json({
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};


const getAllInvoice=async(req,res)=>{
try {
  const invoices = await Invoice.findAll({
    include: [
      { model: FeeCategory, as: "feeCategory" },
      { model: Student, as: "student" },
    ],
  });

  res.status(200).json({
    message: `All invoices retrieved successfully and the total is ${invoices.length}`,
    data: invoices,
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
}
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: FeeCategory, as: "feeCategory" },
        { model: Student, as: "student" },
        { model: Payment, as: "payments" },
      ],
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const totalPaid = invoice.payments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);

    const outstandingBalance = invoice.amount - totalPaid;

    res.status(200).json({
      message: "Invoice retrieved successfully",
      totalPaid: totalPaid,
      outstandingBalance: outstandingBalance,
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};


const getInvoicesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const invoices = await Invoice.findAll({
      where: { studentId },
      include: [
        { model: FeeCategory, as: "feeCategory" },
        { model: Payment, as: "payments" },
      ],
    });

    res.status(200).json({
      message: "All invoices of this student retrieved successfully",
      data: invoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
};

module.exports = {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  getAllInvoice,
  getInvoiceById,
  getInvoicesByStudent,
};