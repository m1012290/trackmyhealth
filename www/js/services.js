angular.module('tracmyhealthappsvcs', ['ngResource'])
.service('signupservice', ['$q', '$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
	return {
		validatedetails: function(emailid, mobileno, doctor){
			var deferred = $q.defer();
			var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registration/:emailid/:mobilenumber" + "?isdoctor=:doctor");
			resource.get({ emailid :emailid, mobilenumber :mobileno, doctor:doctor }, function(data){
				console.log( "signup service call is successful ["+ JSON.stringify(data) + "]");
				deferred.resolve(data);
			},function(error){
				console.log("signup service call failed with error [" + JSON.stringify(error)+ "]");
				deferred.reject(error);
			});
			return deferred.promise;
		},
		registerDoctor: function(firstname,lastname,cntrynum,gender,emailid,mobilenumber,address,age,dob,doc,licence,smsotp,emailotp,pw){
			var deferred= $q.defer();
			var resource= $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registration/register/doctor");
			resource.save({regdets:{
				firstname:firstname,
				lastname:lastname,
				cntrynum:cntrynum,
				gender:gender,
				emailid:emailid,
				mobilenumber:mobilenumber,
				address:{
				addressline1:address
				},
				age:age,
				dateofbirth:dob,
				isdoctor:doc,
				doctorlicenseno: licence,
				otpdetails:{
					smsotp:smsotp,
					emailotp:emailotp
				},
				password : pw
			}},function(data){
				    deferred.resolve(data);
			},function(error){
				    deferred.reject(error);
			});
			return deferred.promise;
		},
		generateOtp: function(emailid, mobileno){
			var deferred = $q.defer();
			var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registration/generateotp");
			resource.save({emailid : emailid , "mobileno" : mobileno },function(data){
				deferred.resolve(data);
			},function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		},
		registerPatient:function(firstname,lastname,cntrynum,gender,emailid,mobilenumber,address,age,dob,doc,smsotp,emailotp,pw){
			var deferred = $q.defer();
			var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registration/register/patient");

			resource.save({regdets:{
				firstname:firstname,
				lastname:lastname,
				cntrynum:cntrynum,
				gender:gender,
				emailid:emailid,
				mobilenumber:mobilenumber,
				address:{
				addressline1:address
				},
				age:age,
				dateofbirth:dob,
				isdoctor:doc,
				otpdetails:{
					smsotp:smsotp,
					emailotp:emailotp
				},
				password : pw
			}},function(data){
				  deferred.resolve(data);
			},function(error){
				  deferred.reject(error);
			});
			return deferred.promise;
		}
	}
}])
.service('loginservice', ["$q", '$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
  this.profiledata = {};
	return{
		logindets:function(email, password){
			var deferred = $q.defer();
			var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/login/authenticate");
			resource.save({"logindets" : {"loginidentifier" : email, "password" : password} },function(data){
			    deferred.resolve(data);
			},function(error){
				  deferred.reject(error);
			});
			return deferred.promise;
		},
    setProfileData:function(profiledata){
        this.profiledata = profiledata
    },
    getProfileData:function(){
        return this.profiledata;
    }
	};
}])
.service('hospitalservice', ['$q', '$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
	return{
		getregHospitals: function(patientid){
			var deferred= $q.defer();
			var resource= $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/hospitals/:patientid");
			resource.get({patientid : patientid},function(data){
				  deferred.resolve(data);
			},function(error){
			    deferred.reject(error);
			});
			return deferred.promise;
		},
		hospitalinfo: function(hospitalid,hospitalcode){
			var deferred = $q.defer();
			var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/hospitals/:hospitalid/:hospitalcode");
			resource.get({hospitalid: hospitalid, hospitalcode: hospitalcode }, function(data){
				  deferred.resolve(data);
			},function(error){
				  deferred.reject(error);
			});
			return deferred.promise;
		}
	};
}])
.factory('pushnotificationservice', ['$q', '$resource', '$ionicPlatform', function($q, $resource, $ionicPlatform){
    var pushnotificationservice = {};
    pushnotificationservice.registerDevice = function(registrationhandler, notificationhandler, errorhandler){
        $ionicPlatform.ready(function() {
            push = PushNotification.init({ "android": {
                "senderID": '496534223786'
            }});
            push.on('registration', registrationhandler);
            push.on('notification', notificationhandler);
            push.on('error', errorhandler);
        });
    };
    return pushnotificationservice;
}])
.factory('internetservice', ['$ionicPlatform', '$rootScope', function($ionicPlatform, $rootScope){
    return {
        //only passed during testing on device
        isInternetAvailable : function(){
            var self = this;
            self.available = true;
            $ionicPlatform.ready(function() {
                if(window.cordova && window.navigator.connection){
                    self.networkState = navigator.connection.type;
                    if(self.networkState === 'none'){
                      //broadcast an event which can tell the appctrl to pop up this message to user
                      //take it from there
                        self.available = false;
                        $rootScope.$broadcast('NoInternet');
                    }
                }
            });
            return self.available;
        }
    };
}])
.factory('DBA', ['$q', '$cordovaSQLite', '$ionicPlatform', function($q, $cordovaSQLite, $ionicPlatform){
    var self = this;
    // Handle query's and potential errors
    self.query = function (query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();
        $ionicPlatform.ready(function(){
          $cordovaSQLite.execute(db, query, parameters)
            .then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
        });
        return q.promise;
    };
    // Proces a result set
    self.getAll = function(result) {
        var output = [];
        for (var i = 0; i < result.rows.length; i++) {
          output.push(result.rows.item(i));
        }
        return output;
    };
    // Proces a single result
    self.getById = function(result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
    };
    return self;
}])
.factory('registrationdetsdb', ['DBA', function(DBA){
    var self = this;
    self.add = function(registrationdets){
        var parameters = [registrationdets.mobilenumber, registrationdets.registrationtoken, registrationdets.deviceuuid];
        return DBA.query("INSERT INTO registrationtable (mobilenumber, registrationtoken, deviceuuid) VALUES (?,?,?)", parameters);
    };
    self.updRegTokenUUID = function(registrationdets){
        var parameters = [registrationdets.mobilenumber, registrationdets.registrationtoken, registrationdets.deviceuuid];
        return DBA.query("UPDATE registrationtable set mobilenumber = (?), registrationtoken= (?), deviceuuid=(?)", parameters);
    };
    self.addAppRegId = function(registrationdets){
        var parameters = [registrationdets.jsonwebtoken, registrationdets.appregistrationid, registrationdets.isdoctor];
        return DBA.query("INSERT INTO registrationtable (jsonwebtoken,appregistrationid,isdoctor) VALUES (?,?,?)", parameters);
    };
    self.updateMobileNumber = function(registrationdets) {
        var parameters = [registrationdets.mobilenumber];
        return DBA.query("UPDATE registrationtable SET mobilenumber = (?)", parameters);
    };
    self.query = function(registrationdets) {
        return DBA.query("SELECT mobilenumber, registrationtoken, deviceuuid, jsonwebtoken, appregistrationid, isdoctor from registrationtable");
    };
    self.updateJWT = function(registrationdets){
        var parameters = [registrationdets.jsonwebtoken, registrationdets.mobilenumber];
        return DBA.query("UPDATE registrationtable SET jsonwebtoken = (?) where mobilenumber = (?)",parameters);
    };
    self.updateJWTWithoutMobileNo = function(registrationdets){
        var parameters = [registrationdets.jsonwebtoken];
        return DBA.query("UPDATE registrationtable SET jsonwebtoken = (?)",parameters);
    };
    self.updateAppRegistrationId = function(appregistrationid){
        var parameters = [appregistrationid];
        return DBA.query("UPDATE registrationtable SET appregistrationid = (?)",parameters);
    };
    self.updateJWTAndAppRegId = function(appregistrationid, jsonwebtoken, isdoctor){
        var parameters = [appregistrationid, jsonwebtoken, isdoctor];
        return DBA.query("UPDATE registrationtable SET appregistrationid = (?), jsonwebtoken = (?), isdoctor = (?)", parameters);
    };
    return self;
}])
.factory('imagesservicedb',['$q','DBA',function($q, DBA){
   var self = this;
   self.add = function(imagedetails){
       var parameters = [imagedetails.imgname, imagedetails.imgtag, imagedetails.imgdesc, imagedetails.imgnativeurl, imagedetails.capturedate];
       return DBA.query("INSERT INTO tmhimagestable(imgname, imgtag, imgdescription, imgnativeurl, capturedate) VALUES (?,?,?,?,?)", parameters);
   };
   self.query = function(){
      return DBA.query("SELECT imgname, imgtag, imgdescription, imgnativeurl, capturedate from tmhimagestable");
   };
   return self;
}])
.factory('offlinestoredb',['$q','DBA',function($q, DBA){
    var self = this;
    self.add = function(offlinestoredets){
       var parameters = [offlinestoredets.svckey, offlinestoredets.svcvalue, offlinestoredets.rcredate, offlinestoredets.rupdate];
       return DBA.query("INSERT INTO tmhofflinestore(svckey, svcvalue, rcredate, rupdate) VALUES (?,?,?,?)", parameters);
    };
    self.query = function(key){
        var parameters = [key];
        return DBA.query("SELECT svckey, svcvalue, rcredate, rupdate from tmhofflinestore where svckey=?",parameters);
    };
    self.update = function(offlinestoredets){
      var parameters = [offlinestoredets.svcvalue,offlinestoredets.rupdate, offlinestoredets.svckey];
      return DBA.query("UPDATE tmhofflinestore set svcvalue=?, rupdate=? where svckey = ?", parameters);
    };
    return self;
}])
.factory('AuthInterceptor', ['$rootScope','$q','registrationdetsdb','offlinestoredb','DBA','AUTH_EVENTS','API_KEYS',function ($rootScope, $q, registrationdetsdb, offlinestoredb, DBA, AUTH_EVENTS, API_KEYS) {
  return {
    responseError: function (response) {
      var deferred = $q.defer();
      if((response.config.url && response.config.url.search('/v1/registered/') != -1)
         || (response.config.url && response.config.url.search('/v1/login/') != -1)){
        var svckey = response.config.url.substr(response.config.url.indexOf('/v1'));
        if(window.cordova && window.navigator.connection){
            if(navigator.connection.type === 'none'){
              offlinestoredb.query(svckey).then(function(result){
                 if(result.rows.length > 0){
                   var data = DBA.getById(result);
                   response.status = 200;
                   response.data = angular.fromJson(data.svcvalue);
                   deferred.resolve(response);
                 }else{
                   deferred.reject(response);
                 }
              }).catch(function(error){
                 deferred.reject(response);
              });
              $rootScope.showToast('No internet connection available', 'long', 'center');
            }else{
              deferred.reject(response);
            }
        }else{
          offlinestoredb.query(svckey).then(function(result){
            if(result.rows.length > 0){
               var data = DBA.getById(result);
               response.status = 200;
               response.data = angular.fromJson(data.svcvalue);
               deferred.resolve(response);
            }else{
               deferred.reject(response);
            }
          }).catch(function(error){
             deferred.reject(response);
          });
        }
      }else{
        deferred.reject(response);
      }
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.jsonwebtokenExpired
      }[response.status], response);
      return deferred.promise;
    },
    request: function(config) {
      // do something on success
        var deferred = $q.defer();
        var url = String(config.url);
        if(config.url && url.search('v1') != -1){
            registrationdetsdb.query({}).then(function(response){
                var result = DBA.getById(response);
                if(result && result.jsonwebtoken){
                    config.headers['Authorization'] = result.jsonwebtoken;
                }
                deferred.resolve(config);
            }).catch(function(error){
                //return config;
                deferred.reject(config);
            });
        }else{
            return config;
        }
        return deferred.promise;
    },
    response : function(response){
       if((response.config.url && response.config.url.search('/v1/registered/') != -1)
          || (response.config.url && response.config.url.search('/v1/login/') != -1) ){
            var deferred = $q.defer();
            var svckey = response.config.url.substr(response.config.url.indexOf('/v1'));
            offlinestoredb.query(svckey).then(function(result){
            if( result.rows.length === 0 ){
              //insert new record
              offlinestoredb.add({"svckey":svckey,"svcvalue":angular.toJson(response.data), "rcredate":new Date(), "rupdate" : new Date()})
              .then(function(storeresult){
              }).catch(function(error){
              });
            }else{
             // update existing record
             //offlinestoredets.svcvalue,offlinestoredets.rupdate, offlinestoredets.svckey
             offlinestoredb.update({"svcvalue":angular.toJson(response.data),"rupdate":new Date(), "svckey":svckey})
             .then(function(storeresult){
             }).catch(function(error){
             });
           }
           deferred.resolve(response);
         }).catch(function(error){
           deferred.resolve(response);
         });
       }else{
         return response;
       }
       return deferred.promise;
    }
  };
}])
.service('medicalprofileservice', ['$q','$resource','NODE_SERVER_DETAILS',function($q,$resource,NODE_SERVER_DETAILS){
    return {
        savedetails: function(patientId, medicalprofile){
          var deferred = $q.defer();
          var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/medicalprofile",{patientid: patientId});
          resource.save({"medicalprofile": medicalprofile.data, "createdat":medicalprofile.createdat},function(data){
            deferred.resolve(data);
          },function(error){
            deferred.reject(error);
          });
          return deferred.promise;
        },
				getdetails:function(patientId){
		           var deferred = $q.defer();
		           var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/medicalprofilet");
		           resource.get({patientid: patientId},function(data){
		               deferred.resolve(data);
		           }, function(error){
		               deferred.reject(error);
		           });
		           return deferred.promise;
		         }
    };
 }])


.service('familymemberservice', ['$q','$resource','NODE_SERVER_DETAILS',function($q,$resource,NODE_SERVER_DETAILS){
     return {
         savedetails: function(patientId, fdata){

           var deferred = $q.defer();
           var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/familymember",{patientid: patientId});
           resource.save(fdata,function(data){
             deferred.resolve(data);
           },function(error){
             deferred.reject(error);
           });
           return deferred.promise;
         },
           getdetails: function(patientId){
						
            var deferred = $q.defer();
            var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/familymember");
            resource.get({patientid : patientId}, function(data){
              deferred.resolve(data);
            },function(error){
              deferred.reject(error);
            });
            return deferred.promise;
          }
     };
  }])
	


.service('visitservice', ['$q', '$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
	return{

		getvisitdets: function(patientid, hospitalid){

			var deferred = $q.defer();
			var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/visits/:hospitalid");
			resource.get({ patientid: patientid, hospitalid: hospitalid }, function(data){
				console.log( "visits service call is successful ["+ JSON.stringify(data) + "]");
				deferred.resolve(data);
			},function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		},
     getVisits : function(patientid){
	//		 debugger;
      var deferred = $q.defer();
			var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/visits");
			resource.get({ patientid: patientid}, function(data){
			  deferred.resolve(data);
			},function(error){
				deferred.reject(error);
			});
			return deferred.promise;
    },
		 getdocdetail: function(doctorid){
			var deferred = $q.defer();
			var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:doctorid/profile");
			resource.get({ doctorid: doctorid}, function(data){
				console.log( "doctor service call is successful ["+ JSON.stringify(data) + "]");
				deferred.resolve(data);
			},function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		},
		savevisitinfo: function(patientid,visitid){
			var deferred = $q.defer();
			var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:patientid/visits/:visitid/notifications");
			resource.get({ patientid: patientid, visitid: visitid }, function(data){
				deferred.resolve(data);
			},function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}

	};
}])
.service('patientprflservice',['$q','$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
    return {
        getpatientinfo: function(patientId){
            var deferred = $q.defer();
            var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/patients/:patientid");
            resource.get({patientid :patientId}, function(data){
              deferred.resolve(data);
            },function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },
        changedpatientinfo : function(patientprofiledata,patientId){
          var deferred=$q.defer();
          var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/patients/:patientid", {patientid : patientId}, {'update': { method:'PUT' }});
          resource.update(patientprofiledata, function(data){
            deferred.resolve(data);
          }, function(error){
            deferred.reject(error);
          });
          return deferred.promise;
        }
    };
}])
.factory('feedbackservice', ['$q', '$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
	var self = this;
	var feedbackobj = {};
	feedbackobj.feedbackQueries = function(hospitalid){
      var deferred = $q.defer();
      var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/hospitals/:hospitalid/feedback/queries");
      resource.get({hospitalid:hospitalid}, function(data){
          deferred.resolve(data);
      },function(error){
          deferred.reject(error);
      });
      return deferred.promise;
  };
  feedbackobj.save = function(hospitalid,patientid,visitid,feedbackdets){
      var deferred = $q.defer();
      var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:hospitalid/:patientid/feedback/:visitid",
      {hospitalid:hospitalid,patientid:patientid,visitid:visitid});
      resource.save(feedbackdets,function(data){
        deferred.resolve(data);
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
  };
	return feedbackobj;
}])
.factory('forgotpwdservice', ['$q','$resource','NODE_SERVER_DETAILS',function($q,$resource,NODE_SERVER_DETAILS){
    return {
        forgotpwd : function(emailId, mobNo, password ){
				    var mobnum = mobNo.toString();
            var deferred=$q.defer();
            var resource= $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registration/:emailid/:mobilenumber?forgotpwd=:password");
            resource.get({ emailid: emailId, mobilenumber: mobnum, password : password}, function(data){
              deferred.resolve(data);
            },function(error){
              deferred.reject(error);
            });
            return deferred.promise;
		    },
		    changedpwd : function(emailid, mobNo, password, smsotp, emailotp, pass){
			      var mobnum = mobNo.toString();
            var deferred=$q.defer();
            var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registration/register/patient?forgotpwd=:pass" , {pass: pass}, {'update': { method:'PUT' } } );
            resource.update({emailid: emailid, mobilenumber:mobnum, password : password, smsotp: smsotp, emailotp: emailotp},function(data){
              deferred.resolve(data);
            },function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        }
    };
}])
.service('doctortabservice', ['$q','$resource','NODE_SERVER_DETAILS',function($q, $resource,NODE_SERVER_DETAILS){
  return {
      getdctdets: function(doctorid){
          var deferred = $q.defer();
          var resource = $resource(NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:doctorid/notifications");
          resource.get({doctorid: doctorid}, function(data){
						console.log( "doctor service call is successful ["+ JSON.stringify(data) + "]");
              deferred.resolve(data);
          },function(error){
  				    deferred.reject(error);
          });
          return deferred.promise;
      },
      fetchvisit: function(doctorid, patientid, visitid){
  			var deferred = $q.defer();
  			var resource = $resource (NODE_SERVER_DETAILS.protocol+"://"+NODE_SERVER_DETAILS.server+":"+NODE_SERVER_DETAILS.port+"/v1/registered/:doctorid/:patientid/visits/:visitid/notifications");
  			resource.get({ doctorid: doctorid, patientid: patientid, visitid: visitid }, function(data){
  				deferred.resolve(data);
  			},function(error){
  				deferred.reject(error);
  			});
  			return deferred.promise;
  		}
   };
}])
.factory('socket',function(socketFactory){
    //Create socket and connect to http://cat.socket.io
    var mySocket = null;
    if(typeof io !== 'undefined'){
        //var myIoSocket = io.connect( "https://socketioserver-m1012290.c9users.io:8080", { secure: true, transports: [ "flashsocket","polling","websocket" ] } );
        var myIoSocket = io.connect("https://bnotified-service-m1012290.c9users.io:8080");
        mySocket = socketFactory({
      	   ioSocket: myIoSocket
         });
    }
	  return mySocket;
})
// .service('screeningdataservice',['$q','$resource',function($q,$resource){
//  return {
// 	  loadHospitals : function(){
// 			var deferred = $q.defer();
// 			var resource = $resource('/json/screeningdata.json');
// 			resource.query(null,function(data){
//              deferred.resolve(data);
// 				console.log('data ['+JSON.stringify(data)+']');
// 			}, function(err){
// 				console.log('err encountered ['+ err.toString() + ']');
// 			});
// 			return deferred.promise;
// 		}
//  };
// }]);
