var express = require('express');
var app = express();
var session = require('express-session');
var admin = require('firebase-admin');
var serviceAccount = require('./serviceaccount.json');
var bodyparser = require('body-parser');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ando-1e52b.firebaseio.com",
  });

app.use(bodyparser.json());
app.use(session({secret: 'ssshhhhh',resave: true,saveUninitialized: true}));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));

var db = admin.database();
var sess;

// index page
app.get('/homepage', function(req,res){
    res.render("index.ejs" , {brand:null, model:null});
});

// brand selcted on index page
app.get('/homepage/:pbrand', function(req,res){
    sess = req.session;

    var pbrand = req.params.pbrand;
    var pmodel = [];
    var pmodelkey = [];
    
    // retreiving models of selected brand
    var ref = db.ref("/phone/" + pbrand);
        ref.on("child_added", function(snapshot){
            pmodelkey.push(snapshot.key);
        });
        ref.on("value", function(snapshot) {
            snapshot.forEach(ChildSnapshot => {
                pmodel.push(ChildSnapshot.val().name);
            });
        });
        setTimeout(function(){
            res.render("index.ejs" , {model:pmodel, brand:pbrand ,modelkey:pmodelkey});
        }, 800);
    });

// model selected on index page
app.get('/homepage/:pbrand/:pmodel' , function(req,res){
    sess = req.session;

    var pbrand = req.params.pbrand;
    var pmodel = [];
    var pmodelkey = [];
    
    // retreiving model and brand
    var ref = db.ref("/phone/" + pbrand);
        ref.on("child_added", function(snapshot){
            pmodelkey.push(snapshot.key);
        });
        ref.on("value", function(snapshot) {
            snapshot.forEach(ChildSnapshot => {
                pmodel.push(ChildSnapshot.val().name);
            });
        });
        setTimeout(function(){
            res.render("index.ejs" , {model:pmodel, brand:pbrand ,modelkey:pmodelkey});
        }, 800);
    });

// service page
app.post('/service', function(req,res){
    sess = req.session;
    sess.uid = req.body.userid;
    sess.city =  req.body.selectcity;
    sess.brand = req.body.selectbrand;
    sess.model = req.body.selectmodel;
    sess.screen = req.body.screencolor;
    sess.faults = req.body.faults;

    // storing current user in db
    admin.auth().getUser(sess.uid).then(function(userRecord) {
        
        var checkuser = db.ref("/users/");
        checkuser.on("value", function(snapshot){
            console.log(snapshot.val());
            var userexist = 0;
            snapshot.forEach(function(snap){
                if(snap.val().uid == sess.uid){
                    userexist = 1;
                }
            });
            console.log(userexist);
            if(userexist == 0){
                var ref = db.ref('/');
                var userref = ref.child("users/" + sess.uid);
                userref.set({
                    uid : sess.uid,
                    uphone:userRecord.phoneNumber       
                })
            }
            else{
                console.log("user already exists");
            }
        });
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
    });

    // getting prices of selected brand, model and fault
    var ref=db.ref("/phone/" + sess.brand + "/" + sess.model + "/" + sess.faults + "/")
    ref.once("value" , function(snapshot){
        sess.marketprice = snapshot.val().market;
        sess.appprice = snapshot.val().app;
        res.render("service.ejs" , {ocity:sess.city, obrand:sess.brand, omodel:sess.model, oscreen:sess.screen, ofaults:sess.faults, omprice:sess.marketprice, oaprice:sess.appprice});
    });
});

// time page
app.post('/service/time' ,function(req,res){ 
    var time = [];
    var ref = db.ref('/appoinment/time/');
    ref.on("child_added", function(snapshot){
        if(snapshot.val().available=="1"){
            time.push(snapshot.val().start + '-' + snapshot.val().end);
        }
    });
    setTimeout(function(){
    res.render("time.ejs" , {ocity:sess.city, obrand:sess.brand, omodel:sess.model, oscreen:sess.screen, ofaults:sess.faults, omprice:sess.marketprice, oaprice:sess.appprice, oavailabletime:time});
    },800);
});

// address page
app.post('/service/time/address' ,function(req,res){
    var time = [];
    var saddress = [];
    sess.date = req.body.servicedate;
    sess.time = req.body.servicetime;

    // Retreiving all Stored addresses
    var ref = db.ref('/users/' + sess.uid + "/uaddress/");
     ref.on("child_added" , function(snapshot){
         saddress.push(snapshot.val().uaddress);
    });

    var flat = req.body.flat;
    var locality = req.body.locality;
    var landmark = req.body.landmark;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;
    
    // Adding new Address 
    if(flat && locality && landmark && pincode && city && state){
    var ref = db.ref('/users/' + sess.uid);
    var userref =ref.child("/uaddress");
    userref.push({
        uaddress: flat + "," + locality + "," + landmark + "," + city + "," + pincode + "," + state 
    });
    }

    setTimeout(function(){
        res.render("address.ejs" , {ocity:sess.city, obrand:sess.brand, omodel:sess.model, oscreen:sess.screen, ofaults:sess.faults, omprice:sess.marketprice, oaprice:sess.appprice, oavailabletime:time, odate:sess.date, otime:sess.time, saddress:saddress});
    },80);
});

app.post('/service/time/address/confirm' , function(req,res){
    sess.address = req.body.saddress;
    var ref = db.ref("/");
    var orderref = ref.child("orders");
    orderref.push({
        uid : sess.uid,
        ocity : sess.city,
        obrand : sess.brand,
        omodel : sess.model,
        oscreen : sess.screen, 
        ofaults : sess.faults, 
        omprice : sess.marketprice, 
        oaprice : sess.appprice,  
        odate : sess.date, 
        otime : sess.time, 
        oaddress : sess.address
    })


    res.render("confirm.ejs" , {ocity:sess.city, obrand:sess.brand, omodel:sess.model, oscreen:sess.screen, ofaults:sess.faults, omprice:sess.marketprice, oaprice:sess.appprice, odate:sess.date, otime:sess.time, oaddress:sess.address}); 
});

// listen app on port 5555
app.listen('5555' , function(req,res){
    console.log("running on port 5555");
})

