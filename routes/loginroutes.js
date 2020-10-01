var mysql = require('mysql');
// var bcrypt = require('bcrypt');
var jsonfile = require('jsonfile');
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "balaji",
  database : "test",
 // port :   3306,
  insecureAuth: false
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn",err);
}
});

exports.register = function(req,res){
   console.log("register called");
  var today = new Date();
  // bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
   //save to db
   console.log(req.body)
   var users={
     "name":req.body.name,
  
    // "username":req.body.userid,
     "password":req.body.password,
     "role":"user",
    // "created":today,
    // "modified":today
    "email": req.body.email,
    "emp_id": req.body.emp_id
   }
   connection.query('INSERT INTO users1 SET ?',users, function (error, results, fields) {
   if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"
     })
   }else{
    //  console.log('The solution is: ', results);
     res.send({
       "code":200,
       "success":"user registered sucessfully"
         });
   }
   });
  // });


}

exports.login = function(req,res){
  console.log("INSide logim ", req.body)
  var email= req.body.userid;
  var password = req.body.password;
  var role = req.body.role;
  connection.query('SELECT * FROM users1 WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results[0].password,req.body.password,req.body.role);
    if(results.length >0){
      if(results[0].password == req.body.password){
          res.send({
            "code":200,
            "success":"login sucessfull",
             "res" : results
          })
        }
         
      else{
        res.send({
             "code":204,
             "success":"Email and password does not match"
        })
      }

    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
}
  });
}


exports.getExpense = function(req,res){
  console.log('Expense get calledd')

  console.log(req.query.userid)
  var userid= req.query.userid
  var role = req.query.role
  console.log("ROLE ", role)

  if(role == "admin"){  
    connection.query('SELECT * FROM expense a JOIN customer_name d ON a.cid = d.id '+
                      ' JOIN location c ON a.lid = c.id  JOIN project_name b ON a.pid = b.id '+
                        'JOIN project_code e ON a.project_code_id = e.id JOIN users1 f ON a.userid= f.id'
                        , function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      }else{
        if(results.length >0){
            res.send(results)
            }
        else{


          res.send({
            "code":204,
            "success":"Expense not found"
              });


        }
      }
      });

  }else if(role == "user"){
  connection.query('SELECT * FROM expense a JOIN customer_name d ON a.cid = d.id '+
                  ' JOIN location c ON a.lid = c.id  JOIN project_name b ON a.pid = b.id '+
                    'JOIN project_code e ON a.project_code_id = e.id JOIN users1 f ON a.userid= f.id WHERE userid = ?'
                    ,[userid], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    if(results.length >0){
        res.send(results)
        }
    else{
      res.send({
        "code":204,
        "success":"Expense not found"
          });
    }
  }
  });
}
}


exports.postExpense = function(req,res){
  // console.log("req",req.body);
  var today = new Date();
  var c_name 
  // bcrypt.hash(req.body.password, 5, function( err, bcryptedPassword) {
   //save to db
   console.log(req.body)

   var expense={
     "lid":req.body.location,
     "userid":req.body.userid,
     "cid":req.body.cust_name,
     "bike":req.body.bike,
     "car":req.body.car,
     "bus":req.body.bus,
     "flight":req.body.flight,
     "train":req.body.train,
     "food":req.body.food,
     "hotel":req.body.hotel,
     "pid":req.body.project_name,
     "project_code_id": req.body.project_code,
      "status" : req.body.status,
      "e_date": new Date(req.body.date),
      "total": req.body.total
    // "created":today,
    // "modified":today

   }
   connection.query('INSERT INTO expense SET ?',expense, function (error, results, fields) {
   if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"
     })
   }else{
    //  console.log('The solution is: ', results);
     res.send({
       "code":200,
       "success":"Expense success"
         });
   }
   });
  // });


}

exports.action = function(req,res){
  console.log('Action calledd')

  console.log(req.body.id)
  var expenseId= req.body.id
  var expenseStatus= req.body.status

  connection.query('UPDATE expense set status = ? where id = ?',[expenseStatus ,expenseId], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('RSS ', results)
    if(results.length >0){
        res.send(results)
        }
    else{
      res.send({
        "code":204,
        "success":"Expense not found"
          });
    }
  }
  });
}


exports.customerNames = function(req,res){
  console.log('customerNames calledd')

  connection.query('SELECT * from customer_name', function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('RSS ', results)
    if(results.length >0){
        res.send(results)
        }
    else{
      res.send({
        "code":204,
        "success":"Expense not found"
          });
    }
  }
  });
}

exports.customerNamesLocation= function(req,res){
  console.log('customer LOC calledd', req.query.cid)

  connection.query('SELECT * from location where cid= ?',[req.query.cid], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('RSS ', results)
    if(results.length >0){
        res.send(results)
        }
    else{
      res.send({
        "code":204,
        "success":"Expense not found"
          });
    }
  }
  });
}


exports.projectNames= function(req,res){
  console.log('Project Names  calledd', req.query.cid)

  connection.query('SELECT * from project_name where cid= ? and lid=?',[req.query.cid, req.query.lid], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('RSS ', results)
    if(results.length >0){
        res.send(results)
        }
    else{
      res.send({
        "code":204,
        "success":"Project not found"
          });
    }
  }
  });
}

exports.projectCodes= function(req,res){
  console.log('Project Codes  calledd', req.query.cid)
  console.log('Project Codes  calledd', req.query.lid)
  console.log('Project Codes  calledd', req.query.pid)

  connection.query('SELECT * from project_code where cid= ? and lid=? and pid=?',[req.query.cid, req.query.lid, req.query.pid], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('RSS ', results)
    if(results.length >0){
        res.send(results)
        }
    else{
      res.send({
        "code":204,
        "success":"Project not found"
          });
    }
  }
  });
}


exports.addCustomerName = function(req,res){
  
   console.log(req.body)
   var customer={
     "cname":req.body.cname,
   }
   connection.query('INSERT INTO customer_name SET ?',customer, function (error, results, fields) {
   if (error) {
     console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"
     })
   }else{
     res.send({
       "code":200,
       "success":"Customer add success"
         });
   }
   });
}

exports.addLocation = function(req,res){
  
  console.log(req.body)
  var customer={
    "cid":req.body.cid,
    "location": req.body.location
  }
  connection.query('INSERT INTO location SET ?',customer, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    res.send({
      "code":200,
      "success":"Location add success"
        });
  }
  });
}

exports.addProjectName = function(req,res){
  console.log("ADD project name")

  console.log(req.body)
  var customer={
    "cid":req.body.cid,
    "lid": req.body.lid,
    "project_name" : req.body.project_name
  }
  connection.query('INSERT INTO project_name SET ?',customer, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    res.send({
      "code":200,
      "success":"Project add success"
        });
  }
  });
}

exports.addProjectCode = function(req,res){
  console.log("ADD project Code")

  console.log(req.body)
  var customer={
    "cid":req.body.cid,
    "lid": req.body.lid,
    "pid": req.body.pid,
    "project_code" : req.body.project_code
  }
  connection.query('INSERT INTO project_code SET ?',customer, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    res.send({
      "code":200,
      "success":"Project code add success"
        });
  }
  });
}