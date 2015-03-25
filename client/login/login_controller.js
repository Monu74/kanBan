routerApp.controller('loginCtrl', [ '$state','$scope','$http', '$location','$cookieStore','DataService', function($state,$scope,$http, $location,$cookieStore,DataService) {
//-----------------------function to findout the user for log in process---------------------------------------       
        $scope.find = function(){  
                                   if($scope.email == undefined){
                                        alert("email can't be Empty");                                        
                                   } else{
                                           $scope.form  =  {email :$scope.email};
                                           console.log($scope.form);
                                           DataService.postWebService($scope, '/login', form, function(err, data){
    		                                if(err){
    			                                alert(err.message);
    		                                } else {
    			                                  /*if(data && data.length > 0){
		 		                                     	if(data[0].verify == false){
		 				                                alert("You are not verified");
		 	                                   		} else {
		 				                                    window.localStorage.setItem("email", data[0].email);
                                                            window.localStorage.setItem("name", data[0].name);
                                                            window.localStorage.setItem("pass", data[0].password);
                                                            $scope.username = window.localStorage.getItem("name");
                                                            $state.go('dashboard');
                                                            console.log("successfully logged in"+data[0].name+'/'+$scope.username);
		     		                                }*/
    			                            }
    		                            }
    	                               } );
                                       
    }

}]);    
