
$(document).ready(function() {
// var apiai = require('apiai');
// var app = apiai("ca0ab94c7104450ea34585ee8a7a00b8");

var accessToken = "ca0ab94c7104450ea34585ee8a7a00b8";
var serverbaseUrl = "http://18.219.111.242:1337"//i "http://localhost:8000/api-server"
var dialogbaseUrl = "https://api.api.ai/v1/";


var local = {};
local.avatar = "https://image.flaticon.com/icons/png/128/149/149071.png";

var remote = {};


remote.avatar = "https://developers.viber.com/images/apps/apiai-icon.png";


var sendPOSTRequest = function(url, method, payload, successCallBack){
        var obj = {
        	type: method,
            url: serverbaseUrl + url,
            dataType: 'JSON',
            contentType: 'application/json',
            success: function( data, status, xhr) {
                console.log(data, status);
                return successCallBack(data, status);
            },
            error: function(xhr, status, error){
                //hideAjaxInProgress();
                //showNotification('error', "Something went wrong, please try again later");
                console.log("failure");
            }
        }
        
        if(method.toUpperCase() == "POST" && payload ){
        	obj.data = JSON.stringify(payload);
        }

        $.ajax(obj);
}


$("#user-form").submit(function(e) {
        e.preventDefault();
        //hideAjaxInProgress();
        var payload = {
                "name":$("#exampleInputName").val(),
                "email":$("#exampleInputEmail").val(),
                };

        sendPOSTRequest('/getcourse',"GET", null,  function(data, status){
                if(data && data.success){
                    if(data.message){
                        console.log("success");
                        }
                    showStatusForm();
                    
                }else if(data && !data.success){
                    if(data.message){
                        //showNotification('error', data.message);
                        console.log("failure");
                    }
                    }
                })
        
    });




function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

function insertChat(who, text){
    var control = "";
    var date = formatTime(new Date());
    
     if (who == "local"){
        
         control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        //'<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+local.avatar+'" /></div>' +                                
                  '</li>';                   
    }else{
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+local.avatar+'" /></div>' +
                        //'<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ remote.avatar +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';   
    }
    $("#messages").append(control);
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

$("#chat-panel").on('click',function(){
    $(".innerframe").toggle();
});

function resetChat(){
    $("#messages").empty();
}

$(".mytext").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("local", text);              
            $(this).val('');
            queryBot(text)
        }
    }
});

resetChat();

function queryBot(text) {
            $.ajax({
                type: "POST",
                url: dialogbaseUrl + "query?v=20150910",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                data: JSON.stringify({ query: text, lang: "en", sessionId: "597468526481284741854158548745" }),
                success: function(data) {
                    insertChat("remote",data.result.fulfillment.speech);
                },
                error: function() {
                    insertChat("remote","Internal Server Error");
                }
            });
            // var request = app.textRequest(text, {   sessionId: '597468526481284741854158548745'  });
            
            // request.on('response', function(response) {     
            //                insertChat("remote",response);  
            //    });

            // request.on('error', function(error) {
            //                 insertChat("remote","Internal Server Error");     
            //     }); 
    }



})
