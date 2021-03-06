angular.module('tracmyhealthappctrls', [])
.controller('AppCtrl', ['$rootScope', '$scope','$state','$ionicSideMenuDelegate','$ionicPopup','$ionicLoading','$cordovaToast','AUTH_EVENTS','$ionicHistory','registrationdetsdb','$ionicPopover','$cordovaCamera','$ionicModal','$cordovaFile','$ionicActionSheet','$cordovaFileTransfer','imagesservicedb','ionicDatePicker','$filter','patientprflservice','DBA' ,'$cordovaCalendar', function($rootScope, $scope, $state,$ionicSideMenuDelegate,$ionicPopup, $ionicLoading, $cordovaToast, AUTH_EVENTS,$ionicHistory, registrationdetsdb, $ionicPopover, $cordovaCamera, $ionicModal, $cordovaFile, $ionicActionSheet,$cordovaFileTransfer,imagesservicedb,ionicDatePicker,$filter, patientprflservice, DBA, $cordovaCalendar) {

  // profile camera function
    $scope.urlForImage = function(imageName) {
      var trueOrigin = cordova.file.dataDirectory + imageName;
      return trueOrigin;
    };
    if(!$scope.croppedimage)
    {

      $scope.croppedimage=  '/img/default.jpg';

    };

    $scope.selectImages = function(){
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take a photo ' },
        { text: 'Add photo from Gallery ' },
        { text: 'Remove photo'}
      ],
      titleText: 'Add Profile Photo',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.takeImages(index);
      }
    });
  };
  $scope.takeImages = function(type){
    $scope.hideSheet();
    $scope.source;
    $scope.RemovePhoto;
    if(type === 0){
      $scope.source = Camera.PictureSourceType.CAMERA;
    }
    if(type === 1){
      $scope.source = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    }

    if(type ===2){

      $scope.RemovePhoto=function() {


      var confirmPopup = $ionicPopup.confirm({
         title: 'remove photo',
         template: 'Are you sure?'
      });

      confirmPopup.then(function(res) {
         if(res) {
            $scope.RemovePhoto1=(function(){
              $scope.croppedimage="img/default.jpg";
              $rootScope.showToast("profile photo removed successfully","long","top");
              $state.go('patientprfl');
              })();
            // scope.RemovePhoto1();

         } else {
            console.log('Not sure!');
         }
      });

   }
      // $scope.RemovePhoto=function(){
      //   $scope.croppedimage="img/default.jpg";
      //   $rootScope.showToast("profile photo removed successfully","long","top");
      //   $state.go('patientprofile');
      //
      // }
    $scope.RemovePhoto();
    }
$state.go('patientprfl');
    $scope.data = {
      "filename" : "",
      "tag" : "",
      "description" : ""
    };

    var  options = {
         quality: 60,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: $scope.source,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         mediaType: Camera.MediaType.PICTURE,
         targetWidth: 800,
         targetHeight: 600,
        popoverOptions: CameraPopoverOptions,
         saveToPhotoAlbum: false,
        //  correctOrientation: true
    };

if(type!=2)
{
    $cordovaCamera.getPicture(options).then(function(imageData) {

      onImageSuccess1(imageData);

      function onImageSuccess1(fileURI) {
        createFileEntry1(fileURI);
      }
      function createFileEntry1(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile1, fail);

      }
      function copyFile1(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;
       /* window.resolveLocalFileSystemURL("file:///storage/emulated/0/", function(dir) {*/
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
          fs.root.getDirectory("TracMyHealth",{create:true, exclusive:false}, function(direntry){
             fileEntry.copyTo(
               direntry,
               newName,
               onCopySuccess1,
               function(err) {
                  $rootScope.showToast("Copy to TracMyHealth directory failed","long","top");
               }
             );
           }, fail);
        },fail);
      }

      function onCopySuccess1(entry) {

          // crop function read

          $scope.myImage1='';
          $scope.myCroppedImage1='';

         entry.file(gotFile, fail);
         function gotFile(file){
             readDataUrl(file);
         }
         function readDataUrl(file) {
           var reader = new FileReader();
           reader.onloadend = function(evt) {
               $scope['srcImage1']=entry.nativeURL;

           };
           reader.readAsDataURL(file);
         }
         function fail(evt) {
           console.log(evt.target.error.code);
         }

         //crop end

        $scope.$apply(function () {
          $scope.srcImage1 = entry.nativeURL;
          $scope.data.filename = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);
        });
        $cordovaCamera.cleanup().then(function(){
        },function(error){
        });
        cordova.plugins.MediaScannerPlugin.scanFile(entry.nativeURL, function(){
          //$rootScope.showToast("Mediascannerplugin scan was successful","long","top");
        }, function(err){
          $rootScope.showToast("Couldn't complete the action due to "+err+", please try again","long","top");
        });
       $scope.openDocModal1();

      }
      function fail(err) {
        $rootScope.showToast("Couldn't complete the action due to "+err+", please try again","long","top");
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
      $rootScope.showToast("Couldn't complete the action due to "+err+", please try again","long","top");
    });
  }
  };


  $scope.saveCapturedImage1 = function(){

    $cordovaFile.writeFile(cordova.file.dataDirectory, "croppedimage", "base64", true)
     .then(function (success) {
       //successful
       $scope.fileName = cordova.file.dataDirectory + croppedimage;
     }, function (error) {
         $rootScope.showToast('image captured successfully','Long','top');
     });
     $scope.closeDocModal1();
}

  $ionicModal.fromTemplateUrl('crop.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal1) {
      $scope.documentmodal1 = modal1;
  });
  $scope.openDocModal1 = function() {
      $scope.profilepicupdated = false;
      $scope.documentmodal1.show();
  }
  $scope.closeDocModal1 = function() {
    $scope.profilepicupdated = true;

      $scope.documentmodal1.hide();
  }
  $scope.cancel= function() {
    resultimage=$scope.previmg;
    	$scope.documentmodal1.hide();

	}

$scope.updateProfilePic=function(){

    $scope.closeDocModal();
  // });
}
$scope.onimagecrop = function(resultimage){
   if(!$scope.profilepicupdated)
   $scope.croppedimage = resultimage;
   $scope.previmg=$scope.croppedimage;
};
 /*Alarm notification*/
    $scope.event = {
       summary : '',
       location:'',
       description :''
 };
  $scope.createEvent = function(event){
    // Add to calendar interactively (vs silently):
    $cordovaCalendar.createEventInteractively({
      title: event.summary,
      location: event.location,
      notes: event.description,
     // startDate: startsAt,
     // endDate: endsAt
      startDate: new Date(2017, 0, 15, 18, 30, 0, 0, 0),
            endDate: new Date(2015, 1, 17, 12, 0, 0, 0, 0)

    }).then(function (result) {
       console.log("Event created successfully");
    }, function (err) {
       alert('Oops, something went wrong');
    });
  }
    /*Patient profile data*/
        $scope.patientId = '';
    $scope.patientprofiledata = {
      "firstname"        : "",
      "lastname"         : "",
      "emailid"          : "",
      "cntrynum"         : "",
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

    $scope.$on("$ionicView.afterEnter", function(event, data){
     // $rootScope.showLoader();
      registrationdetsdb.query({}).then(function(response){
          //alternateemailid alternatemobilenum doctorlicenseno
          var result = DBA.getById(response);
          $scope.patientId = result.appregistrationid;
          patientprflservice.getpatientinfo($scope.patientId).then(function(data){
               $rootScope.hideLoader();
               $scope.originalresponse = data.data;
               $scope.patientprofiledata = {
                  "firstname" : data.data.firstname,
                  "lastname"  : data.data.lastname,
                  "emailid"   : data.data.emailid,
                  "cntrynum"  : data.data.cntrynum,
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

                });
            });
        }).catch(function(err){
              $rootScope.hideLoader();
              $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){

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
            $rootScope.showToast('You have not updated anything in your profile','Long','top');
        }
    };
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
    var alertPopup = $ionicPopup.alert(alertconfig);
    alertPopup.then(onokfunction);
  };
  $rootScope.showToast = function(message, duration, position){
      if(window.cordova){
          $cordovaToast.show(message, duration, position).then(function(success){
            //success
          }, function(error){
            //error
          });
      }else{
        var alertPopup = $ionicPopup.alert({
            title: 'Message',
            template: message
          });
          alertPopup.then(function(res) {

          });
      }
  };
  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(response){
      $state.go('login',{}, {reload: true});
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $ionicHistory.clearCache();
      $rootScope.showPopup({title:'Invalid Session', template:'Session lost, please login again'}, function(res){

      });
  });

  $rootScope.$on(AUTH_EVENTS.jsonwebtokenExpired, function(response){
      registrationdetsdb.updateJWTWithoutMobileNo({jsonwebtoken:null}).then(function(result){
        $state.go('login',{}, {reload: true});
         $ionicHistory.nextViewOptions({
            disableBack: true
         });
        $ionicHistory.clearCache()
        $rootScope.showPopup({title:'Invalid Session', template:'Session lost, please login again'}, function(res){

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
      $rootScope.showPopup({title:'Invalid Session', template:'Session lost, please login again'}, function(res){

      });
  });
  $scope.backButtonAction = function(){
        $ionicHistory.goBack();
  };
  $rootScope.messagesdata = {
     badgeCount: ''
  }
    $scope.popover = $ionicPopover.fromTemplate('<ion-popover-view class=".platform-android .popover" style=" top: 45px; height:240px; width:150px; margin=0;"><ion-content><div class="list" ><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 24px;" href="#/about">About</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/patientprfl" >User Profile</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" href="#/patientimages" >Uploaded photos</a><a class="item" on-tap="closePopover()" style="padding-bottom: 12px;padding-top: 12px;" ng-click="showPopup()">Rate the app</a><a class="item" on-tap="closePopover()" style="padding-bottom: 24px;padding-top: 12px;" ng-click="showConfirm()" href="#/logout">Logout</a></div></ion-content></ion-popover-view>',{
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
 template: '<ion-item class="item-input" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="item-input"><h4>{{rating}}</h4><br><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ></label></button></ion-item>',
      title: 'Feedback',
      scope: $scope
    });
    //popup close
    $scope.closepopup = function(){
       console.log("closing popup");
       myPopup.close();
    }
  };

     //sidemenu addition
     $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
   };

  $scope.urlForImage = function(imageName) {
    var trueOrigin = cordova.file.dataDirectory + imageName;
    return trueOrigin;
  };
    $scope.selectImageSource = function(){
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take a photo' },
        { text: 'Add photo from Gallery' },
        { text: 'View Uploaded Images'}
      ],
      titleText: 'Add Photos',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
            if(index==2)
            {
                $state.go('patientimages');
            }
          else{
              $scope.takeImage(index);
          }
   }
    });
  };
    
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
         mediaType: Camera.MediaType.PICTURE,
         saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
  		onImageSuccess(imageData);
  		function onImageSuccess(fileURI) {
  			createFileEntry(fileURI);
  		}
  		function createFileEntry(fileURI) {
  			window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
  		}
  		function copyFile(fileEntry) {
  			var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
  			var newName = makeid() + name;
       /* window.resolveLocalFileSystemURL("file:///storage/emulated/0/", function(dir) {*/
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
          fs.root.getDirectory("TracMyHealth",{create:true, exclusive:false}, function(direntry){
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
      }
  		function onCopySuccess(entry) {
  			$scope.$apply(function () {
          $scope.srcImage = entry.nativeURL;
          $scope.data.filename = entry.fullPath.substr(entry.fullPath.lastIndexOf('/') + 1);
  			});
        $cordovaCamera.cleanup().then(function(){
        },function(error){
        });
        cordova.plugins.MediaScannerPlugin.scanFile(entry.nativeURL, function(){
          //$rootScope.showToast("Mediascannerplugin scan was successful","long","top");
        }, function(err){
          $rootScope.showToast("Couldn't complete the action due to "+err+", please try again","long","top");
        });
        $scope.openDocModal();
  		}
  		function fail(err) {
  			$rootScope.showToast("Couldn't complete the action due to "+err+", please try again","long","top");
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
  		$rootScope.showToast("Couldn't complete the action due to "+err+", please try again","long","top");
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
        //$rootScope.showPopup({'title':'Error','template':'Error encountered while capturing image to Database ['+ error.code + ' '+ error.message + ']'});
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
    template: 'Are you sure you want to Logout ?',
    });
    confirmPopup.then(function(res) {
      if(res){
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
      }else{
        //console.log('You clicked on "Cancel" button');
      }
    });
  };
}])
.controller('LoginCtrl', ['$scope','$rootScope','internetservice','$state','$ionicPopup','$stateParams','forgotpwdservice' , '$ionicModal', 'loginservice','signupservice','registrationdetsdb','DBA','$ionicHistory',function($scope, $rootScope, internetservice, $state, $ionicPopup, $stateParams, forgotpwdservice, $ionicModal, loginservice, signupservice, registrationdetsdb, DBA, $ionicHistory) {
  $scope.$on("$ionicView.beforeEnter",function(event, data){
    $scope.logindata={
      "email" : "",
      "passcode" : ""
    };
  	$scope.forgot=[];
    // Set the default value of inputType
    $scope.inputType = 'password';
  });
  $scope.$on("$ionicView.afterEnter",function(event, data){
      $ionicHistory.clearHistory();
  		$ionicHistory.clearCache();
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
              $state.go('menu');
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
	$scope.openForgotPwdModal = function() {
    $scope.validemailmobile = false;
    $ionicModal.fromTemplateUrl('forgotpassword.html',{
        scope: $scope,
      	animation: 'slide-in-up'
    }).then(function(modal) {
      	$scope.modal = modal;
        $scope.modal.show();
    });
	};
  $scope.closeForgotPwdModal = function() {
    $scope.modal.remove();
	};
	$scope.save=function(dets){
	    $scope.forgotpass = true;
      $rootScope.showLoader();
      forgotpwdservice.forgotpwd($scope.forgot.emailId, $scope.forgot.mobNo, $scope.forgotpass ).then(function(data){
            if(data.status === "SUCCESS"){
                $scope.validemailmobile=true;
                var mobnum= $scope.forgot.mobNo.toString();
                signupservice.generateOtp($scope.forgot.emailId, mobnum ).then(function(data){
                    $rootScope.hideLoader();
                    if(data.status !== "SUCCESS"){
                        $rootScope.showPopup({title:"Error",template:"Error generating OTP, please try again"},
                        function(res){
                        });
                    }
                }).catch(function(error){
                  $rootScope.hideLoader();
                  $rootScope.showPopup({title:"Error",template:"Error generating OTP, please try again"},
                  function(res){
                  });
                });
            }else{
                $rootScope.hideLoader();
                $rootScope.showPopup({title:"Error",template:"Error resetting the password, please try again"},
                function(res){
                });
            }
      }).catch(function(error){
          $rootScope.hideLoader();
          if(error.status === 400 || error.status === 404){
            $rootScope.showPopup({
             title:'Error',
             template:"Email id and mobile number isn't registered on our platform"
            },function(res){
             console.log("error to save");
            });
          }else{
            $rootScope.showPopup({title:"Error",template:"Error resetting the password, please try again"},
            function(res){
            });
          }
      });
  };

	$scope.newpassword= function(chg){
      $scope.forgot.push({emailId : chg.emailId, mobNo : chg.mobNo, password: chg.password, confirmpwd: chg.confirmpwd, smsotp: chg.smsotp, emailotp: chg.emailotp});
		  if($scope.forgot.password === $scope.forgot.confirmpwd){
          forgotpwdservice.changedpwd($scope.forgot.emailId, $scope.forgot.mobNo,$scope.forgot.password, $scope.forgot.smsotp, $scope.forgot.emailotp,$scope.forgotpass).then(function(data){
      				if(data.status === "SUCCESS"){
                $rootScope.showToast('Password updated successfuly','long','top');
      					console.log("password saved successfully");
      					$scope.closeForgotPwdModal();
      				}else{
                $rootScope.showPopup({
                  title:'Error',
                  template:"Error resetting the password, please try again later"
                },function(res){
                  console.log("error to save");
                });
              }
    		  }).catch(function(error){
              $rootScope.showPopup({
                title:'OTP Error',
                template:"Please enter correct OTP"
              },function(res){
                console.log("error to save");
              });
    		  });
		  }else{
          $rootScope.showToast("Passwords don't match, please re-enter them",'long','top');
      }
	};

  $scope.signup=function(){
      $state.go('signup');
  };
	$scope.login =function(logindata){
		$rootScope.showLoader();
		loginservice.logindets($scope.logindata.email, $scope.logindata.passcode).then(function(data){
        if(data.status === 'SUCCESS'){
          $rootScope.hideLoader();
          registrationdetsdb.updateJWTAndAppRegId(data.appregistrationid, data.authtoken, data.isdoctor).then(function(result){
              loginservice.setProfileData({"appregistrationid":data.appregistrationid, "jsonwebtoken":data.authtoken, "isdoctor":data.isdoctor});

              $state.go('menu');
          }).catch(function(error){
              $rootScope.showPopup({
                title:'System Error',
                template:'We are experiencing problem logging in right now, please try again'
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
      if(error.status === 400 || error.status === 404){
        $rootScope.showPopup({
          title:'Invalid Credentials',
          template:'Invalid login details, please try again'
        },function(res){
        });
      }else{
        console.log('printing error object completely while login ['+ JSON.stringify(error) + ']');
        $rootScope.showPopup({
          title:'System Error',
          template:'We are experiencing problem logging in right now, please try again'
        },function(res){
        });
      }
		});
	};
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
          //console.log('Return value from the datepicker popup is : ' + val, new Date(val));
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
    cntrynum:fdata.cntrynum,
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
    signupservice.validatedetails($scope.formData.emailadd, $scope.formData.mobnum, $scope.formData.doctor ).then(function(data){
      $rootScope.hideLoader();
  		if(data.status == 'SUCCESS'){
  		     $rootScope.showPopup({title:'Already Registered', template:'Email id and mobile number combination already exists'});
  		}
  	}).catch(function(error){
      $rootScope.hideLoader();
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
	};
	$scope.security=[];
	$scope.securitydets = function(u){
		$scope.security.push({otpsms: u.otpsms, otpemail: u.otpemail });
		//console.log($scope.security);
		if( $scope.formData.female === true){
			$scope.formData.gender = "female";
		}else{
			$scope.formData.gender = "male";
		}
	  var mobile = $scope.formData.mobnum.toString();
    $rootScope.showLoader();
    if($scope.formData.doctor == true){
       signupservice.registerDoctor($scope.formData.firstname,$scope.formData.lastname,$scope.formData.cntrynum,$scope.formData.gender,$scope.formData.emailadd,mobile,$scope.formData.address,$scope.formData.age,$scope.formData.dob,$scope.formData.doctor, $scope.formData.licenceNo,$scope.security.otpsms, $scope.security.otpemail, $scope.formData.password).then(function(data){
         $rootScope.hideLoader();
         $scope.closeModal2();
         $rootScope.showToast('Registration successful','long','top');
         //$state.go('main.listedentities');
           $state.go('login');
    	 }).catch(function(error){
          $rootScope.hideLoader();
        	var alertpop = $ionicPopup.alert({
        		title:"Registration Error",
            template:"Error completing the registration, please try again"
        	}).then(function(res){
        		$state.go('signup');
        	});
        });
	  }else{
		    signupservice.registerPatient($scope.formData.firstname,$scope.formData.lastname,$scope.formData.cntrynum,$scope.formData.gender,$scope.formData.emailadd,mobile,$scope.formData.address,$scope.formData.age,$scope.formData.dob,$scope.formData.doctor,$scope.security.otpsms, $scope.security.otpemail, $scope.formData.password).then(function(data){
          $rootScope.hideLoader();
          $scope.closeModal2();
          $rootScope.showToast('Registration successful','long','top');
         // $state.go('main.listedentities');
                $state.go('login');
        }).catch(function(error){
            $rootScope.hideLoader();
            $rootScope.showPopup({title:'Registration Error',template:'Error completing the registration, please try again'});
        });
		}
	};
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
.controller('HealthtipsCtrl',['$scope','$http','$sce','$rootScope',function($scope, $http, $sce, $rootScope){

    $scope.video = function(e) {
    var videoElements = angular.element(e.srcElement);
    videoElements[0].pause();
}
    
    
    
$rootScope.showLoader();
 $http.get('example.json').success(function(data) {
     $scope.phones = data.medias.map(function (m) {
        
         console.log("my audio" + '' + $scope.phones);
      m.video = $sce.trustAsResourceUrl(m.video);
         console.log(m.video);
      return m;
         $rootScope.hideLoader();
         
       $scope.video = function(e) {
    m.video = $sce.trustAsResourceUrl(m.video);
    m.video[0].pause();
}   
         
         
         
            });
});
}])
.controller('ScreeningCtrl',['$scope', '$filter', '$ionicModal','$http',function($scope, $filter, $ionicModal, $http){
  $scope.openModal = function() {
  $ionicModal.fromTemplateUrl('screening.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
};
$scope.closeModal = function() {

  $scope.modal.remove();
};

$scope.openModalreg = function() {
$ionicModal.fromTemplateUrl('registration.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
  $scope.modal.show();
});
};
$scope.closeModalreg = function() {

$scope.modal.remove();
};
$http.get('detail.json').success(function(data) {
    $scope.phones = data;
    console.log($scope.phones);
});
$http.get('registration.json').success(function(data){
  $scope.regform = data;
  console.log($scope.regform);

});
}])
.controller('DataentryCtrl',['$scope', '$filter', '$ionicModal','$http',function($scope, $filter, $ionicModal, $http){
  $scope.openModal = function() {
  $ionicModal.fromTemplateUrl('survey_form.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
};
$scope.closeModal = function() {
  $scope.sdate = $filter('date')(new Date(),'dd-MM-yyyy');
  $scope.modal.remove();
};
$http.get('detail.json').success(function(data) {
    $scope.phones = data;
    console.log($scope.phones);
});

}])
.controller('RegistrationCtrl',['$scope', '$filter', '$ionicModal', '$http', function($scope, $filter, $ionicModal, $http){
$http.get('registration.json').success(function(data){
  $scope.regform = data;
  console.log($scope.regform);

});
}])
.controller('EntitiesCtrl', ['$scope','$rootScope','$stateParams','$state', 'hospitalservice','$ionicPopup','$cordovaDialogs','$ionicFilterBar', '$ionicModal', '$ionicSlideBoxDelegate','DBA','registrationdetsdb','$ionicPopover',function($scope, $rootScope, $stateParams, $state, hospitalservice, $ionicPopup, $cordovaDialogs, $ionicFilterBar, $ionicModal,$ionicSlideBoxDelegate, DBA, registrationdetsdb, $ionicPopover){

    $ionicModal.fromTemplateUrl('filterHospitaldetails.html',{
      scope: $scope,
      animation: 'slide-in-left'
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
       "backup":{
         "hospitalnameselected" : ["All"]
         ,"isFilterApplied": false
       }
       ,"hospitalnameselected" : ["All"]
       ,"isFilterApplied": false
     };
     $scope.filtersavailable = {
       "hospitalnames" : ["All"]
     };

     $scope.filterSetAll = function(){
       $scope.appliedfilters.hospitalnameselected[0]=angular.copy("All");

     };

     $scope.filterCancel = function(){
          //copy from backup in case of cancel press
          $scope.appliedfilters.hospitalnameselected=angular.copy($scope.appliedfilters.backup.hospitalnameselected);
          $scope.appliedfilters.isFilterApplied=$scope.appliedfilters.backup.isFilterApplied;
        // console.log( $scope.appliedfilters.isFilterApplied);
          $scope.closeModalfilter();
     };

     $scope.filterapply = function(){
           var filteredkey=0;
           var allHospitals=false;
           if($scope.appliedfilters.hospitalnameselected.length != 0 )
           {
              if(angular.equals($scope.appliedfilters.hospitalnameselected[0],"All"))
                  allHospitals=true;
              if(allHospitals==true)
              {
                $scope.appliedfilters.isFilterApplied=false;
                if($scope.backuphosvisitinfo != undefined)
                {
                  //No need to apply filter all to be displayed
                  $scope.hospitalslist=angular.copy($scope.backuphosvisitinfo);
                }
                //If no backupdrvisitinfo leave visitinfo as is.
              }else{
                $scope.appliedfilters.isFilterApplied=true;
                //fillter need to be applied
                if($scope.backuphosvisitinfo == undefined){
                  //this if condition may never arise may need to be deleted
                  $scope.backuphosvisitinfo = angular.copy($scope.hospitalslist);
                }
                else{
                  $scope.hospitalslist=angular.copy($scope.backuphosvisitinfo);
                }
                angular.forEach($scope.appliedfilters.hospitalnameselected,function (hospitalName,key1){
                    angular.forEach($scope.hospitalslist,function (hospitalVisited,key2){
                        if(angular.equals(hospitalName,hospitalVisited.hospitalname))
                        {
                            $scope.hospitalslist[filteredkey]=hospitalVisited   ;
                            filteredkey++;
                        }//end of if
                    });
                });
                $scope.hospitalslist.length=filteredkey;
              }//end of else
            $scope.closeModalfilter();
          }
          else{
            $rootScope.showPopup({title:'Filter Error', template:"Select at least one hospital"});
          }
      };//end of filterapply
      $scope.filterDetails = function(visitid){
         if(($scope.backuphosvisitinfo != undefined) || (($scope.hospitalslist != undefined ) && ($scope.hospitalslist.length != 0 ))){
           if($scope.backuphosvisitinfo == undefined)
               $scope.backuphosvisitinfo=angular.copy($scope.hospitalslist);
             console.log($scope.hospitalslist);
           angular.forEach($scope.backuphosvisitinfo, function(visitdata, key1){
                  var namefound = false;
                  angular.forEach($scope.filtersavailable.hospitalnames, function(value, key2){
                     if(angular.equals(value, visitdata.hospitalname)){
                        namefound = true;
                     }
                  });
                  if(!namefound){
                     $scope.filtersavailable.hospitalnames.push(visitdata.hospitalname);
                  }
            });
            //Keep a copy of previous filter values for backup in case of cancel press
            $scope.appliedfilters.backup.hospitalnameselected=angular.copy($scope.appliedfilters.hospitalnameselected);
            $scope.appliedfilters.backup.isFilterApplied=$scope.appliedfilters.isFilterApplied;
            $scope.openModalfilter();
          }
          else{
              //No data to filter show error msg
              //no need to open modal
              $rootScope.showPopup({title:'Filter Error', template:"No data to filter"});
          }

      };//end of filterdetails

      $scope.openPopover = function($event) {
        $scope.$parent.openPopover($event);
      };

      $scope.closePopover = function() {
        $scope.$parent.closePopover();
      };

    $scope.$on("$ionicView.loaded", function(event, data){
$scope.fetchhosp();
});
$scope.fetchhosp = function(){
$scope.listedentities=[];
$scope.hospitalslist=[];
$scope.hos=[];
$rootScope.showLoader();

registrationdetsdb.query({}).then(function(response){
    var result = DBA.getById(response);
    $scope.patientId = result.appregistrationid;
    hospitalservice.getregHospitals($scope.patientId).then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
        $rootScope.hideLoader();
       if(data.status === 'SUCCESS'){
            $scope.listedentities = data;
            //before the data value lets take out duplicate hospitals from the list
             var uniquehospitalset ={};
             var arrayofhospitals = [];
            _.each($scope.listedentities.data, function(hospitaldata, key, list){
                uniquehospitalset[hospitaldata._id] = hospitaldata;
            });
            angular.forEach(uniquehospitalset, function(value, key) {
                this.push(value);
            }, arrayofhospitals);
            $scope.hospitalslist = arrayofhospitals;
        }
        else{
            $rootScope.showPopup({
                title:'Error',
                template:"We are experiencing problem retrieving Hospitals registered"}, function(res){
                console.log('on click ok');
            });
        }
    }).catch(function(error){
          if(error.status === 404){
              $scope.$broadcast('scroll.refreshComplete');
              $rootScope.hideLoader();
              $rootScope.showPopup({
              title:'Info',
              template:"Hospital data yet to be added, check with your hospital."}, function(res){
              console.log('on click ok');
          });
        }else{
             $scope.$broadcast('scroll.refreshComplete');
            $rootScope.hideLoader();
            $rootScope.showPopup({
            title:'Error',
            template:"We are experiencing problem retrieving Hospitals registered"}, function(res){
                console.log('on click ok');
        });
      }
    });
}).catch(function(error){
   $rootScope.hideLoader();
   $rootScope.showPopup({title:'Error', template:"Unable to process the request, please try  again!!"}, function(res){
   });
});
}
$scope.reload = function(){
  $scope.fetchhosp();
}

      $scope.hosinfo= function(hospitalid,hospitalcode){
  		    hospitalservice.hospitalinfo(hospitalid,hospitalcode).then(function(data){
				      $scope.openModal3();
				      $scope.hos= data.data;
  		    }).catch(function(error){
              $rootScope.showPop({title:'Error',template:'Error retrieving hospital details'},function(res){

              });
  		    });
      };
      //Search bar implementation code begins
      $scope.filterBarInstance;
      $scope.showFilterBar = function(){
          filterBarInstance = $ionicFilterBar.show({
          items:$scope.hospitalslist,
          update:function(filteredItemList){
              $scope.hospitalslist = filteredItemList;
          },
          expression:function(filterText, value, index, array){//we r checking hospital name only
              return value.hospitalname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
          }
        });
      };
      // Search bar implementation code ends
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
		     $scope.i= $ionicSlideBoxDelegate.currentIndex();
		     console.log($scope.i);
		     $ionicSlideBoxDelegate.next();
		     $scope.questions[$scope.i].answer = rating;
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
.controller('MyHealthCtrl', ['$scope', '$rootScope','$state', '$stateParams','$ionicModal','medicalprofileservice','$ionicPopup', 'DBA','registrationdetsdb','$ionicPopover','$ionicFilterBar','$filter',function($scope, $rootScope, $state, $stateParams, $ionicModal, medicalprofileservice,$ionicPopup, DBA, registrationdetsdb, $ionicPopover, $ionicFilterBar, $filter) {
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
         },
         "yogaactivity" : {
           "sttime" : "",
           "endtime":"",
           "remarks": "",
              "yogatype" :{
                  "asana" : "Asana",
                  "pranayama" : "Pranayama",
                  "meditation" : "Meditation"
              },
              "selectedyoga": ""
         }

      };

      $scope.openModal1 = function(trackername, title){
        $ionicModal.fromTemplateUrl('medicalprofile.html', {
          scope: $scope,
          animation: 'slide-in-left'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.trackername = trackername;
        $scope.title = title;
        $scope.tdate= new Date();
        $scope.modal.show();
      });
    }

    $scope.closeModal1 = function() {
         $scope.data = initDataCopy();
      $scope.modal.remove();

    };

     $scope.$on("$ionicView.loaded", function(event, data){
$scope.fetchmyhealth();

      });
      $scope.fetchmyhealth = function(){
      $rootScope.showLoader();

      registrationdetsdb.query({}).then(function(response){
        var result = DBA.getById(response);
        $scope.patientId = result.appregistrationid;
        medicalprofileservice.getdetails($scope.patientId).then(function(data){
        $scope.$broadcast('scroll.refreshComplete');
          $rootScope.hideLoader();
         // if(data.status === 'SUCCESS'){
            $scope.healthdetails = data.data;
            console.log($scope.healthdetails);
            if(data.summary !== '' && data.summary !== 0){
              $scope.summary = data.summary;
            }
          //}
          }).catch(function(error){
            if(error == 404){
                 $scope.$broadcast('scroll.refreshComplete');
              $rootScope.hideLoader();
              $rootScope.showPopup({
                  title:'Info',
                  template:"Health details are not added, try adding."}, function(res){
                  console.log('on click ok');
              });
            }
            else{
              $rootScope.hideLoader();
              $rootScope.showPopup({title:'Error', template:"We are experiencing problem right now, please try again"}, function(res){
              });
            }
        });
      }).catch(function(error){
          $rootScope.hideLoader();
          $rootScope.showPopup({title:'Error', template:"Unable to process the request, please try  again!!"}, function(res){
          });
      });
    }
    $scope.reloadmyhealth = function(){
    $scope.fetchmyhealth();
    }


    $scope.openModalfilter = function(){
         $ionicModal.fromTemplateUrl('filterhealthtabdetails.html',{
           scope: $scope,
           animation: 'slide-in-left'
         }).then(function(modal){
           $scope.filtermodal = modal;
           $scope.filtermodal.show();
         });
       };
       $scope.closeModalfilter = function(){
           $scope.filtermodal.remove();
       };

       $scope.appliedfilters = {
            "backup":{"bloodsugarFilter":true
                      ,"bloodpressureFilter":true
                      ,"vaccinationFilter":true
                      ,"medicationFilter":true
                      ,"allergiesFilter":true
                      ,"weightFilter":true
                      ,"yogaactivity":true
                      ,"isFilterApplied":false}
            ,"bloodsugarFilter":true
            ,"bloodpressureFilter":true
            ,"vaccinationFilter":true
            ,"medicationFilter":true
            ,"allergiesFilter":true
            ,"weightFilter":true
            ,"yogaactivity":true
            ,"isFilterApplied":false
        };

        $scope.healthFilterList = [
           { text: "Blood Sugar", checked: true, backupchecked: true},
            { text: "Blood Pressure", checked: true, backupchecked: true},
            { text: "Vaccination", checked: true, backupchecked: true},
            { text: "Medication", checked: true, backupchecked: true},
            { text: "Allergies", checked: true, backupchecked: true},
            { text: "Weight", checked: true, backupchecked: true},
            { text: "Yoga Activity", checked: true, backupchecked: true}
    ];

        $scope.filterCancel = function(){
          $scope.closeModalfilter();
          ionic.requestAnimationFrame(function (){
              $scope.getBackupFilters();
          });
        };
        $scope.getBackupFilters = function(){
              //copy previous filter values from backup in case of cancel press
              $scope.appliedfilters.bloodsugarFilter=$scope.appliedfilters.backup.bloodsugarFilter;
              $scope.appliedfilters.bloodpressureFilter=$scope.appliedfilters.backup.bloodpressureFilter;
              $scope.appliedfilters.vaccinationFilter=$scope.appliedfilters.backup.vaccinationFilter;
              $scope.appliedfilters.medicationFilter=$scope.appliedfilters.backup.medicationFilter;
              $scope.appliedfilters.allergiesFilter=$scope.appliedfilters.backup.allergiesFilter;
              $scope.appliedfilters.weightFilter=$scope.appliedfilters.backup.weightFilter;
 $scope.appliedfilters.yogaactivity=$scope.appliedfilters.backup.yogaactivity;
              $scope.appliedfilters.isFilterApplied=$scope.appliedfilters.backup.isFilterApplied;


 $scope.healthFilterList[bloodsugarFilter].checked=$scope.healthFilterList[bloodpressureFilter].backupchecked;
              $scope.healthFilterList[bloodpressureFilter].checked=$scope.healthFilterList[bloodpressureFilter].backupchecked;
              $scope.healthFilterList[vaccinationFilter].checked=$scope.healthFilterList[vaccinationFilter].backupchecked;
              $scope.healthFilterList[medicationFilter].checked=$scope.healthFilterList[medicationFilter].backupchecked;
              $scope.healthFilterList[allergiesFilter].checked=$scope.healthFilterList[allergiesFilter].backupchecked;
              $scope.healthFilterList[weightFilter].checked=$scope.healthFilterList[weightFilter].backupchecked;

 $scope.healthFilterList[yogaactivity].checked=$scope.healthFilterList[yogaactivity].backupchecked;
        };
        var bloodsugarFilter=0,bloodpressureFilter=1,vaccinationFilter=2,medicationFilter=3,allergiesFilter=4,weightFilter=5,yogaactivity=6;
        $scope.filterResetAll = function(){
          $scope.healthFilterList[bloodsugarFilter].checked=false;
          $scope.healthFilterList[bloodpressureFilter].checked=false;
          $scope.healthFilterList[vaccinationFilter].checked=false;
          $scope.healthFilterList[medicationFilter].checked=false;
          $scope.healthFilterList[allergiesFilter].checked=false;
          $scope.healthFilterList[weightFilter].checked=false;
            $scope.healthFilterList[yogaactivity].checked=false;
        };
        $scope.filterSetAll = function(){
          $scope.healthFilterList[bloodsugarFilter].checked=true;
          $scope.healthFilterList[bloodpressureFilter].checked=true;
          $scope.healthFilterList[vaccinationFilter].checked=true;
          $scope.healthFilterList[medicationFilter].checked=true;
          $scope.healthFilterList[allergiesFilter].checked=true;
          $scope.healthFilterList[weightFilter].checked=true;
          $scope.healthFilterList[yogaactivity].checked=true;
        };
      $scope.filterdetails = function(visitid){
          if(($scope.healthdetails != undefined ) && ($scope.healthdetails.length != 0 )){
             $scope.openModalfilter();
             ionic.requestAnimationFrame(function (){
                  $scope.backupFilters();
             });
           }else{
               //No data to filter show error msg
               //no need to open modal
               $rootScope.showPopup({title:'Filter Error', template:"No data to filter"});
           }
        };
        $scope.backupFilters = function(){
            //keep a copy of previous filter values for backup in case of cancel press
            $scope.appliedfilters.backup.bloodsugarFilter=$scope.appliedfilters.bloodsugarFilter;
            $scope.appliedfilters.backup.bloodpressureFilter=$scope.appliedfilters.bloodpressureFilter;
            $scope.appliedfilters.backup.vaccinationFilter=$scope.appliedfilters.vaccinationFilter;
            $scope.appliedfilters.backup.medicationFilter=$scope.appliedfilters.medicationFilter;
            $scope.appliedfilters.backup.allergiesFilter=$scope.appliedfilters.allergiesFilter;
            $scope.appliedfilters.backup.weightFilter=$scope.appliedfilters.weightFilter;
            $scope.appliedfilters.backup.yogaactivity=$scope.appliedfilters.yogaactivity;
            $scope.appliedfilters.backup.isFilterApplied=$scope.appliedfilters.isFilterApplied;
            $scope.healthFilterList[bloodsugarFilter].backupchecked=$scope.healthFilterList[bloodsugarFilter].checked;
 console.log($scope.healthFilterList[bloodsugarFilter].backupchecked);           $scope.healthFilterList[bloodpressureFilter].backupchecked=$scope.healthFilterList[bloodpressureFilter].checked;
            $scope.healthFilterList[vaccinationFilter].backupchecked=$scope.healthFilterList[vaccinationFilter].checked;
            $scope.healthFilterList[medicationFilter].backupchecked=$scope.healthFilterList[medicationFilter].checked;
            $scope.healthFilterList[allergiesFilter].backupchecked=$scope.healthFilterList[allergiesFilter].checked;
            $scope.healthFilterList[weightFilter].backupchecked=$scope.healthFilterList[weightFilter].checked;
            $scope.healthFilterList[yogaactivity].backupchecked=$scope.healthFilterList[yogaactivity].checked;
        };
        $scope.filterapply = function(){

            if(($scope.healthdetails == undefined) || ($scope.healthdetails.length == 0)){
                //No data to filter show error msg
                //no need to open modal

                $rootScope.showPopup({title:'Filter Error', template:"No data to filter"});
                $scope.closeModalfilter();
            }else{
              if(($scope.healthFilterList[bloodsugarFilter].checked == false) &&
                ($scope.healthFilterList[bloodpressureFilter].checked == false) &&
                ($scope.healthFilterList[vaccinationFilter].checked == false) &&
                ($scope.healthFilterList[medicationFilter].checked == false) &&
                ($scope.healthFilterList[allergiesFilter].checked == false) &&
                ($scope.healthFilterList[weightFilter].checked == false) &&
                ($scope.healthFilterList[yogaactivity].checked == false)){
                    $rootScope.showPopup({title:'Error', template:"Select at least one filter"});
              }else{
                  $scope.closeModalfilter();
                  ionic.requestAnimationFrame(function () {
                      $scope.setResetAppliedFilters();
                  });
              }
           }
        };
        $scope.setResetAppliedFilters = function(){
            if(($scope.healthFilterList[bloodsugarFilter].checked == true) &&
                ($scope.healthFilterList[bloodpressureFilter].checked == true) &&
                ($scope.healthFilterList[vaccinationFilter].checked == true) &&
                ($scope.healthFilterList[medicationFilter].checked == true) &&
                ($scope.healthFilterList[allergiesFilter].checked == true) &&
                ($scope.healthFilterList[weightFilter].checked == true) &&
              ($scope.healthFilterList[yogaactivity].checked == true)){
                    $scope.appliedfilters.isFilterApplied=false;
            }else{
                $scope.appliedfilters.isFilterApplied=true;
            }
            angular.forEach($scope.healthFilterList,function(item, key){
              switch (key) {
                case bloodsugarFilter :
                   if(item.checked == true)
                     $scope.appliedfilters.bloodsugarFilter=true;
                   else
                     $scope.appliedfilters.bloodsugarFilter=false;
                   break;
               case bloodpressureFilter:
                   if(item.checked == true)
                     $scope.appliedfilters.bloodpressureFilter=true;
                   else
                     $scope.appliedfilters.bloodpressureFilter=false;
                   break;
               case vaccinationFilter:
                 if(item.checked == true)
                     $scope.appliedfilters.vaccinationFilter=true;
                 else
                     $scope.appliedfilters.vaccinationFilter=false;
                 break;
               case medicationFilter:
                 if(item.checked == true)
                     $scope.appliedfilters.medicationFilter=true;
                 else
                     $scope.appliedfilters.medicationFilter=false;
                 break;
               case allergiesFilter:
                 if(item.checked == true)
                     $scope.appliedfilters.allergiesFilter=true;
                 else
                     $scope.appliedfilters.allergiesFilter=false;
                 break;
               case weightFilter:
                 if(item.checked == true)
                     $scope.appliedfilters.weightFilter=true;
                 else
                     $scope.appliedfilters.weightFilter=false;
                 break;
                       case yogaactivity:
                 if(item.checked == true)
                     $scope.appliedfilters.yogaactivity=true;
                 else
                     $scope.appliedfilters.yogaactivity=false;
                 break;
              }
            });
        };
        $scope.patientId = '';
        $scope.healthdetails = [];

        // Search bar implementation begins
        $scope.filterBarInstance;
        $scope.showFilterBar = function(){
            filterBarInstance = $ionicFilterBar.show({
            items:$scope.healthdetails,
            update:function(filteredItemList){
              $scope.healthdetails = filteredItemList;
            },
            expression:function(filterText, value, index, array){
              var foundvalue = false;
              angular.forEach(value.medicalprofile, function(profiledata, key){
                if((typeof profiledata.profile[0].weight !== 'undefined'
                    &&  profiledata.profile[0].weight.value !== ''
                    && profiledata.profile[0].weight.value !== null
                    && profiledata.profile[0].weight.value.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].bloodsugar !== 'undefined'
                      &&  typeof profiledata.profile[0].bloodsugar.fbs !== 'undefined'
                      &&  profiledata.profile[0].bloodsugar.fbs !== ''
                      && profiledata.profile[0].bloodsugar.fbs !== null
                      && profiledata.profile[0].bloodsugar.fbs.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].bloodsugar !== 'undefined'
                      &&  typeof profiledata.profile[0].bloodsugar.ppbs !== 'undefined'
                      &&  profiledata.profile[0].bloodsugar.ppbs !== ''
                      && profiledata.profile[0].bloodsugar.ppbs !== null
                      && profiledata.profile[0].bloodsugar.ppbs.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].bloodsugar !== 'undefined'
                      &&  typeof profiledata.profile[0].bloodsugar.rbs !== 'undefined'
                      &&  profiledata.profile[0].bloodsugar.rbs !== ''
                      && profiledata.profile[0].bloodsugar.rbs !== null
                      && profiledata.profile[0].bloodsugar.rbs.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                      (typeof profiledata.profile[0].yogaactivity !== 'undefined'
                          &&  typeof profiledata.profile[0].yogaactivity.selectedyoga !== 'undefined'
                          &&  profiledata.profile[0].yogaactivity.selectedyoga !== ''
                          && profiledata.profile[0].yogaactivity.selectedyoga !== null
                          && profiledata.profile[0].yogaactivity.selectedyoga.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                      (typeof profiledata.profile[0].yogaactivity !== 'undefined'
                                  &&  typeof profiledata.profile[0].yogaactivity.sttime !== 'undefined'
                                  &&  profiledata.profile[0].yogaactivity.sttime !== ''
                                  && profiledata.profile[0].yogaactivity.sttime !== null
                                  && profiledata.profile[0].yogaactivity.sttime.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                          (typeof profiledata.profile[0].yogaactivity !== 'undefined'
                                &&  typeof profiledata.profile[0].yogaactivity.endtime !== 'undefined'
                                &&  profiledata.profile[0].yogaactivity.endtime !== ''
                               && profiledata.profile[0].yogaactivity.endtime !== null
                                && profiledata.profile[0].yogaactivity.endtime.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                              (typeof profiledata.profile[0].yogaactivity !== 'undefined'
                                &&  typeof profiledata.profile[0].yogaactivity.remarks !== 'undefined'
                                &&  profiledata.profile[0].yogaactivity.remarks !== ''
                              && profiledata.profile[0].yogaactivity.remarks !== null
                              && profiledata.profile[0].yogaactivity.remarks.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                   ||
                   (typeof profiledata.profile[0].profile !== 'undefined'
                                &&  typeof profiledata.profile[0].profile.name !== 'undefined'
                                &&  profiledata.profile[0].profile.name !== ''
                              && profiledata.profile[0].profile.name !== null
                              && profiledata.profile[0].profile.name.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].medication !== 'undefined'
                      &&  profiledata.profile[0].medication.value !== ''
                      && profiledata.profile[0].medication.value !== null
                      && profiledata.profile[0].medication.value.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].allergies !== 'undefined'
                      &&  profiledata.profile[0].allergies.value !== ''
                      && profiledata.profile[0].allergies.value !== null
                      && profiledata.profile[0].allergies.value.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].vaccination !== 'undefined'
                      &&  profiledata.profile[0].vaccination.value !== ''
                      && profiledata.profile[0].vaccination.value !== null
                      && profiledata.profile[0].vaccination.value.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].bloodpressure !== 'undefined'
                      &&  typeof profiledata.profile[0].bloodpressure.systolic !== 'undefined'
                      &&  profiledata.profile[0].bloodpressure.systolic !== ''
                      && profiledata.profile[0].bloodpressure.systolic !== null
                      && profiledata.profile[0].bloodpressure.systolic.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)
                  ||
                  (typeof profiledata.profile[0].bloodpressure !== 'undefined'
                      && typeof profiledata.profile[0].bloodpressure.diastolic !== 'undefined'
                      &&  profiledata.profile[0].bloodpressure.diastolic !== ''
                      && profiledata.profile[0].bloodpressure.diastolic !== null
                      && profiledata.profile[0].bloodpressure.diastolic.toString().toLowerCase().indexOf(filterText.toString().toLowerCase()) !== -1)

                ){
                      foundvalue = true;
                }
              });
              return foundvalue;
             }
          });
        };
    //end of search

     function initDataCopy(){
            return {
               "weight" : {
                  "value" : "",
                  "notes" : "",
                  "options": {
                      floor: 0,
                      ceil: 500,
                      step: 1,
                      showTicks: 50
                  }
               },
               "bloodsugar" : {
                 "rbs" : "",
                 "ppbs": "",
                 "fbs" : "",
                 "notes" :"",
                 "options": {
                   floor: 0,
                   ceil: 400,
                   step: 1
                 }
               },
               "bloodpressure" :{
                 "systolic" : "",
                 "diastolic": "",
                 "options": {
                   floor: 30,
                   ceil: 250,
                   step: 1,
                   translate: function(value, sliderId, label) {
                     switch (label) {
                       case 'model':
                       return 'diastolic : &nbsp;' + value;
                       case 'high':
                       return 'systolic : &nbsp;' + value;
                       default:
                       return  + value
                     }
                   }
                 }
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
               },
               "profile" : {
                   "name" : ""
               },
               "yogaactivity" : {
            "sttime" : "",
            "endtime":"",
            "remarks": "",
               "yogatype" :{
                   "asana" : "Asana",
                   "pranayama" : "Pranayama",
                    "meditation" : "Meditation"
               },
                "selectedyoga": ""
          }


            };
        };
        $scope.data = initDataCopy();
        $scope.tracker = function(trackername, title){
            $scope.trackername = trackername;
            $scope.title = title;
        };
        $scope.tdate= new Date();
        //function to capture vitals as entered by the user
  	    $scope.create = function() {

          //check if the values are entered by user to proceed further to save the data
          if(($scope.data.weight.value === '' || $scope.data.weight.value === 0)
          &&($scope.data.yogaactivity.sttime === '' || $scope.data.yogaactivity.sttime === 0)
           &&($scope.data.yogaactivity.endtime === '' || $scope.data.yogaactivity.endtime === 0)
           &&($scope.data.yogaactivity.remarks === '' || $scope.data.yogaactivity.remarks === 0)
              &&($scope.data.yogaactivity.selectedyoga === '' || $scope.data.yogaactivity.selectedyoga === 0)
             && ($scope.data.bloodsugar.fbs === '' || $scope.data.bloodsugar.fbs === 0)
             && ($scope.data.bloodsugar.ppbs === '' || $scope.data.bloodsugar.ppbs === 0)
             && ($scope.data.bloodsugar.rbs === '' || $scope.data.bloodsugar.rbs === 0)
        && (($scope.data.bloodpressure.systolic === 0 || $scope.data.bloodpressure.systolic === '' )
              || ($scope.data.bloodpressure.diastolic === 0 || $scope.data.bloodpressure.diastolic === '' ))

                  && $scope.data.medication.value === ''
             && $scope.data.allergies.value === ''
             && $scope.data.vaccination.value === ''
          ){
              $rootScope.showToast('There was no data entered to be saved','long','top');
              $scope.closeModal1();
          }else{
  	          var details =[];
              var medicalprofiledatatosave = {};
              medicalprofiledatatosave["weight"] = {};
              medicalprofiledatatosave["weight"]["value"] = $scope.data.weight.value;
              medicalprofiledatatosave["weight"]["notes"] = $scope.data.weight.notes;
              medicalprofiledatatosave["yogaactivity"] = {};
                medicalprofiledatatosave["yogaactivity"]["sttime"] = $scope.data.yogaactivity.sttime;
                medicalprofiledatatosave["yogaactivity"]["endtime"] = $scope.data.yogaactivity.endtime;
                medicalprofiledatatosave["yogaactivity"]["remarks"] = $scope.data.yogaactivity.remarks;
    medicalprofiledatatosave["yogaactivity"]["selectedyoga"] = $scope.data.yogaactivity.selectedyoga;
      //
              medicalprofiledatatosave["bloodsugar"] = {};
              if($scope.data.bloodsugar.rbs !== 0){
                  if(typeof medicalprofiledatatosave["bloodsugar"] === 'undefined') {
                      medicalprofiledatatosave["bloodsugar"] = {};
                  }
                  medicalprofiledatatosave["bloodsugar"]["rbs"] = $scope.data.bloodsugar.rbs;
              }
              if($scope.data.bloodsugar.ppbs !== 0){
                  if(typeof medicalprofiledatatosave["bloodsugar"] === 'undefined') {
                      medicalprofiledatatosave["bloodsugar"] = {};
                  }
                  medicalprofiledatatosave["bloodsugar"]["ppbs"] = $scope.data.bloodsugar.ppbs;
              }
              if($scope.data.bloodsugar.fbs !== 0){
                  if(typeof medicalprofiledatatosave["bloodsugar"] === 'undefined') {
                      medicalprofiledatatosave["bloodsugar"] = {};
                  }
                  medicalprofiledatatosave["bloodsugar"]["fbs"] = $scope.data.bloodsugar.fbs;
              }
              medicalprofiledatatosave["bloodpressure"] = {};
              medicalprofiledatatosave["bloodpressure"]["systolic"] = $scope.data.bloodpressure.systolic;
              medicalprofiledatatosave["bloodpressure"]["diastolic"] = $scope.data.bloodpressure.diastolic;
              medicalprofiledatatosave["medication"] = {}
              medicalprofiledatatosave["medication"]["value"] = $scope.data.medication.value;
              medicalprofiledatatosave["medication"]["notes"] = $scope.data.medication.notes;
              medicalprofiledatatosave["allergies"] = {}
              medicalprofiledatatosave["allergies"]["value"] = $scope.data.allergies.value;
              medicalprofiledatatosave["allergies"]["notes"] = $scope.data.allergies.notes;
              medicalprofiledatatosave["vaccination"] = {}
              medicalprofiledatatosave["vaccination"]["value"] = $scope.data.vaccination.value;
              medicalprofiledatatosave["vaccination"]["notes"] = $scope.data.vaccination.notes;

              medicalprofiledatatosave["profile"] = {}
              medicalprofiledatatosave["profile"]["name"] = $scope.data.profile.name;


              var medicalprofile = {
                  "data" : medicalprofiledatatosave
                  ,"createdat" : $scope.tdate
              };
              console.log(medicalprofile.createdat);
              $rootScope.showLoader();
              medicalprofileservice.savedetails($scope.patientId, medicalprofile).then(function(data){
                  if(data.status == 'SUCCESS'){
                      $scope.closeModal1();
                      $rootScope.hideLoader();
                      $rootScope.showToast('Medical profile data saved successfully',null,'top');
                      medicalprofileservice.getdetails($scope.patientId).then(function(data){
                  	     if(data.status === 'SUCCESS'){
                      $scope.healthdetails = data.data;

                     if(data.summary !== '' && data.summary !== 0 && data.summery !== null){
                             $scope.summary = data.summary;
                           }
                         }else{
                           $rootScope.showToast('We are experiencing problem retrieving vitals history','long','top');
                         }
                      }).catch(function(error){
                         $rootScope.hideLoader();
                         $rootScope.showToast('We are experiencing problem retrieving vitals history','long','top');
  			              });
                  }else{
                      $rootScope.showToast('We are experiencing problem saving vitals','long','top');
                  }
              }).catch(function(error){
  		   		      $rootScope.hideLoader();
    		   			  if(error.status === 404){
                      $rootScope.showToast('We are experiencing problem saving vitals','long','top');
            		  }else if(error.status ===500){
                      $rootScope.showToast('We are experiencing problem saving vitals','long','top');
    					    }else{
                    $rootScope.showToast('We are experiencing problem saving vitals','long','top');
                  }
              });
              $scope.data = initDataCopy();
            console.log($scope.healthdetails);
               //$scope.showhide = function(){


           }

  	    };



        // Cleanup the modal when we're done with it!
       $scope.$on('$destroy', function() {
         // $scope.modal.remove();
        });

        $scope.$on("$ionicView.beforeLeave", function(event, data){

        });
        $scope.$on("$ionicView.enter", function(event, data){

        });

    

        $scope.enableTimeLine = function(details){
            return ((details.vitalslistforday.allergies && details.vitalslistforday.allergies !== null &&details.vitalslistforday.allergies !== ''&&details.vitalslistforday.allergies !== 0 && $scope.appliedfilters.allergiesFilter != false && $scope.appliedfilters.allergiesFilter != null && $scope.appliedfilters.allergiesFilter != '' && $scope.appliedfilters.allergiesFilter != 0)
                          || (details.vitalslistforday.weight && details.vitalslistforday.weight !== '' && details.vitalslistforday.weight !== 0 && details.vitalslistforday.weight !== null && $scope.appliedfilters.weightFilter != false && $scope.appliedfilters.weightFilter != '' && $scope.appliedfilters.weightFilter != '' && $scope.appliedfilters.weightFilter != null && $scope.appliedfilters.weightFilter != 0 )
                          || (details.vitalslistforday.bloodpressure && details.vitalslistforday.bloodpressure !== '' && details.vitalslistforday.bloodpressure !== null && details.vitalslistforday.bloodpressure !== 0 && $scope.appliedfilters.bloodpressureFilter != false && $scope.appliedfilters.bloodpressureFilter != null && $scope.appliedfilters.bloodpressureFilter != '' && $scope.appliedfilters.bloodpressureFilter != 0)
                          || (details.vitalslistforday.medication && details.vitalslistforday.medication !== '' && details.vitalslistforday.medication !== null && $scope.appliedfilters.medicationFilter != false && $scope.appliedfilters.medicationFilter != null && $scope.appliedfilters.medicationFilter != '' && $scope.appliedfilters.medicationFilter != 0)
                          || (details.vitalslistforday.vaccination && details.vitalslistforday.vaccination !== '' && details.vitalslistforday.vaccination !== null && $scope.appliedfilters.vaccinationFilter != false && $scope.appliedfilters.vaccinationFilter != null && $scope.appliedfilters.vaccinationFilter != '' && $scope.appliedfilters.vaccinationFilter != 0)
                          || (details.vitalslistforday.fbs && details.vitalslistforday.fbs !== ''
                              && details.vitalslistforday.fbs !== null && details.vitalslistforday.fbs !== 0 && $scope.appliedfilters.bloodsugarFilter != false && $scope.appliedfilters.bloodsugarFilter != null && $scope.appliedfilters.bloodsugarFilter != '' && $scope.appliedfilters.bloodsugarFilter != 0)
                          || (details.vitalslistforday.rbs && details.vitalslistforday.rbs !== ''   && details.vitalslistforday.rbs !== null && details.vitalslistforday.rbs !== 0 && $scope.appliedfilters.bloodsugarFilter != false && $scope.appliedfilters.bloodsugarFilter != null  && $scope.appliedfilters.bloodsugarFilter != 0 && $scope.appliedfilters.bloodsugarFilter != '')
                          || (details.vitalslistforday.ppbs && details.vitalslistforday.ppbs !== '' && details.vitalslistforday.ppbs !== null && details.vitalslistforday.ppbs !== 0 && $scope.appliedfilters.bloodsugarFilter != false && $scope.appliedfilters.bloodsugarFilter != null && $scope.appliedfilters.bloodsugarFilter != 0 && $scope.appliedfilters.bloodsugarFilter != '')
 || (details.vitalslistforday.yogaactivity && details.vitalslistforday.yogaactivity !== null && details.vitalslistforday.yogaactivity !== 0 && details.vitalslistforday.yogaactivity !== '' &&  $scope.appliedfilters.selectedyoga !== false &&  $scope.appliedfilters.selectedyoga !== null &&  $scope.appliedfilters.selectedyoga !== '' &&  $scope.appliedfilters.selectedyoga !== 0 )
                          );
        };
    
   
 
    
    
        // 1 week blood sugar graph
      $scope.weekbs = function(){
        $scope.labels = [];
        $scope.data1 = [];
             var fbsarray = [];
             var rbsarray = [];
             var ppbsarray = [];
             $scope.yaxisbs = function(){
             angular.forEach($scope.healthdetails, function(details, key){
                 angular.forEach(details.medicalprofile,function(medicalprofiledata,keyobj){
                     //rbs value
                     if(typeof medicalprofiledata.profile[0].bloodsugar !== 'undefined'
                         && typeof medicalprofiledata.profile[0].bloodsugar.rbs !== 'undefined'
                         && medicalprofiledata.profile[0].bloodsugar.rbs !== ''
                         && medicalprofiledata.profile[0].bloodsugar.rbs !== null){
                          if(medicalprofiledata.profile[0].bloodsugar.rbs < 400){
                         rbsarray.push(medicalprofiledata.profile[0].bloodsugar.rbs);
                         }
                     }
                      //fbs value
                     if(typeof medicalprofiledata.profile[0].bloodsugar !== 'undefined'
                       && typeof medicalprofiledata.profile[0].bloodsugar.fbs !== 'undefined'
                       && medicalprofiledata.profile[0].bloodsugar.fbs !== ''
                       && medicalprofiledata.profile[0].bloodsugar.fbs !== null){
                          if(medicalprofiledata.profile[0].bloodsugar.fbs < 400){
                         fbsarray.push(medicalprofiledata.profile[0].bloodsugar.fbs);
                     }
                     }
                     //ppbs value
                     if(typeof medicalprofiledata.profile[0].bloodsugar !== 'undefined'
                       && typeof medicalprofiledata.profile[0].bloodsugar.ppbs !== 'undefined'
                       && medicalprofiledata.profile[0].bloodsugar.ppbs !== ''
                       && medicalprofiledata.profile[0].bloodsugar.ppbs !== null){
                          if(medicalprofiledata.profile[0].bloodsugar.ppbs < 400){
                         ppbsarray.push(medicalprofiledata.profile[0].bloodsugar.ppbs);
                     }
                     }
                 });
             });
             $scope.data1.push(rbsarray);
             $scope.data1.push(fbsarray);
             $scope.data1.push(ppbsarray);
 }
             $scope.yaxisbs();
             var weekdatesarray = [];

            var day = $filter('date')(new Date(), 'dd');
            var month = $filter('date')(new Date(), 'MM');
            var year = $filter('date')(new Date(), 'yyyy');
            for(var i=0; i<7;i++){
                weekdatesarray.push(getDate(year, month, day -i));
              }
              function getDate(year, month, day){
                   return new Date(year, month , day);
                 }

             angular.forEach($scope.healthdetails, function(details, key){
             angular.forEach(weekdatesarray, function( value, key){
               if( weekdatesarray[key].getDate() === details.createdat.day &&  weekdatesarray[key].getMonth()  === details.createdat.month&&   weekdatesarray[key].getFullYear() === details.createdat.year){
                $scope.labels.push('');
               }
              });
            });
          }
 //1 month blood sugar graph
 $scope.monthbs = function(){
     $scope.labels = [];
     $scope.data1 = [];
    var fbsarray = [];
    var rbsarray = [];
    var ppbsarray = [];

       $scope.yaxisbs();
       var montharray = [];
       var day = $filter('date')(new Date(), 'dd');
       var month = $filter('date')(new Date(), 'MM');
       var year = $filter('date')(new Date(), 'yyyy');

             function getDate(year, month, day){
              return new Date(year, month , day);
            }
            for(var j=0; j<30 ;j++){
              montharray.push(getDate(year, month, day -j));
            }

            angular.forEach($scope.healthdetails, function(details, key){
              angular.forEach(montharray, function( value, key){
                  if( montharray[key].getDate() === details.createdat.day &&  montharray[key].getMonth()  === details.createdat.month&&   montharray[key].getFullYear() === details.createdat.year){
                    $scope.labels.push('');
                }
              });
            });
          }
          // 3 months graph for blood sugar
    $scope.month3bs = function(){
    $scope.labels = [];
    $scope.data1 = [];
     var fbsarray = [];
     var rbsarray = [];
     var ppbsarray = [];
     $scope.yaxisbs();
     var montharray3 = [];
      var day = $filter('date')(new Date(), 'dd');
      var month = $filter('date')(new Date(), 'MM');
      var year = $filter('date')(new Date(), 'yyyy');

                function getDate(year, month, day){
                 return new Date(year, month , day);
               }

               for(var k=0; k<90; k++){
                 montharray3.push(getDate(year, month, day - k));
               }

               angular.forEach($scope.healthdetails, function(details, key){
                      angular.forEach(montharray3, function( value, key){
                        if( montharray3[key].getDate() === details.createdat.day &&  montharray3[key].getMonth()  === details.createdat.month&&   montharray3[key].getFullYear() === details.createdat.year){
                      $scope.labels.push('');
                    }
                  });
                });
              }
 //6 months for blood sugar

 $scope.month6bs = function(){
   $scope.labels = [];
 $scope.data1 = [];
    var fbsarray = [];
    var rbsarray = [];
    var ppbsarray = [];
   $scope.yaxisbs();
   var montharray6 = [];
    var day = $filter('date')(new Date(), 'dd');
    var month = $filter('date')(new Date(), 'MM');
    var year = $filter('date')(new Date(), 'yyyy');

     function getDate(year, month, day){
              return new Date(year, month , day);
            }
            for(var l=0; l<180; l++){
              montharray6.push(getDate(year, month, day - l));
            }
            angular.forEach($scope.healthdetails, function(details, key){
              angular.forEach(montharray6, function( value, key){
              if( montharray6[key].getDate() === details.createdat.day &&  montharray6[key].getMonth()  === details.createdat.month&&   montharray6[key].getFullYear() === details.createdat.year){
                $scope.labels.push('');
              }
            });
          });
        }

         $scope.labels = [];
   $scope.series  = ['fbs', 'rbs', 'ppbs'];
  $scope.data1 = [];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  // $scope.options = {
  //   scales: {
  //     yAxes: [
  //       {
  //         id: 'y-axis-1',
  //         label: '$scope.labels',
  //         type: 'linear',
  //         display: true,
  //         position: 'left'
  //       },
  //       {
  //         id: 'y-axis-2',
  //         label: '$scope.labels',
  //         type: 'linear',
  //         display: true,
  //         position: 'right'
  //       }
  //     ]
  //   }
  // };

     $scope.serieswt = ['weight'];
     $scope.labelswt = [];
     $scope.datawt = [];
     $scope.onClickwt = function (points, evt) {
    console.log(points, evt);
  };
  // $scope.datasetOverridewt = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  // $scope.optionswt = {
  //   scales: {
  //     yAxes: [
  //       {
  //         id: 'y-axis-1',
  //         type: 'linear',
  //         display: true,
  //         position: 'left'
  //       },
  //       {
  //         id: 'y-axis-2',
  //         type: 'linear',
  //         display: true,
  //         position: 'right'
  //       }
  //     ]
  //   }
  // };
 //6 months weight graph
     $scope.wtmonth6 = function(){

           $scope.labelswt = [];
     $scope.datawt = [];
         var wtarray = [];
         $scope.yaxiswt();
         var montharray6 = [];
         var day = $filter('date')(new Date(), 'dd');
         var month = $filter('date')(new Date(), 'MM');
         var year = $filter('date')(new Date(), 'yyyy');
          function getDate(year, month, day){
               return new Date(year, month , day);
             }

             for(var l=0; l<180; l++){
               montharray6.push(getDate(year, month, day - l));
             }
   angular.forEach($scope.healthdetails, function(details, key){
     angular.forEach(montharray6, function( value, key){
     if( montharray6[key].getDate() === details.createdat.day &&  montharray6[key].getMonth()  === details.createdat.month&&   montharray6[key].getFullYear() === details.createdat.year){
       $scope.labelswt.push('');
   }
 });
 });
 }
     //1 month for weight graph
     $scope.wtmonth = function(){
       $scope.labelswt = [];
     $scope.datawt = [];
     var wtarray = [];
   $scope.yaxiswt();
     var montharray = [];

            var day = $filter('date')(new Date(), 'dd');
            var month = $filter('date')(new Date(), 'MM');
            var year = $filter('date')(new Date(), 'yyyy');


   $scope.today = new Date();
          function getDate(year, month, day){
           return new Date(year, month , day);
         }
         for(var j=0; j<30 ;j++){
           montharray.push(getDate(year, month, day -j));

         }
   angular.forEach($scope.healthdetails, function(details, key){
     angular.forEach(montharray, function( value, key){
       if( montharray[key].getDate() === details.createdat.day &&  montharray[key].getMonth()  === details.createdat.month&&   montharray[key].getFullYear() === details.createdat.year){
                 $scope.labelswt.push('');
             }
           });
         });
       }
 // 1 week graph for weight
 $scope.wtweek = function(){
   $scope.labelswt = [];
 $scope.datawt = [];
 var wtarray = [];
 $scope.yaxiswt = function(){
 angular.forEach($scope.healthdetails, function(details, key){
     angular.forEach(details.medicalprofile, function(medicalprofiledata, keyobj){

         if(typeof medicalprofiledata.profile[0].weight !== 'undefined'
           && typeof medicalprofiledata.profile[0].weight.value !== 'undefined'
           && medicalprofiledata.profile[0].weight.value !== ''
           && medicalprofiledata.profile[0].weight.value !== null){
             if(medicalprofiledata.profile[0].weight.value < 500){
            wtarray.push(medicalprofiledata.profile[0].weight.value);
             }
            }


     });
 });

 $scope.datawt.push(wtarray);
 }
 $scope.yaxiswt();

 var weekdatesarray = [];

        var day = $filter('date')(new Date(), 'dd');
        var month = $filter('date')(new Date(), 'MM');
        var year = $filter('date')(new Date(), 'yyyy');

 $scope.today = new Date();

     for(var i=0; i<7;i++){

    weekdatesarray.push(getDate(year, month, day -i));

      }

      function getDate(year, month, day){
       return new Date(year, month , day);
     }
         var getdatesarray = [];
 angular.forEach($scope.healthdetails, function(details, key){
  angular.forEach(weekdatesarray, function( value, key){
    if( weekdatesarray[key].getDate() === details.createdat.day &&  weekdatesarray[key].getMonth()  === details.createdat.month&&   weekdatesarray[key].getFullYear() === details.createdat.year){
    $scope.labelswt.push('');
   }
 });
 });
 }
 // 3 month weight graph
 $scope.wtmonth3 = function(){

       $scope.labelswt = [];
 $scope.datawt = [];
     var wtarray = [];
     $scope.yaxiswt();
     var montharray3 = [];
            var day = $filter('date')(new Date(), 'dd');
            var month = $filter('date')(new Date(), 'MM');
            var year = $filter('date')(new Date(), 'yyyy');
             function getDate(year, month, day){
           return new Date(year, month , day);
         }

         for(var k=0; k<90; k++){
           montharray3.push(getDate(year, month, day - k));
         }
         angular.forEach($scope.healthdetails, function(details, key){
           angular.forEach(montharray3, function( value, key){
             if( montharray3[key].getDate() === details.createdat.day &&  montharray3[key].getMonth()  === details.createdat.month&&   montharray3[key].getFullYear() === details.createdat.year){
                $scope.labelswt.push('');
              }
            });
          });
        }

  $scope.labelsbp = [];
             $scope.seriesbp  = ['systolic', 'diastolic'];
             $scope.data1bp = [];
             $scope.onClickbp = function (points, evt) {
    console.log(points, evt);
  };
  //            $scope.datasetOverridebp = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  // $scope.optionsbp = {
  //   scales: {
  //     yAxes: [
  //       {
  //         id: 'y-axis-1',
  //         type: 'linear',
  //         display: true,
  //         position: 'left'
  //       },
  //       {
  //         id: 'y-axis-2',
  //         type: 'linear',
  //         display: true,
  //         position: 'right'
  //       }
  //     ]
  //   }
  // };
 // 1 week bp graph
     $scope.weekbp = function(){
          $scope.data1bp = [];
         $scope.labelsbp = [];
                 var sysarray = [];
                 var diastolicarray = [];
                 $scope.yaxisbp = function(){
                 angular.forEach($scope.healthdetails, function(details, keybp){
                     angular.forEach(details.medicalprofile, function(medicalprofiledata, keyobjbp){
                         if(typeof medicalprofiledata.profile[0].bloodpressure !== 'undefined'
                           && typeof medicalprofiledata.profile[0].bloodpressure.systolic !== 'undefined'
                           && medicalprofiledata.profile[0].bloodpressure.systolic !== ''
                           && medicalprofiledata.profile[0].bloodpressure.systolic !== null){
                             if(medicalprofiledata.profile[0].bloodpressure.systolic < 250){
                             sysarray.push(medicalprofiledata.profile[0].bloodpressure.systolic);
                             }
                            }
                         if(typeof medicalprofiledata.profile[0].bloodpressure !== 'undefined'
                           && typeof medicalprofiledata.profile[0].bloodpressure.diastolic !== 'undefined'
                           && medicalprofiledata.profile[0].bloodpressure.diastolic !== ''
                           && medicalprofiledata.profile[0].bloodpressure.diastolic !== null){
                             diastolicarray.push(medicalprofiledata.profile[0].bloodpressure.diastolic);
                         }
                     });
                 });
                 $scope.data1bp.push(sysarray);
                $scope.data1bp.push(diastolicarray);
              }
              $scope.yaxisbp();
                var weekdatesarray = [];
                       var day = $filter('date')(new Date(), 'dd');
                       var month = $filter('date')(new Date(), 'MM');
                       var year = $filter('date')(new Date(), 'yyyy');
                       for(var i=0; i<7;i++){
                         weekdatesarray.push(getDate(year, month, day -i));
                       }
                       function getDate(year, month, day){
                         return new Date(year, month , day);
                       }
                       angular.forEach($scope.healthdetails, function(details, key){
                         angular.forEach(weekdatesarray, function( value, key){
                           if( weekdatesarray[key].getDate() === details.createdat.day &&  weekdatesarray[key].getMonth()  === details.createdat.month&&   weekdatesarray[key].getFullYear() === details.createdat.year){
                               $scope.labelsbp.push('');
                             }
                           });
                         });
                       }

               //1 month bp
               $scope.monthbp = function(){
               $scope.data1bp = [];
               $scope.labelsbp = [];
               var sysarray = [];
               var diastolicarray = [];
               $scope.yaxisbp();
               var montharray = [];

                                 var day = $filter('date')(new Date(), 'dd');
                                 var month = $filter('date')(new Date(), 'MM');
                                 var year = $filter('date')(new Date(), 'yyyy');


                           function getDate(year, month, day){
                                return new Date(year, month , day);
                              }
                              for(var j=0; j<30 ;j++){
                                montharray.push(getDate(year, month, day -j));

                              }
                        angular.forEach($scope.healthdetails, function(details, key){
                          angular.forEach(montharray, function( value, key){
                                    if( montharray[key].getDate() === details.createdat.day &&  montharray[key].getMonth()  === details.createdat.month&&   montharray[key].getFullYear() === details.createdat.year){
                                      $scope.labelsbp.push('');
                                  }

                                       });
                                       });

                         }
                         // 3 month graph for bp
                         $scope.month3bp = function(){
                              $scope.data1bp = [];
                             $scope.labelsbp = [];
                                     var sysarray = [];
                                     var diastolicarray = [];
                                     $scope.yaxisbp();

                                    var montharray3 = [];
                                           var day = $filter('date')(new Date(), 'dd');
                                           var month = $filter('date')(new Date(), 'MM');
                                           var year = $filter('date')(new Date(), 'yyyy');

                                   function getDate(year, month, day){
                                          return new Date(year, month , day);
                                        }

                                        for(var k=0; k<90; k++){
                                          montharray3.push(getDate(year, month, day - k));
                                        }
                                    angular.forEach($scope.healthdetails, function(details, key){
                                      angular.forEach(montharray3, function( value, key){
                                              if( montharray3[key].getDate() === details.createdat.day &&  montharray3[key].getMonth()  === details.createdat.month&&   montharray3[key].getFullYear() === details.createdat.year){
                                               $scope.labelsbp.push('');
                                             }
                                           });
                                         });
                                       }
                 // 6 month bp graph

                 $scope.month6bp = function(){
                      $scope.data1bp = [];
                     $scope.labelsbp = [];
                             var sysarray = [];
                             var diastolicarray = [];
                             $scope.yaxisbp();

                            var montharray6 = [];
                            var day = $filter('date')(new Date(), 'dd');
                            var month = $filter('date')(new Date(), 'MM');
                            var year = $filter('date')(new Date(), 'yyyy');
                            function getDate(year, month, day){
                                  return new Date(year, month , day);
                                }

                                for(var l=0; l<180; l++){
                                  montharray6.push(getDate(year, month, day - l));
                                }
                            angular.forEach($scope.healthdetails, function(details, key){
                            angular.forEach(montharray6, function( value, key){
                            if( montharray6[key].getDate() === details.createdat.day &&  montharray6[key].getMonth()  === details.createdat.month&&   montharray6[key].getFullYear() === details.createdat.year){
                            $scope.labelsbp.push('');
                            }
                          });
                        });
                      }
}])

.controller('TermsCtrl',['$scope','$state','$ionicHistory', function($scope, $state, $ionicHistory){
      $scope.backButtonAction = function(){
        $scope.shouldShowDelete = false;
        $ionicHistory.goBack();
      };
      $scope.greeting = 'You must agree with the terms and conditions';
      $scope.doGreeting = function(greeting) {
          alert(greeting);
      };
      $scope.close = function(){
        $state.go('signup');
      };
}])
.controller('AboutusCtrl',['$scope', '$ionicHistory',function($scope,$ionicHistory){
     $scope.backButtonAction = function(){
        $scope.shouldShowDelete = false;
        $ionicHistory.goBack();
      };
}])
.controller('FamilyCtrl',['$scope','$ionicModal','$ionicHistory','familymemberservice','DBA','registrationdetsdb','ionicDatePicker','$filter',function($scope,$ionicModal,$ionicHistory,familymemberservice,DBA,registrationdetsdb,ionicDatePicker,$filter){
     $scope.backButtonAction = function(){
    $scope.shouldShowDelete = false;
    $ionicHistory.goBack();
  };
    
    
    // DatePicker object with callbcak to obtain the date
	 var ipObj1 = {
     callback: function (val) {  //Mandatory
         console.log('Return value from the datepicker popup is : ' + val, new Date(val));
         $scope.formData.dateofbirth = $filter('date')(val, "dd MMM yyyy");
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
    
    
  $ionicModal.fromTemplateUrl('addfamilymember.html',{
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.familymodal = modal;
  });
   $scope.openModal = function(){
     $scope.familymodal.show();
      // getmemberdetail();
   }
   $scope.closeModal = function(){
       $scope.familymodal.hide();
        getmemberdetail();
   }

   $scope.formData = [];
   $scope.$on("$ionicView.loaded", function(event, data){
  // $rootScope.showLoader();
  getmemberdetail();
 });
   $scope.save = function(fdata){
     if( $scope.formData.male === true){
       $scope.formData.gender = "male";
     }else{
       $scope.formData.gender = "female";
     }
     registrationdetsdb.query({}).then(function(response){
         var result = DBA.getById(response);
         $scope.patientId = result.appregistrationid;
    familymemberservice.savedetails($scope.patientId,{
    firstname: fdata.firstname,
    lastname:fdata.lastname,
    gender:fdata.gender,
    emailid:fdata.emailadd,
    mobnum:fdata.mobilenumber,
    age: fdata.age,
   dob:fdata.dateofbirth
     }).then(function(data){
        if(data.status == 'SUCCESS'){
            $scope.familydata = data;
          //  console.log("calling SUCCESS");
            console.log($scope.familydata);
            $scope.closeModal();
             }
  }).catch(function(error){
  //    $rootScope.hideLoader();
      $rootScope.showPopup({
           title : 'Error'
          ,template:'We are experiencing problem in saving'
        }, function(res){
          console.log('on click ok');
        });
    });
  }).catch(function(error){
  //   $rootScope.hideLoader();
     $rootScope.showPopup({title:'Error', template:"Unable to process the request, please try  again!!"}, function(res){
     });
  });
    // console.log($scope.formData);

}
var getmemberdetail = function(){
  registrationdetsdb.query({}).then(function(response){
      var result = DBA.getById(response);
      $scope.patientId = result.appregistrationid;
  familymemberservice.getdetails($scope.patientId).then(function(data){
  //  console.log($scope.patientId);
    $scope.memberprofile = data.data;

    console.log($scope.memberprofile);
  }).catch(function(error){
  if(error.status === 404){

      $rootScope.showPopup({
        title:'Info',
        template:"Sorry get method"}, function(res){
          console.log('on click ok');
        });
  }
  else{
    $rootScope.showPopup({
      title : 'Error'
      ,template:'We are experiencing problem '}, function(res){
        console.log('on click ok');
    });
  }
  });
}).catch(function(error){
  // $rootScope.hideLoader();
   $rootScope.showPopup({title:'Error', template:"Unable to process the request, please try  again!!"}, function(res){
   });
});

}

}])

.controller('InboxOfAllMsgCtrl', ['$scope', '$rootScope','$stateParams', '$ionicPopup', '$state', '$ionicFilterBar','hospitalservice', 'visitservice', '$ionicModal', 'DBA','registrationdetsdb','$cordovaInAppBrowser','$ionicPopover','$ionicSlideBoxDelegate', 'socket','loginservice','$cordovaFile','feedbackservice',function($scope, $rootScope, $stateParams, $ionicPopup, $state, $ionicFilterBar, hospitalservice,  visitservice, $ionicModal, DBA, registrationdetsdb, $cordovaInAppBrowser, $ionicPopover,$ionicSlideBoxDelegate, socket, loginservice, $cordovaFile, feedbackservice){
      $scope.openModalfilter = function(){
        $ionicModal.fromTemplateUrl('filterPatientDetails.html',{
            scope: $scope,
            animation: 'slide-in-left'
        }).then(function(modal){
            $scope.filtermodal = modal;
            $scope.filtermodal.show();
        });
      };
      $scope.closeModalfilter = function(){
         $scope.filtermodal.remove();
      };
      $scope.appliedfilters = {
         "backup":{"patientnameselected" : ["All"]
                    ,"visittypeselected"  : []
                    ,"hospitalnameselected" : ["All"]
                    ,"docswithattachment" : false
                    ,"isFilterApplied" : false}
         ,"patientnameselected" : ["All"]
         ,"visittypeselected"  : []
         ,"hospitalnameselected" : ["All"]
         ,"docswithattachment" : false
         ,"isFilterApplied" : false
      };
       $scope.filtersavailable = {
         "patientnames"   : ["All"]
         ,"visittypes"    : []
         ,"hospitalnames" : ["All"]
       };

       $scope.filterCancel = function(){
          $scope.closeModalfilter();
          //copy from backup of previous filter in case of cancel press
          $scope.appliedfilters.patientnameselected=JSON.parse(JSON.stringify($scope.appliedfilters.backup.patientnameselected));
          $scope.appliedfilters.visittypeselected=JSON.parse(JSON.stringify($scope.appliedfilters.backup.visittypeselected));
          $scope.appliedfilters.hospitalnameselected=JSON.parse(JSON.stringify($scope.appliedfilters.backup.hospitalnameselected));
          $scope.appliedfilters.docswithattachment=$scope.appliedfilters.backup.docswithattachment;
          $scope.appliedfilters.isFilterApplied=$scope.appliedfilters.backup.isFilterApplied;
       };

       $scope.filterSetAll = function(){
         $scope.appliedfilters.patientnameselected[0]=JSON.parse(JSON.stringify($scope.filtersavailable.patientnames[0]));
            console.log($scope.appliedfilters.patientnameselected[0]);
         $scope.appliedfilters.visittypeselected=JSON.parse(JSON.stringify($scope.filtersavailable.visittypes));
         console.log($scope.appliedfilters.visittypeselected); $scope.appliedfilters.hospitalnameselected[0]=JSON.parse(JSON.stringify($scope.filtersavailable.hospitalnames[0]));
           console.log($scope.appliedfilters.hospitalnameselected[0]);
         $scope.appliedfilters.docswithattachment=false;
       };

       $scope.filterapply = function(){
         $scope.closeModalfilter();
         var filteredkey=0;
         var allPatients=false, allHospitals=false, allVisittypes=false, docswithattachment=true;

         if(($scope.backupvisitinfo.length != 0) || $scope.backupvisitinfo){
            if(angular.equals($scope.appliedfilters.patientnameselected[0],"All"))
                allPatients=true;
            if(angular.equals($scope.appliedfilters.hospitalnameselected[0],"All"))
                allHospitals=true;
            if($scope.appliedfilters.visittypeselected.length == $scope.filtersavailable.visittypes.length)
                allVisittypes=true;
            if($scope.appliedfilters.docswithattachment == false)
                docswithattachment=false;
            if((allPatients==true) && (allHospitals==true) && (allVisittypes==true) && (docswithattachment==false))
            {
              $scope.appliedfilters.isFilterApplied=false;
              if(!angular.isUndefined($scope.backupvisitinfo))
              {
                //No need to apply filter
                $scope.visitinfo=JSON.parse(JSON.stringify($scope.backupvisitinfo));
              }
              //If no backupvisitinfo leave visitinfo as is.
            }else{
              //fillter need to be applied
              $scope.appliedfilters.isFilterApplied=true;
              if(angular.isUndefined($scope.backupvisitinfo)){
                //this check may not be needed any more, to be removed after checking
                $scope.backupvisitinfo = JSON.parse(JSON.stringify($scope.visitinfo));
              }
              else{
                $scope.visitinfo=JSON.parse(JSON.stringify($scope.backupvisitinfo));
              }
              //filter only hospital list first if hospital filter is applied
              if(allHospitals == false){
                  angular.forEach($scope.visitinfo,function (visitdata,key){
                      angular.forEach($scope.appliedfilters.hospitalnameselected,function (hospitalname,key){
                          if(angular.equals(hospitalname,visitdata.hospitalid.hospitalname)){
                              $scope.visitinfo[filteredkey]=visitdata;
                              filteredkey++;
                              //break;
                            }
                      });
                  });
                  $scope.visitinfo.length=filteredkey;
              }
              filteredkey=0;
              //Now apply all other filters on hospital filter
              angular.forEach($scope.visitinfo,function (visitdata,key){
                  if((( allPatients == true) || angular.equals($scope.appliedfilters.patientnameselected[0],(visitdata.patientregprofiles.firstname +' '+visitdata.patientregprofiles.lastname)))
                      && ((allVisittypes == true) || angular.equals($scope.appliedfilters.visittypeselected[0],visitdata.visitid.visittype))
                      && (( docswithattachment == false) || (visitdata.reporturl))){
                        $scope.visitinfo[filteredkey]=visitdata;
                        filteredkey++;
                      }//end of if
              });//end of forEach
              $scope.visitinfo.length=filteredkey;
            }//end of else
          }else{//visitinfo =0 or backupvisitinfo=undefined
              //No data to filter show error msg
              //no need to open modal
              $scope.appliedfilters.isFilterApplied=false;
              $rootScope.showPopup({title:'Filter Error', template:"No data to Filter"});
          }
       };//end of filterapply

       $scope.filterdetails = function(visitid){
         //There is no data no need to show filter
         if(($scope.backupvisitinfo) || ($scope.visitinfo && ($scope.visitinfo.length != 0))){
            if(angular.isUndefined($scope.backupvisitinfo))
            {
                var firstEntry=true;
                $scope.backupvisitinfo=JSON.parse(JSON.stringify($scope.visitinfo));
            }
            angular.forEach($scope.backupvisitinfo, function(visitdata, key1){
                //Fill patientnames
                if($scope.filtersavailable.patientnames.length == 1){
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
                 if($scope.filtersavailable.hospitalnames.length == 1){
                   $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                 }else{
                    var namefound = false;
                    angular.forEach($scope.filtersavailable.hospitalnames, function(value, key2){
                        if(angular.equals(value,visitdata.hospitalid.hospitalname)){
                            namefound = true;
                        }
                    });
                    if(!namefound){
                      $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                    }
                  }
            });
            if(firstEntry){
              //fill appliedfilters array for the first time
              $scope.filterSetAll();
              $scope.appliedfilters.isFilterApplied=false;
              firstEntry=false;
            }
            //keep a backup copy of previous filter incase of cancel press
            $scope.appliedfilters.backup.patientnameselected=JSON.parse(JSON.stringify($scope.appliedfilters.patientnameselected));
            $scope.appliedfilters.backup.visittypeselected=JSON.parse(JSON.stringify($scope.appliedfilters.visittypeselected));
            $scope.appliedfilters.backup.hospitalnameselected=JSON.parse(JSON.stringify($scope.appliedfilters.hospitalnameselected));
            $scope.appliedfilters.backup.docswithattachment=$scope.appliedfilters.docswithattachment;
            $scope.appliedfilters.backup.isFilterApplied=$scope.appliedfilters.isFilterApplied;
            //display filter modal
            $scope.openModalfilter();
        }else{
            //No data to filter show error msg
            //no need to open modal
            $rootScope.showPopup({title:'Filter Error', template:"No data to Filter"});
        }
      };//end of filterdetails
      //hospital info modal
      $scope.myActiveSlide = 0;
      $scope.openPopover = function($event) {
        $scope.$parent.openPopover($event);
      };
      $scope.closePopover = function() {
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

    $scope.$on("$ionicView.loaded", function(event, data){
$scope.fetchdata();
      });
      $scope.fetchdata = function(){
              $scope.shouldShowReorder = false;
              $scope.shouldShowDelete  = false;
              $scope.listCanSwipe = true;
              $scope.filterBarInstance;
              $scope.patientId = '';
              $scope.notinfo =[];
              $scope.visitinfo=[];

              $rootScope.showLoader();
              registrationdetsdb.query({}).then(function(response){
                  var result = DBA.getById(response);
                  $scope.patientId = result.appregistrationid;
                  if($stateParams.hospitalid === '123'){
                    visitservice.getVisits($scope.patientId).then(function(data){
                        $scope.$broadcast('scroll.refreshComplete');
                        $rootScope.hideLoader();
                        $scope.visitinfo = data.data;

                    }).catch(function(error){
                      if(error.status === 404){
                        $scope.$broadcast('scroll.refreshComplete');
                        $rootScope.hideLoader();
                          $rootScope.showPopup({
                            title:'Info',
                            template:"Visit data yet to be added, check with your hospital."}, function(res){
                              console.log('on click ok');
                            });
                      }else{
                       $scope.$broadcast('scroll.refreshComplete');
                        $rootScope.hideLoader();
                        $rootScope.showPopup({
                          title : 'Error'
                          ,template:'We are experiencing problem retrieving your visit information'}, function(res){
                            console.log('on click ok');
                        });
                      }
                    });

                  }else{
                    visitservice.getvisitdets($scope.patientId, $stateParams.hospitalid).then(function(data){
                        $rootScope.hideLoader();
                        $scope.visitinfo = data.data;

                    }).catch(function(error){
                      $rootScope.hideLoader();
                      $rootScope.showPopup({
                           title : 'Error'
                          ,template:'We are experiencing problem retrieving your visit information'
                        }, function(res){
                          console.log('on click ok');
                        });
                    });
                  }

              }).catch(function(err){
                $rootScope.hideLoader();
                $rootScope.showPopup({title:'Error', template:"Unable to process the request, please try  again!!"}, function(res){
                });
              });
    //    }//riz added for refresh close
}
$scope.reloadNotifications=function(){

  $scope.fetchdata();
    console.log("call reload");
}

      $scope.notifications = function(visitid){
          visitservice.savevisitinfo($scope.patientId, visitid).then(function(data){
			        $scope.notinfo = data.data;
              $scope.openModal5();
		      }).catch(function(error){
              $rootScope.showPopup({title:'System Error', template:"Unable to process the request, please try  again!!"}, function(res){
              });
          });
	    };

    	$scope.openModal5 = function() {
        $ionicModal.fromTemplateUrl('my-modal5.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal5 = modal;
          $scope.modal5.show();
        });
      };
    	$scope.closeModal5 = function() {
        	$scope.modal5.remove();
    	};
      $scope.patientdetails = function(visitid){
          $scope.visitdata = {
              "patientdetails" : "",
               "hospitaldetails" : "",
              "visitdetails" : ""
          };
          angular.forEach($scope.visitinfo, function(value, key){
              if(value._id === visitid){
                  $scope.visitdata.patientdetails = value.patientregprofiles;
                  $scope.visitdata.hospitaldetails = value.hospitalid;
                    $scope.visitdata.visitdetails = value.visitid;
                  console.log($scope.visitdata.patientdetails);
              }
          });
          // angular.forEach($scope.visitinfo, function(value, key){
          //     if(value._id === visitid){
          //
          //         console.log($scope.visitdata.hospitaldetails);
          //     }
          // });
          // angular.forEach($scope.visitinfo, function(value, key){
          //     if(value._id === visitid){
          //         $scope.visitdata.visitdetails = value.visitid;
          //         console.log($scope.visitdata.visitdetails.doctorid);
          //
          //     }
          // });
          //perform service call to doctor profile details
        var docProfilePromise = visitservice.getdocdetail($scope.visitdata.visitdetails.doctorid);
          docProfilePromise.then(function(profiledata){
              $scope.visitdata.visitdetails["docname"] = profiledata.firstname + " " + profiledata.lastname;
          }).catch(function(err){
              $rootScope.showToast("Error fetching Doctor Profile Details","short","top");
          });

          $scope.openModal3();
      };
    	$scope.openModal3 = function() {
          $ionicModal.fromTemplateUrl('patientdetails.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
      };
    	$scope.closeModal3 = function() {
        	$scope.modal.remove();
    	};
      $scope.openPDFViewer = function(){
        $ionicModal.fromTemplateUrl('pdf-viewer.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.pdfviewermodal = modal;
            $scope.pdfviewermodal.show();
        });
      };
      $scope.hidePDFViewerModal = function(){
        $scope.pdfviewermodal.remove();
      };
      var profiledata = loginservice.getProfileData();
      if(socket !== null){
        socket.on('connect', function(){
          console.log('socket connected successfully');
          socket.emit('appregistrationid',$scope.patientId);
        });
        socket.on('documentrecieved', function(data){
           var datarecieved = data;
           console.log('printing parsed data recieved ['+ data + ']');
           if(data && data === 'ERROR'){
             $rootScope.hideLoader();
             $rootScope.showToast('Document is unavailable/error retrieving the document, please try again later', 'long','center');
           }else{
             $rootScope.hideLoader();
             try{
               var uint8array = base64ToUint8Array(datarecieved);
               var blob = new Blob([uint8array],{type:'application/pdf'});
               //below 2 lines are working code commented for testing...
               $scope.pdfUrl = URL.createObjectURL(blob);
               $scope.openPDFViewer();
               //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
               window.resolveLocalFileSystemURL("file:///storage/emulated/0/", function(dir) {
                  dir.getDirectory("TracMyHealth",{create:true}, function(direntry){
                    var filename = "labreport_"+(new Date()).getTime()+".pdf";
                    direntry.getFile(filename, {create:true}, function(file) {
                      console.log("File created succesfully.");
                      file.createWriter(function(fileWriter) {
                          console.log("Writing content to file");
                          fileWriter.write(blob);
                          $rootScope.showToast("Report has also been downloaded to your device",'long','center');
                      }, function(err){
                          $rootScope.showToast("Couldn't download the report, please try again",'long','center');
                      });
                    });
                  });
                });
              }catch(error){
                $rootScope.showToast("Couldn't download the report, please try again",'long','center');
              }
            }
        });
      };
      function base64ToUint8Array(base64) {
        var raw = atob(base64);
        var uint8Array = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) {
          uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
      };
      $scope.downloaddocument = function(visit){
        $rootScope.showLoader();
        var data = {
          "visitid" : visit.visitid.visitid,
          "appregistrationid" : visit.visitid.patientregno,
          "labrefno" : visit.visitid.labrefno,
          "hospitalroutingkey" : visit.hospitalid.hospitalroutingkey[0]
        };
        socket.emit('documentrequest',data);
      };
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
      //popup to show feedback
    var ifentered = false;
      $scope.showMyPopup = function(hospitalid, visitid, patientregprofileid) {
           if(!ifentered){
                ifentered = true;
          $scope.feedbackanswers  = {};
          // ratings callback function , obtains the current slide and updates the object answer
          $scope.ratingsCallback = function(rating) {
            $scope.i= $ionicSlideBoxDelegate.$getByHandle('feedbackdata').currentIndex();
             $scope.next=function(){
                  $ionicSlideBoxDelegate.$getByHandle('feedbackdata').next();
                                    }
             $scope.previous = function() {
    $ionicSlideBoxDelegate.enableSlide(true);
    $ionicSlideBoxDelegate.previous();
    $ionicSlideBoxDelegate.enableSlide(false);
  };
                  $scope.feedbackanswers[$scope.i] = rating;
            if($scope.i === $scope.questions.length - 1){
              //call service to save the feedback data..
              var feedbackresponse = [];
              angular.forEach($scope.questions,function(question, key){
                if($scope.feedbackanswers[key] !== "undefined"){
                  feedbackresponse.push({
                    "id" : question._id,
                    "answer":$scope.feedbackanswers[key]
                  });
                }
              });
             feedbackservice.save(hospitalid,patientregprofileid,visitid,{"feedbackdets":feedbackresponse}).then(function(data){
                $rootScope.showToast('Thank you for your valuable feedback','long','top');
                  ifentered = false;
             }).catch(function(error){
               $rootScope.showToast('Error saving feedback, please retry again','short','center');
             });
             $scope.closepopup();
           }
         };
         feedbackservice.feedbackQueries(hospitalid).then(function(data){
             $scope.questions = data.data[0].questions;
             // An elaborate, custom popup
       	     var myPopup = $ionicPopup.show({
     		           template: '<ion-slide-box show-pager="false" delegate-handle="feedbackdata" ><ion-slide ng-repeat="quest in questions"><h4>{{quest.questiontext}}</h4><ion-item class="item-input" > &nbsp;&nbsp;&nbsp;&nbsp;<button class="button-clear" ng-click="previous()"> <i class="icon ion-chevron-left dark"></i></button>&nbsp;&nbsp;<label class="item-input"><ionic-ratings ratingsobj="ratingsObject"></ionic-ratings ></label> &nbsp;&nbsp;&nbsp;&nbsp;<button class="button-clear"  ng-click="next()"><i class="icon ion-chevron-right dark"></i></button></ion-item><button class="button button-full button-assertive"  ng-click="closepopup()">Not Now</button></ion-slide></ion-slide-box>',
     		           title: 'Feedback',
     		           scope: $scope
                 });

         	  //popup close
           	 $scope.closepopup = function(){
           		  myPopup.close();
                 ifentered = false;
           	 }
          }).catch(function(error){
             $rootScope.showToast("Error displaying feedqueries, please try again later",'long','top')
          });
              };
      }
}])

.controller('LogoutCtrl', ['$scope','$rootScope','$route','$state','$ionicHistory','registrationdetsdb',function($scope, $rootScope, $route, $state, $ionicHistory, registrationdetsdb){
    //deleting the jsonwebtoken as there is a logout request by the user..
    $rootScope.showLoader();
    registrationdetsdb.updateJWTWithoutMobileNo({jsonwebtoken:null}).then(function(response){
        $rootScope.hideLoader();
        $scope.closePopover();
        $state.go('login');
        $route.reload();
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
  
}])
.controller('DoctortabCtrl', ['$scope','$rootScope','$stateParams', '$ionicPopup','$ionicModal','$state','doctortabservice','DBA','registrationdetsdb','$cordovaInAppBrowser','$ionicFilterBar','$ionicSlideBoxDelegate','socket',function($scope ,$rootScope,$stateParams, $ionicPopup,$ionicModal,$state,doctortabservice,DBA, registrationdetsdb,$cordovaInAppBrowser, $ionicFilterBar,$ionicSlideBoxDelegate,socket){
       
      $ionicModal.fromTemplateUrl('filterDoctortabdetails.html',{
          scope: $scope,
          animation: 'slide-in-left'
      }).then(function(modal){
          $scope.filtermodal = modal;
      });
       $scope.openModalfilter = function(){
          $scope.filtermodal.show();
       };
       $scope.closeModalfilter = function(){
          $scope.filtermodal.hide();
       };
       //Filters applied
       $scope.appliedfilters = {
         "backup":{"hospitalnameselected" : ["All"]
                  ,"docswithattachment" : false
                  ,"isFilterApplied": false}
         ,"hospitalnameselected" : ["All"]
         ,"docswithattachment" : false
         ,"isFilterApplied": false
       };
       $scope.filtersavailable = {
         "hospitalnames" : ["All"]
       };

       $scope.filterCancel = function(){
          //copy of backup filter values in case of cancel press
          $scope.appliedfilters.hospitalnameselected=angular.copy($scope.appliedfilters.backup.hospitalnameselected);
          $scope.appliedfilters.docswithattachment=$scope.appliedfilters.backup.docswithattachment;
          $scope.appliedfilters.isFilterApplied=$scope.appliedfilters.backup.isFilterApplied;
          $scope.closeModalfilter();
       };

       $scope.filterSetAll = function(){
         $scope.appliedfilters.hospitalnameselected[0]=angular.copy("All");
         $scope.appliedfilters.docswithattachment=false;
       };

       $scope.filterapply = function(){
           var filteredkey=0;
           var allHospitals=false, docswithattachment=true;
           if(($scope.drvisitinfo.length != 0) || $scope.backupdrvisitinfo){
              if(angular.equals($scope.appliedfilters.hospitalnameselected[0],"All"))
                  allHospitals=true;
              if($scope.appliedfilters.docswithattachment == false)
                  docswithattachment=false;

              if((allHospitals==true) && (docswithattachment==false))
              {
                $scope.appliedfilters.isFilterApplied=false;
                if($scope.backupdrvisitinfo)
                {
                  //No need to apply filter all to be displayed
                  $scope.drvisitinfo=angular.copy($scope.backupdrvisitinfo);
                }
                //If no backupdrvisitinfo leave visitinfo as is.
              }else{
                //fillter need to be applied
                $scope.appliedfilters.isFilterApplied=true;
                $scope.drvisitinfo=angular.copy($scope.backupdrvisitinfo);
                if(allHospitals == false){
                    angular.forEach($scope.drvisitinfo,function (drVisitdata,key){
                        angular.forEach($scope.appliedfilters.hospitalnameselected,function (hospitalname,key){
                            if(angular.equals(hospitalname,drVisitdata.hospitalid.hospitalname)){
                                $scope.drvisitinfo[filteredkey]=drVisitdata;
                                filteredkey++;
                                //break;
                              }
                        });
                    });
                    $scope.drvisitinfo.length=filteredkey;
                }
                filteredkey=0;
                angular.forEach($scope.drvisitinfo,function (visitdata,key){
                  if(( docswithattachment == false) || (visitdata.reporturl !== undefined)){
                        $scope.drvisitinfo[filteredkey]=visitdata;
                        filteredkey++;
                  }//end of if
                });//end of forEach
                $scope.drvisitinfo.length=filteredkey;
              }//end of else
            }else{
              //No data to filter show error msg
              //no need to open modal
              $rootScope.showPopup({title:'Filter Error', template:"No data to filter"});
              $scope.appliedfilters.isFilterApplied=false;
            }
            $scope.closeModalfilter();
        };//end of filterapply

        $scope.filterdetails = function(visitid){
           if(($scope.backupdrvisitinfo != undefined) || (($scope.drvisitinfo != undefined ) && ($scope.drvisitinfo.length != 0 ))){
             if($scope.backupdrvisitinfo == undefined)
                 $scope.backupdrvisitinfo=angular.copy($scope.drvisitinfo);

             angular.forEach($scope.backupdrvisitinfo, function(visitdata, key1){
                if($scope.filtersavailable.hospitalnames.length === 0){
                    $scope.filtersavailable.hospitalnames.push("All");
                    $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                }else{
                    var namefound = false;
                    angular.forEach($scope.filtersavailable.hospitalnames, function(value, key2){
                       if(angular.equals(value, visitdata.hospitalid.hospitalname)){
                          namefound = true;
                       }
                    });
                    if(!namefound){
                       $scope.filtersavailable.hospitalnames.push(visitdata.hospitalid.hospitalname);
                    }
                  }
              });
              //keep a copy of backup filter values in case of cancel press
              $scope.appliedfilters.backup.hospitalnameselected=angular.copy($scope.appliedfilters.hospitalnameselected);
              $scope.appliedfilters.backup.docswithattachment=$scope.appliedfilters.docswithattachment;
              $scope.appliedfilters.backup.isFilterApplied=$scope.appliedfilters.isFilterApplied;
              $scope.openModalfilter();
            }else{
                //No data to filter show error msg
                //no need to open modal
                $rootScope.showPopup({title:'Filter Error', template:"No data to filter"});
            }
        };//end of filterdetails
         $scope.showFilterBar = function(){
           filterBarInstance = $ionicFilterBar.show({
             items:$scope.drvisitinfo,
             update:function(filteredItemList){
                 $scope.drvisitinfo = filteredItemList;
             },
             expression:function(filterText, value, index, array){
                 return ( value.notificationtext.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                         || value.hospitalid.hospitalname.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                         || value.hospitalid.hospitaltelnumber.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
                        )
             }
           });
         };

        $scope.$on("$ionicView.loaded", function(event, data){
$scope.docfetch();
         });
         $scope.docfetch = function(){
         $scope.drvisitinfo=[];
         $scope.notinfo=[];
         $scope.filterBarInstance;

         $rootScope.showLoader();
         registrationdetsdb.query({}).then(function(response){
           var result = DBA.getById(response);
           $scope.doctorid =  result.appregistrationid;
           doctortabservice.getdctdets($scope.doctorid).then(function(data){
                 $scope.$broadcast('scroll.refreshComplete');
              $rootScope.hideLoader();
              $scope.drvisitinfo = data.data;
               console.log($scope.drvisitinfo);
            }).catch(function(error){
              if(error.status === 404){
                   $scope.$broadcast('scroll.refreshComplete');
                  $rootScope.hideLoader();
                  $rootScope.showPopup({
                    title:'Info',
                    template:"Hospital visits yet to be added, check with your hospital."}, function(res){
                      console.log('on click ok');
                    });
              }else{
                   $scope.$broadcast('scroll.refreshComplete');
                $rootScope.hideLoader();
                $rootScope.showPopup({
                  title : 'Error'
                  ,template:'We are experiencing problem retrieving your visit information'}, function(res){
                });
              }
            });
         }).catch(function(err){
              $rootScope.hideLoader();
              $rootScope.showPopup({title:'Error', template:"Unable to process the request, please try  again!!"}, function(res){
              });
         });
       }
       $scope.reloaddocNotifications = function(){
         $scope.docfetch();
       }


         /*
         $scope.downloaddocument = function(url){
           var options = {
             location: 'yes',
             clearcache: 'yes',
             toolbar: 'no'
           };
           $cordovaInAppBrowser.open(encodeURI(url), '_system', options)
           .then(function(event) {
           }).catch(function(event) {
           });
         };*/
         $scope.downloaddocument = function(visit){
           $rootScope.showLoader();
           var data = {
             "visitid" : visit.visitid.visitid,
             "appregistrationid" : visit.visitid.patientregno,
             "labrefno" : visit.visitid.labrefno,
             "hospitalroutingkey" : visit.hospitalid.hospitalroutingkey[0]
           };
           socket.emit('documentrequest',data);
         };
         $scope.notification = function(patientid, visitid){
            doctortabservice.fetchvisit($scope.doctorid,patientid,visitid).then(function(data){
			          $scope.notinfo = data.data;
                $scope.openModal5();
		        }).catch(function(error){
                $rootScope.showPopup({title:'Error',template:'We are experiencing problem retrieving your notifications'});
            });
         };
         $ionicModal.fromTemplateUrl('mynotification.html', {
    	      scope: $scope,
    	      animation: 'slide-in-up'
  	     }).then(function(modal) {
    	      $scope.modal5 = modal;
  	     });
	       $scope.openModal5 = function() {
    	      $scope.modal5.show();
         };
         $scope.closeModal5 = function() {
           $scope.modal5.hide();
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
		      $scope.i= $ionicSlideBoxDelegate.currentIndex();
		      $ionicSlideBoxDelegate.next();
		      $scope.questions[$scope.i].answer = rating;
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
      	   });
    	     //popup close
    	     $scope.closepopup = function(){
    		       myPopup.close();
    	     };
    	  };
        $scope.openPDFViewer = function(){
          $ionicModal.fromTemplateUrl('pdf-viewer.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
              $scope.pdfviewermodal = modal;
              $scope.pdfviewermodal.show();
          });
        };
        $scope.hidePDFViewerModal = function(){
          $scope.pdfviewermodal.remove();
        };
        if(socket !== null){
          socket.on('connect', function(){
            console.log('socket connected successfully');
            socket.emit('appregistrationid',$scope.doctorid);
          });
          socket.on('documentrecieved', function(data){
             var datarecieved = data;
             console.log('printing parsed data recieved ['+ data + ']');
             if(data && data === 'ERROR'){
               $rootScope.hideLoader();
               $rootScope.showToast('Document is unavailable/error retrieving the document, please try again later', 'long','center');
             }else{
               $rootScope.hideLoader();
               try{
                 var uint8array = base64ToUint8Array(datarecieved);
                 var blob = new Blob([uint8array],{type:'application/pdf'});
                 //below 2 lines are working code commented for testing...
                 $scope.pdfUrl = URL.createObjectURL(blob);
                 $scope.openPDFViewer();
                 //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
                 window.resolveLocalFileSystemURL("file:///storage/emulated/0/", function(dir) {
                    dir.getDirectory("TracMyHealth",{create:true}, function(direntry){
                      var filename = "labreport_"+(new Date()).getTime()+".pdf";
                      direntry.getFile(filename, {create:true}, function(file) {
                        console.log("File created succesfully.");
                        file.createWriter(function(fileWriter) {
                            console.log("Writing content to file");
                            fileWriter.write(blob);
                            $rootScope.showToast("Report has also been downloaded to your device",'long','center');
                        }, function(err){
                            $rootScope.showToast("Couldn't download the report, please try again",'long','center');
                        });
                      });
                    });
                  });
                }catch(error){
                  $rootScope.showToast("Couldn't download the report, please try again",'long','center');
                }
              }
          });
        };
        function base64ToUint8Array(base64) {
          var raw = atob(base64);
          var uint8Array = new Uint8Array(raw.length);
          for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
          }
          return uint8Array;
        };
}])

.controller('LogoutCtrl', ['$scope','$rootScope','$route','$state','$ionicHistory','registrationdetsdb',function($scope, $rootScope, $route, $state, $ionicHistory, registrationdetsdb){
  //deleting the jsonwebtoken as there is a logout request by the user..
  $rootScope.showLoader();
  registrationdetsdb.updateJWTWithoutMobileNo({jsonwebtoken:null}).then(function(response){
      $rootScope.hideLoader();
      $scope.closePopover();
      $state.go('login');
      $route.reload();
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
.controller('MenuCtrl', ['$scope','$state','$ionicSideMenuDelegate','$ionicHistory','loginservice', function($scope,$state,$ionicSideMenuDelegate, $ionicHistory, loginservice){
  $scope.$on("$ionicView.beforeEnter",function(event, data){
      $ionicHistory.nextViewOptions({
            disableBack: true
      });
//      $ionicHistory.clearHistory();
//      $ionicHistory.clearCache();

      var profiledata = loginservice.getProfileData();
      if(typeof profiledata !== 'undefined'){
        $scope.showDoctorsTab = profiledata.isdoctor;
      }
  });
   //sidemenu addition
   $scope.toggleLeftSideMenu = function() {
      $ionicSideMenuDelegate.toggleLeft();
   };
 
    
}])
.controller('ImagesProfileCtrl', ['$scope','$rootScope','$stateParams','$ionicModal','$state','DBA','$ionicFilterBar','imagesservicedb','$ionicHistory','orderByFilter',function($scope ,$rootScope,$stateParams,$ionicModal,$state,DBA,$ionicFilterBar, imagesservicedb, $ionicHistory, orderBy){
    $scope.openImagesModal = function(index) {
      	$scope.activeSlide = index;
        $ionicModal.fromTemplateUrl('imageslist.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.imageslist = modal;
            $scope.imageslist.show();
        });
    };
    $scope.closeImagesModal = function() {
        $scope.imageslist.remove();
    };
    $scope.$on("$ionicView.enter", function(event, data){
        $scope.imagesarray = [];
        imagesservicedb.query().then(function(response){
            var result = DBA.getAll(response);
            if(result !== null && result.length > 0){
                angular.forEach(result, function(value, key){
                    $scope.imagesarray.push({
                      "imgtag":value.imgtag,
                      "imgdescription" : value.imgdescription,
                      "imgnativeurl" : value.imgnativeurl,
                      "capturedate"  : value.capturedate
                    });
                });
                $scope.imagesarray = orderBy($scope.imagesarray, 'capturedate',true);
            }else{
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
