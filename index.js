const express = require("express");
const bd = require("body-parser");
const mysql = require("mysql");
const ejs = require("ejs");
const app = express();
app.use(bd.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
var con = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"Tanmay@19",
  database:"ecommerce"
});

con.connect(function(err,result){
  if(err){
  throw err;
}
  console.log("Connected Successfully "+result);
});
// var q = "insert into user(name,password,address) values('kunal','password','asadsdasdas')";
// con.query(q, function (err, result, fields) {
// if (err) throw err;
// console.log(result);
// });
app.get("/",function(req,res){
  res.render("home");
});

app.post("/logout",function(req,res){
  res.render("home");
});

app.post("/signup",function(req,res){
  var n ="'"+req.body.name+"'"; var p = "'"+req.body.password+"'"; var a = "'"+req.body.address+"'";
      var sql = "select * from user where name = "+n+" and password = "+p+";";
      console.log(sql);
      var c;
      con.query(sql, function (err, resul, fields) {
    if (err) throw err;
    if(resul.length==1){
      res.render("signup",{ch:1});
    }else{

      sql = "insert into user(name,password,address) values("+n+","+p+","+a+")";
      con.query(sql, function (err, result, fields) {
      if (err) throw err;
      //console.log(result);
      });

      sql = "select * from product";
      con.query(sql, function (err, result, fields) {
      if (err) throw err;


      sql = "select * from user where name = "+n+" and password = "+p+";";
      con.query(sql, function (err, result1, fields) {
      if (err) throw err;
      console.log(result1);
      var i = result1[0].id;
      var cart = "cart"+i.toString();

      sql = "CALL createcart(?)"; // Use '?' as a placeholder for the parameter
con.query(sql, [cart], function (err, result2, fields) { // Pass 'cart' as an array to the query function
    if (err) throw err;
    // Handle the result of the stored procedure call
});
      res.render("product",{u:result1,rp:result});

      });
    });
      console.log("iyggyyggyigiy");
      //console.log(u);
      // var i = u[0].id;
      // console.log("reached");


    }

  });
  //res.render("signup");
});
app.post("/login",function(req,rep){
  var sql = "select * from product";
  con.query(sql, function (err, result, fields) {
  if (err) throw err;


  var sql = "select * from user where name = '"+req.body.name+"' and password = '"+req.body.password+"';";
  console.log(sql);

  con.query(sql, function (err, result1, fields) {
  if (err) throw err;
  console.log(result1);
if(result1.length==1){
  rep.render("product",{u:result1,rp:result});}
  else{
    rep.render("home");
  }

  });

});
});


app.post("/cartview",function(req,res){
    var cn =  "cart"+req.body.uid;
    var q = "select * from "+cn+";";
    con.query(q, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    q = "select * from user where id = "+req.body.uid+";";
    con.query(q, function (err, result1, fields) {
    if (err) throw err;
    console.log(result1);

    res.render("cartview",{c:result,u:result1,ch:0});
    });

    });
});


app.post("/addminus",function(req,res){
  console.log("dbfbdfbdfbdfb"+req.body.uid);
  console.log(req.body.work);
  if(req.body.work=="1"){
    var q = "select * from product where pid = "+req.body.pid+";";
    con.query(q, function (err, result1, fields) {
    if (err) console.log("dfsdfsdfsdf");;
    console.log(result1);

    if(Number(result1[0].quantity)>0){
      var cn =  "cart"+req.body.uid;
      var cz1 = Number(req.body.count)+1;var cz = "'"+cz1+"'";
      console.log(cz1);
      var t1 = cz1*result1[0].prize;
      q = "update "+ cn +" set count = "+cz1+",prize = "+t1+" where pid = "+req.body.pid+";";
      console.log(q);
      con.query(q, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      });
      var w = result1[0].quantity-1;
      q = "update product set quantity = "+w+" where pid = "+req.body.pid+";";
      console.log(q);
      con.query(q, function (err, result33, fields) {
      if (err) throw err;
      console.log(result33);
      });
      q = "select * from "+cn+";";
      con.query(q, function (err, result3, fields) {
      if (err) throw err;
      console.log(result3);
      q = "select * from user where id = "+req.body.uid+";";
      con.query(q, function (err, result11, fields) {
      if (err) throw err;
      console.log(result11);
      var t = "delete from "+cn+" where count = 0";
      con.query(t, function (err, result111111, fields) {
      if (err) throw err;
      //console.log(result11);


      });
      res.render("cartview",{c:result3,u:result11,ch:0});
      });

      });
    }else{
      var cn = "cart"+req.body.uid;
      q = "select * from "+cn+";";
      con.query(q, function (err, result3, fields) {
      if (err) throw err;
      console.log(result3);
      q = "select * from user where id = "+req.body.uid+";";
      con.query(q, function (err, result11, fields) {
      if (err) throw err;
      console.log(result11);

      res.render("cartview",{c:result3,u:result11,ch:1});
      });

      });
    }
    });
  }else{
    var q = "select * from product where pid="+req.body.pid+";";
    con.query(q, function (err, result1, fields) {
    if (err) throw err;
    console.log(result1);

    if(Number(result1[0].quantity)>-10000){
      var cn =  "cart"+req.body.uid;
      var cz1 = Number(req.body.count)-1;var cz = "'"+cz1+"'";
      console.log(cz1);
      var t1 = cz1*result1[0].prize;
      q = "select * from "+cn+" where pid = "+req.body.pid+";";
      con.query(q, function (err, result9, fields) {
      if (err) throw err;
      console.log(result9);
      if(result9[0].count>0){
      q = "update "+ cn +" set count = "+cz1+",prize = "+t1+" where pid = "+req.body.pid+";";
      console.log(q);
      con.query(q, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      });
      var w = result1[0].quantity+1;
      q = "update product set quantity = "+w+" where pid = "+req.body.pid+";";
      console.log(q);
      con.query(q, function (err, result33, fields) {
      if (err) throw err;
      console.log(result33);
      });
      q = "select * from "+cn+";";
      con.query(q, function (err, result3, fields) {
      if (err) throw err;
      console.log(result3);
      q = "select * from user where id = "+req.body.uid+";";
      con.query(q, function (err, result11, fields) {
      if (err) throw err;
      console.log(result11);
      var t = "delete from "+cn+" where count = 0;";
      con.query(t, function (err, result111111, fields) {
      if (err) throw err;
      //console.log(result11);
res.render("cartview",{c:result3,u:result11,ch:0});

      });

      });

      });
    }
});


    }else{

    }
    });
  }
});
app.post("/s",function(req,rep){
  console.log(req.body.name);
});
app.post("/addcart",function(req,rep){

  var pid ="'"+req.body.pid+"'";
  var i = req.body.uid;
    var cn = "cart"+i;
    var sql;
    var name = "'"+req.body.name+"'";
    console.log("my name is "+req.body.uname);
    var count = "'"+1+"'";
    var prize = "'"+req.body.prize+"'";
    var d = "select * from product where pid="+req.body.pid+";";
    con.query(d,function(err,sd,field){
      if (err) throw err;
      if(sd[0].quantity>0){
        console.log(pid+"reached");
        var w =sd[0].quantity-1;
        var qe = "update product set quantity = "+w+" where pid="+req.body.pid+";";
        con.query(qe,function(err,qe,field){
          if (err) throw err;
          console.log(pid+"reached1");
        });

        var q = "select * from "+ cn +" where pid="+pid+";";
        con.query(q, function (err, r, fields) {
        if (err) throw err;
        if(r.length==0){
          sql = "insert into "+ cn +" values("+pid+","+name+","+count+","+prize+");";
         console.log(sql);
         con.query(sql, function (err, result2, fields) {
         if (err) throw err;

         });
       }else{
         var cz = Number(r[0].count)+1;
         var t = "'"+cz+"'";
         var cz1 = Number(r[0].prize)+Number(req.body.prize);
         var t1 = "'"+cz1+"'";
         sql = "update "+ cn +" set count = "+cz+",prize = "+t1+" where pid = "+pid+";";
         con.query(sql, function (err, result21, fields) {
         if (err) throw err;
         });
       }
        });
      }
    });


//   "UPDATE Customers
// SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
// WHERE CustomerID = 1;"

      sql = "select * from product";
      con.query(sql, function (err, result, fields) {
      if (err) throw err;


      sql = "select * from user where name = '"+req.body.uname+"' and password = '"+req.body.up+"';";
      console.log(sql);
      con.query(sql, function (err, result1, fields) {
      if (err) throw err;
      console.log(result1);

      rep.render("product",{u:result1,rp:result});

      });
    });

});

app.post("/new",function(req,rep){
   rep.render("signup",{ch:0});
});



app.post("/",function(req,res){

 console.log("dsfsdfsd");
 res.redirect(`/login?name=${d.i}`);
 });

app.post("/backp",function(req,rep){
  var sql = "select * from product";
  con.query(sql, function (err, result, fields) {
  if (err) throw err;


  sql = "select * from user where id = '"+req.body.uid+"';";
  console.log(sql);
  con.query(sql, function (err, result1, fields) {
  if (err) throw err;
  console.log(result1);

  rep.render("product",{u:result1,rp:result});

  });
});
});

app.post("/placeorder",function(req,rep){
  var cn = "cart"+req.body.uid;
  var q = "select * from "+cn+";";
  con.query(q,function(err,result,fields){
    var s;
    for(var i=0;i<result.length;i++){
      if(i==0){
       s =result[i].name_p+" "+result[i].count;
     }else{
      if(i==result.length-1){
        s =s+" "+result[i].name_p+" "+result[i].count+" ";
      }
      else{
        s =s+" "+result[i].name_p+" "+result[i].count;
      }
      

     }
    }
    q = "select SUM(prize) AS sum FROM " + cn+";";
    con.query(q,function(err,result1,fields){
      if (err) console.log("dsfsdfsdf");
      console.log(result1);
      //s ="dfsdfsd";
      q = "INSERT INTO `orderr` (uid, productlist, amount, payment_s) VALUES (?, ?, ?, ?)";

// Define an array of values for the parameters
const values = [req.body.uid, s, result1[0].sum, 'pending'];
      console.log(q);
      con.query(q,values,function(err,result11,fields){
        if (err) throw err;
        console.log(result11);
        var v = "view"+req.body.uid;
        const createViewQ = "CREATE VIEW "+v+" AS SELECT * FROM `orderr` WHERE uid ="+req.body.uid+";";

// Define the query to retrieve the maximum oid from the view
const getMaxOidQ = "SELECT MAX(oid) as maxe FROM "+v+";";

// Execute the first query to create the view
con.query(createViewQ, function(err, result111, fields) {
  if (err) throw err;
  console.log(result111);

  // Execute the second query to retrieve the maximum oid from the view
  con.query(getMaxOidQ, function(err, result1111, fields) {
    if (err) throw err;
    console.log(result1111);

    // Render the response with the maximum oid value
    q = "select * from user where id = "+req.body.uid+";";
    con.query(q,function(err,result2,fields){
      if (err) throw err;
      console.log(result2);
       q = "select * from orderr where oid = "+result1111[0].maxe+";";
       con.query(q,function(err,result12,fields){
         if (err) throw err;
         console.log(result12);
           rep.render("layout",{u:result2,o:result12});
           });
        });

  });
});
          });
    });

  });
});
app.post("/pay",function(req,rep){
  var q = "drop view view"+req.body.uid+";";
  con.query(q,function(err,result11,fields){
    if (err) throw err;
    console.log(result11);

      });
      q = "UPDATE `orderr` SET `payment_s` = 'done' WHERE `orderr`.`oid` ="+req.body.oid+";";
      con.query(q,function(err,result11,fields){
        if (err) throw err;
        console.log(result11);

          });
          var i = req.body.uid;
          var sql = "CALL 	truncate_cart_table(?)"; // Use '?' as a placeholder for the parameter
    con.query(sql, [i], function (err, result2, fields) { // Pass 'cart' as an array to the query function
        if (err) throw err;
        // Handle the result of the stored procedure call
    });
    q = "select * from user where id = "+i+";";
    con.query(q,function(err,result11,fields){
      if (err) throw err;
      console.log(result11);
           rep.render("congrats",{u:result11});
        });
});
app.post("/late",function(req,rep){
  var q = "drop view view"+req.body.uid+";";
  con.query(q,function(err,result11,fields){
    if (err) throw err;
    console.log(result11);

      });
      q = "DELETE FROM orderr WHERE oid = "+req.body.oid+" AND payment_s = 'pending';";
      con.query(q,function(err,result11,fields){
        if (err) throw err;
        console.log(result11);

          });
  var sql = "select * from product";
  con.query(sql, function (err, result, fields) {
  if (err) throw err;


  sql = "select * from user where id = '"+req.body.uid+"';";
  console.log(sql);
  con.query(sql, function (err, result1, fields) {
  if (err) throw err;
  console.log(result1);

  rep.render("product",{u:result1,rp:result});

  });
});
});
app.post("/goback",function(req,rep){
  var sql = "select * from product";
  con.query(sql, function (err, result, fields) {
  if (err) throw err;


  sql = "select * from user where id = '"+req.body.uid+"';";
  console.log(sql);
  con.query(sql, function (err, result1, fields) {
  if (err) throw err;
  console.log(result1);

  rep.render("product",{u:result1,rp:result});

  });
});
});
app.post("/display",function(req,rep){
  var sql = "select * from orderr where uid = "+ req.body.uid +";";
  con.query(sql, function (err, result11, fields) {
  if (err) throw err;
  console.log(result11);

  sql = "select * from product";
  con.query(sql, function (err, result, fields) {
  if (err) throw err;


  sql = "select * from user where id = '"+req.body.uid+"';";
  console.log(sql);
  con.query(sql, function (err, result1, fields) {
  if (err) throw err;
  console.log(result1);

  rep.render("display",{u:result1,rp:result,o:result11});

  });
});

  });
});
app.listen(8080,function(){
  console.log("started server");
});




// var sql = "select * from user where name = "+n+" and password = "+p+";";
// console.log(sql);
// con.query(sql, function (err, result, fields) {
// if (err) throw err;
// if(result.length==1){
// res.render("signup",{ch:1});
// }else{
//
// }
// });
// con.query(q,function(err,result11,fields){
//   if (err) throw err;
//   console.log(result11);
//
//     });
