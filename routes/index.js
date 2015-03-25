var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var express = require('express');
var router = express.Router();
var api=require('./script.js').api;

/* GET home page. */
 router.get('/', function(req, res, next) {
  console.log("this is welcome page");
 });

 router.post('/login/new', function(req, res, next) {
           api.user_info(req.body.team,function(err,result){
                   if(err){
                        res.status(404).send();
                  }else{ 
                       res.send(result);}  
           });
 }); 

 router.post('/login', function(req, res, next) {
   console.log(JSON.stringify(req.body));
      api.login(req.body,function(err,result){
    	  if(err){
          res.status(404).send();
    	  }else{ 
          res.send(result);}	
       });
   } );

 router.post('/login/profile', function(req, res, next) {
   console.log(JSON.stringify(req.body));
      api.login_withprofile(req.body,function(err,result){
        if(err){
          res.status(404).send();
        }else{ 
          res.send(result);}  
       });
   } );

router.get('/project/:Email',function(req, res, next) {
   //res.setHeader("Content-Type","application/json");
       api.projectget({"email" : req.params.Email},function(err,result){
            if(err){
                res.status(404).send(err.message);        
            }else{ 
                res.send(result);}  
       }); 
 });

router.get('/project/member/:Pname',function(req, res, next) {
   res.setHeader("Content-Type","application/json");
         api.projectget({"name" : req.params.Pname},function(err,result){
              if(err){
                res.status(404).send(err.message);        
              }else{ 
                res.send(result);}  
       });  
});

router.post('/register', function(req, res, next) {
          api.register(req.body,function(err,result){
   	           if(err){
   	  	            res.status(400).send(err);
   	           }else{ 
                  transporter.sendMail({
                             from: 'monu.saini@daffodilsw.com',
                             to: 'monusainioneworld@gmail.com',//result.email,
                             subject: 'hello',
                             text: 'hello , click here to verify your email http://192.168.100.121:4000/#/verify/' + result.email +'/' + result.verification_token
                            } , function(error, message) {
                                   if(message ) {
                                         console.log("message is :" ,message);
                                    } else if(error) {
                                         console.log("error is email :",error);
                                }
                     });
   	  	         res.send(result);
                 res.end();}	
          });
}); 

router.post('/register/new', function(req, res, next) {
         console.log(JSON.stringify(req.body));
         api.register_new(req.body,function(err,result){
               if(err){
                   res.status(400).send(err);
               }else{ 
                         transporter.sendMail({
                                        from: 'monu.saini@daffodilsw.com',
                                        to: 'monusainioneworld@gmail.com',//result.email,
                                        subject: 'hello',
                                        text:'Congrats , You have successfully registered \nyour password is '+req.body.pass
                                        +'\nhello , click here to verify your email http://192.168.100.121:4000/#/verify/' + req.body.email +'/' + req.body.verification_token 
                                       } , function(error, message) {
                                               if(message ) {
                                                         console.log("message is :" ,message);
                                                         res.status(200).send({"sucess":result});        
                                                 } else if(error) {
                                                         console.log("error is email :",error);}
                                });
                  } 
        });
 });     
  
router.post('/project', function(req, res, next) {
     console.log(JSON.stringify(req.body));    
      api.project(req.body,function(err,result){
  	             if(err){
  	  	            	res.status(404).send(err);
  	             }else{ 
  	                	res.send(result);} 	
        });  
 }); 

router.post('/project/task', function(req, res, next) {
     console.log(JSON.stringify(req.body));    
       api.add_task(req.body,function(err,result){
  	            if(err){
  	  	              res.body(err); 
  	  	              res.status(404);
  	            }else{ 
  	  	              res.send(result);}	
        });  
 }); 

router.get('/project/task/:task/:pname',function(req, res, next) {
      res.setHeader("Content-Type","application/json");
      api.read({"project_name" : req.params.task, "email":req.params.pname},function(err,result){
               if(err){
                    res.status(404);
               }else{ 
                    res.send(result);}  
          });
} );

router.put('/project/task/:Task/:Pname/:Email', function(req, res, next) {
    res.setHeader("Content-Type","application/json");
    api.change_task({"title" : req.params.Task,"project_name":req.params.Pname,"email":req.params.Email},req.body,function(err,result){
              if(err){  	  	
  	  	           res.status(404).send(err);
  	          }else if (result){ 
                        api.read({"title" : req.params.Task,"project_name":req.params.Pname},function(err,result){
                                  if(err){
                                      res.status(404);
                                   }else{
                                         if(result[0].status == 'Completed')
                                              {
                                                    transporter.sendMail({
                                                         from: 'monu.saini@daffodilsw.com',
                                                         to: 'monusainioneworld@gmail.com',//result.email,
                                                         subject: 'hello',
                                                         text:'Congrats , Your task '+result[0].title + ' is Completed',
                                                         } , function(error, message) {
                                                                    if(message ) {
                                                                           console.log("message is :" ,message);
                                                                     } else if(error) {
                                                                         console.log("error is email :",error);}
                                                    });
                                               }
                                          res.send(result);
                                    }  
                          });
  	  	      }	
         });  
 }); 

router.put('/project/:Pname/:Email', function(req, res, next) {
        res.setHeader("Content-Type","application/json");
         api.change_project({"name":req.params.Pname,"email":req.params.Email},req.body,function(err,result){
                        if(err){
                            res.status(404).send(err);
                        } else{
                                 api.projectget({"email" : req.params.Email},function(err,result1){
                                      if(err){
                                          // console.log(err);
                                          res.status(404).send(err.message);
                                      }else{
                                          console.log(result1); 
                                          res.send(result1);}  
                                   });
                         }
    
          });
});

router.put('/project/change', function(req, res, next) {
         res.setHeader("Content-Type","application/json");
         api.add_email_inProject({"name":req.body.projId},req.body.value1,function(err,result){
                   if(err){
                       res.status(404).send(err);
                   } else{
                         api.projectget({"name" :req.body.projId },function(err,result1){
                               if(err){
                                   res.status(404).send(err.message);
                               }else{
                                   console.log(result1); 
                                   res.send(result1);}  
                         }); 
                     }   
        });  
 }); 

router.delete('/project/task', function(req, res, next) {
       console.log(JSON.stringify(req.body));    
       api.delete_task(req.body,function(err,result){
  	           if(err){
  	  	           res.body(err); 
  	  	           res.status(404);
  	           }else{ 
  	  	          api.read();}	
         });  
 }); 

router.put('/register/:Email', function(req, res, next) {
    res.setHeader("Content-Type","application/json");
    api.change_user({"email":req.params.Email},req.body,function(err,result){
           if(err){
               res.status(404).send(err);
          }else if (result){ 
                      if(req.body.pass){
                             transporter.sendMail({
                                    from: 'monu.saini@daffodilsw.com',
                                    to: req.params.Email,
                                    subject: 'password updated',
                                    text: 'your new password is  ' + req.body.pass
                                  } , function(error, message) {
                                               if(message ) {
                                                     console.log("message is :" ,message);
                                                } else if(error) {
                                                     console.log("error is email :",error);
                                            }
                             });
                        }
                      api.getlogin({"email":req.params.Email},function(err,result){
                           if(err){
                                 res.status(404);
                           }else{ 
                                 res.send(result);
                                 console.log(result);}
                       });
            }
      });
});
router.put('/register/verify/:Email/:Token', function(req, res, next) {
    res.setHeader("Content-Type","application/json");
    api.change_user({"email":req.params.Email,"verification_token":req.params.Token},req.body,function(err,result){
                if(err){
                    res.status(404).send(err);
                 }else if (result){ 
                        api.getlogin({"email":req.params.Email},function(err,result){
                              if(err){
                                   res.status(404);
                              }else{ 
                                   res.send(result);
                                   console.log(result);}
                         });
                    }
       });
});
router.put('/task/comments/:Task/:Pname/:Email', function(req, res, next) {
    res.setHeader("Content-Type","application/json");
    api.add_comments({"title" : req.params.Task,"project_name":req.params.Pname,"email":req.params.Email},{"user_email":req.params.Email,"comments":req.body.value},function(err,result){
            if(err){        
                  res.status(404).send(err);
            }else if (result){ 
                  res.send(result);} 
     });  
});  
module.exports = router;
