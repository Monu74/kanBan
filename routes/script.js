var express = require('express');
var db=require('./db.js');
var api=require('./script.js').api;
module.exports.api={
 
  login: function(options,callback){ 
    try{
          if(!options.email)
               throw "email is required";
          else{
 	              db.user.find(options,{picture:0},function(err,res){
                    if(err){
                        console.log("this is error");
                        callback(err,null);
                    }else{  
                        console.log("this is result",res);
                        callback(null,res);
                      }  
                 })
              } 
      } catch(error)
          { 
              error.prototype=Error.prototype;
              callback(error,null);
          } 
  },
  getlogin: function(options,callback){ 
           db.user.find(options,{picture:0},function(err,res){               
                  if(err){
                       console.log(err);
                       callback(err,null);
                   }else{  
                        callback(null,res);}  
            })
  },
  login_withprofile: function(options,callback){ 
           db.user.find(options,function(err,res){               
                  if(err){
                        console.log(err);
                        callback(err,null);
                  }else{  
                      callback(null,res);}  
           })
  },
  user_info: function(options,callback){ 
           db.user.find(options/*{ email: { $nin: options } }*/,function(err,res){               
                  if(err){
                      console.log(err);
                      callback(err,null);
                  }else{  
                      callback(null,res);}  
           })
  },
  projectget: function(options,callback){ 
           db.project.find(options,function(err,res){               
                  if(err){
                      console.log(err);
                      callback(err,null);
                  }else{  
                      callback(null,res);}  
           })
  },

 register: function(options,callback){ 
      try{
          if(!options.name)
               throw "enter the name";
          else if(!options.email)
               throw "email is required";
          else if(!options.pass)
               throw "enter the password";
          else{
                db.user.create(options,function(err,res){
                   if(err){
                        console.log(err);
                        callback(err,null);
                   }else{  
                        callback(null,res);}
                 })
           }
        }catch(error)
          { 
              error.prototype=Error.prototype;
              callback(error,null);
         } 
  },
  register_new: function(options,callback){ 
                db.user.create({"email":options.email,"pass":options.pass,"verification_token":options.verification_token},function(err,res){
                       if(err){
                              console.log(err);
                              callback(err,null);
                       }else{  
                              db.project.update({"name":options.project_name},{ $push: { email : options.email } },function(err,res){
                                      if(err){
                                            console.log(err);
                                            callback(err,null);
                                      }else{ 
                                            callback(null,res);}    
                                  })             
                        }   
                  });
  },
  project: function(options,callback){     
                  db.project.create(options,function(err,res){               
                          if(err){
                                 console.log(err);
                                 callback(err,null);
                          }else{  
                                 callback(null,res);} 
                     })
         
  },
  change_project: function(options,change,callback){  
                  db.project.update(options,change,function(err,res){
                          if(err){
                                  console.log(err);
                                  callback(err,null);
                          }else{                 
                                db.task.update({"project_name":options.name,"email":options.email},{"project_name":change.name}, { multi: true },function(err, res1){
                                      if (err) {
                                            console.log(err);
                                            callback(err,null);
                                      } else {
                                          callback(null,res1);}
                                   });
                           }    
                   })                   
  },
  change_project_task: function(options,change,callback){    
                 db.task.update(options,change,function(err,res){
                           if(err){
                                 console.log(err);
                                 callback(err,null);
                           } else{  
                                 callback(null,res);}    
                  })                   
  },
  add_email_inProject: function(options,change,callback){ 
                 db.project.update(options,{ $push: { email : change } },function(err,res){
                            if(err){
                                  console.log(err);
                                  callback(err,null);
                            } else{  
                                  callback(null,res);}    
                  })                   
  },
  add_task: function(options,callback){ 
                 db.task.create(options,function(err,res){               
                            if(err){
                                   console.log(err);
                                   callback(err,null);
                             } else{  
                                   callback(null,res);}  
                  })
  },
  read: function(options,callback){ 
                 db.task.find({$query :options, $orderby:{ order:1}},function(err,res){               
                             if(err){
                                    console.log(err);
                                    callback(err,null);
                             }else{  
                                     callback(null,res);}  
                 })
  },  
  change_task: function(options,change,callback){ 
                 db.task.update(options,change,function(err,res){
                             if(err){
                                   console.log(err);
                                   callback(err,null);
                            } else{ 
                                   callback(null,res);}    
                })                   
  }, 
  change_user: function(options,change,callback){
                 db.user.update(options,change,function(err,res){
                              if(err){
                                   console.log(err);
                                   callback(err,null);
                             } else{  
                                   callback(null,res);}    
                 })                   
  },
  add_comments: function(options,change,callback){ 
                db.task.findOneAndUpdate(options,{$push :{ "comments":{
                                                                         "user_email" :change.user_email,
                                                                          "user_comments" :change.comments
                                                                      }
                                                         }
                                                  },function(err,res){
                                                          if(err){
                                                                console.log(err);
                                                                callback(err,null);
                                                          } else{  
                                                                console.log(res);
                                                                callback(null,res);}    
               })                   
  },
  delete_task: function(options,callback){
               db.task.remove(options,function(err,res){
                          if(err){
                                console.log(err);
                                callback(err,null);
                         } else{  
                                callback(null,res);}    
               })
  }    
}
