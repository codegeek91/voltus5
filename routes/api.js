var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer();
const sgMail = require('@sendgrid/mail');
var fs = require('fs');
var path = require('path');
var apikey = fs.readFileSync(path.join(__dirname, '../sendgridkey.txt'), 'utf8');
console.log(apikey.toString().trim());
sgMail.setApiKey(apikey.toString().trim());

var cors = require('cors');
router.use(cors());

var Problem = require("../models/problem");
var Solution = require("../models/solution");
var Taller = require("../models/taller");

router.get('/check_connection', function(){
    res.status(200).send('success');
})

var sendMail = function(to,sender,subject,text){
    console.log('function invocation');
    const msg = {
        to: to,
        from: sender,
        subject: subject,
        text: text,
    };

    sgMail.sendMultiple(msg, function(error, result) {
        if(error){
            const {message, code, response} = error;
            console.log('ERROR');
            console.log(code);
            return console.error(error);
        }else{
            return console.log('sended email');
        }
    });
};
/*
router.post('/sendmail', function(req, res, next) {
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
});*/

/////////////////  Talleres Solutions Routes  /////////////////////////

router.get('/download_pending_solutions_ids', function(req, res, next){
    Solution
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

router.get('/download_pending_solution_by_id/:solution_id', function(req, res, next){
    const id = req.params.solution_id;
    if(id){
        Solution
            .findOne({_id: id})
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

router.put('/update_solution_downloadpending_status/:solution_id', function(req, res, next){
    console.log('yijaaa')
    const id = req.params.solution_id;
    if(id){
        Solution.findById(id, function(err, doc){
            //console.log('>>>>>>>>>>>>>>'+ doc);
            if (err) return res.status(500).json(err);
            //res.status(200).json({success: true});
            doc.downloadPending = false;
            doc.save(function(){res.status(200).json({success: true});});
        });
    }else{res.status(500).send('error');}
    
});


//////////////////  Talleres Solutions Routes End   ///////////////////////////

/*
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
});*/

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
        Problem.findById(id, function(err, doc){
            //console.log('>>>>>>>>>>>>>>'+ doc);
            if (err) return res.status(500).json(err);
            //res.status(200).json({success: true});
            doc.downloadPending = false;
            doc.save(function(){res.status(200).json({success: true});}); //este cambio no esta bien testeado, poner el response de callback de la salva en bd
        });
    }else{res.status(500).send('error');}
    
});

router.post('/post_problem', function(req, res, next){
    var emailList = [];
    const problem = req.body;
    console.log('Incoming Uploaded Problem:  ' + problem);
    if(problem){
        Problem.create(problem, function(err,doc){
            if(err){
                console.error(err);
               return res.status(500).json({succes:false, reason:err});
            }
            else{
                console.log('Problem Created By Upload');
                Taller
                    .find()
                    .select('email')
                    .exec(function(err, emails){
                        if(err){
                            return res.status(500).json({succes:false, reason:err});
                        }else{
                            //console.log(emails);
                            testFun(0, emails, [], doc);
                        }   
                    });
                //sendMail('codegeek1991@gmail.com', 'prueba@voltus5.com', doc._id, doc.title);
                //return res.status(201).json({succes:true});
            }
        });
    }else{
        res.status(401).json({succes:false});
    }
    
});

var testFun = function(index, array, emailList, problem){
    if (index >= array.length){
        console.log(emailList);
        sendMail(emailList, 'prueba@voltus5.com', problem._id, problem.title);
        return res.status(201).json({succes:true});
    }
    emailList.push(array[index].email);
    testFun(index + 1, array, emailList);
};

router.post('/sendgrid_post_problem', upload.array(), function(req, res, next){

    var envelope = JSON.parse(req.body.envelope)
    var subject = req.body.subject;
    var text = req.body.text;
    /*
    console.log('**Incoming Email**');
    console.log('From: '+ envelope.from);
    console.log('To: '+ envelope.to);
    console.log('Subject: ' + subject);
    console.log('Text: ' + text);
    */
    
    if(envelope.to == 'contacto@voltus5.com'){

        var newProblem = new Problem({
            title: subject,
            content: text,
            source: 'email',
            personEmail: envelope.from
        });

        newProblem.save(function(err){
            if(err){
                return res.status(500).send('error posting problem');
            }else{
                return res.status(200).send('success');
            }
        });
    }else if(envelope.to == 'talleres@voltus5.com'){
        var tallerName;

        Taller
            .findOne({email: envelope.from})
            .exec(function(err,doc){
                if(err){
                    console.log(err);
                }else if(doc){
                    console.log('akakak');
                    console.log(doc);
                    tallerName = doc.name;
                    doc.responses = doc.responses + 1;
                    doc.save();
                    Solution.create({from: envelope.from, tallerName: tallerName, subject: subject, text: text}, function(err, solution){
                        if(err){
                            console.error(err);
                            return res.status(500).send('failure');
                        }
                        else{
                            console.log('Solution Created By Email');
                            return res.status(201).send('success');;
                        }
                    })
                }else{
                    console.log('unknow taller');
                    return res.status(200).send('unknow taller');
                }
            });
    }else{
        return res.status(200).send('unknow to');
    }
});

router.get('/testsolution', function(req, res, next){
    Solution.create({}, function(err,doc){
        if(err){
            console.error(err);
            res.status(500).json({succes:false, reason:err});
        }
        else{
            console.log('Solution Created By Test');
            res.status(201).json({succes:true});
        }
    });
});

router.post('/post_taller', function(req,res,next){
    var taller = req.body;
    if(taller){
        Taller.create(taller, function(err,doc){
            if(err){
                console.error(err);
               return res.status(500).json({succes:false, reason:err});
            }
            else{
                console.log('Taller Created By Upload');
               return res.status(201).json({succes:true});
            }
        });
    }else{
        res.status(401).json({succes:false});
    }
    
});



module.exports = router;
