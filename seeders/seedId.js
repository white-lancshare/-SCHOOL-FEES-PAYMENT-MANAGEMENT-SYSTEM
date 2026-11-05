const uuid = require("uuid").v4;

const studentIds = {
  ada: uuid(),
  daniel: uuid(),
  grace: uuid(),
  samuel: uuid(),
  esther: uuid(),
};

const feeCategoryIds = {
  tuition: uuid(),
  laboratory: uuid(),
  library: uuid(),
};

const invoiceIds = {
  adaTuition: uuid(),
  danielTuition: uuid(),
  graceTuition: uuid(),
  samuelLaboratory: uuid(),
  estherLaboratory: uuid(),
  adaLibrary: uuid(),
  danielLibrary: uuid(),
  graceLaboratory: uuid(),
};

module.exports = {
  studentIds,
  feeCategoryIds,
  invoiceIds,
};