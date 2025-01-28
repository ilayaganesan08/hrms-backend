var schema = {
    author: { type: String, required: true },
    role: { type: String },
    content: { type: String },
    profile: { type: String },
    isactive: { type: Boolean, default: true },
};

module.exports = schema;