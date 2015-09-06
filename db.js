var uriUtil = require('mongodb-uri');


var mongodbUri = 'mongodb://allegralarche:alohomora94@ds035673.mongolab.com:35673/schoolsquad';



module.exports = {
  'url' : uriUtil.formatMongoose(mongodbUri)

}