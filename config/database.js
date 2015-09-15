var mongoose = require('mongoose');
var databaseName = "birdproj";

mongoose.connect('mongodb://localhost/' + databaseName);
