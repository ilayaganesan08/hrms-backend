var DB = require("./schemaconnection");

async function GetDocument(model, query, projection, extension, callback) {
  try {
    let queryBuilder = DB[model].find(query, projection, extension.options).lean();

    if (extension.populate) {
      if (extension.select) {
        queryBuilder = queryBuilder.populate(extension.populate, extension.select);
      } else {
        queryBuilder = queryBuilder.populate(extension.populate);
      }
    }
    if (extension.sort) {
      queryBuilder = queryBuilder.sort(extension.sort);
    }
    if (extension.skip) {
      queryBuilder = queryBuilder.skip(extension.skip);
    }
    if (extension.limit) {
      queryBuilder = queryBuilder.limit(extension.limit);
    }

    const docs = await queryBuilder.exec();

    if (extension.count) {
      const count = await DB[model].countDocuments(query).exec();
      callback(null, count);
    } else {
      callback(null, docs);
    }
  } catch (err) {
    callback(err, null);
  }
}

async function GetOneDocument(model, query, projection, extension, callback) {
  try {
    let queryBuilder = DB[model].findOne(query, projection, extension.options);

    if (extension.populate) {
      if (extension.select) {
        queryBuilder = queryBuilder.populate(extension.populate, extension.select);
      } else {
        queryBuilder = queryBuilder.populate(extension.populate);
      }
    }

    const doc = await queryBuilder.exec();
    callback(null, doc);
  } catch (err) {
    callback(err, null);
  }
}

async function GetAllDocuments(model, query = {}, projection = {}, extension = {}) {
  try {
    let queryBuilder = DB[model].find(query, projection, extension.options);

    if (extension.populate) {
      if (extension.select) {
        queryBuilder = queryBuilder.populate(extension.populate, extension.select);
      } else {
        queryBuilder = queryBuilder.populate(extension.populate);
      }
    }

    const docs = await queryBuilder.exec();
    return docs;
  } catch (err) {
    throw err;
  }
}

async function GetAggregation(model, query, extension, callback) {
  try {
    let docs = await DB[model].aggregate(query).exec();
    if (extension.populate) {
      docs = await DB[model].populate(docs, { path: extension.populate });
    }
    callback(null, docs);
  } catch (err) {
    callback(err, null);
  }
}

async function InsertDocument(model, docs, callback) {
  try {
    var doc_obj = new DB[model](docs);
    var numAffected = await doc_obj.save();
    callback(null, numAffected);
  } catch (err) {
    callback(err, null);
  }
}

async function InsertManyDocument(model, docs, callback) {
  try {
    const result = await DB[model].insertMany(docs);
    callback(null, result);
  } catch (err) {
    callback(err, null);
  }
}


async function DeleteDocument(model, criteria, doc, options) {
  try {
    const result = await DB[model].deleteOne(criteria, doc, options);
    return result; // Return the result for promise usage
  } catch (err) {
    throw err; // Throw error for promise usage
  }
}

async function DeleteManyDocument(model, criteria, callback) {
  try {
    const result = await DB[model].deleteMany(criteria);
    callback(null, result);
  } catch (err) {
    callback(err, null);
  }
}

async function UpdateDocument(model, criteria, doc, options) {
  try {
    const result = await DB[model].updateOne(criteria, doc, options);
    return result; // Return the result for promise usage
  } catch (err) {
    throw err; // Throw error for promise usage
  }
}



async function UpdateManyDocument(model, criteria, doc, options, callback) {
  try {
    const result = await DB[model].updateMany(criteria, doc, options);
    callback(null, result);
  } catch (err) {
    callback(err, null);
  }
}

async function FindUpdateDocument(model, criteria, doc, options, callback) {
  try {
    const result = await DB[model].findOneAndUpdate(criteria, doc, options);
    callback(null, result);
  } catch (err) {
    console.log("err", err);
    callback(err, null);
  }
}

async function GetCount(model, conditions, callback) {
  try {
    const count = await DB[model].countDocuments(conditions);
    callback(null, count);
  } catch (err) {
    callback(err, null);
  }
}

async function PopulateDocument(model, docs, options, callback) {
  try {
    const populatedDocs = await DB[model].populate(docs, options);
    callback(null, populatedDocs);
  } catch (err) {
    callback(err, null);
  }
}

module.exports = {
  GetDocument,
  GetOneDocument,
  GetAllDocuments, 
  InsertDocument,
  DeleteDocument,
  UpdateDocument,
  FindUpdateDocument,
  GetAggregation,
  PopulateDocument,
  GetCount,
  UpdateManyDocument,
  InsertManyDocument,
  DeleteManyDocument,
};
