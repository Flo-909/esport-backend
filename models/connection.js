var mongoose = require('mongoose')
require('dotenv').config();

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true
}

mongoose.connect(process.env.MONGO_DB,
    options,
    function(err){
        if (err) {
            console.log(`error, failed to connect to the database because --> ${err}`);
          } else {
            console.info('*** Database E-Sport connection : Success ***');
          }
    }
)

module.exports = mongoose