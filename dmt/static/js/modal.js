$(document).ready(function(){
    $("body").on('click', '#shadow, .modal_close_link', function(){
        closeModal();
        if($('#alert_modal')!=undefined){closeMyAlert();}
    });
	$("body").on('click', "#alert_shadow", function(){closeMyAlert();});
	$("body").on('click', "#confirm_shadow", function(){closeMyConfirm();});
	$("body").keyup(function(e){if(e.keyCode=="27"){
		if($("#alert_modal").length!=0){
			closeMyAlert();
		}else if($("#confirm_modal").length!=0){
			closeMyConfirm();
		}else{
			closeModal();
		}
	}});
    $(window).resize(function(){
        $("#shadow").height($(document).height());
    });
});
function openModal(id){
	//reset form
	if($("#"+id+" form").length!=0){
		$("#"+id+" form input[type='text'], #"+id+" form input[type='password'], #"+id+" form input[type='email'], #"+id+" form textarea").val('');
		$("#"+id+" .form_row").removeClass('err');
	}
	$('#shadow').height($(document).height()).css({opacity:'0', display:'block'});
	$('#shadow').animate({opacity:'0.65'}, 500);
	var top=($(window).height()-$('#'+id).height())/2;
    if ($('#'+id).height() >= $(window).height()) {$('#'+id).height($(window).height())}
	if (top<0){top=0;}
	//$('#'+id).css('left', '50%').css('top', top+'px').addClass('opened_window');
	//$('#'+id).css('left', '50%').addClass('opened_window').animate({top:'0px'}, 500, 'easeOutBack');
    //$('#'+id).draggable({
	//	handle: 'div.modal_window_title',
    //    containment:'window'
	//});
    $('#'+id).css('left', '50%').addClass('opened_window').animate({
        top: '30px'}, 500, 'easeOutBack');
    $('#'+id).draggable({handle: 'div.modal_window_title', containment: 'window'});
    $('#'+id).css({
        'height': $(window).height()-60
        });
}
function closeModal(){
    var height=$("div.opened_window:visible").height();
    $("div.opened_window").animate({top:-height-200+'px'}, 500, "easeInBack");
    $("#shadow").animate({opacity:'0'}, 500);
    setTimeout('$("#shadow").css("display", "none")', 500);
    $("div.opened_window").removeClass("opened_window"); //.draggable("destroy");
}
function myAlert(text, title, type){
    if(typeof(title)=="undefined"){
        title = "Message";
    }
    if(typeof(type)=="undefined"){
        type = 'info';
    }
    var html = '<div class="modal_window middle_modal_window" id="alert_modal"><div class="modal_window_top"><div class="modal_window_title">'+title+'</div>'+
    '<div class="modal_window_close"><a href="javascript:void(0)" class="close_icon" onClick="closeMyAlert()"></a></div><div class="clr"></div></div>'+
    '<div class="modal_content_wrapper '+type+'"><div class="text" id="modal_text">'+text+'</div><div class="form_buttons"><button type="button" class="btn_big btn_blue" onclick="closeMyAlert()">OK</button></div></div></div>';
    $("body").append(html);
    $("#alert_shadow").height($(document).height()).css({'opacity':'0', 'display':'block'});
    $("#alert_shadow").animate({'opacity':'0.65'}, 500);
    var top = ($(window).height()-$("#alert_modal").height())/2;
    if(top<0){top=50;}
    $("#alert_modal").css('left','50%').animate({top:top+'px'}, 500, "easeOutBack");
    $("#alert_modal").draggable({
        handle:"div.modal_window_title"
    });
}
function closeMyAlert(){
    $("#alert_modal").animate({top:'-150%'}, 500, "easeInBack");
    $("#alert_shadow").animate({opacity:'0'}, 500);
    setTimeout('$("#alert_shadow").css("display", "none");$("#alert_modal").remove();', 500);
}

function myConfirm(text, func, btn_text, title){
    if(typeof(title)=="undefined"){title = "Message";}
    if(typeof(btn_text)=="undefined"){btn_text = 'OK';}
    if(typeof(text)=="undefined"){text = 'Are you sure';}
    if(typeof(func)=="undefined"){func = alert("callback empty");}
    var html = '<div class="modal_window middle_modal_window" id="confirm_modal"><div class="modal_window_top err"><div class="modal_window_title">'+title+'</div>'+
    '<div class="modal_window_close" ><a href="javascript:void(0)" class="close_icon" onClick="closeMyConfirm()"></a></div><div class="clr"></div></div>'+
    '<div class="modal_content_wrapper"><div class="text" id="modal_text">'+text+'</div><div class="modal_window_bottom form_buttons"><button type="button" class="btn_big btn_blue" onClick="'+func+'">'+btn_text+'</button><button type="button" class="btn_big btn_trans_red" onClick="closeMyConfirm()">Cancel</button></div></div></div>';
    $("body").append(html);
    $("#confirm_shadow").height($(document).height()).css({'opacity':'0', 'display':'block'});
    $("#confirm_shadow").animate({'opacity':'0.65'}, 500);
    var top = ($(window).height()-$("#confirm_modal").height())/2;
    if(top<0){top=50;}
    $("#confirm_modal").css('left','50%').animate({top:top+'px'}, 500, "easeOutBack");
    $("#confirm_modal").draggable({
        handle:"div.modal_window_title"
    });
}
function closeMyConfirm(){
    $("#confirm_modal").animate({top:'-150%'}, 500, "easeInBack");
    $("#confirm_shadow").animate({opacity:'0'}, 500);
    setTimeout('$("#confirm_shadow").css("display", "none");$("#confirm_modal").remove();', 500);
}