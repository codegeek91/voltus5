var express = require('express');
var router = express.Router();
var path = require('path');

var User = require("../models/user");
var Problem = require("../models/problem");
var passport = require("passport");


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}


router.use(function(req, res, next) {
    //console.log(req.user);
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.sendFile(path.join(__dirname, '../views/index.html'));
    res.render('home_page'); 
});

router.get('/pub', function(req, res, next) {
  //res.sendFile(path.join(__dirname, '../views/index.html'));
    res.render('publish_page'); 
});

router.post('/pub', function(req, res, next){

    console.log(req.body);

    const category = req.body.inputCategory;
    const title = req.body.inputTitle;
    const content = req.body.inputContent;
    const brand = req.body.inputBrand;
    const model = req.body.inputModel;
    const personName = req.body.inputName;
    const personEmail = req.body.inputEmail;
    const personPhone = req.body.inputPhone;
    const personLocation = req.body.inputLocation;

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
        personLocation: personLocation,
        downloadPending: true
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

router.get('/signup', function(req, res, next){
    res.render('signup_page')
});

router.post("/signup", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ username: username }, function(err, user) {
        if (err) { return next(err); }
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }
    var newUser = new User({
        username: username,
        password: password
    });
    newUser.save(next);
    });
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));

router.get('/login', function(req, res, next){
    res.render('login_page');
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

router.get('/listing', function(req, res, next){
    var category = req.query.cat;
    var actualPage = req.query.page
    var listingsPerPage = 10;
    console.log(req.query);
    if(!actualPage || actualPage == 0){return next()}
    if(category && (category == "celular" || category == "tablet" || category == "laptop" || category == "pc")){
        var icon;
        if(category == 'celular'){
            icon = 'mobile';
        }else if(category == 'pc'){
            icon = 'desktop';
        }else{
            icon = category;
        }
        var query = {category: category, pending: false};
        var options = {
        select: '-personName -personPhone -personEmail -personLocation',
        sort: '-createdAt',
        page: actualPage,
        limit: 10
        };

        Problem.paginate(query, options).then(function(problems) {
            console.log(actualPage);
            if(actualPage > problems.pages){return next()}
            res.render('listings_page', {category: category, icon: icon, problems: problems.docs, actualPage:actualPage, totalPages:problems.pages});
        });
        
    }else{
        next()
    }
});


router.get('/test', function(req, res){
    console.log(req.session ? 'Session Created' : 'Not using Session');
    if(req.session.page_views){
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    }else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
});





module.exports = router;
