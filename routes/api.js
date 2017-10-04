var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer();
const sgMail = require('@sendgrid/mail');
var fs = require('fs');
var path = require('path');
var apikey = fs.readFileSync(path.join(__dirname, '../sendgridkey.txt'), 'utf8');
console.log(apikey);
sgMail.setApiKey('api key here');

var cors = require('cors');
router.use(cors());

var Problem = require("../models/problem");

router.get('/check_connection', function(){
    res.status(200).send('success');
})

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

router.get('/getpending', function(req, res, next){
    Problem
            .find({pending: true})
            .exec(function(err,result){
                if(err){
                    //console.log(err);
                    res.status(500).json({error: error});
                }else{
                    //console.log(result);
                    res.status(201).json({problems: result})
                }
            });
});

router.get('/download_pending_ids', function(req, res, next){
    Problem
            .find({downloadPending: true})
            .select('_id')
            .exec(function(err,result){
                if(err){
                    console.log(err);
                    res.status(500).json({error: error});
                }else{
                    //console.log(result);
                    res.status(200).json(result);
                }
            });
});

router.get('/download_pending_problem_by_id/:problem_id', function(req, res, next){
    const id = req.params.problem_id;
    if(id){
        Problem
            .findOne({pending: true, _id: id})
            .select('-downloadPending')
            .exec(function(err,doc){
                if(err){
                    console.log(err);
                    res.status(500).json(error);
                }else{
                    //console.log(doc);
                    res.status(200).json(doc);
                    //doc.downloadPending = true;
                    //doc.save();
                }
            });
    }
    
});

router.put('/update_problem_downloadpending_status/:problem_id', function(req, res, next){
    const id = req.params.problem_id;
    if(id){
        Problem.findById(req.params.problem_id, function(err, doc){
            //console.log('>>>>>>>>>>>>>>'+ doc);
            if (err) return res.status(500).json(err);
            //res.status(200).json({success: true});
            doc.downloadPending = false;
            doc.save(function(){res.status(200).json({success: true});}); //este cambio no esta bien testeado, poner el response de callback de la salva en bd
        });
    }
    
});

router.post('/post_problem', function(req, res, next){
    const problem = req.body;
    console.log('Incoming Uploaded Problem:  ' + problem);
    if(problem){
        Problem.create(problem, function(err,doc){
            if(err){
                console.error(err);
                res.status(500).json({succes:false, reason:err});
            }
            else{
                console.log('Problem Created By Upload');
                res.status(201).json({succes:true});
            }
        });
    }
});

router.post('/sendgrid_post_problem', upload.array(), function(req, res, next){

    //console.log(req.body);
    //Comprobacion para saber si es un mail
    
    /*if(req.body.from == 'talleres@voltus5.com'){
        
        console.log(req.body);
        res.status(200);
        res.send('email received');

        const title = req.body.subject;
        const content = req.body.text;
        const personEmail = req.body.from;

        var newProblem = new Problem({
            title: title,
            content: content,
            source: 'email',
            personEmail: personEmail
        });

        newProblem.save(function(err){
            if(err){
                return res.status(500).send('error posting problem');
            }else{
                return res.status(200).send('success');
            }
        });
    }*/

    
    //console.log(req.body);
    var envelope = JSON.parse(req.body.envelope)
    var subject = req.body.subject;
    var text = req.body.text;
    console.log('**Incoming Email**');
    console.log('From: >>>>>>  '+ envelope.from);
    console.log('To: >>>>>>  '+ envelope.to);
    console.log('Subject: ', + subject);
    console.log('Text: ' + text);
    //console.log(req.body);
    res.status(200);
    res.send('email received');
    
    
});



module.exports = router;
