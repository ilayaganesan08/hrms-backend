var Countries = {
    countriesname: { type: String, required: true },
    countriescode: { type: String,required: true},
    status: { type: String },
    isactive: { type: Boolean, default: true },
};

module.exports = Countries;
