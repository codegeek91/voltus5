var mongoose = require('mongoose');

module.exports = function(){

    var dbURI = 'mongodb://localhost/voltus5';
    mongoose.connect(dbURI);
    var db = mongoose.connection;

    var gracefulShutdown = function(msg, callback) {
        mongoose.connection.close(function() {
            console.log('Mongoose disconnected through ' + msg);
            callback();
        });
    };
    
    db.on('connected', function() {
        console.log('Mongoose conected on ' + dbURI);
    });

    db.on('error', function(err) {
        console.log('Mongoose connection error: ' + err);
    });

    db.on('disconnected', function() {
        console.log('Mongoose disconnected');
    });
    /*
    process.once('SIGUSR2', function() {
        gracefulShutdown('nodemon restart', function() {
            process.kill(process.pid, 'SIGUSR2');
        });
    });

    process.on('SIGINT', function() {
        gracefulShutdown('app termination', function() {
            process.exit(0);
        });
    });

    process.on('SIGTERM', function() {
        gracefulShutdown('Heroku app shutdown', function() {
            process.exit(0);
        });
    });
*/
}