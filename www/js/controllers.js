angular.module('bnotifiedappctrls', [])
.controller('AppCtrl', ['$rootScope', '$scope','$state','$ionicPopup','$ionicLoading','$cordovaToast','AUTH_EVENTS','$ionicHistory','registrationdetsdb','$ionicPopover','$cordovaCamera','$ionicModal','$cordovaFile','$ionicActionSheet','$cordovaFileTransfer','imagesservicedb', function($rootScope, $scope, $state, $ionicPopup, $ionicLoading, $cordovaToast, AUTH_EVENTS,$ionicHistory, registrationdetsdb, $ionicPopover, $cordovaCamera, $ionicModal, $cordovaFile, $ionicActionSheet,$cordovaFileTransfer,imagesservicedb) {
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
        var alertPopup = $ionicPopup.alert( alertconfig);
        alertPopup.then(onokfunction);
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

  $scope.backButtonAction = function(){
        $ionicHistory.goBack();
  };

  $rootScope.messagesdata = {
     badgeCount: ''
  }

  $scope.popover = $ionicPopover.fromTemplate('<ion-popover-view style=" top: 45px; left: 190px;  margin-left: 10px;    opacity: 1;    height: 43%;    width:40%;"><ion-content><div class="list" ><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/about">About</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/patientprfl" >User Profile</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/patientimages" >Uploaded Images</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" ng-click="showPopup()">Rate the app</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" ng-click="showConfirm()" >Logout</a></div></ion-content></ion-popover-view>',{
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
  $scope.selectImageSource = function(){
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from Gallery' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.takeImage(index);
      }
    });
  }

  $scope.takeImage = function(type){
    $scope.hideSheet();
    $scope.source;
    if(type === 0){
      $scope.source = Camera.PictureSourceType.CAMERA;
    }
    if(type === 1){
      $scope.source = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    }
    $scope.data = {
      "filename" : "",
      "tag" : "",
      "description" : ""
    };
    var options = {
         quality: 100,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: $scope.source,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         //targetWidth: 250,
         //targetHeight: 250,
         mediaType: Camera.MediaType.PICTURE,
         saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      /*
      if($scope.source === 2){
          window.resolveLocalFileSystemURL(imageData, function(fileentry){
            $scope.srcImage = fileentry.toURL();
            $scope.data.filename = fileentry.fullPath.substr(fileentry.fullPath.lastIndexOf('/') + 1);
            $scope.data.tag = fileentry.toURL();
            $scope.openDocModal();
          }, function(){
            $rootScope.showToast("Error while capturing image","long","top");
          });
      }
      else{ */
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
        /*
  			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
  				fileEntry.copyTo(
  					fileSystem2,
  					newName,
  					onCopySuccess,
  					fail
  				);
  			},
  			fail); */
        /* window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            console.log('fileSystem object ['+ JSON.stringify(fileSystem) + ']');
        }); */

          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "Pictures", function(dir) {
             dir.getDirectory("TracMyHealth",{create:true, exclusive:false}, function(direntry){
               fileEntry.copyTo(
                 direntry,
                 newName,
                 onCopySuccess,
                 function(err) {
                    $rootScope.showToast("Copy to TracMyHealth directory failed","long","top");
                 }
               );
             }, fail);
          },fail);
  		//}
     }
  		// 6
  		function onCopySuccess(entry) {
  			$scope.$apply(function () {
          $scope.srcImage = entry.nativeURL;
          $scope.data.filename = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);
  			});
        cordova.plugins.MediaScannerPlugin.scanFile(entry.nativeURL, function(){
          //$rootScope.showToast("Mediascannerplugin scan was successful","long","top");
        }, function(err){
          /*$rootScope.showPopup({
            "title":"error",
            "template":"Error while scanning the media path["+ entry.nativeURL + "] and error ["+ err + "]"
          });*/
          $rootScope.showToast("Error displaying the captured photo, please try again","long","top");
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


  $scope.showConfirm = function() {

  var confirmPopup = $ionicPopup.confirm({

     title: 'Logout ?',

     template: 'Are you sure you want to Logout?',

  });

  confirmPopup.then(function(res) {

     if (res) {
 $rootScope.showLoader();


   registrationdetsdb.updateJWTWithoutMobileNo({jsonwebtoken:null}).then(function(response){
       $rootScope.hideLoader();
       $scope.closePopover();
       $state.go('login');
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
        console.log('You clicked on "OK" button');

     } else {

        console.log('You clicked on "Cancel" button');

     }

  });
};

}])
.controller('LoginCtrl', ['$scope','$rootScope','internetservice', 'registrationservice','authservice','$state','$ionicPopup','$stateParams','forgotpwdservice' , '$ionicModal', 'loginservice','signupservice','registrationdetsdb','DBA', function($scope, $rootScope, internetservice, registrationservice, authservice, $state, $ionicPopup, $stateParams, forgotpwdservice, $ionicModal, loginservice, signupservice, registrationdetsdb, DBA) {
$scope.$on("$ionicView.beforeEnter",function(event, data){
  $scope.logindata=[];
	$scope.forgot=[];
});
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
              //registrationdetsdb.query({}).then(function(response){
                  //var result = DBA.getById(response);
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
        // Set the default value of inputType
  $scope.inputType = 'password';

  // Hide & show password function
  $scope.hideShowPassword = function(){
    if ($scope.inputType == 'password')
      $scope.inputType = 'text';
    else
      $scope.inputType = 'password';
  };
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
.controller('EntitiesCtrl', ['$scope','$rootScope','$stateParams','$state', 'hospitalservice', '$ionicPopup','$cordovaDialogs','$ionicFilterBar', '$ionicModal', '$ionicSlideBoxDelegate','DBA','registrationdetsdb','$ionicPopover',function($scope, $rootScope, $stateParams, $state, hospitalservice, $ionicPopup, $cordovaDialogs, $ionicFilterBar, $ionicModal, $ionicSlideBoxDelegate, DBA, registrationdetsdb, $ionicPopover){

  $ionicModal.fromTemplateUrl('filterHospitaldetails.html',{
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

     $scope.filterResetAll = function(){
       $scope.appliedfilters.hospitalnameselected="All";
       $scope.hospitalslist=angular.copy($scope.backuphosvisitinfo);
       $scope.openModalfilter();
     }


     $scope.filterapply = function(){
           var filteredkey=0;
           var allHospitals=false;

           console.log($scope.appliedfilters);
           if(($scope.hospitalslist.length != 0) || ($scope.backuphosvisitinfo != undefined)){
              if(angular.equals($scope.appliedfilters.hospitalnameselected,"All"))
                  allHospitals=true;


              if(allHospitals==true)
              {
                if($scope.backuphosvisitinfo != undefined)
                {
                  //No need to apply filter all to be displayed
                  $scope.hospitalslist=angular.copy($scope.backuphosvisitinfo);
                }
                //If no backupdrvisitinfo leave visitinfo as is.
              }
              else{
                //fillter need to be applied
                if($scope.backuphosvisitinfo == undefined){
                  //this if condition may never arise may need to be deleted
                  $scope.backuphosvisitinfo = angular.copy($scope.hospitalslist);
                }
                else{
                  $scope.hospitalslist=angular.copy($scope.backuphosvisitinfo);
                }

                angular.forEach($scope.hospitalslist,function (visitdata,key){
                  if((allHospitals == true) || angular.equals($scope.appliedfilters.hospitalnameselected,visitdata.hospitalname))
                    {
                        console.log("filter call");
                        console.log('   ',visitdata.hospitalname);
                        $scope.hospitalslist[filteredkey]=visitdata;
                        filteredkey++;
                  }//end of if
                  else{
                       console.log("Not filtered");
                       console.log(visitdata.hospitalname);
                  }
                })//end of forEach
                $scope.hospitalslist.length=filteredkey;
              }//end of else
            }
            else{
              //No data to filter show error msg
              //no need to open modal
              $rootScope.showPopup({title:'Error', template:"No data to filter"});
            }
            $scope.closeModalfilter();
      }//end of filterapply

     //Filters applied
     $scope.appliedfilters = {
       "hospitalnameselected" : "All"

     };
     $scope.filtersavailable = {
       "hospitalnames" : []
     };


     $scope.filterdetails = function(visitid){
         if(($scope.backuphosvisitinfo != undefined) || (($scope.hospitalslist != undefined ) && ($scope.hospitalslist.length != 0 ))){
           if($scope.backuphosvisitinfo == undefined)
               $scope.backuphosvisitinfo=angular.copy($scope.hospitalslist);

           angular.forEach($scope.backuphosvisitinfo, function(visitdata, key1){
              if($scope.filtersavailable.hospitalnames.length === 0){
                  $scope.filtersavailable.hospitalnames.push("All");
                  $scope.filtersavailable.hospitalnames.push(visitdata.hospitalname);
                  console.log("Available Hospitals:");
                  console.log('      ',"All, ",visitdata.hospitalname);
              }else{
                  var namefound = false;
                  angular.forEach($scope.filtersavailable.hospitalnames, function(value, key2){
                     if(angular.equals(value, visitdata.hospitalname)){
                        namefound = true;
                     }
                  });
                  if(!namefound){
                     $scope.filtersavailable.hospitalnames.push(visitdata.hospitalname);
                     console.log('     ',visitdata.hospitalname);
                  }
                }
            });
            $scope.openModalfilter();
          }
          else{
              //No data to filter show error msg
              //no need to open modal
              $rootScope.showPopup({title:'Error', template:"No data to filter"});

          }
     }//end of filterdetails

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

}])

.controller('MyHealthCtrl', ['$scope', '$rootScope','$state', '$stateParams','$ionicModal','medicalprofileservice','$ionicPopup', 'DBA','registrationdetsdb','$ionicPopover','$ionicFilterBar',function($scope, $rootScope, $state, $stateParams, $ionicModal, medicalprofileservice,$ionicPopup, DBA, registrationdetsdb, $ionicPopover, $ionicFilterBar) {

  $ionicModal.fromTemplateUrl('filterhealthtabdetails.html',{
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

       $scope.filtersavailable = {
           "vitals" : ["All","Blood Sugar","Blood Pressure","Weight","Vaccination","Medication","Allergies"]
         };


         $scope.appliedfilters = {
           "vitals" : "All"
         };


        $scope.filterdetails = function(visitid){

             if(($scope.backupHealthdetails != undefined) || (($scope.healthdetails != undefined ) && ($scope.healthdetails.length != 0 ))){
               if($scope.backupHealthdetails == undefined)
                   $scope.backupHealthdetails=angular.copy($scope.healthdetails);
                $scope.openModalfilter();
              }
              else{
                  //No data to filter show error msg
                  //no need to open modal
                  $rootScope.showPopup({title:'Error', template:"No data to filter"});

              }
         }//end of filterdetails*/

         $scope.filterapply = function(){
         console.log($scope.appliedfilters);
  $scope.closeModalfilter();
          }//end of filterapply
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

.controller('termsCtrl',['$scope','$state','$ionicHistory', function($scope, $state, $ionicHistory){
      $scope.backButtonAction = function(){
     $scope.shouldShowDelete = false;
     $ionicHistory.goBack();
  };


}])
.controller('aboutCtrl',['$scope', '$ionicHistory',function($scope,$ionicHistory){
      $scope.backButtonAction = function(){
     $scope.shouldShowDelete = false;
     $ionicHistory.goBack();
  };
}])
.controller('InboxOfAllMsgCtrl', ['$scope', '$rootScope','$stateParams', '$ionicPopup', '$state', '$ionicFilterBar','hospitalservice', 'visitservice', '$ionicModal', 'DBA','registrationdetsdb','$cordovaInAppBrowser','$ionicPopover','$ionicSlideBoxDelegate', 'socket','loginservice','$cordovaFile','$cordovaFileOpener2','$http',function($scope, $rootScope, $stateParams, $ionicPopup, $state, $ionicFilterBar, hospitalservice,  visitservice, $ionicModal, DBA, registrationdetsdb, $cordovaInAppBrowser, $ionicPopover,$ionicSlideBoxDelegate, socket, loginservice, $cordovaFile, $cordovaFileOpener2, $http){

$rootScope.showLoader();
$ionicModal.fromTemplateUrl('filterPatientDetails.html',{
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

   $scope.appliedfilters = {
     "patientnameselected" : "All"
     ,"visittypeselected"  : "All"
     ,"hospitalnameselected" : "All"
     ,"docswithattachment" : false
   };


   $scope.filterResetAll = function(){
     $scope.appliedfilters.patientnameselected="All";
     $scope.appliedfilters.visittypeselected="All";
     $scope.appliedfilters.hospitalnameselected="All";
     $scope.appliedfilters.docswithattachment=false;
     $scope.visitinfo=angular.copy($scope.backupvisitinfo);
     $scope.openModalfilter();
   }


   $scope.filterapply = function(){
         var filteredkey=0;
         var allPatients=false, allHospitals=false, allVisittypes=false, docswithattachment=true;

         //console.log($scope.appliedfilters);
         if(($scope.visitinfo.length != 0) || ($scope.backupvisitinfo != undefined)){

            if(angular.equals($scope.appliedfilters.patientnameselected,"All"))
                allPatients=true;
            if(angular.equals($scope.appliedfilters.hospitalnameselected,"All"))
                allHospitals=true;
            if(angular.equals($scope.appliedfilters.visittypeselected,"All"))
                allVisittypes=true;
            if(angular.equals($scope.appliedfilters.docswithattachment,false))
                docswithattachment=false;

            if((allPatients==true) && (allHospitals==true) && (allVisittypes==true) && (docswithattachment==false))
            {
              if($scope.backupvisitinfo != undefined)
              {
                //No need to apply filter
                $scope.visitinfo=angular.copy($scope.backupvisitinfo);
              }
              //If no backupvisitinfo leave visitinfo as is.
            }
            else{
              //fillter need to be applied
              if($scope.backupvisitinfo == undefined){
                //this check may not be needed any more, to be removed after checking
                $scope.backupvisitinfo = angular.copy($scope.visitinfo);
              }
              else{
                $scope.visitinfo=angular.copy($scope.backupvisitinfo);
              }

              angular.forEach($scope.visitinfo,function (visitdata,key){
                if((( allPatients == true) || angular.equals($scope.appliedfilters.patientnameselected,(visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname)))
                    && ((allHospitals == true) || angular.equals($scope.appliedfilters.hospitalnameselected,visitdata.hospitalid.hospitalname))
                    && ((allVisittypes == true) || angular.equals($scope.appliedfilters.visittypeselected,visitdata.visitid.visittype))
                    && (( docswithattachment == false) || (visitdata.reporturl !== undefined))){
                      console.log("filter call");
                      console.log('   ',visitdata.patientregprofiles.firstname,visitdata.patientregprofiles.lastname,',',visitdata.visitid.visittype,',',visitdata.hospitalid.hospitalname,',',visitdata.reporturl);
                      $scope.visitinfo[filteredkey]=visitdata;
                      filteredkey++;
                }//end of if
                else{
                     console.log("Not filtered");
                     console.log(visitdata.patientregprofiles.firstname,visitdata.patientregprofiles.lastname,',',visitdata.visitid.visittype,',',visitdata.hospitalid.hospitalname,',',visitdata.reporturl);
                }
              })//end of forEach
              $scope.visitinfo.length=filteredkey;
            }//end of else
          }//visitinfo =0 or backupvisitinfo=undefined
          else{
            //No data to filter show error msg
            //no need to open modal
            $rootScope.showPopup({title:'Error', template:"No data to filter"});
          }


            $scope.closeModalfilter();
          }//end of filterapply


   $scope.filtersavailable = {
     "patientnames"   : []
     ,"visittypes"    : []
     ,"hospitalnames" : []
   };


   $scope.filterdetails = function(visitid){
      //There is no data no need to show filter
     if(($scope.backupvisitinfo != undefined) || (($scope.visitinfo != undefined) && ($scope.visitinfo.length != 0))){
          if($scope.backupvisitinfo == undefined)
          {
              $scope.backupvisitinfo=angular.copy($scope.visitinfo);
          }
          angular.forEach($scope.backupvisitinfo, function(visitdata, key1){
              //Fill patientnames
              if($scope.filtersavailable.patientnames.length === 0){
                $scope.filtersavailable.patientnames.push("All");
                $scope.filtersavailable.patientnames.push(visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname);
              }else{
                var namefound = false;
                angular.forEach($scope.filtersavailable.patientnames, function(value, key2){
                  if(angular.equals(value,(visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname))){
                      namefound = true;
                  }
                });
                if(!namefound){
                    $scope.filtersavailable.patientnames.push(visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname);
                  }
              }

              //Fill visittypes
              if($scope.filtersavailable.visittypes.length === 0){
                $scope.filtersavailable.visittypes.push("All");
                $scope.filtersavailable.visittypes.push(visitdata.visitid.visittype);
              }else{
                var typefound = false;
                angular.forEach($scope.filtersavailable.visittypes, function(value, key2){
                  if(angular.equals(value,visitdata.visitid.visittype)){
                      typefound = true;
                  }
                });
                if(!typefound){
                   $scope.filtersavailable.visittypes.push(visitdata.visitid.visittype);
                 }
              }

            //Fill hospitalnames
            if($scope.filtersavailable.hospitalnames.length === 0)
            {
                $scope.filtersavailable.hospitalnames.push("All");
                $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                console.log('Hospital names');
                console.log('      ',"All",visitdata.hospitalid.hospitalname);
            }else
            {
                var namefound = false;
                angular.forEach($scope.filtersavailable.hospitalnames, function(value, key2){
                    if(angular.equals(value,visitdata.hospitalid.hospitalname)){
                        namefound = true;
                    }
                });
                if(!namefound){
                    $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                    console.log('      ',visitdata.hospitalid.hospitalname);
                }
            }
        });
        //display filter modal
        $scope.openModalfilter();
      }
      else{
        //No data to filter show error msg
        //no need to open modal
        $rootScope.showPopup({title:'Error', template:"No data to filter"});
      }
    }//end of filterdetails


    //hospital info modal
$scope.myActiveSlide = 0;

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
            $rootScope.hideLoader();
             $scope.visitinfo = data.data;
             $scope.copyofvisitinfo = data.data;
             //Obtain unique patient names, hospital names, visit types available

          }).catch(function(error){
              $rootScope.hideLoader();
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
              $rootScope.hideLoader();
              $scope.visitinfo = data.data;
              console.log($scope.visitinfo);
          }).catch(function(error){
              $rootScope.hideLoader();
              var popupalert = $ionicPopup.alert({
                  title: "Error",
                  template: "Sorry unable to obatin your visit information"
              }).then(function(res){
                  console.log("error received");
              });
          });
      }

  }).catch(function(err){
        $rootScope.hideLoader();
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

  $ionicModal.fromTemplateUrl('pdf-viewer.html', {
        scope: $scope,
        animation: 'slide-in-up'
  }).then(function (modal) {
        $scope.pdfviewermodal = modal;
  });
  var profiledata = loginservice.getProfileData();
  if(socket !== null){
    socket.on('connect', function(){
      console.log('socket connected successfully');
      socket.emit('appregistrationid', $scope.patientId);
    });
    socket.on('documentrecieved', function(data){
           //console.log('printing data object recieved ['+ data + ']');
           var datarecieved = JSON.parse(data);
           console.log('printing parsed data recieved ['+ data + ']');
           var uint8array = base64ToUint8Array(datarecieved.data);
           var blob = new Blob([uint8array],{type:'application/pdf'});
           //below 2 lines are working code commented for testing...
           $scope.pdfUrl = URL.createObjectURL(blob);
           $scope.pdfviewermodal.show();
           console.log('blob length ['+ blob.length + ']');
           window.resolveLocalFileSystemURL("file:///storage/emulated/0/", function(dir) {

              dir.getDir("TracMyHealth",{create:true}, function(direntry){
                var filename = "labreport_"+(new Date()).getTime()+".pdf";
                direntry.getFile(filename, {create:true}, function(file) {
                  console.log("File created succesfully.");
                  file.createWriter(function(fileWriter) {
                      console.log("Writing content to file");
                      fileWriter.write(blob);
                      $rootScope.showToast("Report has also been downloaded to your device",'long','center');
                  }, function(err){
                      $rootScope.showToast("Couldn't downloaded the report, please try again with error ["+ JSON.stringify(err) +"]",'long','center');
                  });
                });
              });
           });

    });
  }
  function base64ToUint8Array(base64) {
    var raw = atob(base64);
    var uint8Array = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }
  $scope.downloaddocument = function(url){
    var data = {
      "id" : "id",
      "documentname":"name"
    };
    socket.emit('documentrequest',data);
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
		$scope.i= $ionicSlideBoxDelegate.$getByHandle('feedbackdata').currentIndex();
       console.log($scope.i);
		$ionicSlideBoxDelegate.$getByHandle('feedbackdata').next();
         console.log($scope.i);

		$scope.questions[$scope.i].answer = rating;
		console.log($scope.questions);
		 if($scope.i === 4){
		 $scope.closepopup()
		 }
	  };


	//popup to show feedback
	$scope.showMyPopup = function() {

   // An elaborate, custom popup
  	 var myPopup = $ionicPopup.show({
		 template: '<ion-slide-box show-pager="false" delegate-handle="feedbackdata" ><ion-slide ng-repeat="quest in questions"><h4>{{quest.question}}</h4><br><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ><br/></i><button class="button button-full button-assertive"  ng-click="closepopup()">Not now!</button></ion-slide></ion-slide-box>',
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
        $state.go('login');
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

.controller('DoctortabCtrl', ['$scope','$rootScope','$stateParams', '$ionicPopup','$ionicModal','$state','doctortabservice','DBA','registrationdetsdb','$cordovaInAppBrowser','$ionicFilterBar','$ionicSlideBoxDelegate',function($scope ,$rootScope,$stateParams, $ionicPopup,$ionicModal,$state,doctortabservice,DBA, registrationdetsdb,$cordovaInAppBrowser, $ionicFilterBar,$ionicSlideBoxDelegate){
  $ionicModal.fromTemplateUrl('filterDoctortabdetails.html',{
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

       $scope.filterResetAll = function(){
         $scope.appliedfilters.hospitalnameselected="All";
         $scope.appliedfilters.docswithattachment=false;
         $scope.drvisitinfo=angular.copy($scope.backupdrvisitinfo);
         $scope.openModalfilter();
       }


       $scope.filterapply = function(){
             var filteredkey=0;
             var allHospitals=false, docswithattachment=true;

             console.log($scope.appliedfilters);
             if(($scope.drvisitinfo.length != 0) || ($scope.backupdrvisitinfo != undefined)){
                if(angular.equals($scope.appliedfilters.hospitalnameselected,"All"))
                    allHospitals=true;
                if(angular.equals($scope.appliedfilters.docswithattachment,false))
                    docswithattachment=false;

                if((allHospitals==true) && (docswithattachment==false))
                {
                  if($scope.backupdrvisitinfo != undefined)
                  {
                    //No need to apply filter all to be displayed
                    $scope.drvisitinfo=angular.copy($scope.backupdrvisitinfo);
                  }
                  //If no backupdrvisitinfo leave visitinfo as is.
                }
                else{
                  //fillter need to be applied
                  if($scope.backupdrvisitinfo == undefined){
                    //this if condition may never arise may need to be deleted
                    $scope.backupdrvisitinfo = angular.copy($scope.drvisitinfo);
                  }
                  else{
                    $scope.drvisitinfo=angular.copy($scope.backupdrvisitinfo);
                  }

                  angular.forEach($scope.drvisitinfo,function (visitdata,key){
                    if(((allHospitals == true) || angular.equals($scope.appliedfilters.hospitalnameselected,visitdata.hospitalid.hospitalname))
                      && (( docswithattachment == false) || (visitdata.reporturl !== undefined))){
                          console.log("filter call");
                          console.log('   ',visitdata.hospitalid.hospitalname,',',visitdata.reporturl);
                          $scope.drvisitinfo[filteredkey]=visitdata;
                          filteredkey++;
                    }//end of if
                    else{
                         console.log("Not filtered");
                         console.log(visitdata.hospitalid.hospitalname,',',visitdata.reporturl);
                    }
                  })//end of forEach
                  $scope.drvisitinfo.length=filteredkey;
                }//end of else
              }
              else{
                //No data to filter show error msg
                //no need to open modal
                $rootScope.showPopup({title:'Error', template:"No data to filter"});
              }
              $scope.closeModalfilter();
        }//end of filterapply

       //Filters applied
       $scope.appliedfilters = {
         "hospitalnameselected" : "All"
         ,"docswithattachment" : false
       };
       $scope.filtersavailable = {
         "hospitalnames" : []
       };


       $scope.filterdetails = function(visitid){
           if(($scope.backupdrvisitinfo != undefined) || (($scope.drvisitinfo != undefined ) && ($scope.drvisitinfo.length != 0 ))){
             if($scope.backupdrvisitinfo == undefined)
                 $scope.backupdrvisitinfo=angular.copy($scope.drvisitinfo);

             angular.forEach($scope.backupdrvisitinfo, function(visitdata, key1){
                if($scope.filtersavailable.hospitalnames.length === 0){
                    $scope.filtersavailable.hospitalnames.push("All");
                    $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                    console.log("Available Hospitals:");
                    console.log('      ',"All, ",visitdata.hospitalid.hospitalname);
                }else{
                    var namefound = false;
                    angular.forEach($scope.filtersavailable.hospitalnames, function(value, key2){
                       if(angular.equals(value, visitdata.hospitalid.hospitalname)){
                          namefound = true;
                       }
                    });
                    if(!namefound){
                       $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                       console.log('     ',visitdata.hospitalid.hospitalname);
                    }
                  }
              });
              $scope.openModalfilter();
            }
            else{
                //No data to filter show error msg
                //no need to open modal
                $rootScope.showPopup({title:'Error', template:"No data to filter"});

            }
       }//end of filterdetails


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
	$scope.showMyPopup = function() {

   // An elaborate, custom popup
  	 var myPopup = $ionicPopup.show({
		 template: '<ion-slide-box show-pager="false" ><ion-slide ng-repeat="quest in questions"><h4>{{quest.question}}</h4><br><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ><br/></i><button class="button button-full button-assertive"  ng-click="closepopup()">Not now!</button></ion-slide></ion-slide-box>',
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
.controller('ImagesProfileCtrl', ['$scope','$rootScope','$stateParams','$ionicModal','$state','DBA','$ionicFilterBar','imagesservicedb','$ionicHistory',function($scope ,$rootScope,$stateParams,$ionicModal,$state,DBA,$ionicFilterBar, imagesservicedb, $ionicHistory){

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
