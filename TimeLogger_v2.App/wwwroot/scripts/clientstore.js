export const sessionStore={getter:{accountDetails:function(){return JSON.parse(sessionStorage.getItem("accountDetails"))},isLoggedIn:function(){return"true"==sessionStorage.getItem("isLoggedIn")},projects:function(){return JSON.parse(sessionStorage.getItem("projects"))}},setter:{accountDetails:function(e){sessionStorage.setItem("accountDetails",JSON.stringify(e))},isLoggedIn:function(e){sessionStorage.setItem("isLoggedIn",e)},projects:function(e){sessionStorage.setItem("projects",JSON.stringify(e))}}};