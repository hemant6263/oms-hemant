var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var docStorage = new Schema({
        filename :            {type: String, required: true},
        contentType:          {type: String, required: true},
        length:               {type: Number, required: true},
        chunkSize:            {type: Number, required: true},
        uploadDate:           {type: Date, required: true},
        aliases:              {type: String},
        metadata:             {
                originalname : { type: String}
        },
        md5:                  {type: String}

});

module.export = mongoose.model('docStorage', docStorage);
