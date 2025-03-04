const mongoose = require('mongoose');

const faqSchema = mongoose.Schema(require('../models/faq'), { timestamps: true, versionKey: false });
const testimonialSchema = mongoose.Schema(require('../models/testimonial'), { timestamps: true, versionKey: false });
const countriesSchema = mongoose.Schema(require('../models/countries'), {timestamps: true, versionKey: false });
const taxesSchema = mongoose.Schema(require('../models/taxes'), {timestamps: true, versionKey: false });
const employeesalarySchema = mongoose.Schema(require('../models/employeesalary'),{timestamps: true, versionKey: false })

const faqModel = mongoose.model('faqs', faqSchema);
const testimonialsModel = mongoose.model('testimonials', testimonialSchema);
const countriesModel = mongoose.model('countries', countriesSchema)
const taxesModel = mongoose.model('taxes', taxesSchema)
const employeesalaryModel = mongoose.model('employeesalary', employeesalarySchema );

module.exports = {
  faqs: faqModel,
  testimonials: testimonialsModel,
  countries:countriesModel,
  taxes:taxesModel,
  employeesalary:employeesalaryModel

}

