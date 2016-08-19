angular.module('bnotifiedappctrls', [])
.controller('AppCtrl', ['$rootScope', '$scope','$state','$ionicPopup','$ionicLoading','$cordovaToast','AUTH_EVENTS','$ionicHistory','registrationdetsdb','$ionicPopover','$cordovaCamera','$ionicModal','$cordovaFile','imagesservicedb', function($rootScope, $scope, $state, $ionicPopup, $ionicLoading, $cordovaToast, AUTH_EVENTS,$ionicHistory, registrationdetsdb, $ionicPopover, $cordovaCamera, $ionicModal, $cordovaFile, imagesservicedb) {
    //handle events and broadcasts such as error scenario to redirect user
   console.log('within AppCtrl current state -->'+JSON.stringify($state.current));
   $scope.$on('NoInternet' , function(event){
         var alertPopup = $ionicPopup.alert({
             title: 'No Internet Connection',
             template: 'Please check your internet connectivity'
           });
           alertPopup.then(function(res) {
             console.log('Thank you for not eating my delicious ice cream cone');
           });
   });
  $rootScope.showLoader = function(options) {
    $ionicLoading.show({
      template: '<ion-spinner icon="android"></ion-spinner>&nbsp&nbspLoading...',
      hideOnStateChange : true,
      noBackdrop : true,
      duration : 60000
    });
  };
  $rootScope.hideLoader = function(options){
    $ionicLoading.hide();
  };
  $rootScope.showPopup = function(alertconfig, onokfunction){
        var alertPopup = $ionicPopup.alert(/*{
             title: 'Invalid Login Details',
             template: 'Please check your mobilenumber and passcode combination'
        }*/ alertconfig);
        alertPopup.then(/*function(res) {
             console.log('Thank you for not eating my delicious ice cream cone');
        }*/onokfunction);
  };

  $rootScope.showToast = function(message, duration, position){
      if(window.cordova){
          $cordovaToast.show(message, duration, position).then(function(success){
            //success
          }, function(error){
            //error
          });
      }
  };
  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(response){
      $state.go('login',{}, {reload: true});
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $ionicHistory.clearCache()
      $rootScope.showPopup({title:'Invalid Login', template:'Session lost, please login again'}, function(res){

      });
  });

  $rootScope.$on(AUTH_EVENTS.jsonwebtokenExpired, function(response){
      registrationdetsdb.updateJWTWithoutMobileNo({jsonwebtoken:null}).then(function(result){
        $state.go('login',{}, {reload: true});
         $ionicHistory.nextViewOptions({
            disableBack: true
         });
        $ionicHistory.clearCache()
        $rootScope.showPopup({title:'Invalid Login', template:'Session lost, please login again'}, function(res){

        });
      }).catch(function(error){
        $rootScope.showPopup({title:'System Error', template:'Oops !! There is some problem logging in right now'}, function(res){
            console.log('on ok click');
        });
      });
  });


  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(response){
      $state.go('login',{}, {reload: true});
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $ionicHistory.clearCache()
      $rootScope.showPopup({title:'Invalid Login', template:'Session lost, please login again'}, function(res){

      });
  });
/*
  $scope.goToAddSubscriptions = function($event){
      console.log('invoked from goToAddSubscriptions');
    $state.go('addsubscriptions');
  };*/
  $scope.backButtonAction = function(){
        $ionicHistory.goBack();
  };

  $rootScope.messagesdata = {
     badgeCount: ''
  }

  $scope.popover = $ionicPopover.fromTemplate('<ion-popover-view style=" top: 45px; left: 190px;  margin-left: 10px;    opacity: 1;    height: 35%;    width:40%;"><ion-content><div class="list" ><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/patientprfl" >User Profile</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/patientimages" >Uploaded Images</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" ng-click="showPopup()">Rate the app</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/logout">logout</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/logout">About</a></div></ion-content></ion-popover-view>',{
    scope: $scope
  });
  $scope.openPopover = function($event) {
    console.log('printing openPopover within AppCtrl');
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    console.log('printing closePopover within AppCtrl');
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    console.log('printing $destroy within AppCtrl');
    //$scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

  //feedback questions
 $scope.questions=[{question: "Please rate the App?",answer: ''}];

 //ratings for feedback
 $scope.ratingsObject = {
       iconOn : 'ion-ios-star',
       iconOff : 'ion-ios-star-outline',
       iconOnColor: 'rgb(200, 200, 100)',
       iconOffColor:  'rgb(200, 100, 100)',
   rating: '',
       minRating: 0 ,
       callback: function(rating) {
         $scope.ratingsCallback(rating);
     return rating;
       }
     };

 // ratings callback function , obtains the current slide and updates the object answer
    $scope.ratingsCallback = function(rating) {
       console.log('Selected rating is : ', rating);
    $scope.closepopup()
   };

 //popup to show feedback
 $scope.showPopup = function() {

  // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
    template: '<ion-item class="item-input" ><label class="item-input"><h4>{{rating}}</h4><br><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ><br/></i></label></ion-item>',
    title: 'Feedback',
    scope: $scope
  })
   //popup close
  $scope.closepopup = function(){
     console.log("closing popup");
     myPopup.close();
  }
};

  $scope.urlForImage = function(imageName) {
    var trueOrigin = cordova.file.dataDirectory + imageName;
    return trueOrigin;
  }
  $scope.takeImage = function(){
    $scope.data = {
      "filename" : "",
      "tag" : "",
      "description" : ""
    };
    var options = {
         quality: 100,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: Camera.PictureSourceType.CAMERA,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         //targetWidth: 250,
         //targetHeight: 250,
         popoverOptions: CameraPopoverOptions,
         mediaType: Camera.MediaType.PICTURE,
         saveToPhotoAlbum: false
     };
    $cordovaCamera.getPicture(options).then(function(imageData) {
  		// 4
  		onImageSuccess(imageData);

  		function onImageSuccess(fileURI) {
  			createFileEntry(fileURI);
  		}

  		function createFileEntry(fileURI) {
  			window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
  		}

  		// 5
  		function copyFile(fileEntry) {
  			var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
  			var newName = makeid() + name;

  			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
  				fileEntry.copyTo(
  					fileSystem2,
  					newName,
  					onCopySuccess,
  					fail
  				);
  			},
  			fail);
  		}

  		// 6
  		function onCopySuccess(entry) {
  			$scope.$apply(function () {
          $scope.srcImage = entry.nativeURL;
          $scope.data.filename = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);
  			});
        $scope.openDocModal();
  		}

  		function fail(error) {
  			$rootScope.showToast("Error displaying the captured photo, please try again","long","top");
  		}

  		function makeid() {
  			var text = "";
  			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  			for (var i=0; i < 5; i++) {
  				text += possible.charAt(Math.floor(Math.random() * possible.length));
  			}
  			return text;
  		}

  	}, function(err) {
  		console.log(err);
  	});
  };
  $scope.saveCapturedImage = function(){
      imagesservicedb.add({
        "imgname":$scope.data.filename,
        "imgtag" :$scope.data.tag,
        "imgdesc":$scope.data.description,
        "imgnativeurl" :$scope.srcImage,
        "capturedate" : Date.now()
      }).then(function(data){
        $scope.closeDocModal();
        $rootScope.showToast('Image captured successfully','long','top');
      }).catch(function(error){
        $rootScope.showPopup({'tutle':'Error','template':'Error encountered while capturing image to Database ['+ error.code + ' '+ error.message + ']'});
        $rootScope.showToast("Image couldn't be captured, please try again",'long','top');
      });
  };

  $ionicModal.fromTemplateUrl('documentpic.html', {
  	scope: $scope,
  	animation: 'slide-in-up'
  }).then(function(modal) {
    	$scope.documentmodal = modal;
  });
	$scope.openDocModal = function() {
    	$scope.documentmodal.show();
  }
	$scope.closeDocModal = function() {
    	$scope.documentmodal.hide();
	}
}])
.controller('MobileNumberCtrl', ['$scope','$rootScope','internetservice', 'registrationservice','authservice','$state','$ionicPopup','$stateParams', function($scope, $rootScope, internetservice, registrationservice, authservice, $state, $ionicPopup, $stateParams) {
    //$scope.mobilenumber = '';
    $scope.errordescription = '';
    $scope.registrationdets = {
      mobilenumber : ''
    };
    /*$scope.options = {
    rightControl: '<i class="icon ion-backspace-outline"></i></button>',
    onKeyPress: function(value, source) {
        $scope.errordescription = '';
        if (source === 'RIGHT_CONTROL') {
            $scope.mobilenumber = $scope.mobilenumber.substr(0, $scope.mobilenumber.length - 1);
        }
        else if (source === 'NUMERIC_KEY') {
            $scope.mobilenumber += value;
        }
      }
    };*/
    $scope.clearFormFields = function(){
        $scope.registrationdets.mobilenumber = '';
    };
    $scope.continuebtn = function(){
        //check for internet connectivity before doing anything
        var available = internetservice.isInternetAvailable();
        if(!available){ return ; } //no internet connectivity

        $rootScope.showLoader();

        //validate mobile number length --
        if($scope.registrationdets.mobilenumber.length === '' || $scope.registrationdets.mobilenumber.length > 10 ||  $scope.registrationdets.mobilenumber.length < 10         ){
            //error scenario
            $rootScope.hideLoader();

            $scope.errordescription = 'Invalid mobile number';
            $scope.registrationdets.mobilenumber = '';
        }else{//call node service to validate if mobile number is registered on the platform
            authservice.validateMobileNumber($scope.registrationdets.mobilenumber).then(function(data){
                console.log('successful call to node service to validate mobile number ['+ JSON.stringify(data) +']');
                if(data.status == 'SUCCESS'){
                    $state.go('password', {mobilenumber:$scope.registrationdets.mobilenumber}); //goto security details and password screen
                }else{
                    $rootScope.hideLoader();
                    //$scope.errordescription = data.errorDescription;
                    $rootScope.showPopup({title:'Error', template:data.errorDescription}, function(res){
                        console.log('On alert ok ');
                    });
                    $scope.registrationdets.mobilenumber = '';
                }
            }).catch(function(error){
                $rootScope.hideLoader();


                $scope.registrationdets.mobilenumber = '';
                if(error.status === 400){
                    $rootScope.showPopup({title:'Error', template:"Please check the mobile number entered"}, function(res){
                    });
                }
                if(error.status === 401){
                    $rootScope.showPopup({title:'Error', template:"Mobile number is not registered, please register"}, function(res){
                    });
                }
                if(error.status === 500){
                    $rootScope.showPopup({title:'Error', template:"We couldn't validate mobile number right now, Please try again"}, function(res){
                    });
                }

                /*$rootScope.showPopup({title:'Error', template:"Couldn't validate mobile number right now, Please try again!"}, function(res){
                });*/
            });
        }
    };

}])
.controller('LoginCtrl', ['$scope','$rootScope','internetservice', 'registrationservice','authservice','$state','$ionicPopup','$stateParams','forgotpwdservice' , '$ionicModal', 'loginservice','signupservice','registrationdetsdb','DBA', function($scope, $rootScope, internetservice, registrationservice, authservice, $state, $ionicPopup, $stateParams, forgotpwdservice, $ionicModal, loginservice, signupservice, registrationdetsdb, DBA) {
  $scope.logindata=[];
	$scope.forgot=[];

	$ionicModal.fromTemplateUrl('my-modal4.html',{
      scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
	$scope.openModal4 = function() {
		$scope.modal.show();
	};

  	$scope.closeModal4 = function() {
    	$scope.modal.hide();
	};

	$scope.save=function(dets){
        console.log("calling the forgot password service");
		    $scope.forgotpass = true;
        forgotpwdservice.forgotpwd($scope.forgot.emailId, $scope.forgot.mobNo, $scope.forgotpass ).then(function(data){
            console.log( data);
                if(data.status === "SUCCESS"){
                    console.log("mobile no exists generate otp now");
                    $scope.pass=true;
                    var mobnum= $scope.forgot.mobNo.toString();
                    signupservice.generateOtp($scope.forgot.emailId, mobnum ).then(function(data){
                                if(data.status === "SUCCESS"){
                                    console.log("The otp is generated");
                                }
                            }).catch(function(error){
                        console.log("The Otp is not generated");
                    })
                }
            }).catch(function(error){
                if(error.status === 404){
                    console.log("mobile no doesn't please register ")
                      $scope.closeModal4();
                }
            });
    };

	$scope.newpassword= function(chg){
		console.log("changing the pasword");
$scope.forgot.push({emailId : chg.emailId, mobNo : chg.mobNo, password: chg.password, confirmpwd: chg.confirmpwd, smsotp: chg.smsotp, emailotp: chg.emailotp});
			console.log($scope.forgot);
		if($scope.forgot.password === $scope.forgot.confirmpwd){
			console.log("CHECKING passwords");
forgotpwdservice.changedpwd($scope.forgot.emailId, $scope.forgot.mobNo,$scope.forgot.password, $scope.forgot.smsotp, $scope.forgot.emailotp,$scope.forgotpass).then(function(data){
				console.log(data);
				if(data.status === "SUCCESS"){
					console.log("password saved successfully");
					$scope.closeModal4();
					$state.go('main.listedentities');
				}
			}).catch(function(error){
				console.log(error);
				var popupalert= $ionicPopup.alert({
					template:"Sorry unable to save the new password"
				}).then(function(res){
					console.log("error to save");
				})
			});
		}

	}

  $scope.signup=function(){
      $state.go('signup');
  };
	$scope.login =function(logindata){
		$scope.logindata.push({email: logindata.email, passcode: logindata.passcode});
		$rootScope.showLoader();
		loginservice.logindets($scope.logindata.email, $scope.logindata.passcode).then(function(data){
            if(data.status === 'SUCCESS'){
              $rootScope.hideLoader();
              registrationdetsdb.query({}).then(function(response){
                  var result = DBA.getById(response);
                  registrationdetsdb.updateJWTAndAppRegId(data.appregistrationid, data.authtoken, data.isdoctor).then(function(result){
                      loginservice.setProfileData({"appregistrationid":data.appregistrationid, "jsonwebtoken":data.authtoken, "isdoctor":data.isdoctor});
                      $state.go('main.listedentities');
                  }).catch(function(error){
                     console.log('printing error object completely while login ['+ JSON.stringify(error) + ']');
                      $rootScope.showPopup({
                        title:'System Error',
                        template:'Unable to login right now, please try again !!'
                      },function(res){
                      });
                  });
              }).catch(function(error){
                console.log('printing error object completely while login ['+ JSON.stringify(error) + ']');
                $rootScope.showPopup({
                       title:'System Error',
                            template:'Unable to login right now, please try again !!'
                },function(res){
                });
              });
            }else{
                $rootScope.showPopup({
      					       title:'Invalid Login',
      					            template:'Invalid login details, please try again'
				        },function(res){
                });
            }
		}).catch(function(error){
      $rootScope.hideLoader();
      console.log('printing error object completely while login ['+ JSON.stringify(error) + ']');
      if(error.status === 400){
        $rootScope.showPopup({
          title:'Invalid Credentials',
          template:'Invalid login details, please try again'
        },function(res){
        });
      }else{
        console.log('printing error object completely while login ['+ JSON.stringify(error) + ']');
        $rootScope.showPopup({
          title:'System Error',
          template:'Unable to login right now, please try again !!'
        },function(res){
        });
      }
		});
	}
}])
.controller('SignUpCtrl',['$scope', '$rootScope','$state', 'ionicDatePicker', '$filter', 'signupservice', '$ionicModal', '$ionicPopup', function($scope, $rootScope, $state, ionicDatePicker, $filter, signupservice, $ionicModal, $ionicPopup){

	$scope.formData = [];

	// DatePicker object with callbcak to obtain the date
	var ipObj1 = {
      callback: function (val) {  //Mandatory
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
		      $scope.formData.dob = $filter('date')(val, "dd MMM yyyy");
      },
      from: new Date(1900 , 1, 1), //Optional
      //to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
//      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

  //OTP Details Modal View
	$ionicModal.fromTemplateUrl('otpscreen.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
	$scope.openModal2 = function() {
    	$scope.modal.show();
  }
	$scope.closeModal2 = function() {
    	$scope.modal.hide();
  }

	// saving data into an array and calling the modal func to capture the otp
  $scope.save = function(fdata){
    $rootScope.showLoader();
		$scope.formData.push({
		firstname: fdata.firstname,
    lastname:fdata.lastname,
    mobnum:fdata.mobnum,
    emailadd:fdata.emailadd,
    password:fdata.password,
    confirmpassword:fdata.confirmpassword,
    age: fdata.age,
    dob:fdata.dob,
    male:fdata.male,
    female: fdata.female,
    address: fdata.address,
    city: fdata.city,
    pincode: fdata.pincode,
    state: fdata.state,
    country: fdata.country,
    doctor : fdata.doctor,
    licenceNo: fdata.licenceNo,
    termyes: fdata.termsyes
   });

		//console.log($scope.formData);
	  signupservice.validatedetails($scope.formData.emailadd, $scope.formData.mobnum, $scope.formData.doctor ).then(function(data){
      $rootScope.hideLoader();
			if(data.status == 'SUCCESS'){
			     $rootScope.showPopup({title:'Already Registered', template:'Email id and mobile number combination already exists'});
			}
		}).catch(function(error){
			if(error.status === 404){
				var mobilenum = $scope.formData.mobnum.toString();
			  signupservice.generateOtp($scope.formData.emailadd, mobilenum ).then(function(data){
          $rootScope.hideLoader();
					$scope.openModal2();
				});
			}else{
        $rootScope.hideLoader();
        $rootScope.showPopup({title:'Error', template:"Error validating details, please try again"});
      }
		});
	}
	//otp
	$scope.security=[];

	$scope.securitydets = function(u){
		$scope.security.push({otpsms: u.otpsms, otpemail: u.otpemail });
		console.log($scope.security);
		if( $scope.formData.female === true){
			$scope.formData.gender = "female"
		}else{
			$scope.formData.gender = "male"
		}

	var mobile = $scope.formData.mobnum.toString();

if($scope.formData.doctor == true){
   signupservice.registerDoctor($scope.formData.firstname,$scope.formData.lastname,$scope.formData.gender,$scope.formData.emailadd,mobile,$scope.formData.address,$scope.formData.age,$scope.formData.dob,$scope.formData.doctor, $scope.formData.licenceNo,$scope.security.otpsms, $scope.security.otpemail, $scope.formData.password).then(function(data){
			var alertPopUp = $ionicPopup.alert({
				title:"Registration Successful"
			}).then(function(res){
				$scope.closeModal2();
				$state.go('main.listedentities');
			});
	 }).catch(function(error){
      	var alertpop = $ionicPopup.alert({
      		title:" Registration failed"
      	}).then(function(res){
      		$state.go('signup');
      	})
    });
	}else{
			signupservice.registerPatient($scope.formData.firstname,$scope.formData.lastname,$scope.formData.gender,$scope.formData.emailadd,mobile,$scope.formData.address,$scope.formData.age,$scope.formData.dob,$scope.formData.doctor,$scope.security.otpsms, $scope.security.otpemail, $scope.formData.password).then(function(data){

			var alertPopUp = $ionicPopup.alert({
				title:"Registration Successful"
			}).then(function(res){
				$scope.closeModal2();
				$state.go('main.listedentities');
			})
    }).catch(function(error){
        $rootScope.showPopup()
    })
		}
	}
}])
.controller('LandingCtrl',['$scope','$rootScope', '$ionicPopup', '$stateParams','registrationdetsdb','DBA','$state','loginservice',function(
  $scope, $rootScope, $ionicPopup, $stateParams, registrationdetsdb, DBA, $state, loginservice){
  // first on loading of the landing page lets check if we have
  //json web token available
  $scope.$on("$ionicView.loaded", function(event, data){
    $rootScope.showLoader();
    registrationdetsdb.query({}).then(function(response){
        var result = DBA.getById(response);
        loginservice.logindets('', '').then(function(data){
          $rootScope.hideLoader();
          if(data.status === 'SUCCESS'){
              loginservice.setProfileData({"appregistrationid":result.appregistrationid, "isdoctor":result.isdoctor});
              $state.go('main.listedentities');
          }else{
            $rootScope.showToast("Couldn't do auto sign in, please login again",'long','top');
          }
        }).catch(function(error){
            $rootScope.hideLoader();
            $rootScope.showToast("Couldn't do auto sign in, please login again",'long','top');
        });
    }).catch(function(error){
          $rootScope.hideLoader();
          $rootScope.showToast("Couldn't do auto sign in, please login again",'long','top');
    });
  });
}])
.controller('PasswordCtrl', ['$scope','$rootScope','internetservice', 'registrationservice','authservice','$state','$ionicPopup','$stateParams','registrationdetsdb','DBA', function($scope, $rootScope, internetservice, registrationservice, authservice, $state, $ionicPopup, $stateParams, registrationdetsdb, DBA) {
    $scope.logindata = {
        mobilenumber : $stateParams.mobilenumber,
        passcode : ''
    };
    $scope.errordescription = '';
    $scope.passcode = '';

    $scope.options = {
    rightControl: '<i class="icon ion-backspace-outline"></i></button>',
    onKeyPress: function(value, source) {
        $scope.errordescription = '';
        if (source === 'RIGHT_CONTROL') {
            $scope.logindata.passcode = $scope.logindata.passcode.substr(0, $scope.logindata.passcode.length - 1);
        }
        else if (source === 'NUMERIC_KEY') {
            $scope.logindata.passcode += value;
            if($scope.logindata.passcode.length == 4){
                $scope.loginfunction();
            }
        }
      }
    };

    $scope.continuebtn = function(){
        //check for internet connectivity before doing anything
        var available = internetservice.isInternetAvailable();
        if(!available){ return ; } //no internet connectivity
        $rootScope.showLoader();
        console.log('continuebtn click with mobile number ['+ $scope.logindata.mobilenumber + ']');
        //validate mobile number length --
        if($scope.logindata.mobilenumber.length === '' || $scope.logindata.mobilenumber.length > 10 ||  $scope.logindata.mobilenumber.length < 10         ){
            //error scenario
            console.log('Invalid mobile number entered');
            $scope.errordescription = 'Invalid mobile number';
            $scope.mobilenumber = '';
            $rootScope.hideLoader();
        }else{//call node service to validate if mobile number is registered on the platform
            authservice.validateMobileNumber($scope.logindata.mobilenumber).then(function(data){
                console.log('successful call to node service to validate mobile number ['+ JSON.stringify(data) +']');
                if(data.status == 'SUCCESS'){
                    $state.go('password', {mobilenumber:$scope.logindata.mobilenumber}); //goto security details and password screen
                }else{
                    $scope.errordescription = data.errorDescription;
                    $scope.logindata.mobilenumber = '';
                    $rootScope.hideLoader();
                }
            }).catch(function(error){
                console.log('error encountered during validatemobileservice call with error ['+ error + ']');
                $scope.errordescription = 'Cannot validate mobile number right now, please try again!';
                $scope.logindata.mobilenumber = '';
                $rootScope.hideLoader();
            });
        }
    };

    $scope.loginfunction = function(){
        if(window.cordova){
            //check for internet connectivity before doing anything
            var available = internetservice.isInternetAvailable();
            if(!available){ return ; } //no internet connectivity

        }
        $rootScope.showLoader();
        console.log('Before login call checking the payload ['+ JSON.stringify($scope.logindata) + '] stateParams mobilenumber is ['+ $stateParams.mobilenumber +']' );

        registrationdetsdb.query({}).then(function(response){
                        var result = DBA.getById(response);
                        console.log('printing result of local table query b4 login ['+ JSON.stringify(result) + ']');
                        authservice.loginservice($stateParams.mobilenumber, $scope.logindata.passcode, result.registrationtoken).then(function(data){
            console.log('Response from login service was successfull with response ['+ JSON.stringify(data)+']');
            if(data.status === 'SUCCESS'){
                if(data.actioncode && data.actioncode === 'REG_TOKEN_UPDATED'){
                    if(window.cordova){
                            //update the jsonwebtoken back to registration table
                            registrationdetsdb.updateMobileNumber({mobilenumber:$stateParams.mobilenumber});
                    }
                }
                console.log('Login was successful');
                //if(window.cordova){
                    //update the jsonwebtoken back to registration table
                    registrationdetsdb.updateJWT({mobilenumber:$stateParams.mobilenumber,       jsonwebtoken:data.authtoken}).then(function(result){
                        console.log('result of JWT update on login is ['+ result.rowsAffected + ']');
                        $state.go('main.recentnotifications', {mobilenumber:$stateParams.mobilenumber});
                    }).catch(function(error){
                        $rootScope.showPopup({title:'System Error', template:'Oops !! There is some problem logging in right now'}, function(res){
                   console.log('on ok click');
                        });
                    });
                //}
            }else{
               $rootScope.hideLoader();
               /*var alertPopup = $ionicPopup.alert({
                 title: 'Invalid Login Details',
                 template: 'Please check your mobilenumber and passcode combination'
               });
               alertPopup.then(function(res) {
                 console.log('Thank you for not eating my delicious ice cream cone');
               });*/
                $scope.logindata.passcode = '';
                $rootScope.showPopup({title:'Invalid Login Details', template:'Please check your mobilenumber and passcode combination'}, function(res){
                   console.log('on ok click');
                });

            }
        }).catch(function(error){
          $rootScope.hideLoader();
          /*var alertPopup = $ionicPopup.alert({
             title: 'Invalid Login Details',
             template: 'Please check your mobilenumber and passcode combination'
           });
           alertPopup.then(function(res) {
             console.log('Thank you for not eating my delicious ice cream cone');
           });*/
           $scope.logindata.passcode = '';

           if(error.status === 400){
                $rootScope.showPopup({title:'System Error', template:'Oops !! There is some problem logging in right now, Please try again'}, function(res){
                   console.log('on ok click');
                });
           }else{
               if(error.status !== 401 && error.status !== 419){ //there is handling for these error codes seperately
                    $rootScope.showPopup({title:'Invalid Login Details', template:'Please check your mobilenumber and passcode combination'}, function(res){
                    console.log('on ok click');
                    });
               }
           }
        });
     }).catch(function(error){
                        $rootScope.showPopup({title:'System Error', template:'Oops !! There is some problem logging in right now, Please try again'}, function(res){
                   console.log('on ok click');
                        });

      });

    };

}])

.controller('RegistrationCtrl', ['$scope','$rootScope','$ionicPlatform','registrationservice', '$state','$ionicPopup','internetservice', function($scope, $rootScope, $ionicPlatform, registrationservice, $state, $ionicPopup, internetservice){
    //$scope.mobilenumber = '';
    $scope.errordescription = '';
    $scope.registrationdets = {
      mobilenumber : ''
    };
    /*$scope.hidekeyboard = function($event){
        console.log('hidekeyboard is invoked');
       // $ionicPlatform.ready(function() {
            console.log('within ionicplatform device function');
            if (window.cordova && window.cordova.plugins.Keyboard) {
                console.log('cordova plugins keyboard found, lets see if it closes');
                console.log('printing keyboard value ['+ cordova.plugins.Keyboard.isVisible +'] b4 close');
                cordova.plugins.Keyboard.close();
                console.log('printing keyboard visible value ['+ cordova.plugins.Keyboard.isVisible +'] after close');

            }
            console.log('printing keyboard value ['+ $cordovaKeyboard.isVisible() +'] b4 close with ngCordova');
            $cordovaKeyboard.close();
        //});
    };
    */
    /*$scope.options = {
    rightControl: '<i class="icon ion-backspace-outline"></i></button>',
    onKeyPress: function(value, source) {
        $scope.errordescription = '';
        if (source === 'RIGHT_CONTROL') {
            $scope.mobilenumber = $scope.mobilenumber.substr(0, $scope.mobilenumber.length - 1);
        }
        else if (source === 'NUMERIC_KEY') {
            $scope.mobilenumber += value;
        }
      }
    };*/

    $scope.continuebtn = function(){
        //check for internet connectivity before doing anything

        var available = internetservice.isInternetAvailable();
        if(!available){ return ; } //no internet connectivity
        $rootScope.showLoader();
        console.log('continuebtn click with mobile number ['+ $scope.registrationdets.mobilenumber + ']');
        //validate mobile number length --
        if($scope.registrationdets.mobilenumber.length === '' || $scope.registrationdets.mobilenumber.length > 10 ||  $scope.registrationdets.mobilenumber.length < 10 ){

            console.log('Invalid mobile number entered');
            $scope.errordescription = 'Invalid mobile number';
            $scope.registrationdets.mobilenumber = '';
            $rootScope.hideLoader();
        }else{//call node service to validate if mobile number is registered on the platform*
            registrationservice.validateMobileNumber($scope.registrationdets.mobilenumber).then(function(data){
                console.log('successful call to node service to validate mobile number ['+ JSON.stringify(data) +']');
                if(data.status == 'SUCCESS'){
                    $state.go('securitydetails', {mobilenumber:$scope.registrationdets.mobilenumber});
					//goto security details and password screen
                }else{
                    //$scope.errordescription = data.errorDescription;
                    $scope.registrationdets.mobilenumber = '';
                    $rootScope.hideLoader();
                    $rootScope.showPopup({title:'Error', template:data.errorDescription}, function(res){
                   console.log('on ok click');
                    });
                }
            }).catch(function(error){
                console.log('error encountered during validatemobileservice call with error ['+ error + ']');
                //$scope.errordescription = 'Cannot validate mobile number right now, please try again';
                $scope.registrationdets.mobilenumber = ''
                $rootScope.hideLoader();
                $rootScope.showPopup({title:'Error', template:"Couldn't validate mobile number right now, Please try again!"}, function(res){
                   console.log('on ok click');
                });
            });
        }
    };

}])

.controller('SecurityDetailsCtrl', ['$scope','$rootScope','$stateParams', '$state', 'securityquestions','initiateotpgeneratesvc', 'pushnotificationservice','registrationservice', 'registrationdetsdb','DBA', function($scope, $rootScope, $stateParams, $state, securityquestions, initiateotpgeneratesvc, pushnotificationservice, registrationservice, registrationdetsdb, DBA){
    $scope.enableotp = false;
    $scope.securityquesdata = {
        securityquestions : securityquestions,
        selectedquestion  : '',
        answer   :'',
        securitypin : '',
        otppin : ''
    }
    $scope.onBlurFn = function($event){
        console.log('Printing security answer ['+ $scope.securitydets +']');
        console.log('Printing security answer ['+ $event +']');

    }
    $scope.registerbtn = function(){
        $scope.errordescription = '';
        $rootScope.showLoader();
        if($scope.enableotp){
            //proceed with registration
            console.log('securityquesdata is [' + JSON.stringify($scope.securityquesdata) +']');
            initiateotpgeneratesvc.validateOtp($stateParams.mobilenumber,$scope.securityquesdata.otppin).then(function(data){

                if(data.status == 'SUCCESS'){
                    console.log('Successfully validated OTP');
                    //proceed to data save service call
                    //pushnotificationservice.registerDevice(registrationhandler, notificationhandler, errorhandler);
                    if(window.cordova){
                        registrationdetsdb.query({}).then(function(response){

                            var result = DBA.getById(response);
                            console.log('registration token is ['+ result.registrationtoken + ']');
                            var registrationdetails={ mobilenumber : $stateParams.mobilenumber,
                                                        securitydetails : {
                                                            securitypin : $scope.securityquesdata.securitypin,
                                                        securityquestion:$scope.securityquesdata.selectedquestion,
                                                    securityquestionanswer:$scope.securityquesdata.answer,
                                                            registrationtoken : result.registrationtoken
                                                        }
                                                    };
                           //update mobile number to registrationtable on sqlite
                           registrationdetsdb.updateMobileNumber(registrationdetails);
                            registrationservice.saveRegistrationDetails(registrationdetails).then(function(data){
                                $rootScope.hideLoader();
                                console.log('Registered successfully ['+ JSON.stringify(data) + ']');
                                //$scope.errordescription = 'Registered successfully';
                                $rootScope.showPopup({title:'Registration', template:'Registered Successfully'},                                     function(res){
                                    $state.go('login');
                                });
                            }).catch(function(error){
                                console.log('Error encountered within saveRegistrationDetails');
                                //$scope.errordescription = 'Registeration failed, Please try again later';
                                $rootScope.hideLoader();
                                $rootScope.showPopup({title:'Registration', template:'Registeration failed, Please try again!'},                   function(res){
                                    console.log('on click ok');
                                });
                            });
                        }).catch(function(error){
                            console.log('error encountered while fetching registration token from DB ['+ error +                                 ']');
                            //$scope.errordescription = 'Registeration failed, Please try again later';
                                $rootScope.showPopup({title:'Registration', template:'Registeration failed, Please try again!'},                   function(res){
                                    console.log('on click ok');
                                });
                        });
                    }else{

                            console.log('within else wherein there is no cordova');
                            var registrationdetails={   mobilenumber : $stateParams.mobilenumber,
                                                        securitydetails : {
                                                            securitypin : $scope.securityquesdata.securitypin,
                                                        securityquestion:$scope.securityquesdata.selectedquestion,
                                                    securityquestionanswer:$scope.securityquesdata.answer,
                                                            registrationtoken : 'emp9i_R3PjY:APA91bEpoRrVZkOBiTeXuCn98aMNypJsqmzAMX8I9M86fMlBwn7ZElyoxX9TwezSoNXLC6dGery8GcCRufQArQnl8rYMoFn1K_tbQ6RuAzWoSr4PTp--ro2lOMmuqg7dUlSFNsOSvM8y'
                                                        }
                                                    };

                            console.log('printing registrationdetails [' + JSON.stringify(registrationdetails) + ']');
                            registrationservice.saveRegistrationDetails(registrationdetails).then(function(data){
                                $rootScope.hideLoader();
                                console.log('Registered successfully ['+ JSON.stringify(data) + ']');
                                //$scope.errordescription = 'Registered successfully';
                                $rootScope.hideLoader();
                                $rootScope.showPopup({title:'Registration', template:'Registered Successfully'},                                     function(res){
                                    $state.go('login');
                                });
                            }).catch(function(error){
                                console.log('Error encountered within saveRegistrationDetails');
                                //$scope.errordescription = 'Registeration failed, Please try again later';
                                $rootScope.hideLoader();
                                $rootScope.showPopup({title:'Registration', template:'Registeration failed, Please try again!'},                   function(res){
                                    console.log('on click ok');
                                });
                            });
                    }
               }else{
                    console.log('Invalid OTP entered');
                    //$scope.errordescription = 'Invalid OTP entered';
                    $rootScope.hideLoader();
                    $rootScope.showPopup({title:'OTP Validation', template:'Invalid OTP entered'},                                        function(res){ console.log('on click ok');
                    });
               }
            }).catch(function(error){
                    console.log('OTP validation failed, Please try again');
                    //$scope.errordescription = 'OTP validation failed, Please try again';
                    $rootScope.hideLoader();
                    $rootScope.showPopup({title:'OTP Validation', template:'OTP validation failed, Please try   again!'}, function(res){ console.log('on click ok');
                    });
            });
        }else{
            //invoke OTP generation process
            console.log('Printing mobile number $stateParams.mobileNumber['+$stateParams.mobilenumber +']');
            initiateotpgeneratesvc.generateOtp($stateParams.mobilenumber).then(function(data){
                  if(data.status == 'SUCCESS'){
                     $rootScope.hideLoader();
                     $scope.enableotp = true;
                  }else{
                     $scope.enableotp = false;
                      //update error description to the screen
                      //$scope.errordescription = 'OTP generation failed, Please try again';
                    $rootScope.hideLoader();
                     $rootScope.showPopup({title:'OTP Generation', template:'OTP generation failed, Please try again!'}, function(res){ console.log('on click ok');
                    });
                  }
            }).catch(function(error){
                    $scope.enableotp = false;
                    //update error description to the screen
                    //$scope.errordescription = 'OTP generation failed, Please try again';
                    $rootScope.hideLoader();
                     $rootScope.showPopup({title:'OTP Generation', template:'OTP generation failed, Please try again!'}, function(res){ console.log('on click ok');
                    });
            });
         }
    };

}])

/*.controller('EntitiesCtrl', ['$scope','$rootScope','$stateParams','$state', 'hospitalservice', '$ionicPopup','$cordovaDialogs','$ionicFilterBar', '$ionicModal', function($scope, $rootScope, $stateParams, $state, hospitalservice, $ionicPopup, $cordovaDialogs, $ionicFilterBar, $ionicModal){

	$scope.listedentities=[];
	$scope.hospitalslist=[];
	$scope.patientId = "5751377e4f09030255c59a8b";
	 $scope.filterBarInstance;
    $rootScope.showLoader();
    hospitalservice.getregHospitals($scope.patientId).then(function(data){
        if(data.status === 'SUCCESS'){
            $rootScope.hideLoader();
			console.log("hospital list data" + data );
            //$scope.listedentities  = data;
			console.log($scope.listedentities.data);
            $scope.hospitalslist = data.data;
			//$scope.hospitalslist.push(
		 $scope.hosinfo= function(){
			hospitalservice.hospitalinfo($scope.hos.hospitalid,$scope.hos.hospitalcode).then(function(data){
			console.log(data);
				$scope.hospitalslist.push(data);
				console.log($scope.hospitalslist);
			}).catch(function(error){
				var alertpop = $ionicPopup.alert({
					title: "Failed to retrieve hospital info"
				}).then(function(res){
					console.log("Okay on hospital info");
				})
			});
		  }
         angular.forEach($scope.listedentities.data, function(value,key){
				$scope.hos = value;
				console.log($scope.hos);
				var hoscode= $scope.hos.hospitalcode;
				var hosid= $scope.hos.hospitalid;
				console.log(hoscode);
				console.log(hosid);
				//$scope.hosinfo();
          });
       }
       else{
            $rootScope.hideLoader();
            $rootScope.showPopup({
				title:'Error Retrieving Hospitals',
				template:"Couldn't retrieve Hospitals Registered!"}, function(res){
                console.log('on click ok');
            });
        }
    }).catch(function(error){
        console.log('Error encounterd while calling getregHospitals['+ error + ']');
        $rootScope.hideLoader();
                });


    $scope.showFilterBar = function(){

            filterBarInstance = $ionicFilterBar.show({
            items:$scope.listedentities,
            update:function(filteredItemList){
                $scope.listedentities = filteredItemList;
            },
            expression:function(filterText, value, index, array){
                return value.entityName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
            }
            //filterProperties:'entityName'
            });
        //console.log('filterBarInstance -->['+filterBarInstance + ']');
    };

    $scope.shouldShowReorder = false;
    $scope.shouldShowDelete  = false;
    $scope.listCanSwipe = true;


	//hospital info modal

	$ionicModal.fromTemplateUrl('my-modal3.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
	$scope.openModal3 = function() {
    	$scope.modal.show();
    }
	$scope.closeModal3 = function() {
    	$scope.modal.hide();
            }

	//hospital info data
	$scope.hospitals= [
  {
	  hospitalcode: 01,
	  hospitalname: "CMH Hospital",
	  hospitaladdress:{
		  addressline1 : "#32, 4th main",
		  addressline2 : " 4th Block",
		  addressline3 : " Rajajinagar",
		  city : "Bangalore",
		  pincode : " 567992 ",
		  state : "Karnataka",
		  country : "India"
	  },
	  hospitaltelnumber : "12340000",
      hospitalmobnumber : "09876543211",
      hospitalemailid : "xyz@abc.com",
      hospitalsecondaryemailid : "lmno@pqr.com",
      hospitalsecondarymobno : "09182736455",
	  hospitaldepartments :{
                 dept1:"cardio",
                 dept2:"neuro",
                 dept3:"optha",
                 dept4:"eye",
                 dept5:"dental",
                 dept6:"EnT"
             },
      inhouselabs :{
                 lab1:" Basic blood analysis lab",
                 lab2:"Bio-Chem analysis lab",
                 lab3:"Hormonal analysis lab "
                  },
  }];


	}])*/
.controller('EntitiesCtrl', ['$scope','$rootScope','$stateParams','$state', 'hospitalservice', '$ionicPopup','$cordovaDialogs','$ionicFilterBar', '$ionicModal', '$ionicSlideBoxDelegate','DBA','registrationdetsdb','$ionicPopover',function($scope, $rootScope, $stateParams, $state, hospitalservice, $ionicPopup, $cordovaDialogs, $ionicFilterBar, $ionicModal, $ionicSlideBoxDelegate, DBA, registrationdetsdb, $ionicPopover){

  /* $scope.popover = $ionicPopover.fromTemplate('<ion-popover-view style=" top: 45px; left: 190px;  margin-left: 10px;    opacity: 1;    height: 23%;    width:40%;"><ion-content><div class="list" ><a class="item" on-tap="closePopover()" style="padding-bottom: 5px;padding-top: 5px;" href="#/patientprfl" >Patient Profile</a><a class="item" on-tap="closePopover()" style="padding-bottom: 5px;padding-top: 5px;" href="#/feedback">feedback</a><a class="item" on-tap="closePopover()" style="padding-bottom: 5px;padding-top: 5px;" href="#/logout">logout</a><a class="item" on-tap="closePopover()" style="padding-bottom: 5px;padding-top: 5px;" href="#/logout">About</a></div></ion-content></ion-popover-view>',
  {
    scope: $scope
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  }); */
  $scope.openPopover = function($event) {
    console.log('printing openPopOver Withinin EntitiesCtrl');
    $scope.$parent.openPopover($event);
  };
  $scope.closePopover = function() {
    console.log('printing closePopover Withinin EntitiesCtrl');
    $scope.$parent.closePopover();
  };

	$scope.listedentities=[];
	$scope.hospitalslist=[];
	$scope.hos=[];
  //$scope.patientId = "5751377e4f09030255c59a8b";
 //result.appregistrationid
 $rootScope.showLoader();
 registrationdetsdb.query({}).then(function(response){
        var result = DBA.getById(response);
        $scope.patientId = result.appregistrationid;
        hospitalservice.getregHospitals($scope.patientId).then(function(data){
            if(data.status === 'SUCCESS'){
                $rootScope.hideLoader();
                console.log("hospital list data" + data );
                $scope.listedentities = data;
                //before the data value lets take out duplicate hospitals from the list
                 var arrayofhospitals =[];
                _.each($scope.listedentities.data, function(hospitaldata, key, list){
                    if(arrayofhospitals.length ===0){
                      arrayofhospitals.push(hospitaldata);
                    }else{
                      _.each(arrayofhospitals, function(hospitaladded, key, list){
                          if(hospitaladded._id !== hospitaldata._id){
                              arrayofhospitals.push(hospitaldata);
                          }
                      });
                    }
                });
                $scope.hospitalslist = arrayofhospitals;
                //$scope.hospitalslist = $scope.listedentities.data;

          }else{
                $rootScope.hideLoader();
                $rootScope.showPopup({
                    title:'Error Retrieving Hospitals',
                    template:"Couldn't retrieve Hospitals Registered!"}, function(res){
                    console.log('on click ok');
                });
            }
        }).catch(function(error){
            console.log('Error encounterd while calling getregHospitals['+ error + ']');
            $rootScope.hideLoader();
            $rootScope.showPopup({
                title:'Error Retrieving Hospitals',
                template:"Couldn't retrieve Hospitals Registered!"}, function(res){
                console.log('on click ok');
            });
        });

 }).catch(function(error){
   $rootScope.hideLoader();
   $rootScope.showPopup({
       title:'Error Retrieving Hospitals',
       template:"Couldn't retrieve Hospitals Registered!"}, function(res){
       console.log('on click ok');
   });

});
$scope.hosinfo= function(hospitalid,hospitalcode){
      console.log("hospital info calling with hospitalid["+ hospitalid +"] and hospitalcode ["+ hospitalcode +"]");
			 hospitalservice.hospitalinfo(hospitalid,hospitalcode).then(function(data){
				$scope.openModal3();
				console.log(data);
				$scope.hos= data.data;
				console.log($scope.hos);
			}).catch(function(error){
				var alertpop = $ionicPopup.alert({
					title: "Failed to retrieve hospital info"
				}).then(function(res){
					console.log("Okay on hospital info");
				});
			});
	}
  $scope.filterBarInstance;
  $scope.showFilterBar = function(){

            filterBarInstance = $ionicFilterBar.show({
            items:$scope.hospitalslist,
            update:function(filteredItemList){
                $scope.hospitalslist = filteredItemList;
            },
            expression:function(filterText, value, index, array){
                return value.hospitalname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
            }
        });
    };

    $scope.shouldShowReorder = false;
    $scope.shouldShowDelete  = false;
    $scope.listCanSwipe = true;


	//hospital info modal

	$ionicModal.fromTemplateUrl('my-modal3.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
	$scope.openModal3 = function() {
    	$scope.modal.show();
    }
	$scope.closeModal3 = function() {
    	$scope.modal.hide();
	}
	//feedback questions
	$scope.questions=[{question: "How was the service at the hospital reception?",answer: ''},
		{question: "The care and attention of the staff(nurses and doctors)",answer: ''},
		{question : "The ease of obtaining the records and lab-reports",answer: ''},
		{question: "Trackmyhealth app , has it been helpful?",answer: ''},
		{question: "Is the app easy to use?",answer: ''}];

	//ratings for feedback
	$scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star-outline',
        iconOnColor: 'rgb(200, 200, 100)',
        iconOffColor:  'rgb(200, 100, 100)',
		rating: '',
        minRating: 0 ,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
			return rating;
        }
      };

	// ratings callback function , obtains the current slide and updates the object answer
     $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
		$scope.i= $ionicSlideBoxDelegate.currentIndex();
		console.log($scope.i);
		$ionicSlideBoxDelegate.next();
		$scope.questions[$scope.i].answer = rating;
		console.log($scope.questions);
		 if($scope.i === 4){
		 $scope.closepopup()
		 }
	  };

	//popup to show feedback
	$scope.showPopup = function() {

   // An elaborate, custom popup
  	 var myPopup = $ionicPopup.show({
		 template: '<ion-slide-box show-pager="false" ><ion-slide ng-repeat="quest in questions"><h4>{{quest.question}}</h4><br><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ><br/></i></ion-slide></ion-slide-box>',
		 title: 'Feedback',
		 scope: $scope
	 })
	  //popup close
	 $scope.closepopup = function(){
		  console.log("closing popup");
		  myPopup.close();
	 }
	};


}])
.controller('RecentEntitiesCtrl', ['$scope', '$rootScope','$state', '$stateParams', '$ionicPopup', 'notificationservice', function($scope, $rootScope, $state, $stateParams, $ionicPopup, notificationservice) {
    $scope.todaysdate = new Date();
    console.log('$stateParams.mobilenumber ['+$stateParams.mobilenumber+']');
    $state.current.data.mobilenumber = $stateParams.mobilenumber;
    console.log('Printing data object from Parent ['+ JSON.stringify($state.current.data)+']');
    $rootScope.showLoader();
    //$scope.mobilenumber = $stateParams.mobilenumber;
    $scope.mobilenumber = 9739314152;
    notificationservice.getRecentNotifications($stateParams.mobilenumber).then(function(data){
        $rootScope.hideLoader();
        if(data.status === 'SUCCESS'){
            //filter the list and get the count also
            /* "entityId": transaction.entityId,
                        "notificationText": transaction.notificationText,
                        "entityName": transaction.entityName,
                        "createdAt": transaction.createdAt,
                        "msgunreadstatus" : transaction.msgRedstatus */
            var a = [];
            var tobelistedentities = [];
            angular.forEach(data.entityList, function(entity, key) {
                if(a.indexOf(entity.entityId) < 0){
                    a.push(entity.entityId);
                    if(!entity.msgunreadstatus){
                        entity.unreadmessagecount = 1;
                    }
                    tobelistedentities.push(entity);
                }else{ // already exists increment count if status is unread
                    if(!entity.msgunreadstatus){
                        var sentity = tobelistedentities[a.indexOf(entity.entityId)];
                        if(sentity.unreadmessagecount){
                            sentity.unreadmessagecount = sentity.unreadmessagecount + 1;
                        }else{
                            sentity.unreadmessagecount = 1;
                        }
                    }
                }
            });
            console.log('tobelistedentities ['+ JSON.stringify(tobelistedentities) + ']');
            $scope.listedentities = tobelistedentities;
        }else{
            $rootScope.showPopup({title:'Error', template:"Error retrieving recent notifications, Please try again!"}, function(res){
           });
        }
    }).catch(function(error){
        $rootScope.hideLoader();
        console.log('Error encountered with error object retrieved is ['+ JSON.stringify(error) + ']');
        if(error.status != 401 && error.status != 419){ // only when not-authenticated error is encountered
            $rootScope.showPopup({title:'Error', template:"Couldn't retrieve response from server, Please try again!"}, function(res){

           });
        }
    });

}])

.controller('SubscriptionCtrl', ['$scope','$rootScope','$ionicHistory','$state','notificationservice',function($scope, $rootScope, $ionicHistory,$state,notificationservice){
    $scope.showShowReorder = false;
    $scope.shouldShowCheckMark = false;
    $scope.listCanSwipe = false;
    $scope.unsubscribedentitylist = [];
    var stateconfig = $state.get('main.recentnotifications');
    $rootScope.showLoader();
    notificationservice.listUnsubscribedEntities(stateconfig.data.mobilenumber).then(function(data){
        $rootScope.hideLoader();
        if(data.status === 'SUCCESS'){
            console.log('successfully retrieved unsubscribed list ['+ JSON.stringify(data.entityidlist) +']');
            if(data.entityidlist.length === 0){
                $rootScope.showPopup({title:'Message', template:"There are no previously unsubscribed businesses"},                  function(res){
                    $ionicHistory.goBack();
                });
            }else{
                angular.forEach(data.entityidlist, function(value, key) {
                value.resubscribed = {
                    checked:false
                };
                this.push(value);
                }, $scope.unsubscribedentitylist);
            }
        }else{
            $rootScope.showPopup({title:'Error', template:"Currently system is facing trouble retrieving response, Please try again!"}, function(res){

           });
        }
    }).catch(function(error){
        $rootScope.hideLoader();
        console.log('Error encountered while retrieving list of unsubscribed entities ['+ JSON.stringify(error) + ']');
        if(error.status != 401 && error.status != 419){ // only when not-authenticated error is encountered
            $rootScope.showPopup({title:'Error', template:"Couldn't retrieve response from server, Please try again!"}, function(res){

           });
        }
    });


    $scope.onchangeofcheckbox = function(){
        $scope.truefalselist = [];
        angular.forEach($scope.unsubscribedentitylist, function(value, key) {
            console.log('value.resubscribed.checked ['+ value.resubscribed.checked + ']');
            this.push(value.resubscribed.checked);
        }, $scope.truefalselist);
        if($scope.truefalselist.indexOf(true) !== -1){
            $scope.shouldShowCheckMark = true;
        }else{
            $scope.shouldShowCheckMark = false;
        }
    };

    $scope.resubscribeEntities = function(){
        $scope.resubscriptionavailable = false;
        $scope.entityidlist = [];
        //first check if the entities are selected
        angular.forEach($scope.unsubscribedentitylist, function(value, key) {
            console.log('value.resubscribed.checked ['+ value.resubscribed.checked + ']');
            if(value.resubscribed.checked){
                $scope.resubscriptionavailable = true;
                this.push({entityId:value.entityId});
            }
        }, $scope.entityidlist);
        if($scope.resubscriptionavailable){
            $rootScope.showLoader();
            notificationservice.subscribeEntities(stateconfig.data.mobilenumber, $scope.entityidlist).then(function(data){
                $rootScope.hideLoader();
                if(data.status === 'SUCCESS'){
                    //$state.go('main.listedentities');
                    $scope.shouldShowCheckMark = false;
                    $rootScope.showToast('Subscription added successfully',null,'bottom');

                    angular.forEach($scope.entityidlist, function(value, key){
                        console.log('entity id is ['+ value.entityId + ']');
                        angular.forEach($scope.unsubscribedentitylist, function(valueobj, keyobj){
                            if(valueobj.entityId === value.entityId){
                                console.log('entityid values are equal');
                                $scope.unsubscribedentitylist.splice(keyobj, 1);
                            }
                        });
                    });

                }else{
                    $rootScope.showPopup({title:'Error', template:"Error resubscribing to selected entities, Please try again !!"},                  function(res){

                    });
                }
            }).catch(function(error){
                $rootScope.hideLoader();
                $rootScope.showPopup({title:'Error', template:"Error resubscribing to selected entities, Please try again !!"},                  function(res){

                });
            });
        }else{
            $rootScope.showPopup({title:'Error', template:"Please select atleast one entity for resubscription"}, function(res){

           });
        }
    };
}])
.controller('MyHealthCtrl', ['$scope', '$rootScope','$state', '$stateParams','$ionicModal','medicalprofileservice','$ionicPopup', 'DBA','registrationdetsdb','$ionicPopover','$ionicFilterBar',function($scope, $rootScope, $state, $stateParams, $ionicModal, medicalprofileservice,$ionicPopup, DBA, registrationdetsdb, $ionicPopover, $ionicFilterBar) {
$scope.openPopover = function($event) {
  $scope.$parent.openPopover($event);
};
$scope.closePopover = function() {
  $scope.$parent.closePopover();
};
  $scope.patientId = '';
  $scope.healthdetails = [];
  $scope.filterBarInstance;
  $scope.showFilterBar = function(){
      filterBarInstance = $ionicFilterBar.show({
        items:$scope.healthdetails,
        update:function(filteredItemList){
            $scope.healthdetails = filteredItemList;
        },
        expression:function(filterText, value, index, array){
            console.log('printing filterText value ['+ JSON.stringify(filterText.toString()) + ']');
            console.log('printing value ['+ JSON.stringify(value) + ']');
            var foundvalue = false;
            angular.forEach(value.medicalprofile, function(profiledata, key){
            if((typeof profiledata.profile[0].weight !== 'undefined'
                &&  profiledata.profile[0].weight.value !== ''
                && profiledata.profile[0].weight.value !== null
                && profiledata.profile[0].weight.value.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].bloodsugar !== 'undefined'
                  &&  typeof profiledata.profile[0].bloodsugar.fbs !== 'undefined'
                  &&  profiledata.profile[0].bloodsugar.fbs !== ''
                  && profiledata.profile[0].bloodsugar.fbs !== null
                  && profiledata.profile[0].bloodsugar.fbs.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].bloodsugar !== 'undefined'
                  &&  typeof profiledata.profile[0].bloodsugar.ppbs !== 'undefined'
                  &&  profiledata.profile[0].bloodsugar.ppbs !== ''
                  && profiledata.profile[0].bloodsugar.ppbs !== null
                  && profiledata.profile[0].bloodsugar.fbs.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].bloodsugar !== 'undefined'
                  &&  typeof profiledata.profile[0].bloodsugar.rbs !== 'undefined'
                  &&  profiledata.profile[0].bloodsugar.rbs !== ''
                  && profiledata.profile[0].bloodsugar.rbs !== null
                  && profiledata.profile[0].bloodsugar.rbs.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].medication !== 'undefined'
                  &&  profiledata.profile[0].medication.value !== ''
                  && profiledata.profile[0].medication.value !== null
                  && profiledata.profile[0].medication.value.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].allergies !== 'undefined'
                  &&  profiledata.profile[0].allergies.value !== ''
                  && profiledata.profile[0].allergies.value !== null
                  && profiledata.profile[0].allergies.value.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].vaccination !== 'undefined'
                  &&  profiledata.profile[0].vaccination.value !== ''
                  && profiledata.profile[0].vaccination.value !== null
                  && profiledata.profile[0].vaccination.value.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].bloodpressure !== 'undefined'
                  &&  profiledata.profile[0].bloodpressure.systolic !== ''
                  && profiledata.profile[0].bloodpressure.systolic !== null
                  && profiledata.profile[0].bloodpressure.systolic.toString().indexOf(filterText.toString()) !== -1)
              ||
              (typeof profiledata.profile[0].bloodpressure !== 'undefined'
                  &&  profiledata.profile[0].bloodpressure.diastolic !== ''
                  && profiledata.profile[0].bloodpressure.diastolic !== null
                  && profiledata.profile[0].bloodpressure.diastolic.toString().indexOf(filterText.toString()) !== -1)
              ){
                  foundvalue = true;
              }

            });
            return foundvalue;
        }
      });
  };


  $scope.data ={
       "weight" : {
          "value" : "",
          "notes" : ""
       },
       "bloodsugar" : {
         "rbs" : "",
         "ppbs": "",
         "fbs" : "",
         "notes" :""
       },
       "bloodpressure" :{
         "systolic" : "",
         "diastolic": ""
       },
       "medication" : {
         "value" : "",
         "notes" : ""
       },
       "allergies" : {
         "value" : "",
         "notes" : ""
       },
       "vaccination" : {
        "value" : "",
        "notes" : ""
       }
  };
  $scope.tracker = function(trackername, title){
      $scope.trackername = trackername;
      $scope.title = title;
  };
  $scope.tdate= new Date();
  //function to capture vitals as entered by the user
	$scope.create = function() {
      //check if the values are entered by user to proceed further to save the data
      if($scope.data.weight.value === ''
         && $scope.data.bloodsugar.fbs === ''
         && $scope.data.bloodsugar.ppbs === ''
         && $scope.data.bloodsugar.rbs === ''
         && $scope.data.bloodpressure.systolic === ''
         && $scope.data.bloodpressure.diastolic === ''
         && $scope.data.medication.value === ''
         && $scope.data.allergies.value === ''
         && $scope.data.vaccination.value === '')
      {
        $rootScope.showToast('There was no data entered to be saved','long','top');
        $scope.closeModal1();
      }else{
	     var details =[];
       $rootScope.showLoader();
       var medicalprofile = {
         "data": $scope.data,
         "createdat" : $scope.tdate
       };
       medicalprofileservice.savedetails($scope.patientId, medicalprofile).then(function(data){
             //console.log(data);
             if(data.status == 'SUCCESS'){
                $rootScope.hideLoader();
                $rootScope.showToast('Medical profile data saved successfully',null,'top');
			          console.log("Records saved successfully");
                medicalprofileservice.getdetails($scope.patientId).then(function(data){
                	if(data.status === 'SUCCESS'){
                    	console.log('data obtained['+ JSON.stringify(data) + ']');
                      $scope.healthdetails = data.data;
                      if(data.summary !== ''){
                        $scope.summary = data.summary;
                      }
                  }
              }).catch(function(error){
                  $rootScope.hideLoader();
                  console.log('pritning error reason ['+ JSON.stringify(error) + ']');
				      });
              $scope.closeModal1();
             }}).catch(function(error){
		   		$rootScope.hideLoader();
  		   			if(error.status === 404){
                console.log(" patientid passed is invalid");
          		}else if(error.status ===500){
                console.log("internal server processing error at server side");
  					  }
           });
      		$scope.data={
             "weight" : {
                "value" : "",
                "notes" : ""
             },
             "bloodsugar" : {
               "rbs" : "",
               "ppbs": "",
               "fbs" : "",
               "notes" :""
             },
             "bloodpressure" :{
               "systolic" : "",
               "diastolic": ""
             },
             "medication" : {
               "value" : "",
               "notes" : ""
             },
             "allergies" : {
               "value" : "",
               "notes" : ""
             },
             "vaccination" : {
                "value" : "",
                "notes" : ""
              }
          };
      }//$scope.timeLineForm.$setPristine();
	};
	$scope.closeModal1 = function() {
    	$scope.modal.hide();
  };
  $scope.$on("$ionicView.beforeLeave", function(event, data){
  });

  $scope.$on("$ionicView.enter", function(event, data){
    console.log('within $ionicView.afterEnter');
  });

  $scope.healthdetails = [];
  $scope.summary = {
     "weight" : {
        "value" : "",
        "notes" : ""
     },
     "bloodsugar" : {
       "rbs" : "",
       "ppbs": "",
       "fbs" : "",
       "notes" :""
     },
     "bloodpressure" :{
       "systolic" : "",
       "diastolic": ""
     },
     "medication" : {
       "value" : "",
       "notes" : ""
     },
     "allergies" : {
       "value" : "",
       "notes" : ""
     },
     "vaccination" : {
        "value" : "",
        "notes" : ""
     }
  };
  $scope.$on("$ionicView.loaded", function(event, data){
    $ionicModal.fromTemplateUrl('medicalprofile.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal1 = function(){
      $scope.modal.show();
    };
    $rootScope.showLoader();
    registrationdetsdb.query({}).then(function(response){
       var result = DBA.getById(response);
       //$scope.data.patientId = result.appregistrationid;
       $scope.patientId = result.appregistrationid;

       //Invoke retrieve medicalprofile service in order to display history data if any available
       medicalprofileservice.getdetails($scope.patientId).then(function(data){
               console.log("obtaining medical details" + data);
           //$scope.details=data;
         if(data.status === 'SUCCESS'){
           $rootScope.hideLoader();
           console.log('data obtained['+ JSON.stringify(data) + ']');
           $scope.healthdetails = data.data;
           if(data.summary !== ''){
            $scope.summary = data.summary;
           }
         }
       }).catch(function(error){
           $rootScope.hideLoader();
           var alertPopUp = $ionicPopup.alert({
               title:"There is no medical history available currently"
           });
       });
    }).catch(function(error){
      $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){
      console.log('on ok click');
      });
    });
  });
}])
.controller('FeedbackCtrl', ['$scope', '$state', '$ionicPopup', '$ionicSlideBoxDelegate', 'feedbackform', function($scope, $state, $ionicPopup, $ionicSlideBoxDelegate, feedbackform){

	$scope.temp = [];
	//feedback questions
	$scope.questions=[{question: "How was the service at the hospital reception?",answer: ''},
		{question: "The care and attention of the staff(nurses and doctors)",answer: ''},
		{question : "The ease of obtaining the records and lab-reports",answer: ''},
		{question: "Trackmyhealth app , has it been helpful?",answer: ''},
		{question: "Is the app easy to use?",answer: ''}];

	//ratings for feedback
	$scope.ratingsObject = {
        iconOn : 'ion-ios-star',
        iconOff : 'ion-ios-star-outline',
        iconOnColor: 'rgb(200, 200, 100)',
        iconOffColor:  'rgb(200, 100, 100)',
		rating: '',
        minRating: 0 ,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
			return rating;
        }
      };

	// ratings callback function , obtains the current slide and updates the object answer
      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
		$scope.i= $ionicSlideBoxDelegate.currentIndex();
		console.log($scope.i);
		$ionicSlideBoxDelegate.next();
		$scope.questions[$scope.i].answer = rating;
		console.log($scope.questions);
		 if($scope.i === 4){
		 $scope.closepopup()
		 }
	  };

    $scope.slideHasChanged = function(index){
        console.log('printing index value ['+ index + ']');
    }
	//popup to show feedback
	$scope.showPopup = function() {

   // An elaborate, custom popup
  	 var myPopup = $ionicPopup.show({
		 template: '<ion-slide-box show-pager="false" on-slide-changed="slideHasChanged($index)"><ion-slide ng-repeat="quest in questions"><h4>{{quest.question}}</h4><br><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ><br/></i></ion-slide></ion-slide-box>',
		 title: 'Feedback',
		 scope: $scope
	 })
	  //popup close
	 $scope.closepopup = function(){
		  console.log("closing popup");
		  myPopup.close();
	 }
	};


	}])

.controller('NotificationsCtrl', ['$scope', '$rootScope', 'notificationservice','$stateParams', '$ionicPopup','$cordovaDialogs','$cordovaClipboard', 'DBA', '$ionicHistory', '$timeout','$ionicFilterBar','$ionicModal',function($scope, $rootScope, notificationservice, $stateParams, $ionicPopup, $cordovaDialogs, $cordovaClipboard, DBA, $ionicHistory,$timeout,$ionicFilterBar, $ionicModal){

    $scope.shouldShowReorder = false;
    $scope.shouldShowDelete  = false;
    $scope.listCanSwipe = true;
    $scope.notificationlist = [];
    $scope.entityname = '';
    $scope.listisntempty = true;
    $scope.filterBarInstance;
    $scope.isSelected=false;
    $scope.notificationidselected = '';


	$scope.selectedNotifications={};
	$scope.selectMsgForCopyDelete=function(notification,$event){
        if(angular.element($event.target).parent().parent().hasClass('selected-section') ){
            //remove text from selection list
            delete $scope.selectedNotifications[notification._id];
        }else{
            //add text to selection list
            $scope.selectedNotifications[notification._id]=notification;
        }
         if( Object.keys($scope.selectedNotifications).length > 0){
             $scope.listisntempty = false;
         }else{
             $scope.listisntempty = true;
         }
        angular.element($event.target).parent().parent().toggleClass("selected-section");
    }

	$scope.copyContentToClipboard=function(){

        var copyText="";
        for( _id in $scope.selectedNotifications){
            copyText += $scope.selectedNotifications[_id].notificationText +"\n";
        }

        //console.info( "Text to be copied to clipboard \n" + copyText);
        $cordovaClipboard.copy(copyText).
        then(function(){
           $scope.selectedNotifications={};
           $rootScope.showToast('Copied to clipboard',null,'bottom');
        }, function(error){
            console.log('error message['+ error + ']');
            $scope.selectedNotifications={};
            $rootScope.showToast("Message couldn't be copied to clipboard",null,'bottom');
        });
    }


	$scope.confirmNotificationDeletion=function() {

        if( Object.keys($scope.selectedNotifications).length <= 0){
            console.log("Nothing selected to delete...!!!");
            $rootScope.showToast('Nothing selected!',null,'bottom');
            return;
        }

         var confirmPopup = $ionicPopup.confirm({
           title:'',
           template: 'Are you sure you want to delete selected messages?',
             cssClass:'delete-msg-confirm-popup',
             okText: 'DELETE',
             cancelText:'CANCEL'
           //templateUrl: 'templates/confirmationPopup.html'

         });
         confirmPopup.then(function(res) {
           if(res) {
             $scope.deleteSelectedNotifications(false);
             console.log('You are sure');
           } else {
             console.log('You are not sure');
           }
         });
	};

    $scope.confirmAllMsgDelete=function() {
        if( Object.keys($scope.notificationlist).length <= 0){
            //console.log("Nothing selected to delete...!!!");
            $rootScope.showToast('There are no messages to delete!','long','top');
            return;
        }
        var confirmPopup = $ionicPopup.confirm({
           title:'',
           template: 'Are you sure you want to delete all the messages?',
             cssClass:'delete-msg-confirm-popup',
             okText: 'DELETE',
             cancelText:'CANCEL'
           //templateUrl: 'templates/confirmationPopup.html'

         });
         confirmPopup.then(function(res) {
           if(res) {
             $scope.deleteSelectedNotifications(true);
             console.log('You are sure');
           } else {
             console.log('You are not sure');
           }
         });
    };



    $scope.deleteSelectedNotifications=function(all){
         var listtobedeleted = [];
         $scope.selectedNotifications = {};
         //modify here to delte one by one or multiple messages
         if(all){
            angular.forEach($scope.notificationlist, function(value, key){
                this.push({_id:value._id});
                $scope.selectedNotifications[value._id] = value;
            }, listtobedeleted);
         }else{
            for( notid in $scope.selectedNotifications){
                //delete($scope.selectedNotifications[_id]);
                listtobedeleted.push({_id:notid});
            }
         }
         $scope.deleteMultipleNotifications(listtobedeleted);
    }

    $scope.deleteallnotifications = {
        checked:false
    }

   $rootScope.showLoader();

   notificationservice.getNotifications($stateParams.mobilenumber, $stateParams.entityid, null).then(function(data)     {
        console.log('Response obtained while loading notifications window ['+ JSON.stringify(data) + ']');
        console.log('printing $scope.shouldShowDelete -->['+ $scope.shouldShowDelete + ']');
        if(data.status === 'SUCCESS'){
            $scope.shouldShowDelete = false;
            $rootScope.hideLoader();
            $scope.entityname = data.entityName;
            angular.forEach(data.msgDetails, function(value, key) {
                value.tobedeleted = {
                    checked:false
                };
                this.push(value);
            }, $scope.notificationlist);

            //$scope.notificationlist = data.msgDetails;
            //console.log('printing notification list after adding to be deleted field ['+ JSON.stringify($scope.notificationlist) + ']');
            if($scope.notificationlist.length === 0){
                $scope.listisntempty = false;
                $rootScope.showPopup({title:'Information',template:"There are no notifications to display!"}, function(res){
                    $ionicHistory.goBack();
                });
            }
        }else{
           $rootScope.hideLoader();

           $rootScope.showPopup({title:'Notifications',template:"Error retrieving notifications, Please try again!"}, function(res){
             console.log('on click ok');
            });
            $scope.listisntempty = false;
        }

    }).catch(function(error){
        console.log('Error encounterd while calling getNotifications ['+ error + ']');
        $rootScope.hideLoader();
        if(error.status != 401 && error.status != 419){ // only when not-authenticated error is encountered
            $rootScope.showPopup({title:'Notifications',template:"Error retrieving notifications, Please try again!"}, function(res){
                 console.log('on click ok');
               });
         }

    });
 $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope
      ,animation: 'slide-in'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      //console.log('Modal is shown!');
    });

     $scope.showImage = function(index) {
        $scope.openModal();
    }
	/*
	$scope.notificationlist=[
        {"_id":"56dd53d33aa6e00b1002f8c6",
         "createdAt":"2016-03-07T15:40:33.000Z",
         "notificationText":" bnotified message testing. kindly ignore this message.\r\nRegards\r\nTrinity Motors."}
        ,{"_id":"56dd481a4a413901106975ec",
          "createdAt":"2016-03-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only1. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975ed",
          "createdAt":"2016-03-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only2. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975e2",
          "createdAt":"2016-02-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only3. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975ef",
          "createdAt":"2016-02-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only4. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975ec",
          "createdAt":"2016-02-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only5. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975eg",
          "createdAt":"2016-01-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only6. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975eh",
          "createdAt":"2016-01-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only7. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975ei",
          "createdAt":"2015-12-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only8. \r\nRegards\r\nTrinity Motors."}
         ,{"_id":"56dd481a4a413901106975ej",
          "createdAt":"2015-11-07T14:51:47.000Z",
          "notificationText":" Dear Customer,\r\nwelcome to bnotified app. these messages are trial and testing purpose only9. \r\nRegards\r\nTrinity Motors."}
    ];
	*/
    $scope.showFilterBar = function(){

            filterBarInstance = $ionicFilterBar.show({
            items:$scope.notificationlist,
            update:function(filteredItemList){
                $scope.notificationlist = filteredItemList;
            },
            expression:function(filterText, value, index, array){
                return value.notificationText.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
            }
            //filterProperties:'entityName'
            });
        //console.log('filterBarInstance -->['+filterBarInstance + ']');
    };

    $scope.backButtonAction = function(){
        $scope.shouldShowDelete = false;
        $ionicHistory.goBack();
    };

    $scope.delete = function(notification){
        console.log('delete item from list ['+ JSON.stringify(notification) + ']');

        $cordovaDialogs.confirm('This message will be deleted', 'Delete', ['OK', 'Cancel']).
        then(function(buttonindex){
            $rootScope.showLoader();
            if(buttonindex === 1){ // on click of ok
                notificationservice.deleteNotification($stateParams.mobilenumber,$stateParams.entityid, notification._id)
                .then(function(data){
                    $rootScope.hideLoader();
                    if(data.status === 'SUCCESS'){
                        angular.forEach($scope.notificationlist, function(notificationobj, key){
                            console.log('notificationobj is ['+ JSON.stringify(notificationobj) + '] and key is ['+ key +']');
                           if( notificationobj._id === notification._id){
                                $scope.notificationlist.splice(key, 1);
                           }
                        });
                        $rootScope.showToast('Message deleted succesfully',null,'bottom');
                    }else{
                        /*var alertPopup = $ionicPopup.alert({
                        title: 'Error Deleting Notification',
                        template: 'There is something wrong, please try again !!'
                        });
                        alertPopup.then(function(res) {
                            console.log('Thank you for not eating my delicious ice cream cone');
                        });*/
                        $rootScope.showPopup({title:'Notifications',template:"Error deleting notification, Please try again!"}, function(res){
                     console.log('on click ok');
                        });
                    }
                }).catch(function(error){
                     $rootScope.hideLoader();
        /*                var alertPopup = $ionicPopup.alert({
                        title: 'Notifications',
                        template: 'Error deleting notification, Please try again!'
                        });
                        alertPopup.then(function(res) {
                            console.log('Thank you for not eating my delicious ice cream cone');
                        });*/
                     if(error.status != 401 && error.status != 419){ // only when not-authenticated error is encountered
                        $rootScope.showPopup({title:'Notifications',template:"Error deleting notification, Please try again!"}, function(res){
                     console.log('on click ok');
                        });
                     }
                });
            }else{
                $rootScope.hideLoader();
            }
        });

    }

    $scope.deleteMultipleNotifications = function(notificationstobedeleted){
        console.log('List to be deleted is ['+ JSON.stringify(notificationstobedeleted) + ']');
        //$cordovaDialogs.confirm('Selected messages will be deleted', 'Delete', ['OK', 'Cancel']).
        //then(function(buttonindex){
            //if(buttonindex === 1){
                $rootScope.showLoader();
                notificationservice.deleteMultipleNotification($stateParams.mobilenumber,$stateParams.entityid, notificationstobedeleted).then(function(data){
                    $rootScope.hideLoader();
                    if(data.status === 'SUCCESS'){
                        $scope.shouldShowDelete = false;
                        console.log(' selected for delete are [' + JSON.stringify($scope.selectedNotifications) + ']');
                        /*angular.forEach($scope.notificationlist, function(notificationobj, key){
                            console.log('notificationobj is ['+ JSON.stringify(notificationobj) + '] and key is ['+ key +']');
                            console.log('$scope.selectedNotifications[notificationobj._id]'+ $scope.selectedNotifications[notificationobj._id]);
                           if($scope.selectedNotifications[notificationobj._id] !== undefined){
                                console.log('isselected');
                                $scope.notificationlist.splice(key, 1);
                           }
                        });*/
                        var newList = [];
                        for(notificationobj in $scope.notificationlist){
                            if($scope.selectedNotifications[$scope.notificationlist[notificationobj]._id] === undefined){
                                console.log('$scope.selectedNotifications[notificationobj._id]'+ $scope.selectedNotifications[notificationobj._id]);
                                newList.push($scope.notificationlist[notificationobj]);
                                //keys.push(notificationobj);
                                //delete $scope.notificationlist[notificationobj];
                            }
                        }
                        $scope.notificationlist = newList;
                        //$scope.listisntempty = true;
                        $scope.selectedNotifications={};
                        $rootScope.showToast('Messages deleted succesfully',null,'bottom');

                        //also please ensure there is no delete option displayed in case there are no messages left in list
                        if($scope.notificationlist.length === 0){
                            $scope.listisntempty = true;
                        }
                    }else{
                        $rootScope.showPopup({title:'Notifications',template:"Error deleting notifications, Please try again!"}, function(res){
                     console.log('on click ok');
                        });
                    }

                }).catch(function(error){
                    $rootScope.hideLoader();
                    if(error.status != 401 && error.status != 419){ // only when not-authenticated error is encountered
                                $rootScope.showPopup({title:'Notifications',template:"Error deleting notifications, Please try again!"}, function(res){
                             console.log('on click ok');
                                });
                    }
                });
            //}
        //});
    }
    $scope.reloadNotifications = function(){
        //$rootScope.showLoader();
        $scope.notificationlist = [];
        notificationservice.getNotifications($stateParams.mobilenumber, $stateParams.entityid, null).then(function(data) {
        $scope.$broadcast('scroll.refreshComplete');
        if(data.status === 'SUCCESS'){
            //$rootScope.hideLoader();
            $scope.entityname = data.entityName;
            //$scope.notificationlist = data.msgDetails;
            angular.forEach(data.msgDetails, function(value, key) {
                value.tobedeleted = {
                    checked:false
                };
                this.push(value);
            }, $scope.notificationlist);
            //$scope.notificationlist = data.msgDetails;
            console.log('printing notification list after adding to be deleted field ['+ JSON.stringify($scope.notificationlist) + ']');
            if($scope.notificationlist.length === 0){
                $scope.listisntempty = false;
            }
        }else{
           /*var alertPopup = $ionicPopup.alert({
             title: 'Error Retrieving Notifications',
             template: 'There is something wrong, please try again !!'
           });
           alertPopup.then(function(res) {
             console.log('Thank you for not eating my delicious ice cream cone');
           });*/
           //$rootScope.hideLoader();
           $rootScope.showPopup({title:'Notifications',template:"Error retrieving notifications, Please try again!"}, function(res){
             console.log('on click ok');
           });
            if($scope.notificationlist.length === 0){
                $scope.listisntempty = false;
            }
        }

    }).catch(function(error){
        console.log('Error encounterd while calling getNotifications ['+ error + ']');
        $scope.$broadcast('scroll.refreshComplete');
         /*var alertPopup = $ionicPopup.alert({
             title: 'Error Retrieving Notifications',
             template: 'There is something wrong, please try again !!'
           });
           alertPopup.then(function(res) {
             console.log('Thank you for not eating my delicious ice cream cone');
           });*/
        //$rootScope.hideLoader();
        if(error.status != 401 && error.status != 419){ // only when not-authenticated error is encountered
            $rootScope.showPopup({title:'Notifications',template:"Error retrieving notifications, Please try again!"},           function(res){
                console.log('on click ok');
            });
        }
    });

    }

    $scope.bookmark=function(notification,$event){
        angular.element($event.target).removeClass("ion-android-star ion-android-star-outline");

        if( notification.bookmarked ){
            angular.element($event.target).toggleClass("ion-android-star-outline");
            notification.bookmarked=false;
        }else{
            angular.element($event.target).toggleClass("ion-android-star");
            notification.bookmarked=true;
        }
        $rootScope.showLoader();
        notificationservice.messageBookmark($stateParams.mobilenumber, {
            "entityid" : $stateParams.entityid,
            "bookmarked" : notification.bookmarked,
            "notificationid" : notification._id
        }).then(function(data){
            $rootScope.hideLoader();
            if(data.status === 'SUCCESS'){
                $rootScope.showToast('Bookmarked successfully','short','top');
            }else{
                $rootScope.showToast("Couldn't bookmark the message",'short','top');
            }
        }).catch(function(error){
            $rootScope.hideLoader();
            $rootScope.showToast("Couldn't bookmark the message",'short','top');
        });
    }
}])
.controller('InboxOfAllMsgCtrl', ['$scope', '$rootScope','$stateParams', '$ionicPopup', '$state', '$ionicFilterBar','hospitalservice', 'visitservice', '$ionicModal', 'DBA','registrationdetsdb','$cordovaInAppBrowser','$ionicPopover', function($scope, $rootScope, $stateParams, $ionicPopup, $state, $ionicFilterBar, hospitalservice,  visitservice, $ionicModal, DBA, registrationdetsdb, $cordovaInAppBrowser, $ionicPopover){

  $ionicModal.fromTemplateUrl('filterpatientdetails.html',{
         scope: $scope,
         animation: 'slide-in-up'
     }).then(function(modal){
         $scope.filtermodal = modal;
     });
     $scope.openModalfilter = function(){
         $scope.filtermodal.show();
     }
     $scope.closeModalfilter = function(){
         $scope.filtermodal.hide();
     }
      $scope.filterapply=function(visit){
         if($scope.filterdata.filterpatientdetails.firstname === 'Bennet' &&
            $scope.filterdata.filterpatientdetails.lastname === 'Mendis' &&
            $scope.filterdata.filtervisitdetails.visittype === 'inpatient' &&
            $scope.filterdata.filterhospitaldetails.hospitalname === 'P.D Hinduja Sindhi Hospital'
           )
           {
               //filtered data to be displayed
                 console.log("inbox filter");
           }
     }
     //Filters applied
     $scope.appliedfilters = {
       "patientnameselected" : ""
       ,"visittypeselected"  : ""
       ,"hospitalnameselected" : ""
       ,"docswithattachment" : false
     };
     $scope.filtersavailable = {
       "patientnames"   : []
       ,"visittypes"    : []
       ,"hospitalnames" : []
     };
     $scope.filterdetails = function(visitid){
              angular.forEach($scope.visitinfo, function(visitdata, key){
                //below logic is to identify unique names in the list
                if($scope.filtersavailable.patientnames.length === 0){
                  $scope.filtersavailable.patientnames.push((visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname).toLowerCase());
                }else{
                  var namefound = false;
                  angular.forEach($scope.filtersavailable.patientnames, function(value, key){
                     if(value === (visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname).toLowerCase() ){
                        namefound = true;
                     }
                  });
                  if(!namefound){
                     $scope.filtersavailable.patientnames.push((visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname).toLowerCase());
                  }
                }
                //below logic is to identify unique visittypes in the list
                if($scope.filtersavailable.visittypes.length === 0){
                  $scope.filtersavailable.visittypes.push(visitdata.visitid.visittype.toLowerCase());
                }else{
                  var typefound = false;
                  angular.forEach($scope.filtersavailable.visittypes, function(value, key){
                     if(value === visitdata.visitid.visittype.toLowerCase() ){
                        typefound = true;
                     }
                  });
                  if(!typefound){
                     $scope.filtersavailable.visittypes.push(visitdata.visitid.visittype.toLowerCase());
                  }
                }
              });
              $scope.filterdata = {
               "filterpatientdetails" : "",
               "filterhospitaldetails" : "",
               "filtervisitdetails" : ""
             };
              console.log('printing visitid ['+ visitid + ']');
             angular.forEach($scope.visitinfo, function(value, key){
               console.log('value is ['+ JSON.stringify(value.filterpatientdetails));
               if(value._id === visitid){

                   console.log('values are equal');
                   $scope.filterdata.filterpatientdetails = value.patientregprofiles;
               }
           });
            angular.forEach($scope.visitinfo, function(value, key){
               console.log('value is ['+ JSON.stringify(value.filterpatientdetails));
               if(value._id === visitid){
                   console.log('values are equal');
                   $scope.filterdata.filterhospitaldetails = value.hospitalid;
               }
           });
             angular.forEach($scope.visitinfo, function(value, key){
               console.log('value is ['+ JSON.stringify(value.filterpatientdetails));
               if(value._id === visitid){
                   console.log('values are equal');
                   $scope.filterdata.filtervisitdetails = value.visitid;
               }
           });
             console.log('$scope.filterdata['+ $scope.filterdata + ']');
             $scope.openModalfilter();
       }




    //hospital info modal
$scope.myActiveSlide = 0;
	$ionicModal.fromTemplateUrl('hospitalinfo.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
	$scope.openhospitalinfo = function() {
    	$scope.modal.show();
    }
	$scope.closehospitalinfo = function() {
    	$scope.modal.hide();
	}
  $scope.openPopover = function($event) {
    console.log('printing openPopOver Withinin InboxOfAllMsgCtrl');
    $scope.$parent.openPopover($event);
  };
  $scope.closePopover = function() {
    console.log('printing closePopover Withinin InboxOfAllMsgCtrl');
    $scope.$parent.closePopover();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    //$scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
$scope.shouldShowReorder = false;
    $scope.shouldShowDelete  = false;
    $scope.listCanSwipe = true;
    $scope.filterBarInstance;
    $scope.patientId = '';
	//$scope.patientId = "5751377e4f09030255c59a8b";
  $scope.notinfo =[];
  $scope.visitinfo=[];
registrationdetsdb.query({}).then(function(response){
      var result = DBA.getById(response);
      $scope.patientId = result.appregistrationid;
      console.log('$stateparams hospital id -->['+ $stateParams.hospitalid + ']');
      if($stateParams.hospitalid === '123'){
      visitservice.getVisits($scope.patientId).then(function(data){
             console.log("obtaining visit info" + JSON.stringify(data) );
             $scope.visitinfo = data.data;
             //Obtain unique patient names, hospital names, visit types available

          }).catch(function(error){
              var popupalert = $ionicPopup.alert({
                  title: "Error",
                  template: "Sorry unable to obatin your visit information"
              }).then(function(res){
                  console.log("error received");
              })
          });
      }else{
          visitservice.getvisitdets($scope.patientId, $stateParams.hospitalid).then(function(data){
              console.log("obtaining visit info" + data );
              $scope.visitinfo = data.data;
              console.log($scope.visitinfo);
          }).catch(function(error){
              var popupalert = $ionicPopup.alert({
                  title: "Error",
                  template: "Sorry unable to obatin your visit information"
              }).then(function(res){
                  console.log("error received");
              });
          });
      }

  }).catch(function(err){
        $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){
        console.log('on ok click');
        });
  });
	//$scope.visitdets = function(){

    $scope.notifications = function(visitid){
visitservice.savevisitinfo($scope.patientId, visitid).then(function(data){
            console.log("notifications list obtained" + data);
			$scope.notinfo = data.data;
			console.log($scope.notinfo);
            $scope.openModal5();
            console.log(visitid);
		}).catch(function(error){
        var popupalert = $ionicPopup.alert({
            title: "Error",
            template: "Sorry unable to obatin your notification"
        }).then(function(res){
            console.log("error received");
        })
    });

	}
$ionicModal.fromTemplateUrl('my-modal5.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal5 = modal;
  	});
	$scope.openModal5 = function() {
    	$scope.modal5.show();
    }
	$scope.closeModal5 = function() {
    	$scope.modal5.hide();
	}

  $scope.patientdetails = function(visitid){
      $scope.visitdata = {
          "patientdetails" : "",
           "hospitaldetails" : "",
          "visitdetails" : ""
      };
      console.log('printing visitid ['+ visitid + ']');

      console.log('printing length ['+ JSON.stringify($scope.visitinfo) + ']');

    angular.forEach($scope.visitinfo, function(value, key){
          console.log('value is ['+ JSON.stringify(value.patientdetails));
          if(value._id === visitid){
              console.log('values are equal');
              $scope.visitdata.patientdetails = value.patientregprofiles;
          }
      });
       angular.forEach($scope.visitinfo, function(value, key){
          console.log('value is ['+ JSON.stringify(value.patientdetails));
          if(value._id === visitid){
              console.log('values are equal');
              $scope.visitdata.hospitaldetails = value.hospitalid;
          }
      });
      angular.forEach($scope.visitinfo, function(value, key){
          console.log('value is ['+ JSON.stringify(value.patientdetails));
          if(value._id === visitid){
              console.log('values are equal');
              $scope.visitdata.visitdetails = value.visitid;
          }
      });
      console.log('$scope.visitdata['+ $scope.visitdata + ']');
      $scope.openModal3();
  }
    /* $scope.hospitaldetails = function(visitid){
        $scope.visitdata = {
            "hospitaldetails" : ""
        };
        console.log('printing visitid ['+ visitid + ']');

        console.log('printing length ['+ JSON.stringify($scope.visitinfo) + ']');

        angular.forEach($scope.visitinfo, function(value, key){
            console.log('value is ['+ JSON.stringify(value.patientdetails));
            if(value._id === visitid){
                console.log('values are equal');
                $scope.visitdata.hospitaldetails = value.hospitalid;
            }
        });
        console.log('$scope.visitdata['+ $scope.visitdata + ']');
        $scope.openModal4();
    }

    $scope.visitdetails = function(visitid){
        $scope.visitdata = {
            "visitdetails" : ""
        };
        console.log('printing visitid ['+ visitid + ']');

        console.log('printing length ['+ JSON.stringify($scope.visitinfo) + ']');

        angular.forEach($scope.visitinfo, function(value, key){
            console.log('value is ['+ JSON.stringify(value.patientdetails));
            if(value._id === visitid){
                console.log('values are equal');
                $scope.visitdata.visitdetails = value;
            }
        });
        console.log('$scope.visitdata['+ $scope.visitdata + ']');
        $scope.openModal6();

    }*/

   $ionicModal.fromTemplateUrl('patientdetails.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal = modal;
  	});
	$scope.openModal3 = function() {
    	$scope.modal.show();
    }
	$scope.closeModal3 = function() {
    	$scope.modal.hide();
	}

    /*$ionicModal.fromTemplateUrl('hospitaldetails.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modalhospitaldets = modal;
  	});
	$scope.openModal4 = function() {
    	$scope.modalhospitaldets.show();
    }
	$scope.closeModal4 = function() {
    	$scope.modalhospitaldets.hide();
	}


 $ionicModal.fromTemplateUrl('visitdetails.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modalvisitdets = modal;
  	});
	$scope.openModal6 = function() {
    	$scope.modalvisitdets.show();
  }
	$scope.closeModal6 = function() {
    	$scope.modalvisitdets.hide();
	}*/
  $scope.downloaddocument = function(url){
   console.log('printing url ['+ url +']');
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

   //document.addEventListener(function () {
    $cordovaInAppBrowser.open(encodeURI(url), '_system', options)
      .then(function(event) {
        console.log('i m open');
      }).catch(function(event) {
        console.log('error opening');
      });

    //}, false);
  }
  $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
      console.log('load started');
  });


  $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
      console.log('load error');
  });

  $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
      console.log('load exit');
  });
 $scope.showFilterBar = function(){

          filterBarInstance = $ionicFilterBar.show({
            items:$scope.visitinfo,
            update:function(filteredItemList){
                $scope.visitinfo = filteredItemList;
            },
            expression:function(filterText, value, index, array){
                return ( value.notificationtext.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                        || value.visitid.visittype.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                        || value.hospitalid.hospitalname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                        || value.patientregprofiles.firstname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                        || value.patientregprofiles.lastname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                      )
            }
          });
    };
}])
.controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$state', '$stateParams','authservice','initiateotpgeneratesvc', 'securityquestions', function($scope, $rootScope, $state, $stateParams, authservice, initiateotpgeneratesvc, securityquestions){
    $scope.enableotp = false;
    $scope.buttonname = 'CONTINUE';
    $scope.securityquesdata = {
        securityquestions : securityquestions,
        selectedquestion  : '',
        answer   :'',
        securitypin : '',
        otppin : ''
    }

    $scope.resetpasscodebtn = function(){
        $scope.errordescription = '';
        $rootScope.showLoader();
        if($scope.enableotp){
            initiateotpgeneratesvc.validateOtp($stateParams.mobilenumber, $scope.securityquesdata.otppin).then(function(data){

                if(data.status === 'SUCCESS'){
                    authservice.updatePassword({mobileNumber:$stateParams.mobilenumber, bnotifiedpin:$scope.securityquesdata.securitypin}).then(function(data){
                        $rootScope.hideLoader();
                        if(data.status === 'SUCCESS'){
                            $rootScope.showPopup({title:'Forgot Password', template:"Password Changed Successfully"}, function(res){
                                $state.go('login');
                              });
                        }else{
                            $rootScope.showPopup({title:'Forgot Password', template:"Couldn't update the password, Please try again!"}, function(res){
                            console.log('on ok click');
                            });
                        }
                    }).catch(function(error){
                        $rootScope.hideLoader();
                        $rootScope.showPopup({title:'Forgot Password', template:"Couldn't update the password, Please try again!"}, function(res){
                            console.log('on ok click');
                        });
                    });
                }else{
                    $rootScope.hideLoader();
                    $rootScope.showPopup({title:'OTP Validation', template:"OTP validation failed, Please re-check OTP!"}, function(res){

                    });
                }
            }).catch(function(error){
                 $rootScope.hideLoader();
                $rootScope.showPopup({title:'OTP Validation', template:"OTP validation failed, Please re-check OTP!"}, function(res){

                    });
            });
        }else{
            var securitydetails = {
                mobileNumber : $stateParams.mobilenumber,
                securityquestion : $scope.securityquesdata.selectedquestion._id,
                securityanswer : $scope.securityquesdata.answer
            }
            console.log('SecurityDetails as payload is ['+ JSON.stringify(securitydetails) + ']');
            authservice.validateSecurityDetails(securitydetails).then(function(data){
                $rootScope.hideLoader();
                if(data.status === 'SUCCESS'){
                    initiateotpgeneratesvc.generateOtp($stateParams.mobilenumber).then(function(data){
                        if(data.status === 'SUCCESS'){
                            $scope.enableotp = true;
                            $scope.buttonname = 'RESET PASSWORD';
                        }else{
                            $rootScope.showPopup({title:'Error', template:"Couldn't generate OTP, Please retry again!"}, function(res){
                            console.log('on ok click');
                            });
                        }
                    }).catch(function(error){
                        console.log('error encountered during validating security details ['+ error + ']');
                        $rootScope.showPopup({title:'Error', template:"Couldn't generate OTP, Please retry again!"}, function(res){
                            console.log('on ok click');
                        });
                    });
                }else{
                    console.log('error encountered during validating security details');
                        $rootScope.showPopup({title:'Error', template:'Invalid Security Details, Please recheck the same!'}, function(res){
                            console.log('on ok click');
                        });
                }
            }).catch(function(error){
                $rootScope.hideLoader();
                 console.log('error encountered during validating security details ['+ error + ']');
                        $rootScope.showPopup({title:'Error', template:'Invalid Security Details, Please recheck the same!'}, function(res){
                            console.log('on ok click');
                        });
            });
        }
    }
}])

.controller('LogoutCtrl', ['$scope','$rootScope','$state','$ionicHistory','registrationdetsdb',function($scope, $rootScope, $state, $ionicHistory, registrationdetsdb){
    //deleting the jsonwebtoken as there is a logout request by the user..
    $rootScope.showLoader();
    registrationdetsdb.updateJWTWithoutMobileNo({jsonwebtoken:null}).then(function(response){
        $rootScope.hideLoader();
        $scope.closePopover();
        $state.go('login',{}, {reload: true});
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicHistory.clearCache();
        $rootScope.showToast('Logout completed successfully', null, 'bottom');
    }).catch(function(error){
        $rootScope.hideLoader();
        $scope.closePopover();
        $rootScope.showToast('Logout failed, Please try again later !!', null, 'bottom');
    });
}])
.controller('PatientprofileCtrl',['$scope','$rootScope','$state','ionicDatePicker','$filter','patientprflservice','$ionicHistory','DBA','registrationdetsdb', function($scope,$rootScope,$state,ionicDatePicker,$filter, patientprflservice,$ionicHistory, DBA, registrationdetsdb){
  $scope.patientId = '';
  $scope.patientprofiledata = {
    "firstname"        : "",
    "lastname"         : "",
    "emailid"          : "",
    "mobilenumber"     : "",
    "gender"           : "",
    "alternateemailid" : "",
    "alternatemobilenum" : "",
    "dataofbirth" : "",
    "licenseno"   : "",
    "doctor"    : "",
    "address"     : ""
  };
  $scope.originalresponse = '';

	$scope.backButtonAction = function(){
     $scope.shouldShowDelete = false;
     $ionicHistory.goBack();
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    registrationdetsdb.query({}).then(function(response){
        //alternateemailid alternatemobilenum doctorlicenseno
        var result = DBA.getById(response);
        $scope.patientId = result.appregistrationid;
        patientprflservice.getpatientinfo($scope.patientId).then(function(data){
             $scope.originalresponse = data.data;
             $scope.patientprofiledata = {
                "firstname" : data.data.firstname,
                "lastname"  : data.data.lastname,
                "emailid"   : data.data.emailid,
                "mobilenumber" : data.data.mobilenumber,
                "gender"    : data.data.gender,
                "address"   : typeof data.data.address !== 'undefined' ?  data.data.address.addressline1 : "",
                "doctor"    : data.data.isdoctor,
                "alternateemailid" : data.data.alternateemailid,
                "alternatemobilenum" : data.data.alternatemobilenum,
                "licenseno"  : data.data.doctorlicenseno,
                "dateofbirth" : data.data.dateofbirth
              }
          }).catch(function(error){
              $rootScope.hideLoader();
              $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){
                //console.log('on ok click');
              });
          });
    }).catch(function(err){
          $rootScope.hideLoader();
          $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){
            console.log('on ok click');
          });
    });
  });
	// DatePicker object with callbcak to obtain the date
	var ipObj1 = {
      callback: function (val) {  //Mandatory
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
		      $scope.patientprofiledata.dateofbirth = $filter('date')(val, "dd MMM yyyy");
      },
      from: new Date(1910 , 1, 1), //Optional
      //to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
//      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup',       //Optional
      dateFormat  : 'MMM dd, yyyy'
    };
    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
    $scope.save = function(){
        $rootScope.showLoader();
         if($scope.originalresponse.alternateemailid !== $scope.patientprofiledata.alternateemailid
            || $scope.originalresponse.alternatemobilenum !== $scope.patientprofiledata.alternatemobilenum
            || $scope.originalresponse.isdoctor.toString() !== $scope.patientprofiledata.doctor.toString()
            || $scope.originalresponse.doctorlicenseno !== $scope.patientprofiledata.licenseno
            || $scope.originalresponse.dateofbirth !== $scope.patientprofiledata.dateofbirth){
           $scope.patientprofiledata.doctorlicenseno = !$scope.patientprofiledata.doctor ? "" : $scope.patientprofiledata.doctorlicenseno;
           patientprflservice.changedpatientinfo($scope.patientprofiledata,
              $scope.patientId).then(function(data){
                $rootScope.hideLoader();
              $rootScope.showToast('Profile updated successfully','Long','top');
           }).catch(function(error){
               $rootScope.hideLoader();
               $rootScope.showPopup({'title':'Error','template':"Couldn't update the profile, please try again"}, function(){

               });
           });
         }else{
            $rootScope.hideLoader();
            console.log('You have not updated anything in your profile');
            $rootScope.showToast('You have not updated anything in your profile','Long','top');
        }
     }
}])
.controller('DoctortabCtrl', ['$scope','$rootScope','$stateParams', '$ionicPopup','$ionicModal','$state','doctortabservice','DBA','registrationdetsdb','$cordovaInAppBrowser','$ionicFilterBar',function($scope ,$rootScope,$stateParams, $ionicPopup,$ionicModal,$state,doctortabservice,DBA, registrationdetsdb,$cordovaInAppBrowser, $ionicFilterBar){
     $scope.drvisitinfo=[];
     $scope.notinfo=[];

     $scope.filterBarInstance;
     $scope.showFilterBar = function(){

         filterBarInstance = $ionicFilterBar.show({
           items:$scope.drvisitinfo,
           update:function(filteredItemList){
               $scope.drvisitinfo = filteredItemList;
           },
           expression:function(filterText, value, index, array){
               return ( value.notificationtext.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                       || value.hospitalid.hospitalname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                       || value.notificationdate.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                       || value.hospitalid.hospitaltelnumber.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                                             )
           }
         });
     };
    registrationdetsdb.query({}).then(function(response){
      var result = DBA.getById(response);
       $scope.doctorid =  result.appregistrationid;
        console.log('$stateparams hospital id -->['+ $scope.doctorid + ']');
     doctortabservice.getdctdets($scope.doctorid).then(function(data){

             console.log("obtaining doctornotification info" + JSON.stringify(data) );

             $scope.drvisitinfo = data.data;
              console.log($scope.drvisitinfo);

                     }).catch(function(error){
              var popupalert = $ionicPopup.alert({
                  title: "Error",
                  template: "Sorry unable to obatin your visit information"
              }).then(function(res){
                  console.log("error received");
              })
          });

  }).catch(function(err){
        $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){
        console.log('on ok click');
        });
  });


  $scope.downloaddocument = function(url){
   console.log('printing url ['+ url +']');
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };


    $cordovaInAppBrowser.open(encodeURI(url), '_system', options)
      .then(function(event) {
        console.log('i m open');
      }).catch(function(event) {
        console.log('error opening');
      });

  }

    $scope.notification = function(patientid, visitid){
doctortabservice.fetchvisit($scope.doctorid,patientid,visitid).then(function(data){
            console.log("notifications list obtained" + data);
			$scope.notinfo = data.data;
			console.log($scope.notinfo);
            $scope.openModal5();
            console.log(visitid);
		}).catch(function(error){
        var popupalert = $ionicPopup.alert({
            title: "Error",
            template: "Sorry unable to obatin your notification"
        }).then(function(res){
            console.log("error received");
        })
    });
    }

    $ionicModal.fromTemplateUrl('mynotification.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
  	}).then(function(modal) {
    	$scope.modal5 = modal;
  	});
	$scope.openModal5 = function() {
    	$scope.modal5.show();
    }
	$scope.closeModal5 = function() {
    	$scope.modal5.hide();
	}
}])
.controller('ImagesProfileCtrl', ['$scope','$rootScope','$stateParams','$ionicModal','$state','DBA','$ionicFilterBar','imagesservicedb','$ionicHistory',function($scope ,$rootScope,$stateParams,$ionicModal,$state,DBA,$ionicFilterBar, imagesservicedb, $ionicHistory){
  /*$scope.imagesarray = [{
    'imgnativeurl':'../img/icon.png',
    'imgtag' : 'test'
  },{
    'imgnativeurl':'../img/icon.png',
    'imgtag' : 'test'
  },{
    'imgnativeurl':'../img/icon.png',
    'imgtag' : 'test'
  }];*/
  $ionicModal.fromTemplateUrl('imageslist.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.imageslist = modal;
  });
  $scope.openImagesModal = function(index) {
    	$scope.activeSlide = index;
      $scope.imageslist.show();
  }
  $scope.closeImagesModal = function() {
      $scope.imageslist.hide();
  }

  $scope.$on("$ionicView.enter", function(event, data){
    $scope.imagesarray = [];
    console.log('within $ionicView.afterEnter');
    imagesservicedb.query().then(function(response){
        //$rootScope.showPopup({'title':'message','template':"Response object as json ["+ JSON.stringify(response) + "]"});
        var result = DBA.getAll(response);
        //$rootScope.showPopup({'title':'message','template':"result object as json ["+ JSON.stringify(result) + "]"});
        if(result !== null && result.length > 0){
          angular.forEach(result, function(value, key){
              $scope.imagesarray.push({
                "imgtag":value.imgtag,
                "imgdescription" : value.imgdescription,
                "imgnativeurl" : value.imgnativeurl,
                "capturedate"  : value.capturedate
              });
          });
        }else{
          console.log('no images have been saved by the user');
          $rootScope.showToast("No images available","long","top");
        }
    }).catch(function(error){
        $rootScope.showToast("Couldn't display images for you","long","top");
    });
  });

   $scope.backButtonAction = function(){
       $scope.shouldShowDelete = false;
       $ionicHistory.goBack();
    };
    var filterBarInstance;
    $scope.showFilterBar = function(){

            filterBarInstance = $ionicFilterBar.show({
              items:$scope.imagesarray,
              update:function(filteredItemList){
                  $scope.imagesarray = filteredItemList;
              },
              expression:function(filterText, value, index, array){
                  return ( value.imgtag.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                          || value.capturedate.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                          || value.imgdescription.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                                               )
              }
            });
      };

}]);
