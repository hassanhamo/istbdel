angular.module('istibdel.account')
    .controller('LoginController', ['$rootScope', '$scope', '$http','$route', '$location', '$timeout','Configuration','User',
        function ($rootScope, $scope, $http,$route, $location, $timeout,Configuration,User) {
            var query = new Configuration.Query();

            var storage = window.localStorage;
           
            if (storage.getItem('istibdel')) {
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            } else {
                storage.setItem('istibdel', JSON.stringify({
                    likes: [],country:null
                }));
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            }
                       
             query.first().then(function(config){
                $timeout(function() {
                $scope.config = config;
                $scope.conditionUse=config.conditionUse;
                });
             });
             $timeout(function() {
            $scope.country= istibdel.country||{
                "code": "SA",
                "dial_code": "+966",
                "name_ar": "المملكة العربية السعودية",
                "name_en": "Saudi Arabia"
            };
        });

$scope.countryChange=function(item){
    $timeout(function() {
       
        $scope.country=item;
         storage.setItem('istibdel', JSON.stringify({
                        likes: istibdel.likes,country:item
                    }));
    });
}

var config = {
    apiKey: "AIzaSyA0luRfVtAsYUpTeMZt9o0gHdpBsbNPbCQ",
    authDomain: "istibdel-184609.firebaseapp.com",
    databaseURL: "https://istibdel-184609.firebaseio.com",
    projectId: "istibdel-184609",
    storageBucket: "istibdel-184609.appspot.com",
    messagingSenderId: "963457642001"
  };
firebase.initializeApp(config);

firebase.auth().languageCode = 'ar';
 $scope.login = function (e) {
 var confirmationResult = window.confirmationResult ;

   confirmationResult.confirm($scope.code.toString()).then(function (result) {
 console.log(result); 
    $http.post('/account/login', {username:$scope.country.dial_code+$scope.usernameLogin.toString(),password:$scope.country.dial_code+$scope.usernameLogin.toString()})
        .then(function (res) {
           
            document.location.href = res.data.redirectTo;

        },
        function (res) {
             $timeout(function() {
            $scope.error = res.data.error;
        });
           
        }).$promise;

     },function(error){
         $timeout(function() {
            $scope.code=null;
 
$scope.error='رمز خاطأ';
});
    }); 
}
$scope.verifCode = function () {
  


window.recaptchaVerifier1 = new firebase.auth.RecaptchaVerifier('phone-sign-up-recaptcha', {
  'size': 'normal',
  'callback': function(response) {
   
  },
  'expired-callback': function() {
    // Response expired. Ask user to solve reCAPTCHA again.
    // ...
  }
});

//var phoneNumber = getPhoneNumberFromUserInput();
var appVerifier1 = window.recaptchaVerifier1;
$scope.username1=$scope.country.dial_code+$scope.phoneNumber.toString();
firebase.auth().signInWithPhoneNumber($scope.username1, appVerifier1)
.then(function (confirmationResult) {
//$scope.confirmationResult=confirmationResult;
// SMS sent. Prompt user to type the code from the message, then sign the
// user in with confirmationResult.confirm(code).
window.confirmationResult1 = confirmationResult;
$scope.verif.show();
window.recaptchaVerifier1.clear();
}).catch(function (error) {
    $scope.verif.show();
    window.recaptchaVerifier1.clear();
console.log('sms not send');
});
};


$scope.verifCodeLogin = function () {
  


window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-sign-in-recaptcha1', {
  'size': 'normal',
  'callback': function(response) {
   
  },
  'expired-callback': function() {
    // Response expired. Ask user to solve reCAPTCHA again.
    // ...
  }
});

//var phoneNumber = getPhoneNumberFromUserInput();
var appVerifier = window.recaptchaVerifier;
$scope.username=$scope.country.dial_code+$scope.usernameLogin.toString();
firebase.auth().signInWithPhoneNumber($scope.username, appVerifier)
.then(function (confirmationResult) {
//$scope.confirmationResult=confirmationResult;
// SMS sent. Prompt user to type the code from the message, then sign the
// user in with confirmationResult.confirm(code).
window.confirmationResult = confirmationResult;
window.recaptchaVerifier.clear();
$scope.verifLogin.show();
}).catch(function (error) {
    $scope.verifLogin.show();
 window.recaptchaVerifier.clear();
console.log('sms not send');
});
};

$scope.singUp = function () {
    
    var confirmationResult1 = window.confirmationResult1 ;

   confirmationResult1.confirm($scope.code1.toString()).then(function (result) {
  // User signed in successfully.
  
 
   
  
  var user = new User();
user.set("username", $scope.username1);
user.set("password", $scope.username1);
user.set("fullName", $scope.fullName);
user.save(null,{useMasterKey:true}).then(function(obj){
    console.log(obj);
     $scope.verif.hide();
  $scope.code1=null;
$scope.usernameLogin=$scope.phoneNumber;
$http.post('/account/login', {username:$scope.country.dial_code+$scope.usernameLogin.toString(),password:$scope.country.dial_code+$scope.usernameLogin.toString()})
.then(function (res) {
   
    document.location.href = "/users3/"+res.data.user.objectId;

},
function (res) {
     $timeout(function() {
    $scope.error = res.data.error;
});
   
}).$promise;
},function(error){
      $scope.code1=null;
  $scope.error1="خطأ في التسجيل";
});
},function(error)

{
    $timeout(function() {
           
      
      $scope.code=null;
      $scope.error1="رمز خاطأ";
    });
  });
  


   /* $http.post('/account/singUp', {username:$scope.country.dial_code+$scope.loginDetails.username.toString(),password:$scope.loginDetails.password})
        .then(function (res) {
           
            document.location.href = res.data.redirectTo;

        },
        function (res) {
            $scope.error = res.data.error;
           
        }).$promise;*/
};


     $scope.countries=[{
    "code": "AF",
    "dial_code": "+93",
    "name_ar": "أفغانستان",
    "name_en": "Afghanistan"
}, {
    "code": "AX",
    "dial_code": "+358",
    "name_ar": "جزر آلاند",
    "name_en": "Åland Islands"
}, {
    "code": "AL",
    "dial_code": "+355",
    "name_ar": "ألبانيا",
    "name_en": "Albania"
}, {
    "code": "DZ",
    "dial_code": "+213",
    "name_ar": "الجزائر",
    "name_en": "Algeria"
}, {
    "code": "AS",
    "dial_code": "+1684",
    "name_ar": "ساموا الأمريكية",
    "name_en": "American Samoa"
}, {
    "code": "AD",
    "dial_code": "+376",
    "name_ar": "أندورا",
    "name_en": "Andorra"
}, {
    "code": "AO",
    "dial_code": "+244",
    "name_ar": "أنغولا",
    "name_en": "Angola"
}, {
    "code": "AI",
    "dial_code": "+1264",
    "name_ar": "أنغويلا",
    "name_en": "Anguilla"
}, {
    "code": "AQ",
    "dial_code": "+672",
    "name_ar": "أنتاركتيكا",
    "name_en": "Antarctica"
}, {
    "code": "AG",
    "dial_code": "+1268",
    "name_ar": "أنتيغوا وبربودا",
    "name_en": "Antigua and Barbuda"
}, {
    "code": "AR",
    "dial_code": "+54",
    "name_ar": "الأرجنتين",
    "name_en": "Argentina"
}, {
    "code": "AM",
    "dial_code": "+374",
    "name_ar": "أرمينيا",
    "name_en": "Armenia"
}, {
    "code": "AW",
    "dial_code": "+297",
    "name_ar": "آروبا",
    "name_en": "Aruba"
}, {
    "code": "AU",
    "dial_code": "+61",
    "name_ar": "أستراليا",
    "name_en": "Australia"
}, {
    "code": "AT",
    "dial_code": "+43",
    "name_ar": "النمسا",
    "name_en": "Austria"
}, {
    "code": "AZ",
    "dial_code": "+994",
    "name_ar": "أذربيجان",
    "name_en": "Azerbaijan"
}, {
    "code": "BS",
    "dial_code": "+1242",
    "name_ar": "الباهاما",
    "name_en": "Bahamas"
}, {
    "code": "BH",
    "dial_code": "+973",
    "name_ar": "البحرين",
    "name_en": "Bahrain"
}, {
    "code": "BD",
    "dial_code": "+880",
    "name_ar": "بنجلاديش",
    "name_en": "Bangladesh"
}, {
    "code": "BB",
    "dial_code": "+1246",
    "name_ar": "بربادوس",
    "name_en": "Barbados"
}, {
    "code": "BY",
    "dial_code": "+375",
    "name_ar": "روسيا البيضاء",
    "name_en": "Belarus"
}, {
    "code": "BE",
    "dial_code": "+32",
    "name_ar": "بلجيكا",
    "name_en": "Belgium"
}, {
    "code": "BZ",
    "dial_code": "+501",
    "name_ar": "بليز",
    "name_en": "Belize"
}, {
    "code": "BJ",
    "dial_code": "+229",
    "name_ar": "بنين",
    "name_en": "Benin"
}, {
    "code": "BM",
    "dial_code": "+1441",
    "name_ar": "برمودا",
    "name_en": "Bermuda"
}, {
    "code": "BT",
    "dial_code": "+975",
    "name_ar": "بوتان",
    "name_en": "Bhutan"
}, {
    "code": "BO",
    "dial_code": "+591",
    "name_ar": "بوليفيا",
    "name_en": "Bolivia"
}, {
    "code": "BQ",
    "dial_code": "+599",
    "name_ar": "هولندا الكاريبية",
    "name_en": "Bonaire, Saint Eustatius And Saba"
}, {
    "code": "BA",
    "dial_code": "+387",
    "name_ar": "البوسنة والهرسك",
    "name_en": "Bosnia and Herzegovina"
}, {
    "code": "BW",
    "dial_code": "+267",
    "name_ar": "بتسوانا",
    "name_en": "Botswana"
}, {
    "code": "BV",
    "dial_code": "+47",
    "name_ar": "جزيرة بوفيت",
    "name_en": "Bouvet Island"
}, {
    "code": "BR",
    "dial_code": "+55",
    "name_ar": "البرازيل",
    "name_en": "Brazil"
}, {
    "code": "IO",
    "dial_code": "+246",
    "name_ar": "الإقليم البريطاني في المحيط الهندي",
    "name_en": "British Indian Ocean Territory"
}, {
    "code": "BN",
    "dial_code": "+673",
    "name_ar": "بروناي",
    "name_en": "Brunei"
}, {
    "code": "BG",
    "dial_code": "+359",
    "name_ar": "بلغاريا",
    "name_en": "Bulgaria"
}, {
    "code": "BF",
    "dial_code": "+226",
    "name_ar": "بوركينا فاسو",
    "name_en": "Burkina Faso"
}, {
    "code": "BI",
    "dial_code": "+257",
    "name_ar": "بوروندي",
    "name_en": "Burundi"
}, {
    "code": "CV",
    "dial_code": "+238",
    "name_ar": "الرأس الأخضر",
    "name_en": "Cabo Verde"
}, {
    "code": "KH",
    "dial_code": "+855",
    "name_ar": "كمبوديا",
    "name_en": "Cambodia"
}, {
    "code": "CM",
    "dial_code": "+237",
    "name_ar": "الكاميرون",
    "name_en": "Cameroon"
}, {
    "code": "CA",
    "dial_code": "+1",
    "name_ar": "كندا",
    "name_en": "Canada"
}, {
    "code": "KY",
    "dial_code": "+1345",
    "name_ar": "جزر الكايمن",
    "name_en": "Cayman Islands"
}, {
    "code": "CF",
    "dial_code": "+236",
    "name_ar": "جمهورية أفريقيا الوسطى",
    "name_en": "Central African Republic"
}, {
    "code": "TD",
    "dial_code": "+235",
    "name_ar": "تشاد",
    "name_en": "Chad"
}, {
    "code": "CL",
    "dial_code": "+56",
    "name_ar": "شيلي",
    "name_en": "Chile"
}, {
    "code": "CN",
    "dial_code": "+86",
    "name_ar": "الصين",
    "name_en": "China"
}, {
    "code": "CX",
    "dial_code": "+61",
    "name_ar": "جزيرة الكريسماس",
    "name_en": "Christmas Island"
}, {
    "code": "CC",
    "dial_code": "+891",
    "name_ar": "جزر كوكوس",
    "name_en": "Cocos (Keeling) Islands"
}, {
    "code": "CO",
    "dial_code": "+57",
    "name_ar": "كولومبيا",
    "name_en": "Colombia"
}, {
    "code": "KM",
    "dial_code": "+269",
    "name_ar": "جزر القمر",
    "name_en": "Comoros"
}, {
    "code": "CG",
    "dial_code": "+242",
    "name_ar": "الكونغو - برازافيل",
    "name_en": "Congo"
}, {
    "code": "CK",
    "dial_code": "+682",
    "name_ar": "جزر كوك",
    "name_en": "Cook Islands"
}, {
    "code": "CR",
    "dial_code": "+506",
    "name_ar": "كوستاريكا",
    "name_en": "Costa Rica"
}, {
    "code": "CI",
    "dial_code": "+225",
    "name_ar": "ساحل العاج",
    "name_en": "Côte d'Ivoire"
}, {
    "code": "HR",
    "dial_code": "+385",
    "name_ar": "كرواتيا",
    "name_en": "Croatia"
}, {
    "code": "CU",
    "dial_code": "+53",
    "name_ar": "كوبا",
    "name_en": "Cuba"
}, {
    "code": "CW",
    "dial_code": "+599",
    "name_ar": "كوراساو",
    "name_en": "Curaçao"
}, {
    "code": "CY",
    "dial_code": "+357",
    "name_ar": "قبرص",
    "name_en": "Cyprus"
}, {
    "code": "CZ",
    "dial_code": "+420",
    "name_ar": "جمهورية التشيك",
    "name_en": "Czech Republic"
}, {
    "code": "CD",
    "dial_code": "+243",
    "name_ar": "الكونغو - كينشاسا",
    "name_en": "Democratic Republic of the Congo"
}, {
    "code": "DK",
    "dial_code": "+45",
    "name_ar": "الدانمرك",
    "name_en": "Denmark"
}, {
    "code": "DJ",
    "dial_code": "+253",
    "name_ar": "جيبوتي",
    "name_en": "Djibouti"
}, {
    "code": "DM",
    "dial_code": "+1767",
    "name_ar": "دومينيكا",
    "name_en": "Dominica"
}, {
    "code": "DO",
    "dial_code": "+1",
    "name_ar": "جمهورية الدومينيك",
    "name_en": "Dominican Republic"
}, {
    "code": "EC",
    "dial_code": "+593",
    "name_ar": "الإكوادور",
    "name_en": "Ecuador"
}, {
    "code": "EG",
    "dial_code": "+20",
    "name_ar": "مصر",
    "name_en": "Egypt"
}, {
    "code": "SV",
    "dial_code": "+503",
    "name_ar": "السلفادور",
    "name_en": "El Salvador"
}, {
    "code": "GQ",
    "dial_code": "+240",
    "name_ar": "غينيا الإستوائية",
    "name_en": "Equatorial Guinea"
}, {
    "code": "ER",
    "dial_code": "+291",
    "name_ar": "أريتريا",
    "name_en": "Eritrea"
}, {
    "code": "EE",
    "dial_code": "+372",
    "name_ar": "أستونيا",
    "name_en": "Estonia"
}, {
    "code": "ET",
    "dial_code": "+251",
    "name_ar": "إثيوبيا",
    "name_en": "Ethiopia"
}, {
    "code": "FK",
    "dial_code": "+500",
    "name_ar": "جزر فوكلاند",
    "name_en": "Falkland Islands (Malvinas)"
}, {
    "code": "FO",
    "dial_code": "+298",
    "name_ar": "جزر فارو",
    "name_en": "Faroe Islands"
}, {
    "code": "FJ",
    "dial_code": "+679",
    "name_ar": "فيجي",
    "name_en": "Fiji"
}, {
    "code": "FI",
    "dial_code": "+358",
    "name_ar": "فنلندا",
    "name_en": "Finland"
}, {
    "code": "FR",
    "dial_code": "+33",
    "name_ar": "فرنسا",
    "name_en": "France"
}, {
    "code": "GF",
    "dial_code": "+594",
    "name_ar": "غويانا الفرنسية",
    "name_en": "French Guiana"
}, {
    "code": "PF",
    "dial_code": "+689",
    "name_ar": "بولينيزيا الفرنسية",
    "name_en": "French Polynesia"
}, {
    "code": "TF",
    "dial_code": "+262",
    "name_ar": "المقاطعات الجنوبية الفرنسية",
    "name_en": "French Southern and Antarctic Lands"
}, {
    "code": "GA",
    "dial_code": "+241",
    "name_ar": "الجابون",
    "name_en": "Gabon"
}, {
    "code": "GM",
    "dial_code": "+220",
    "name_ar": "غامبيا",
    "name_en": "Gambia"
}, {
    "code": "GE",
    "dial_code": "+995",
    "name_ar": "جورجيا",
    "name_en": "Georgia"
}, {
    "code": "DE",
    "dial_code": "+49",
    "name_ar": "ألمانيا",
    "name_en": "Germany"
}, {
    "code": "GH",
    "dial_code": "+233",
    "name_ar": "غانا",
    "name_en": "Ghana"
}, {
    "code": "GI",
    "dial_code": "+350",
    "name_ar": "جبل طارق",
    "name_en": "Gibraltar"
}, {
    "code": "GR",
    "dial_code": "+30",
    "name_ar": "اليونان",
    "name_en": "Greece"
}, {
    "code": "GL",
    "dial_code": "+299",
    "name_ar": "غرينلاند",
    "name_en": "Greenland"
}, {
    "code": "GD",
    "dial_code": "+1473",
    "name_ar": "غرينادا",
    "name_en": "Grenada"
}, {
    "code": "GP",
    "dial_code": "+590",
    "name_ar": "جوادلوب",
    "name_en": "Guadeloupe"
}, {
    "code": "GU",
    "dial_code": "+1671",
    "name_ar": "غوام",
    "name_en": "Guam"
}, {
    "code": "GT",
    "dial_code": "+502",
    "name_ar": "غواتيمالا",
    "name_en": "Guatemala"
}, {
    "code": "GG",
    "dial_code": "+44",
    "name_ar": "غيرنزي",
    "name_en": "Guernsey"
}, {
    "code": "GN",
    "dial_code": "+224",
    "name_ar": "غينيا",
    "name_en": "Guinea"
}, {
    "code": "GW",
    "dial_code": "+245",
    "name_ar": "غينيا بيساو",
    "name_en": "Guinea-Bissau"
}, {
    "code": "GY",
    "dial_code": "+592",
    "name_ar": "غيانا",
    "name_en": "Guyana"
}, {
    "code": "HT",
    "dial_code": "+509",
    "name_ar": "هايتي",
    "name_en": "Haiti"
}, {
    "code": "HM",
    "dial_code": "+61",
    "name_ar": "جزيرة هيرد وجزر ماكدونالد",
    "name_en": "Heard Island And McDonald Islands"
}, {
    "code": "HN",
    "dial_code": "+504",
    "name_ar": "هندوراس",
    "name_en": "Honduras"
}, {
    "code": "HK",
    "dial_code": "+852",
    "name_ar": "هونغ كونغ الصينية",
    "name_en": "Hong Kong"
}, {
    "code": "HU",
    "dial_code": "+36",
    "name_ar": "هنغاريا",
    "name_en": "Hungary"
}, {
    "code": "IS",
    "dial_code": "+354",
    "name_ar": "أيسلندا",
    "name_en": "Iceland"
}, {
    "code": "IN",
    "dial_code": "+91",
    "name_ar": "الهند",
    "name_en": "India"
}, {
    "code": "ID",
    "dial_code": "+62",
    "name_ar": "أندونيسيا",
    "name_en": "Indonesia"
}, {
    "code": "IR",
    "dial_code": "+98",
    "name_ar": "إيران",
    "name_en": "Iran"
}, {
    "code": "IQ",
    "dial_code": "+964",
    "name_ar": "العراق",
    "name_en": "Iraq"
}, {
    "code": "IE",
    "dial_code": "+353",
    "name_ar": "أيرلندا",
    "name_en": "Ireland"
}, {
    "code": "IM",
    "dial_code": "+44",
    "name_ar": "جزيرة مان",
    "name_en": "Isle of Man"
}, {
    "code": "IL",
    "dial_code": "+972",
    "name_ar": "إسرائيل",
    "name_en": "Israel"
}, {
    "code": "IT",
    "dial_code": "+39",
    "name_ar": "إيطاليا",
    "name_en": "Italy"
}, {
    "code": "JM",
    "dial_code": "+1876",
    "name_ar": "جامايكا",
    "name_en": "Jamaica"
}, {
    "code": "JP",
    "dial_code": "+81",
    "name_ar": "اليابان",
    "name_en": "Japan"
}, {
    "code": "JE",
    "dial_code": "+44",
    "name_ar": "جيرسي",
    "name_en": "Jersey"
}, {
    "code": "JO",
    "dial_code": "+962",
    "name_ar": "الأردن",
    "name_en": "Jordan"
}, {
    "code": "KZ",
    "dial_code": "+7",
    "name_ar": "كازاخستان",
    "name_en": "Kazakhstan"
}, {
    "code": "KE",
    "dial_code": "+254",
    "name_ar": "كينيا",
    "name_en": "Kenya"
}, {
    "code": "KI",
    "dial_code": "+686",
    "name_ar": "كيريباتي",
    "name_en": "Kiribati"
}, {
    "code": "KW",
    "dial_code": "+965",
    "name_ar": "الكويت",
    "name_en": "Kuwait"
}, {
    "code": "KG",
    "dial_code": "+996",
    "name_ar": "قرغيزستان",
    "name_en": "Kyrgyzstan"
}, {
    "code": "LA",
    "dial_code": "+856",
    "name_ar": "لاوس",
    "name_en": "Laos"
}, {
    "code": "LV",
    "dial_code": "+371",
    "name_ar": "لاتفيا",
    "name_en": "Latvia"
}, {
    "code": "LB",
    "dial_code": "+961",
    "name_ar": "لبنان",
    "name_en": "Lebanon"
}, {
    "code": "LS",
    "dial_code": "+266",
    "name_ar": "ليسوتو",
    "name_en": "Lesotho"
}, {
    "code": "LR",
    "dial_code": "+231",
    "name_ar": "ليبيريا",
    "name_en": "Liberia"
}, {
    "code": "LY",
    "dial_code": "+218",
    "name_ar": "ليبيا",
    "name_en": "Libya"
}, {
    "code": "LI",
    "dial_code": "+423",
    "name_ar": "ليختنشتاين",
    "name_en": "Liechtenstein"
}, {
    "code": "LT",
    "dial_code": "+370",
    "name_ar": "ليتوانيا",
    "name_en": "Lithuania"
}, {
    "code": "LU",
    "dial_code": "+352",
    "name_ar": "لوكسمبورغ",
    "name_en": "Luxembourg"
}, {
    "code": "MO",
    "dial_code": "+853",
    "name_ar": "مكاو الصينية (منطقة إدارية خاصة)",
    "name_en": "Macao"
}, {
    "code": "MK",
    "dial_code": "+389",
    "name_ar": "مقدونيا",
    "name_en": "Macedonia"
}, {
    "code": "MG",
    "dial_code": "+261",
    "name_ar": "مدغشقر",
    "name_en": "Madagascar"
}, {
    "code": "MW",
    "dial_code": "+265",
    "name_ar": "ملاوي",
    "name_en": "Malawi"
}, {
    "code": "MY",
    "dial_code": "+60",
    "name_ar": "ماليزيا",
    "name_en": "Malaysia"
}, {
    "code": "MV",
    "dial_code": "+960",
    "name_ar": "جزر المالديف",
    "name_en": "Maldives"
}, {
    "code": "ML",
    "dial_code": "+223",
    "name_ar": "مالي",
    "name_en": "Mali"
}, {
    "code": "MT",
    "dial_code": "+356",
    "name_ar": "مالطا",
    "name_en": "Malta"
}, {
    "code": "MH",
    "dial_code": "+692",
    "name_ar": "جزر المارشال",
    "name_en": "Marshall Islands"
}, {
    "code": "MQ",
    "dial_code": "+596",
    "name_ar": "مارتينيك",
    "name_en": "Martinique"
}, {
    "code": "MR",
    "dial_code": "+222",
    "name_ar": "موريتانيا",
    "name_en": "Mauritania"
}, {
    "code": "MU",
    "dial_code": "+230",
    "name_ar": "موريشيوس",
    "name_en": "Mauritius"
}, {
    "code": "YT",
    "dial_code": "+262",
    "name_ar": "مايوت",
    "name_en": "Mayotte"
}, {
    "code": "MX",
    "dial_code": "+52",
    "name_ar": "المكسيك",
    "name_en": "Mexico"
}, {
    "code": "FM",
    "dial_code": "+691",
    "name_ar": "ميكرونيزيا",
    "name_en": "Micronesia"
}, {
    "code": "MD",
    "dial_code": "+373",
    "name_ar": "مولدافيا",
    "name_en": "Moldova"
}, {
    "code": "MC",
    "dial_code": "+377",
    "name_ar": "موناكو",
    "name_en": "Monaco"
}, {
    "code": "MN",
    "dial_code": "+976",
    "name_ar": "منغوليا",
    "name_en": "Mongolia"
}, {
    "code": "ME",
    "dial_code": "+382",
    "name_ar": "الجبل الأسود",
    "name_en": "Montenegro"
}, {
    "code": "MS",
    "dial_code": "+1664",
    "name_ar": "مونتسرات",
    "name_en": "Montserrat"
}, {
    "code": "MA",
    "dial_code": "+212",
    "name_ar": "المغرب",
    "name_en": "Morocco"
}, {
    "code": "MZ",
    "dial_code": "+258",
    "name_ar": "موزمبيق",
    "name_en": "Mozambique"
}, {
    "code": "MM",
    "dial_code": "+95",
    "name_ar": "ميانمار -بورما",
    "name_en": "Myanmar"
}, {
    "code": "NA",
    "dial_code": "+264",
    "name_ar": "ناميبيا",
    "name_en": "Namibia"
}, {
    "code": "NR",
    "dial_code": "+674",
    "name_ar": "ناورو",
    "name_en": "Nauru"
}, {
    "code": "NP",
    "dial_code": "+977",
    "name_ar": "نيبال",
    "name_en": "Nepal"
}, {
    "code": "NL",
    "dial_code": "+31",
    "name_ar": "هولندا",
    "name_en": "Netherlands"
}, {
    "code": "NC",
    "dial_code": "+687",
    "name_ar": "كاليدونيا الجديدة",
    "name_en": "New Caledonia"
}, {
    "code": "NZ",
    "dial_code": "+64",
    "name_ar": "نيوزيلاندا",
    "name_en": "New Zealand"
}, {
    "code": "NI",
    "dial_code": "+505",
    "name_ar": "نيكاراغوا",
    "name_en": "Nicaragua"
}, {
    "code": "NE",
    "dial_code": "+227",
    "name_ar": "النيجر",
    "name_en": "Niger"
}, {
    "code": "NG",
    "dial_code": "+234",
    "name_ar": "نيجيريا",
    "name_en": "Nigeria"
}, {
    "code": "NU",
    "dial_code": "+683",
    "name_ar": "نيوي",
    "name_en": "Niue"
}, {
    "code": "NF",
    "dial_code": "+672",
    "name_ar": "جزيرة نورفوك",
    "name_en": "Norfolk Island"
}, {
    "code": "KP",
    "dial_code": "+850",
    "name_ar": "كوريا الشمالية",
    "name_en": "North Korea"
}, {
    "code": "MP",
    "dial_code": "+1670",
    "name_ar": "جزر ماريانا الشمالية",
    "name_en": "Northern Mariana Islands"
}, {
    "code": "NO",
    "dial_code": "+47",
    "name_ar": "النرويج",
    "name_en": "Norway"
}, {
    "code": "OM",
    "dial_code": "+968",
    "name_ar": "عُمان",
    "name_en": "Oman"
}, {
    "code": "PK",
    "dial_code": "+92",
    "name_ar": "باكستان",
    "name_en": "Pakistan"
}, {
    "code": "PW",
    "dial_code": "+680",
    "name_ar": "بالاو",
    "name_en": "Palau"
}, {
    "code": "PS",
    "dial_code": "+970",
    "name_ar": "فلسطين",
    "name_en": "Palestine"
}, {
    "code": "PA",
    "dial_code": "+507",
    "name_ar": "بنما",
    "name_en": "Panama"
}, {
    "code": "PG",
    "dial_code": "+675",
    "name_ar": "بابوا غينيا الجديدة",
    "name_en": "Papua New Guinea"
}, {
    "code": "PY",
    "dial_code": "+595",
    "name_ar": "باراغواي",
    "name_en": "Paraguay"
}, {
    "code": "PE",
    "dial_code": "+51",
    "name_ar": "بيرو",
    "name_en": "Peru"
}, {
    "code": "PH",
    "dial_code": "+63",
    "name_ar": "الفلبين",
    "name_en": "Philippines"
}, {
    "code": "PN",
    "dial_code": "+64",
    "name_ar": "جزر بيتكيرن",
    "name_en": "Pitcairn Islands"
}, {
    "code": "PL",
    "dial_code": "+48",
    "name_ar": "بولندا",
    "name_en": "Poland"
}, {
    "code": "PT",
    "dial_code": "+351",
    "name_ar": "البرتغال",
    "name_en": "Portugal"
}, {
    "code": "PR",
    "dial_code": "+1",
    "name_ar": "بورتوريكو",
    "name_en": "Puerto Rico"
}, {
    "code": "QA",
    "dial_code": "+974",
    "name_ar": "قطر",
    "name_en": "Qatar"
}, {
    "code": "RE",
    "dial_code": "+262",
    "name_ar": "روينيون",
    "name_en": "Réunion"
}, {
    "code": "RO",
    "dial_code": "+40",
    "name_ar": "رومانيا",
    "name_en": "Romania"
}, {
    "code": "RU",
    "dial_code": "+7",
    "name_ar": "روسيا",
    "name_en": "Russia"
}, {
    "code": "RW",
    "dial_code": "+250",
    "name_ar": "رواندا",
    "name_en": "Rwanda"
}, {
    "code": "BL",
    "dial_code": "+590",
    "name_ar": "سان بارتليمي",
    "name_en": "Saint Barthélemy"
}, {
    "code": "SH",
    "dial_code": "+290",
    "name_ar": "سانت هيلنا",
    "name_en": "Saint Helena, Ascension and Tristan da Cunha"
}, {
    "code": "KN",
    "dial_code": "+1869",
    "name_ar": "سانت كيتس ونيفيس",
    "name_en": "Saint Kitts and Nevis"
}, {
    "code": "LC",
    "dial_code": "+1758",
    "name_ar": "سانت لوسيا",
    "name_en": "Saint Lucia"
}, {
    "code": "MF",
    "dial_code": "+590",
    "name_ar": "سانت مارتن",
    "name_en": "Saint Martin"
}, {
    "code": "PM",
    "dial_code": "+508",
    "name_ar": "سانت بيير وميكولون",
    "name_en": "Saint Pierre and Miquelon"
}, {
    "code": "VC",
    "dial_code": "+1784",
    "name_ar": "سانت فنسنت وغرنادين",
    "name_en": "Saint Vincent and the Grenadines"
}, {
    "code": "WS",
    "dial_code": "+685",
    "name_ar": "ساموا",
    "name_en": "Samoa"
}, {
    "code": "SM",
    "dial_code": "+378",
    "name_ar": "سان مارينو",
    "name_en": "San Marino"
}, {
    "code": "ST",
    "dial_code": "+239",
    "name_ar": "ساو تومي وبرينسيبي",
    "name_en": "Sao Tome and Principe"
}, {
    "code": "SA",
    "dial_code": "+966",
    "name_ar": "المملكة العربية السعودية",
    "name_en": "Saudi Arabia"
}, {
    "code": "SN",
    "dial_code": "+221",
    "name_ar": "السنغال",
    "name_en": "Senegal"
}, {
    "code": "RS",
    "dial_code": "+381",
    "name_ar": "صربيا",
    "name_en": "Serbia"
}, {
    "code": "SC",
    "dial_code": "+248",
    "name_ar": "سيشل",
    "name_en": "Seychelles"
}, {
    "code": "SL",
    "dial_code": "+232",
    "name_ar": "سيراليون",
    "name_en": "Sierra Leone"
}, {
    "code": "SG",
    "dial_code": "+65",
    "name_ar": "سنغافورة",
    "name_en": "Singapore"
}, {
    "code": "SX",
    "dial_code": "+1721",
    "name_ar": "سينت مارتن",
    "name_en": "Sint Maarten"
}, {
    "code": "SK",
    "dial_code": "+421",
    "name_ar": "سلوفاكيا",
    "name_en": "Slovakia"
}, {
    "code": "SI",
    "dial_code": "+386",
    "name_ar": "سلوفينيا",
    "name_en": "Slovenia"
}, {
    "code": "SB",
    "dial_code": "+677",
    "name_ar": "جزر سليمان",
    "name_en": "Solomon Islands"
}, {
    "code": "SO",
    "dial_code": "+252",
    "name_ar": "الصومال",
    "name_en": "Somalia"
}, {
    "code": "ZA",
    "dial_code": "+27",
    "name_ar": "جنوب أفريقيا",
    "name_en": "South Africa"
}, {
    "code": "GS",
    "dial_code": "+500",
    "name_ar": "جورجيا الجنوبية وجزر ساندويتش الجنوبية",
    "name_en": "South Georgia and the South Sandwich Islands"
}, {
    "code": "KR",
    "dial_code": "+82",
    "name_ar": "كوريا الجنوبية",
    "name_en": "South Korea"
}, {
    "code": "SS",
    "dial_code": "+211",
    "name_ar": "جنوب السودان",
    "name_en": "South Sudan"
}, {
    "code": "ES",
    "dial_code": "+34",
    "name_ar": "إسبانيا",
    "name_en": "Spain"
}, {
    "code": "LK",
    "dial_code": "+94",
    "name_ar": "سريلانكا",
    "name_en": "Sri Lanka"
}, {
    "code": "SD",
    "dial_code": "+249",
    "name_ar": "السودان",
    "name_en": "Sudan"
}, {
    "code": "SR",
    "dial_code": "+597",
    "name_ar": "سورينام",
    "name_en": "Suriname"
}, {
    "code": "SJ",
    "dial_code": "+47",
    "name_ar": "سفالبارد وجان مايان",
    "name_en": "Svalbard and Jan Mayen"
}, {
    "code": "SZ",
    "dial_code": "+268",
    "name_ar": "سوازيلاند",
    "name_en": "Swaziland"
}, {
    "code": "SE",
    "dial_code": "+46",
    "name_ar": "السويد",
    "name_en": "Sweden"
}, {
    "code": "CH",
    "dial_code": "+41",
    "name_ar": "سويسرا",
    "name_en": "Switzerland"
}, {
    "code": "SY",
    "dial_code": "+963",
    "name_ar": "سوريا",
    "name_en": "Syria"
}, {
    "code": "TW",
    "dial_code": "+886",
    "name_ar": "تايوان",
    "name_en": "Taiwan"
}, {
    "code": "TJ",
    "dial_code": "+992",
    "name_ar": "طاجكستان",
    "name_en": "Tajikistan"
}, {
    "code": "TZ",
    "dial_code": "+255",
    "name_ar": "تانزانيا",
    "name_en": "Tanzania"
}, {
    "code": "TH",
    "dial_code": "+66",
    "name_ar": "تايلاند",
    "name_en": "Thailand"
}, {
    "code": "TL",
    "dial_code": "+670",
    "name_ar": "تيمور الشرقية",
    "name_en": "Timor-Leste"
}, {
    "code": "TG",
    "dial_code": "+228",
    "name_ar": "توجو",
    "name_en": "Togo"
}, {
    "code": "TK",
    "dial_code": "+690",
    "name_ar": "توكيلو",
    "name_en": "Tokelau"
}, {
    "code": "TO",
    "dial_code": "+676",
    "name_ar": "تونغا",
    "name_en": "Tonga"
}, {
    "code": "TT",
    "dial_code": "+1868",
    "name_ar": "ترينيداد وتوباغو",
    "name_en": "Trinidad and Tobago"
}, {
    "code": "TN",
    "dial_code": "+216",
    "name_ar": "تونس",
    "name_en": "Tunisia"
}, {
    "code": "TR",
    "dial_code": "+90",
    "name_ar": "تركيا",
    "name_en": "Turkey"
}, {
    "code": "TM",
    "dial_code": "+993",
    "name_ar": "تركمانستان",
    "name_en": "Turkmenistan"
}, {
    "code": "TC",
    "dial_code": "+1649",
    "name_ar": "جزر الترك وجايكوس",
    "name_en": "Turks and Caicos Islands"
}, {
    "code": "TV",
    "dial_code": "+6688",
    "name_ar": "توفالو",
    "name_en": "Tuvalu"
}, {
    "code": "UG",
    "dial_code": "+256",
    "name_ar": "أوغندا",
    "name_en": "Uganda"
}, {
    "code": "UA",
    "dial_code": "+380",
    "name_ar": "أوكرانيا",
    "name_en": "Ukraine"
}, {
    "code": "AE",
    "dial_code": "+971",
    "name_ar": "الإمارات العربية المتحدة",
    "name_en": "United Arab Emirates"
}, {
    "code": "GB",
    "dial_code": "+44",
    "name_ar": "المملكة المتحدة",
    "name_en": "United Kingdom"
}, {
    "code": "US",
    "dial_code": "+1",
    "name_ar": "الولايات المتحدة",
    "name_en": "United States"
}, {
    "code": "UM",
    "dial_code": "+1",
    "name_ar": "جزر الولايات المتحدة النائية",
    "name_en": "United States Minor Outlying Islands"
}, {
    "code": "VI",
    "dial_code": "+1340",
    "name_ar": "جزر فرجين الأمريكية",
    "name_en": "United States Virgin Islands"
}, {
    "code": "UY",
    "dial_code": "+598",
    "name_ar": "أورغواي",
    "name_en": "Uruguay"
}, {
    "code": "UZ",
    "dial_code": "+998",
    "name_ar": "أوزبكستان",
    "name_en": "Uzbekistan"
}, {
    "code": "VU",
    "dial_code": "+678",
    "name_ar": "فانواتو",
    "name_en": "Vanuatu"
}, {
    "code": "VA",
    "dial_code": "+39",
    "name_ar": "الفاتيكان",
    "name_en": "Vatican City State"
}, {
    "code": "VE",
    "dial_code": "+58",
    "name_ar": "فنزويلا",
    "name_en": "Venezuela"
}, {
    "code": "VN",
    "dial_code": "+84",
    "name_ar": "فيتنام",
    "name_en": "Viet Nam"
}, {
    "code": "VG",
    "dial_code": "+1284",
    "name_ar": "جزر فرجين البريطانية",
    "name_en": "Virgin Islands"
}, {
    "code": "WF",
    "dial_code": "+967",
    "name_ar": "جزر والس وفوتونا",
    "name_en": "Wallis and Futuna"
}, {
    "code": "EH",
    "dial_code": "+212",
    "name_ar": "الصحراء الغربية",
    "name_en": "Western Sahara"
}, {
    "code": "YE",
    "dial_code": "+967",
    "name_ar": "اليمن",
    "name_en": "Yemen"
}, {
    "code": "ZM",
    "dial_code": "+260",
    "name_ar": "زامبيا",
    "name_en": "Zambia"
}, {
    "code": "ZW",
    "dial_code": "+263",
    "name_ar": "زيمبابوي",
    "name_en": "Zimbabwe"
}];

           /* $scope.login = function () {
                $scope.ui.block();
                $scope.error = false;
                Parse.User.logIn($scope.loginDetails.username, $scope.loginDetails.password).then(function (user) {
                    $scope.ui.unblock();
                    if(user.get("type")=='admin'){
                    $timeout(function () {
                       
                        $rootScope.currentUser = user;
                        $scope.loginDetails = null;
                        window.location.href ='/';
                    });
                    }
                    else{
                         $scope.logout();
                         $timeout(function () {
                         $scope.error = true;
                        });


                    }
                }, function (error) {
                    $timeout(function () {
                        $scope.ui.unblock();
                        $scope.error = error.message;
                    });
                });
            };

            $scope.logout = function () {
                Parse.User.logOut().then(function () {
                    $timeout(function () {
                        $rootScope.currentUser = null;
                      
                        window.location.href ='/account/login';
                    });
                });
            };*/
        }
        
    ]);