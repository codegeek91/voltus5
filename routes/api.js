var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

var Problem = require("../models/problem");


/* GET users listing. */
router.post('/sendmail', function(req, res, next) {
    /* Post Data: from, to, subject, text */
    const key = req.body.key;
    const sender = req.body.from;
    const receiver = req.body.to;
    const to = receiver == undefined ? undefined : receiver.split(",");
    const subject = req.param.subject;
    const text = req.param.text;

    console.log(key);

    if(key != "link"){
        return res.status(400).json({test: 'hi'});
    }
    
    if(sender && receiver && subject && text){
        const msg = {
            to: to,
            from: sender,
            subject: subject,
            text: text,
        };

        sgMail.sendMultiple(msg, function(error, result) {
            if(error){
                const {message, code, response} = error;
                res.status(500);
                res.json({success: false, error: message});
                //console.error(message);
            }else{
                res.status(200);
                res.json({success: true});
            }
        });
    }

    //res.send('respond with a resource');
});

router.post('/test', upload.array(), function(req, res, next) {
  console.log(req.body);
  res.status(200);
  res.send('email received');

  /*
    var newProblem = new Problem({
        category: category,
        title: title,
        content: content,
        brand: brand,
        model: model,
        source: 'web',
        personName: personName,
        personEmail: personEmail,
        personPhone: personPhone,
        personLocation: personLocation
    });

    var usingAjax = req.body.usingAJAX;

    newProblem.save(function(err){
        if (err) {
            console.log(err);
            if(usingAjax){
                res.json({success: false});
            }else{
                req.flash("error", "Hubo bateo guardando tu problema");
                res.redirect('/problem'); /// Esta ruta no esta implementada
            }
        }else{
            if(usingAjax){
                console.log('Using Ajax');
                res.status(200)
                res.json({success: true});
            }else{
                res.redirect('/');
            }
        }
    });
*/

});

router.get('/getpending', function(req, res, next){
    Problem
            .find({pending: true})
            .exec(function(err,result){
                if(err){
                    console.log(err);
                    res.status(500).json({error: error});
                }else{
                    console.log(result);
                    res.status(201).json({problems: result})
                }
            });
});

router.post('postproblem', function(req, res, next){
    var newProblem = new Problem({
        category: category,
        title: title,
        content: content,
        brand: brand,
        model: model,
        source: 'web',
        personName: personName,
        personEmail: personEmail,
        personPhone: personPhone,
        personLocation: personLocation
    });

    var usingAjax = req.body.usingAJAX;

    newProblem.save(function(err){
        if (err) {
            console.log(err);
            if(usingAjax){
                res.json({success: false});
            }else{
                req.flash("error", "Hubo bateo guardando tu problema");
                res.redirect('/problem'); /// Esta ruta no esta implementada
            }
        }else{
            if(usingAjax){
                console.log('Using Ajax');
                res.status(200)
                res.json({success: true});
            }else{
                res.redirect('/');
            }
        }
    });
});

module.exports = router;
