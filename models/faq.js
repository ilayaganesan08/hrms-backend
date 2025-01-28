var FAQ = {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isactive: { type: Boolean, default: true },
    isdeleted: { type: Boolean, default: false }
};

module.exports = FAQ;