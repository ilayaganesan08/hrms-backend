const BaseUrl = '/api/v1/';

module.exports = function (app) {
  app.use(BaseUrl + "faq", require("../controllers/admin/faq"));
  app.use(BaseUrl + "testimonial", require("../controllers/admin/testimonial"));
  app.use(BaseUrl + "countries", require("../controllers/admin/countries"));
  app.use(BaseUrl + "taxes", require("../controllers/admin/taxes"));
  app.use(BaseUrl + "employeesalary", require("../controllers/admin/employeesalary"));
}