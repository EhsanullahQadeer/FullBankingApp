var express = require("express");
var app = express();
var cors = require("cors");
var dal = require("./dal.js");
const e = require("express");

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());

//all these functions are from the starter code pack - i did more debugging in the starter code if you want to see my comments

// create user account
app.get("/account/create/:name/:email/:password", function (req, res) {
  dal
    .create(req.params.name, req.params.email, req.params.password)
    .then((user) => {
      console.log(user);
      res.send(user);
    });
  // check if account exists
  //this is where i believe is where the breaking happens - if you check the starter code files, i comment
  //the dal.find out and leave it as dal.create and it actually inserts info into the database
  //if you go to the createaccount.js script you can also see where it tries to fetch this and it just doesnt happen
  /*dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }

        });*/
});

// login user
app.get("/account/login/:email/:password", function (req, res) {
  dal.findOne(req.params.email).then((user) => {
    // if user exists, check password
    if (user.length > 0) {
      if (user[0].password === req.params.password) {
        res.send(user[0]);
      } else {
        res.send("Login failed: wrong password");
      }
    } else {
      res.send("Login failed: user not found");
    }
  });
});

// find user account
app.get("/account/find/:email", function (req, res) {
  dal
    .findOne(req.params.email)
    .then((user) => {
      console.log(user);
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log("err at /account/find/:email ", err);
      res.status(500).json({ error: err });
    });
});

// find one user by email - alternative to find
app.get("/account/findOne/:email", function (req, res) {
  dal
    .findOne(req.params.email)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      console.log("/account/findOne/:email ", err);
    });
});

// update - deposit/withdraw amount
app.get("/account/update/:email/:amount", function (req, res) {
  var amount = Number(req.params.amount);

  dal
    .update(req.params.email, amount)
    .then((response) => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log("/account/update/:email/:amount ", err);
      res.status(500).json({ error: err });
    });
});

// all accounts
app.get("/account/all", function (req, res) {
  dal
    .all()
    .then((docs) => {
      console.log(docs);
      res.send(docs);
    })
    .catch((err) => {
      console.log("/account/all ", err);
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Running on port: " + port);
