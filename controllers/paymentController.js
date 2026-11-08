const {Payment, Invoice, Student} = require('../models');

const createPayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentDate, paymentMethod } = req.body;

        const findInvoice = await Invoice.findByPk(invoiceId);

        if (!findInvoice) {
            return res.status(404).json({
                message: `Invoice does not exist`
            })
        };

        const bill = findInvoice.amount;
        const payments = await Payment.findAll({ where: { invoiceId } });

        const totalPaid = payments.reduce((total, payment) => {
            return total + payment.amount
        }, 0);

        const balance = bill - totalPaid;

        if (amount > balance) {
            return res.status(400).json({
                message: `The payment: ${amount} exceeds the outstanding balance: ${balance}`
            })
        };

        
        const newPayment = await Payment.create({
          invoiceId,
          amount,
          paymentDate,
          paymentMethod
        });

        if (amount < balance) {
          await findInvoice.update(
            {
              status: "Partially Paid",
            },
             
          );
        } else if (amount === balance) {
          await findInvoice.update(
            {
              status: "Fully Paid",
            },
          );
        }


        res.status(201).json({
            message: "Payment Successful",
            data: newPayment
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "An unexpected server error occurred.",
        });
    }
};


const getAllPayments = async (req, res) => {
  try {
    const allPayments = await Payment.findAll();

    res.status(200).json({
      message: "All payments retrieved ",
      data: allPayments
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
};


const getPaymentById = async (req, res) => {
  try {
    const {id} = req.params;

    const foundPayment = await Payment.findByPk(id);

    if (!foundPayment) {
      return res.status(404).json({
        message: `Payment with ID: ${id} does not exist.`
      })
    }

    res.status(200).json({
      message: `Payment found`,
      data: foundPayment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
};


const updatePayment = async (req, res) => {
  try {
    const {id} = req.params;
    const { amount, paymentDate, paymentMethod } = req.body;

    const foundPayment = await Payment.findByPk(id);

    if (!foundPayment) {
      return res.status(404).json({
        message: `Payment with ID: ${id} does not exist.`,
      });
    }

    const invoice = await Invoice.findByPk(foundPayment.invoiceId);
    const bill = invoice.amount;

    const payments = await Payment.findAll({
      where: { invoiceId: foundPayment.invoiceId },
    });

    const otherPayments = payments.filter(
      (payment) => payment.id !== foundPayment.id,
    );

    const totalPaid = otherPayments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);

    const debt = bill - totalPaid;


    if (debt === amount || debt > amount) {
      await Payment.update(
        { amount, paymentDate, paymentMethod },
        { where: { id } },
      );

      const newTotalPaid = totalPaid + amount;

      if (bill === newTotalPaid) {
        await Invoice.update(
          {
            status: "Fully Paid",
          },
          { where: { id: foundPayment.invoiceId } },
        );
      } else if (bill > newTotalPaid) {
        await Invoice.update(
          {
            status: "Partially Paid",
          },
          { where: { id: foundPayment.invoiceId } },
        );
      } 

      const updatedPayment = await Payment.findByPk(id);

      return res.status(200).json({
        message: "Payment updated",
        data: updatedPayment,
      });
    } else if (amount === undefined) {
      await Payment.update(
        { paymentDate, paymentMethod },
        { where: { id } },
      );

      const updatedPayment = await Payment.findByPk(id);

      return res.status(200).json({
        message: "Payment updated",
        data: updatedPayment,
      });
    } else {
      return res.status(400).json({
        message: `Amount: ${amount} exceeds debt: ${debt}`
      })
    }


  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
};


const deletePayment = async (req, res) => {
  try {
    const {id} = req.params;

    const foundPayment = await Payment.findByPk(id);

    if (!foundPayment) {
      return res.status(404).json({
        message: "Payment not found"
      })
    };

    const invoiceId = foundPayment.invoiceId;

    await Payment.destroy({where: {id}});


    const otherPayments = await Payment.findAll({
      where: { invoiceId: invoiceId },
    });

    const remainingPayment = otherPayments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);

    const invoice = await Invoice.findByPk(invoiceId);
    const bill = invoice.amount;


    if (remainingPayment === 0) {
      await Invoice.update(
        {
          status: "Unpaid",
        },
        { where: { id: invoiceId } },
      );
    } else if (bill > remainingPayment) {
      await Invoice.update(
        {
          status: "Partially Paid",
        },
        { where: { id: invoiceId } },
      );
    }

    res.status(200).json({
      message: "Payment deleted successfully",
      data: foundPayment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
};


const getPaymentsByInvoice = async (req, res) => {
  try {
    const {invoiceId} = req.params;

    const findInvoice = await Invoice.findByPk(invoiceId);
    if (!findInvoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    };

    const allPayments = await Payment.findAll({where:{invoiceId}});

    res.status(200).json({
      message: "All Payments to this invoice retrieved successfully.",
      data: allPayments
    })

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
};


const getStudentPaymentHistory = async (req, res) => {
  try {
    const {studentId} = req.params;

    const findStudent = await Student.findByPk(studentId);

    if (!findStudent) {
      return res.status(404).json({
        message: "This student does not exist"
      })
    };


    const allPaymentsWithInvoices = await Payment.findAll({
      include: {
        model: Invoice,
        as: "invoice",
        where: { studentId }
      }
    });

    res.status(200).json({
      message: "All Payments with associated Invoices retrieved successfully.",
      data: allPaymentsWithInvoices
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "An unexpected server error occurred.",
    });
  }
};
module.exports = { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment, getPaymentsByInvoice, getStudentPaymentHistory };