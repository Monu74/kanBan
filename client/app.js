var routerApp = angular.module('routerApp', ['ui.router','ngCookies', 'ngDraggable','ngDialog' ]);
 
routerApp.config(function($stateProvider, $urlRouterProvider) {
    
     
    $urlRouterProvider.otherwise('/');
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: '/login/login.html',
            controller: 'loginCtrl' 
        })
        .state('/',{
            url:'/',
            templateUrl:'/login/login.html',
            controller: 'loginCtrl'
        })
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('register', {
             url: '/register',
            templateUrl: '/register/register.html',
            controller: 'regCtrl'      
        })
       .state('message', {
             url: '/message',
            templateUrl: '/register/message.html',
           controller: 'messageCtrl'
        })
       .state('dashboard', {
             url: '/dashboard',
            templateUrl: '/dashboard/dashboard.html',
            controller: 'dashCtrl'
        })
       .state('dashboard.new', {
             url: '/new',
            templateUrl: '/dashboard/footer.html'
        })
       .state('verify', {
             url: '/verify/:email/:verification_token',
            templateUrl: '/dashboard/verify.html',
            controller: 'verifyCtrl'
        })
         
});
//***********************Register page controller************************************************************

routerApp.controller('regCtrl', function($scope,$http,$location,$state){
   
  $scope.add_info = function(){
        if($scope.pass != $scope.pass1){
            alert("Confirm password is not same as password");
        }
        else{
                var token = Math.floor((Math.random()*100000)+1);
                $scope.form  =  {name:$scope.user, email :$scope.email, pass: $scope.pass,verification_token:token};
                $http.post('/register', $scope.form).
                    success(function(data) {
                       console.log("data is:",data);
                       $state.go('message');     
                    }).error(function(error){
                                alert(error);
                 })
             }
   }
});
//***********************Login page controller***************************************************************

routerApp.controller('loginCtrl', [ '$state','$scope','$http', '$location','$cookieStore' , function($state,$scope,$http, $location,$cookieStore) {
        $scope.y = $cookieStore.get('projectCookie'); 
  //-----------------------function to findout the user for log in process---------------------------------------       
        $scope.find = function(){  
                                   if($scope.email == undefined){
                                        alert("email can't be Empty");                                        
                                   } else{
                                       $scope.form  =  {email :$scope.email};
                                       console.log($scope.form);
                                       $http.post('/login', $scope.form).
                                            success(function(data) {
                                                    if(data.length!=0){
                                                          if(data[0].verification == false){
                                                               alert("you are not verified......"); 
                                                          }else if(data[0].pass != $scope.pass ){
                                                                    alert("email password does't match");
                                                                }else {
                                                                        $cookieStore.put('userCookie',data[0]);
                                                                        console.log("data is:",data);
                                                                        $scope.x= $cookieStore.get('userCookie');
                                                                        console.log("cookies is:", $scope.x);
                                                                        $state.go('dashboard');
                                                                  }
                                                    }else{
                                                            alert("you are not registered user please register");
                                                     }
                                              }).error(function(error){
                                                    alert("there is error");
                                                })
                                      }  
    }
//--------------------------Function called when user click on forgot password------------------------------------------    
     $scope.forgotpassword = function(){
                                           console.log("you are in function call");
                                           var password = Math.floor((Math.random()*6000)+1);
                                           $http.put('/register/'+$scope.email, {pass:password})
                                                   .success(function(data){
                                                            //console.log(data);
                                                            alert("your password is updated please check your email for new password");
                                              });  
                                        }
}]);
//***************************Controller of state showing message to user when sucessfully login******************

routerApp.controller('messageCtrl', function($scope,$state){
     $scope.next = function(){
                                $state.go('login');    
                           }
});
//**********************DashBoard Controller********************************************************************
routerApp.controller('dashCtrl',function($scope,$state,$http, $location,$cookieStore, ngDialog){
  //$state.go('dashboard');
   if($cookieStore.get('userCookie') == undefined){
    $state.go('login');
  }
  $scope.z = $cookieStore.get('userCookie');
  $scope.x = $cookieStore.get('userCookie');
  $scope.tasktitle = " ";
  $scope.index ="";
  $scope.deletetask = {};
  $scope.projects=[];
  $scope.tasks = []; 
  $scope.previous_name="";
  $scope.new_member = [];
  $scope.colorSeries = ['#3366cc', '#dc3912', '#ff9900','#00FA9A','#2E8B57','#8B4513','#8B0000']   
  $scope.options = {"show_task":false,"task_time_toadd":"","e_hide":"false","member_detail":false,"task_time":"","task_assign":"","task_comments":[],"comments":"","p":false,"changed_projectName":"","m":false,"task1":"","des":"","duedate":"","d":false,"e":false,"completion1":"" ,"duedate1":"", "des1":"","taskname":"","project_member":[],"show":false };
//-------function to show the division when new task is created-------------------------------   
     $scope.change = function(){
           $scope.options.m=true; 
     }
//-------function  to hide the division when new task is created------------------------------   
     $scope.change3 = function(){
        $scope.options.m=false;
     }
//------function to show the detail of the task------------------------------------------------     
   $scope.show = function(para){
       $scope.tasktitle = para.title;
       $scope.options.member_detail = false;
       $scope.options.d = true;
       $scope.options.task_name = para.title;
       $scope.options.taskname = para.title;
       $scope.options.des1 = para.des;
       $scope.options.status1 = para.status;
       $scope.options.duedate1 = para.due_date;
       $scope.options.task_assign = para.taskAssign;
       $scope.options.task_time = para.timeAssign;
       $scope.options.task_comments = para.comments;
       $http.get('/project/member/'+$scope.myvar,{})
                .success(function(data) {
                         //console.log("data in show function",data);
                         $scope.options.project_member = data[0].email;
                         //console.log($scope.options.project_member);
                    });                                
   }
//------function   
    $scope.changetask = function(){
        $scope.options.e = false;
        $scope.options.e_hide = true;
     };
//------function     
     $scope.update = function(){
              $scope.data4 = {title :$scope.options.taskname ,des : $scope.options.des1, due_date : $scope.options.duedate1,completion_date: $scope.options.completion1, timeAssign:$scope.options.task_time,  taskAssign:$scope.options.task_assign };
               //console.log($scope.options.task_assign);
              //$scope.options.d = !$scope.options.d;
              $http.put('/project/task/'+ $scope.tasktitle + '/' + $scope.myvar + '/' + $scope.z.email,$scope.data4)
                    .success(function(data) {
                         console.log("successful put " ,data);      
                    }).error(function(data) {
                          console.log("error in update is :",data);
                       });
              $http.get('/project/task/'+$scope.myvar+'/'+$scope.z.email,{})
                   .success(function(data) {
                           console.log("data in get call:",data);
                           $scope.tasks = data;
                           alert("Task is updated"); 
                    });
    };
//----------function to add new task to database--------------------------------------------------------------  
    $scope.addtask = function(){
                   //$scope.order1=($scope.tasks.length+1)*10000;
                   $scope.data3  =  {title :$scope.options.task1, project_name:$scope.myvar,des : $scope.options.des, due_date : $scope.options.duedate,order :$scope.order1, email :$scope.z.email,taskOwner:$scope.z.email,timeAssign:$scope.options.task_time_toadd};
                   $http.post('/project/task', $scope.data3)
                        .success(function(data) {
                               if(data.length!=0){
                                     $scope.order1 = $scope.order1+10000;
                                     $scope.tasks.push(data);
                                     $scope.options.task1  =" ";
                                     $scope.options.des  =" ";
                                     $scope.options.task_time_toadd = " ";
                               }
                       });
  }
//------function to handle drag started---------------------------------------------------------------       
    $scope.handleDragStart = function(data,event,ind){
                 $scope.deletetask=data;
                 $scope.index=ind;
    };
//-------function to handle Drop---------------------------------------------------------------------
  $scope.handleDrop = function(data,event, task,ind){
                  //console.log("status of drag is:"+$scope.deletetask.status);
                  //console.log("status of drop is:"+task.status);
                  if($scope.deletetask.status == task.status){
                              var changedata =(task.order+ind+100);
                              $scope.data6={order:(task.order-5)};
                              $scope.data5 ={order:changedata};
                              $scope.tasks.splice($scope.index,1);
                              $scope.tasks.splice(ind,0,$scope.deletetask);
                              $http.put('/project/task/'+$scope.deletetask.title+'/'+$scope.deletetask.project_name+'/'+$scope.deletetask.email,$scope.data6)
                                      .success(function(data) {
                                              console.log("data in put"+data);                        
                                       });
                              $http.put('/project/task/'+task.title+'/'+task.project_name+'/'+task.email,$scope.data5)
                                      .success(function(data) {
                                              console.log("data in put call"+data);                        
                                       });            
                              $http.get('/project/task/'+$scope.deletetask.project_name+'/'+$scope.deletetask.email,{})
                                       .success(function(data) {
                                              console.log("data in get call:",data);
                                              $scope.tasks = data;
                                       });  
                  }       
   
 };
 //-------function to handle Drop in progress division------------------------------------------------------
   $scope.handleProgressDrop = function(data,event){
                    if($scope.deletetask.timeAssign == undefined){
                             alert("you have to assign time to task");
                     }else{
                             $scope.changestatus={status:"In Progress"};
                             $http.put('/project/task/'+$scope.deletetask.title+'/'+$scope.deletetask.project_name+'/'+$scope.deletetask.email, $scope.changestatus)
                                       .success(function(data) {
                                             console.log("data in put"+data);                     
                                         });
                             $http.get('/project/task/'+$scope.deletetask.project_name+'/'+$scope.deletetask.email,{})
                                        .success(function(data) {
                                             console.log("data in get call:",data);
                                             $scope.tasks = data;
                                         });  
                        }
 }
 //---------function to handle Drop in completed division-----------------------------------------------------
 $scope.handlecompleteDrop = function(data,event){
                     if($scope.deletetask.timeAssign == undefined){
                             alert("you have to assign time to task");
                     }else{
                             $scope.changestatus1={status:"Completed"};
                             $http.put('/project/task/'+$scope.deletetask.title+'/'+$scope.deletetask.project_name+'/'+$scope.deletetask.email, $scope.changestatus1)
                                     .success(function(data) {
                                          console.log("data in put"+data);                        
                                     });
 
                             $http.get('/project/task/'+$scope.deletetask.project_name+'/'+$scope.deletetask.email,{})
                                     .success(function(data) {
                                           console.log("data in get call:",data);
                                           $scope.tasks = data;
                                    });
   
                      }                  
 }
 //----------Function to show the projects of a user----------------------------------   
  $scope.change1 = function(){
             //$scope.n=!$scope.n; 
             $scope.data4  = $scope.x.email;
             console.log($scope.x.email);
             $http.get('/project/'+$scope.data4,{})
                 .success(function(data) {
                      console.log("data is:",data);
                      $scope.projects = data;
                   });
 }
//-----------Function to show the division to add new project-------------------------      
  $scope.change2 = function(){
            console.log("inside change2");
            $scope.l=!$scope.l; 
            $scope.options.show = false;
           //$scope.na = false;
  }
//----------Function  to hide the division to add new project-------------------------
 $scope.close_New_project = function(){
            $scope.l=false;
 }
//---------Function to add new project------------------------------------------------ 
 $scope.add_project = function(){
            $scope.options.show_task = true;
            $scope.data2  =  {name :$scope.ngmodelproject_name , email:[$scope.x.email]};
            //$scope.options.project_member.push($scope.x.email);
            $http.post('/project', $scope.data2)
               .success(function(data) {
                     if(data.length!=0){
                            $cookieStore.put('projectCookie',data);
                            $scope.y= $cookieStore.get('projectCookie');
                            $scope.myvar = $scope.y.name;
                            $scope.l=!$scope.l;
                            $state.go('dashboard.new');
                            $http.get('/project/task/'+$scope.ngmodelproject_name+'/'+$scope.x.email,{})
                                   .success(function(data) {
                                         console.log("data in get call:",data);
                                         $scope.tasks = data;
                                    });   
                     }  
                }).error(function(data){
                       alert("duplicate project name");
                   });
}  
//---------Function to show the task of a project when rhe user click on a project---------------------------   
 $scope.readtask = function(para){
            $http.get('/project/task/'+para.name+'/'+para.email[0],{})
                    .success(function(data) {
                           $scope.options.show_task = true; 
                           $scope.tasks = data;
                           //console.log("data in task array",$scope.tasks);
                           $scope.order1= ($scope.tasks.length+1)*10000;
                           $scope.n=!$scope.n;
                           $scope.myvar = angular.copy(para.name);
                           if (!$scope.$$phase) {
                              $scope.$apply();
                           }
                           $state.go('dashboard.new');
                    });
}
//---------Function to show the division to update project name when the user click on project name-----------------------------------
 $scope.changeProjectName = function(){
              $scope.options.p = !$scope.options.p;
              //$scope.previous_name = $scope.myvar;
             //console.log($scope.previous_name);
 }
//--------Function to hide the division  to update project name--------------------------------------------
 $scope.close_project_name = function(){
              $scope.options.p = false;
 }    
//--------Function  to change the project name in database---------------------------------------------- 
 $scope.updateProjectName = function(project){
              $scope.options.p = !$scope.options.p;
              //console.log("project name:",$scope.previous_name);
              $http.put('/project/' +$scope.myvar+'/'+$scope.z.email, {name:project})
                    .success(function(data) {
                        console.log("data in put",data);
                        $scope.myvar = $scope.options.changed_projectName;
                        $scope.changedName = "";
                        $scope.projects = data;
                    }).error(function(error){
                          console.log("errorrrrrr",error);
                        });
}
/*--------Function
 $scope.show_info = function(){
             //$scope.na = !$scope.na;
             $scope.l= false;
             $scope.options.show = false;
 }*/
//--------Function called when user logout---------------------- 
 $scope.logout = function(){
             $cookieStore.remove('userCookie');
             $cookieStore.remove('projectCookie');
             $state.go('login');
 }
//-------Function to show the user profile---------------------- 
$scope.show_Profile = function(){
               ngDialog.open({
                                template: '<img src="images/download.png" id="pic" height="100" width="100"/ style="margin-bottom:10px">\
                                           <input type="file" accept="image/gif,image/jpg,image/png" id="profile_pic" onchange="angular.element(this).scope().imageChanged()" style="margin-bottom:10px">\
                                           <table>\
                                              <tr><td>First Name:</td><td><input class="form-control" type="text" ng-model="user_name" id="inputbox"></td></tr>\
                                              <tr><td>Last Name:</td><td><input class="form-control"  type="text" ng-model="user_last_name" id="inputbox"></td></tr>\
                                              <tr><td>Designation:</td><td><input  class="form-control" type="text" ng-model="user_designation" id="inputbox"></td></tr>\
                                              <tr><td>E-mail:</td><td><input type="text" class="form-control" ng-model="user_Email" id="inputbox"></td></tr>\
                                              <tr><td>Skype_id:</td><td><input type="text" class="form-control" ng-model="user_Skype_id" id="inputbox"></td></tr>\
                                              <tr><td>Phone No:</td><td><input type="text" class="form-control" ng-model="user_phone_no" id="inputbox"></td></tr>\
                                           </table>\
                                           <button   style=" margin-left:20px" ng-click="update_user_profile()">Save</button>\
                                           <button  style=" margin-left:110px" ng-click="hide_profile()">Ok</button>\
                                           ',
                               plain: true,
                               scope: $scope,
                               controller: ['$scope', function($scope) {
                                                //$scope.$parent.na = !$scope.$parent.na;
                                                 var user_email={email:$scope.$parent.z.email}
                                                 $http.post('/login/profile', user_email).
                                                 success(function(data) {
                                                           console.log(data);
                                                           $scope.user_name = data[0].name;
                                                           $scope.user_last_name = data[0].last_name;
                                                           $scope.user_designation = data[0].designation;
                                                           $scope.user_phone_no = data[0].mobile_number;
                                                           $scope.user_Skype_id = data[0].skype_id;
                                                           $scope.user_Email = data[0].email;
                                                           if(data[0].picture != null){
                                                                document.getElementById("pic").src = data[0].picture;
                                                            }
                                                     });
                                                  $scope.update_user_profile = function(){
                                                               var user = {name: $scope.user_name, last_name :$scope.user_last_name, designation: $scope.user_designation, mobile_number:$scope.user_phone_no, skype_id : $scope.user_Skype_id, email:$scope.user_Email,picture:document.getElementById("pic").src };
                                                               $http.put('/register/'+$scope.z.email, user)
                                                                     .success(function(data) {
                                                                            console.log(data);
                                                                            $cookieStore.put('userCookie',data[0]);
                                                                            $scope.$parent.x= $cookieStore.get('userCookie');
                                                                          }); 
                                                    }
                                                    $scope.hide_profile = function(){
                                                             $scope.closeThisDialog();
                                                      }
                                                    $scope.imageChanged = function () {
                                                                var filesSelected = document.getElementById("profile_pic").files;
                                                                if (filesSelected.length > 0) {
                                                                      var fileToLoad = filesSelected[0];
                                                                      var fileReader = new FileReader();
                                                                      fileReader.onload = function (fileLoadedEvent) {
                                                                            var srcData = fileLoadedEvent.target.result; 
                                                                            document.getElementById("pic").src = srcData;
                                                                      }
                                                                      fileReader.readAsDataURL(fileToLoad);
                                                                }
                                                     }  
                                          }]  

               });
}
//------Function to show the member profile--------------------------------------------------------------------
 $scope.show_Member_Profile = function(parameter){
               ngDialog.open({
                                template: '<img id="member_profile" height="100" width="100" src="images/download.png"/>\
                                           <table>\
                                              <tr><td>First Name:</td><td><span>{{user_name}}</span></td></tr>\
                                              <tr><td>Last Name:</td><td><span ng-bind="user_last_name"></span></td></tr>\
                                              <tr><td>Designation:</td><td><span ng-bind="user_designation"></span></td></tr>\
                                              <tr><td>E-mail:</td><td><span ng-bind="user_Email"></span></td></tr>\
                                              <tr><td>Skype_id:</td><td><span ng-bind="user_Skype_id"></span></td></tr>\
                                              <tr><td>Phone No:</td><td><span ng-bind="user_phone_no"></span></td></tr>\
                                           </table>\
                                           ',
                               plain: true,
                               scope: $scope,
                               controller: ['$scope', function($scope) {
                                                 console.log(parameter);
                                                 var user_email={email:parameter}
                                                 $http.post('/login/profile', user_email).
                                                          success(function(data) {
                                                                console.log(data);
                                                                // $scope.$parent.options.show = !$scope.$parent.options.show;
                                                                $scope.user_name = data[0].name;
                                                                $scope.user_last_name = data[0].last_name;
                                                                $scope.user_designation = data[0].designation;
                                                                $scope.user_phone_no = data[0].mobile_number;
                                                                $scope.user_Skype_id = data[0].skype_id;
                                                                $scope.user_Email = data[0].email;
                                                                if(data[0].picture != null){
                                                                     document.getElementById("member_profile").src = data[0].picture;
                                                                }
                                                           });                                            
                                          }]
             });
}
//-------Function  to show the dialog box to change the password----------------------------------------
 $scope.change_Password = function(){
           ngDialog.open({
                           template: ' <table>\
                                            <tr><td>Old password:</td><td style="padding:3px"><input type="password" class="form-control" ng-model="old_password" style="magin-bottom:10px"></td></tr>\
                                            <tr><td >New password:</td><td style="padding:3px"><input type="password" class="form-control" ng-model="new_password"></td></tr>\
                                            <tr><td>Confirm password:</td><td style="padding:3px"><input type="password" class="form-control" ng-model="confirm_password"></td></tr>\
                                       </table>\
                                       <button style="margin-left:80px" ng-click="update_password()">Update</button>',
                               plain: true,
                               scope: $scope,
                               controller: ['$scope', function($scope) {
                                                 $scope.update_password = function(){
                                                             $http.post('/login', {email:$scope.z.email}).
                                                                  success(function(data){
                                                                       console.log(data);                                                                  
                                                                       if(data[0].pass != $scope.old_password )
                                                                             alert("password does't match with old password");
                                                                       else if($scope.new_password != $scope.confirm_password)
                                                                             alert("Confirm password is not same as new password");
                                                                       else{
                                                                             var data_password = {pass:$scope.new_password};
                                                                             $http.put('/register/'+$scope.z.email, data_password)
                                                                                    .success(function(data) {
                                                                                         console.log("data in window is ",data);
                                                                                         $scope.$parent.na = !$scope.$parent.na;
                                                                                         $scope.closeThisDialog();
                                                                                      }); 
                                                                            }
                                                              });                                       
                                                 }
                                          }]
            });
}
//---------Function to show the Team Directory-----------
 $scope.show_Not_team_member =function(){
                   $scope.options.member_detail = !$scope.options.member_detail;
                   $scope.options.d = false;
                   // console.log("xjsbjxs");
                   console.log($scope.myvar);
                   $http.get('/project/member/'+$scope.myvar,{})
                           .success(function(data) {
                                   console.log("data in show function",data);
                                   $scope.options.project_member = data[0].email;
                                   console.log($scope.options.project_member);
                                   $http.post('/login/new',{team:$scope.options.project_member}).
                                           success(function(data) {
                                                  $scope.options.show = false;
                                                  $scope.na = false;
                                                  $scope.l = false;
                                                  $scope.options.d = false; 
                                                  $scope.new_member = data;
                                                  console.log($scope.new_member);
                                             });
                            }).error(function(data){
                                   console.log("error",data);
                                })
                            console.log("data we send", $scope.options.project_member);     
  }
//----------Function to show the list of members of the project----------------- 
 $scope.show_member = function(){
                  //$scope.options.show = !$scope.options.show;
                  $scope.l=false;
                  $scope.na = false;
                  console.log($scope.myvar);
                  $http.get('/project/member/'+$scope.myvar,{})
                        .success(function(data) {
                             console.log("data in show function",data);
                             $scope.options.project_member = data[0].email;
                             console.log($scope.options.project_member);
                        });
}
//----------Function to add new member to project-------------------------------------------
 $scope.add_member_toProject = function(parameter){
                  $http.put('/project/change',{value1:parameter.email , projId:$scope.myvar})
                          .success(function(data) {
                                 console.log("data in add function function",data);
                                 console.log("ndknckdnckd",$scope.new_member);                        
                                 $http.get('/project/member/'+$scope.myvar,{})
                                      .success(function(data) {
                                          console.log("data in show function",data);
                                          $scope.options.project_member = data[0].email;
                                        });   
                           });
}
//----------Function to invite the new user to add in the project-----------------------------------
 $scope.add_New_Member = function(){
         ngDialog.open({
                           template: 'Email:<input type="text" ng-model="new_user"/>\
                             <button ng-click="register_message()"> invite</button>',
                               plain: true,
                               scope: $scope,
                               controller: ['$scope', function($scope) {
                                       $scope.register_message=function(){      
                                                  var password = Math.floor((Math.random()*6000)+1);
                                                  var token = Math.floor((Math.random()*100000)+1);
                                                  $scope.form  =  {email :$scope.new_user, pass: password , project_name:$scope.myvar,verification_token:token};
                                                  console.log($scope.form);
                                                  $http.post('/register/new', $scope.form)
                                                         .success(function(data) {
                                                                   console.log("data is:",data);
                                                                   $scope.closeThisDialog();
                                                            }).error(function(err){
                                                                  alert(err);
                                                     }); 
                                               }          
                                          }]
                        });
}
//-------------Function to add comments to a task--------------------------------------------------------------
 $scope.add_comments = function(){
                  $http.put('/task/comments/'+$scope.options.taskname + '/' + $scope.myvar + '/' + $scope.z.email,{value : $scope.options.comments})
                              .success(function(data) {
                                       console.log("successful put " ,data); 
                                       $scope.options.task_comments = data.comments ;
                                       console.log($scope.options.task_comments);
                                       $scope.options.comments = " ";     
                        });
}
//-----------Function to hide the division which show the team directory-------------------------------
 $scope.close_detail = function(){
                   $scope.options.member_detail = false;
 }
//------------Function to hide the division which show the task detail------------------------------
 $scope.close_task = function(){
                   $scope.options.d = false;
                   $scope.options.e_hide = false;
                   $scope.options.e = true;
    }
//-----------Function to generate the different color---------------------------------------------
 $scope.setBGColor = function (id) {
                    var color1 = Math.floor((Math.random()*7)+1);                 
                    console.log("generated color is:",color1);
                    document.getElementById("link"+id).style.color=$scope.colorSeries[color1];
                    //return {color:$scope.colorSeries[color1]}
                    
 }

})
.directive('profile', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'directive/profile.html'
  }
})
.directive('leftright', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'directive/leftright.html'
  }
})
.directive('dashboardheader', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'directive/dashboardheader.html'
  }
})
.directive('memberdetail', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'directive/member_detail.html'
  }
})
.directive('taskprogress', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'directive/taskProgress.html'
  }
})
.directive('taskdetail', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'directive/task_detail.html'
  }
});
//**************************Verify Controller************************************************************************
routerApp.controller('verifyCtrl', function($scope,$http,$state,$stateParams){
      console.log($stateParams.email);
      $http.put('/register/verify/'+$stateParams.email + '/' +$stateParams.verification_token, {verification:true})
                    .success(function(data) {
                                console.log(data);                        
                       });
});