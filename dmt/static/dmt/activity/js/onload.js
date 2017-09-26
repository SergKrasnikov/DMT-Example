$(document).ready(function(){
	onResize();
	$('input[type="checkbox"]').lc_switch();
	// var date = new Date();
	// var d = date.getDate(); if(d<10){d='0'+d;}
	// var m = date.getMonth()+1; if(m<10){m='0'+m;}
	// var y = date.getFullYear();
	// var now_date = y+'-'+m+'-'+d;
	// $(".date_inp").val(now_date);
	$(".date_inp").datepicker({
		dateFormat:'yy-mm-dd'
	});

	$(".ip_inp").ipaddress();
	
	$(".title_toggle").click(function(){
		$(this).children('span').toggleClass('down');
		$(this).parents('.white_block').find('.block_content').slideToggle(200);
	});

	$("body").on('mouseover', '.add_tbl tbody tr', function(){
		$(this).find('a.delete_link').css('display','inline-block');
	});
	$("body").on('mouseover', '.add_tbl_ip tbody tr', function(){
		$(this).find('a.delete_link').css('display','inline-block');
	});
	$("body").on('mouseover', '.add_tbl_user tbody tr', function(){
		$(this).find('a.delete_link').css('display','inline-block');
	});
	$("body").on('mouseout', '.add_tbl tbody tr', function(){
		$(this).find('a.delete_link').css('display','none');
	});
	$("body").on('mouseout', '.add_tbl_ip tbody tr', function(){
		$(this).find('a.delete_link').css('display','none');
	});
	$("body").on('mouseout', '.add_tbl_user tbody tr', function(){
		$(this).find('a.delete_link').css('display','none');
	});

	$("body").on('click', '.delete_ip_link', function(){
		var ip = $(this).parents('tr').find('input[type="hidden"]').val();
		myConfirm('Do you really want to delete IP <b>'+ip+'</b>', 'deletePoolIP(\''+ip+'\')', 'Delete', 'Delete IP');
	});
	$("body").on('click', '.delete_user_link', function(){
		var user = $(this).parents('tr').find('input[type="hidden"]').val();
		myConfirm('Do you really want to delete user <b>'+user+'</b>', 'deletePoolUser(\''+user+'\')', 'Delete', 'Delete User');
	});
	$("body").on('click', '.delete_ips_link', function(){
		var ip = $(this).attr("data-ip");
		var pool = $(this).attr("data-pool")
		myConfirm('Do you really want to delete IP <b>'+ip+'</b>', 'deleteNewIP(\''+ip+'\', \''+pool+'\')', 'Delete', 'Delete IP');
	});
	$("body").on('click', '.delete_users_link', function(){
		var name = $(this).attr("data-name");
		var pool = $(this).attr("data-pool")
		myConfirm('Do you really want to delete sender <b>'+name+'</b>', 'deleteNewUser(\''+name+'\', \''+pool+'\')', 'Delete', 'Delete Sender');
	});
	
	$("#pool_user").keydown(function(e){if(e.keyCode=="13"){addPoolUser();}});
	$("#pool_ip_octet_4").keydown(function(e){if(e.keyCode=="13"){addPoolIP();}});
	$("#ip_octet_4").keydown(function(e){if(e.keyCode=="13"){addNewIP();}});
	$("#new_user").keydown(function(e){if(e.keyCode=="13"){addNewUser();}});
	
	/*sliders*/
	
	$("#sent_slider").slider({
		range: true,
		min:0,
		max:500,
		values:[SENT_MIN, SENT_MAX],
		slide:function(event, ui){
			$("#sent_slider_values").html(ui.values[0]+" - "+ui.values[1]);
			$("#sent_min").val(ui.values[0]);
			$("#sent_max").val(ui.values[1]);
		}
	});
	$("#sent_slider_values").html($("#sent_slider").slider("values", 0)+" - "+$("#sent_slider").slider("values",1));
	$("#sent_min").val($("#sent_slider").slider("values", 0));
	$("#sent_max").val($("#sent_slider").slider("values", 1));
	
	$("#delivered_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[DELIVERED_MIN, DELIVERED_MAX],
		slide:function(event, ui){
			$("#delivered_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#delivered_min").val(ui.values[0]);
			$("#delivered_max").val(ui.values[1]);
		}
	});
	$("#delivered_slider_values").html("%"+$("#delivered_slider").slider("values", 0)+" - %"+$("#delivered_slider").slider("values",1));
	$("#delivered_min").val($("#delivered_slider").slider("values", 0));
	$("#delivered_max").val($("#delivered_slider").slider("values", 1));
	
	$("#opened_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[OPENED_MIN, OPENED_MAX],
		slide:function(event, ui){
			$("#opened_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#opened_min").val(ui.values[0]);
			$("#opened_max").val(ui.values[1]);
		}
	});
	$("#opened_slider_values").html("%"+$("#opened_slider").slider("values", 0)+" - %"+$("#opened_slider").slider("values",1));
	$("#opened_min").val($("#opened_slider").slider("values", 0));
	$("#opened_max").val($("#opened_slider").slider("values", 1));
	
	$("#clicked_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[CLICKED_MIN, CLICKED_MAX],
		slide:function(event, ui){
			$("#clicked_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#clicked_min").val(ui.values[0]);
			$("#clicked_max").val(ui.values[1]);
		}
	});
	$("#clicked_slider_values").html("%"+$("#clicked_slider").slider("values", 0)+" - %"+$("#clicked_slider").slider("values",1));
	$("#clicked_min").val($("#clicked_slider").slider("values", 0));
	$("#clicked_max").val($("#clicked_slider").slider("values", 1));
	
	$("#nospf_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[NOSPF_MIN, NOSPF_MAX],
		slide:function(event, ui){
			$("#nospf_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#nospf_min").val(ui.values[0]);
			$("#nospf_max").val(ui.values[1]);
		}
	});
	$("#nospf_slider_values").html("%"+$("#nospf_slider").slider("values", 0)+" - %"+$("#nospf_slider").slider("values",1));
	$("#nospf_min").val($("#nospf_slider").slider("values", 0));
	$("#nospf_max").val($("#nospf_slider").slider("values", 1));
	
	$("#sbounce_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[SBOUNCE_MIN, SBOUNCE_MAX],
		slide:function(event, ui){
			$("#sbounce_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#sbounce_min").val(ui.values[0]);
			$("#sbounce_max").val(ui.values[1]);
		}
	});
	$("#sbounce_slider_values").html("%"+$("#sbounce_slider").slider("values", 0)+" - %"+$("#sbounce_slider").slider("values",1));
	$("#sbounce_min").val($("#sbounce_slider").slider("values", 0));
	$("#sbounce_max").val($("#sbounce_slider").slider("values", 1));
	
	$("#hbounce_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[HBOUNCE_MIN, HBOUNCE_MAX],
		slide:function(event, ui){
			$("#hbounce_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#hbounce_min").val(ui.values[0]);
			$("#hbounce_max").val(ui.values[1]);
		}
	});
	$("#hbounce_slider_values").html("%"+$("#hbounce_slider").slider("values", 0)+" - %"+$("#hbounce_slider").slider("values",1));
	$("#hbounce_min").val($("#hbounce_slider").slider("values", 0));
	$("#hbounce_max").val($("#hbounce_slider").slider("values", 1));
	
	$("#yahoo_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[YAHOO_MIN, YAHOO_MAX],
		slide:function(event, ui){
			$("#yahoo_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#yahoo_min").val(ui.values[0]);
			$("#yahoo_max").val(ui.values[1]);
		}
	});
	$("#yahoo_slider_values").html("%"+$("#yahoo_slider").slider("values", 0)+" - %"+$("#yahoo_slider").slider("values",1));
	$("#yahoo_min").val($("#yahoo_slider").slider("values", 0));
	$("#yahoo_max").val($("#yahoo_slider").slider("values", 1));

	$("#hotmail_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[HOTMAIL_MIN, HOTMAIL_MAX],
		slide:function(event, ui){
			$("#hotmail_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#hotmail_min").val(ui.values[0]);
			$("#hotmail_max").val(ui.values[1]);
		}
	});
	$("#hotmail_slider_values").html("%"+$("#hotmail_slider").slider("values", 0)+" - %"+$("#hotmail_slider").slider("values",1));
	$("#hotmail_min").val($("#hotmail_slider").slider("values", 0));
	$("#hotmail_max").val($("#hotmail_slider").slider("values", 1));
	
	$("#aol_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[AOL_MIN, AOL_MAX],
		slide:function(event, ui){
			$("#aol_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#aol_min").val(ui.values[0]);
			$("#aol_max").val(ui.values[1]);
		}
	});
	$("#aol_slider_values").html("%"+$("#aol_slider").slider("values", 0)+" - %"+$("#aol_slider").slider("values",1));
	$("#aol_min").val($("#aol_slider").slider("values", 0));
	$("#aol_max").val($("#aol_slider").slider("values", 1));
	
	$("#comcast_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[COMCAST_MIN, COMCAST_MAX],
		slide:function(event, ui){
			$("#comcast_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#comcast_min").val(ui.values[0]);
			$("#comcast_max").val(ui.values[1]);
		}
	});
	$("#comcast_slider_values").html("%"+$("#comcast_slider").slider("values", 0)+" - %"+$("#comcast_slider").slider("values",1));
	$("#comcast_min").val($("#comcast_slider").slider("values", 0));
	$("#comcast_max").val($("#comcast_slider").slider("values", 1));
	
	$("#others_slider").slider({
		range: true,
		min:0,
		max:100,
		values:[OTHER_MIN, OTHER_MAX],
		slide:function(event, ui){
			$("#others_slider_values").html("%"+ui.values[0]+" - %"+ui.values[1]);
			$("#others_min").val(ui.values[0]);
			$("#others_max").val(ui.values[1]);
		}
	});
	$("#others_slider_values").html("%"+$("#others_slider").slider("values", 0)+" - %"+$("#others_slider").slider("values",1));
	$("#others_min").val($("#others_slider").slider("values", 0));
	$("#others_max").val($("#others_slider").slider("values", 1));
	
});

$(window).resize(function(){onResize();});

function onResize(){
	//main menu width
	$("#main_menu").width($(window).width()-($("#logo").width()+$("#profile_top").width()));
	var menu_width=0;
	$("#main_menu a").each(function(){
		menu_width = menu_width+$(this).width();
	});
	var padd = (($("#main_menu").width()-menu_width)/$("#main_menu a").length)/2;
	$("#main_menu a").css({'padding-left':padd+'px', 'padding-right':padd+'px'});
	//footer to bottom
	if($(window).height()>($('header').height()+$('main').height()+$('footer').height())){
		$('main').height($(window).height()-($('header').height()+$('footer').height()+1));
	}
}

/*===MODALS===*/
function getModalContent(url,id){
    $.ajax({
	url:url,
	cache:false,
	success:function(html){
	    $("#"+id+" .modal_content_wrapper").html(html);
	}
    });
}

function openModalWindow(url,id){
	getModalContent(url,id);
	openModal(id);
}

function openCreateNewRoute(){
	getModalContent('/dmt/route/create/', 'rename_pool_window');
	openModal('rename_pool_window');
}

function renamePool(){
	if($("#id_name").val()!=""){
		$("#id_name").parents('div.form_row').removeClass('err_text');
		closeModal();

		name = $("#id_name").val();
		mta = $("#id_mta_host").val();
		port = $("#id_mta_port").val();

		$.getJSON(link_to_create_route,{'name': name, 'mta_host': mta, 'mta_port': port},
			function(json){
				if(json.pk===parseInt(json.pk, 10)){
					myAlert('Pool has successfully created.', 'Creating Pool', 'success');
				}else{
					myAlert('Some error while creating pool.', 'Creating Pool', 'error');
				}
			},
			function(){
				myAlert('Some error while creating pool.', 'Creating Pool', 'error');
			}
		);

		return false;
	}else{
		$("#id_name").parents('div.form_row').addClass('err');
		$("#id_name").parent('div').next('p.err_text').html('Enter pool name');
		return false;
	}
}

function createRoute(){
	if($("#id_name").val()!=""){
		$("#id_name").parents('div.form_row').removeClass('err_text');
		closeModal();

		name = $("#id_name").val();
		console.log(name);
		mta = $("#id_mta").val();
		console.log(mta);

		$.getJSON(link_to_create_route,{'name': name, 'mta': mta},
			function(json){
				if(json.pk===parseInt(json.pk, 10)){
					myAlert('Pool has successfully created.', 'Creating Pool', 'success');
				}else{
					myAlert('Some error while creating pool.', 'Creating Pool', 'error');
				}
			},
			function(){
				myAlert('Some error while creating pool.', 'Creating Pool', 'error');
			}
		);

		return false;
	}else{
		$("#id_name").parents('div.form_row').addClass('err');
		$("#id_name").parent('div').next('p.err_text').html('Enter pool name');
		return false;
	}
}

function editRoute(url){
	console.log(url);
	if($("#id_name").val()!=""){
		console.log(url);
		$("#id_name").parents('div.form_row').removeClass('err_text');
		closeModal();

		name = $("#id_name").val();
		mta = $("#id_mta").val();

		$.getJSON(url,{'name': name, 'mta': mta},
			function(json){
				if(json.pk===parseInt(json.pk, 10)){
					myAlert('Pool has successfully created.', 'Creating Pool', 'success');
				}else{
					myAlert('Some error while creating pool.', 'Creating Pool', 'error');
				}
			},
			function(){
				myAlert('Some error while creating pool.', 'Creating Pool', 'error');
			}
		);

		return false;
	}else{
		$("#id_name").parents('div.form_row').addClass('err');
		$("#id_name").parent('div').next('p.err_text').html('Enter pool name');
		return false;
	}
}

function openEditRoute(link_to_edit_route){
    $("#pool_ip_tbody, #pool_user_tbody").html('');
    getModalContent(link_to_edit_route, 'edit_pool_window');
}

function addPoolIP(){
	var ip = $("#pool_ip").val();
	if(ip!=""){
		$("#pool_ip").parents('div.form_row').removeClass('err');
		var rez = '<tr>'+
		'<td><input type="hidden" class="add_ip_inp" name="ip[]" value="'+ip+'" />'+ip+'</td>'+
		'<td class="td_delete_link"><a href="javascript:void(0)" class="delete_link delete_ip_link"></a></td>'+
		'</tr>';
		$("#pool_ip_tbody").prepend(rez);
		$("#pool_ip, .ip_octet").val('');
		$("#pool_ip_octet_1").focus();
	}else{
		$("#pool_ip").parents('div.form_row').addClass('err');
		$("#pool_ip").parent('div').next('p.err_text').html('Enter IP address');
	}
}
function deletePoolIP(ip){
	$("#pool_ip_tbody input[value='"+ip+"']").parents('tr').remove();
	closeMyConfirm();
}
function isValidEmail(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}
function addPoolUser(){
	var user = $("#pool_user").val();
	if(user!=""){
		$("#pool_user").parents('div.form_row').removeClass('err');
		if(isValidEmail(user)){
			$("#pool_user").parents('div.form_row').removeClass('err');
			var rez = '<tr>'+
			'<td><input type="hidden" class="add_user_inp" name="user[]" value="'+user+'" />'+user+'</td>'+
			'<td class="td_delete_link"><a href="javascript:void(0)" class="delete_link delete_user_link"></a></td>'+
			'</tr>';
			$("#pool_user_tbody").prepend(rez);
			$("#pool_user").val('');
		}else{
			$("#pool_user").parents('div.form_row').addClass('err');
			$("#pool_user").parent('div').next('p.err_text').html('Invalid user email');
		}
	}else{
		$("#pool_user").parents('div.form_row').addClass('err');
		$("#pool_user").parent('div').next('p.err_text').html('Enter user email');
	}
}
function deletePoolUser(user){
	$("#pool_user_tbody input[value='"+user+"']").parents('tr').remove();
	closeMyConfirm();
}

function showModalWait(id){
	var cols = $("#"+id).parents('table').find('th').length;
	$("#"+id).html('<tr><td colspan="'+cols+'" class="td_wait"><img src="images/ajax-loader.gif" />Please wait</td></tr>');
}
function hideModalWait(id){
	$("#"+id).html('');
}

function openIPsPool(obj){
	var pool_id = obj.attr("data-id");
	//TODO: get ip list for pool and add to list
	openModal("ips_window");
	showModalWait('new_ips_tbody');
	
	/*
	 * эмуляция запроса IP по выбранному пулу
	 * в ответ получаем объект в переменную json
	 */
	var json = [
		{"ip":"123.145.13.1", "date":"16.03.2016 17:23"},
		{"ip":"123.145.13.2", "date":"16.03.2016 17:24"},
		{"ip":"123.145.13.3", "date":"16.03.2016 17:25"},
		{"ip":"123.145.13.4", "date":"16.03.2016 17:26"},
		{"ip":"123.145.13.5", "date":"16.03.2016 17:27"},
		{"ip":"123.145.13.6", "date":"16.03.2016 17:28"},
		{"ip":"123.145.13.7", "date":"16.03.2016 17:28"},
		{"ip":"123.145.13.8", "date":"16.03.2016 17:29"},
		{"ip":"123.145.13.9", "date":"16.03.2016 17:33"},
		{"ip":"123.145.13.10", "date":"16.03.2016 17:41"},
		{"ip":"123.145.13.11", "date":"16.03.2016 18:02"},
		{"ip":"123.145.13.12", "date":"16.03.2016 18:07"},
		{"ip":"123.145.13.13", "date":"16.03.2016 18:11"},
		{"ip":"123.145.13.14", "date":"16.03.2016 18:23"},
		{"ip":"123.145.13.15", "date":"16.03.2016 18:23"},
		{"ip":"123.145.13.16", "date":"16.03.2016 18:23"},
		{"ip":"123.145.13.17", "date":"16.03.2016 18:23"},
		{"ip":"123.145.13.18", "date":"16.03.2016 18:23"},
		{"ip":"123.145.13.19", "date":"16.03.2016 18:23"}
	];
	
	//выполнить по success ОТ
	var rez = '';
	for(var i=0;i<json.length;i++){
		rez += '<tr>'+
		'<td>'+json[i].ip+'</td>'+
		'<td>'+json[i].date+'</td>'+
		'<td class="td_delete_link"><a href="javascript:void(0)" class="delete_link delete_ips_link" data-ip="'+json[i].ip+'" data-pool="'+pool_id+'"></a></td>'+
		'</tr>';
	}
	//в реальности timeout убрать 
	setTimeout(function(){
		hideModalWait('new_ips_tbody');
		$("#new_ips_tbody").html(rez);
		var scroll_height = $(window).height()-(70+66+26+26+80);
		$("#new_ips_tbody").parents(".scroll_block").height(scroll_height);
		$("#new_ips_tbody").parents(".scroll_block").jScrollPane();
		var top = ($(window).height()-$("#ips_window").height())/2;
		$("#ips_window").css('top',top);
	}, 2000);
	//выполнить по success ДО
}

function addNewIP(){
	if($("#new_ip").val()!=""){
		$("#new_ip").parents('div.form_row').removeClass('err');
		//эмуляция добавления IP в список пула
		var date = new Date();
		var d = date.getDate(); if(d<10){d='0'+d;}
		var m = date.getMonth()+1; if(m<10){m='0'+m;}
		var y = date.getFullYear();
		var h = date.getHours(); if(h<10){h='0'+h;}
		var mn = date.getMinutes(); if(mn<10){mn='0'+mn;}
		var now_date = d+'.'+m+'.'+y+' '+h+':'+mn;
		var json = [{"ip":$("#new_ip").val(),"date":now_date, "pool":"1"}];
		var rez = '<tr>'+
		'<td>'+json[0].ip+'</td>'+
		'<td>'+json[0].date+'</td>'+
		'<td class="td_delete_link"><a href="javascript:void(0)" class="delete_link delete_ips_link" data-ip="'+json[0].ip+'" data-pool="'+json[0].pool+'"></a></td>'+
		'</tr>';
		$("#new_ips_tbody").prepend(rez);
		$("#new_ips_tbody").parents(".scroll_block").jScrollPane();
		$("#new_ip, .ip_octet").val('');
		$("#new_ip_octet_1").focus();
		
		
	}else{
		$("#new_ip").parents('div.form_row').addClass('err');
		$("#new_ip").parent('div').next('p.err_text').html('Enter IP address');
	}
	return false;
}

function deleteNewIP(ip, pool){
	closeMyConfirm();
	//эмуляция удаления IP из списка
	//выполнить по success, timeout естественно убрать
	setTimeout(function(){
		$("#new_ips_tbody").find('a.delete_ips_link[data-ip="'+ip+'"]').parents('tr').remove();
		$("#new_ips_tbody").parents(".scroll_block").jScrollPane();
		myAlert('IP address was successfully deleted.', 'Delete IP', 'success');
	}, 1000);
}

function openUsersPool(obj){
	var pool_id = obj.attr("data-id");
	//TODO: get ip list for pool and add to list
	openModal("users_window");
	showModalWait('new_users_tbody');
	
	/*
	 * эмуляция запроса юзверей по выбранному пулу
	 * в ответ получаем объект в переменную json
	 */
	var json = [
		{"name":"aaa@gmail.com", "date":"16.03.2016 17:23"},
		{"name":"bbb@gmail.com", "date":"16.03.2016 17:23"},
		{"name":"ccc@gmail.com", "date":"16.03.2016 17:23"},
		{"name":"ddd@gmail.com", "date":"16.03.2016 17:23"},
		{"name":"eee@gmail.com", "date":"16.03.2016 17:23"},
		{"name":"fff@gmail.com", "date":"16.03.2016 17:23"},
		{"name":"ggg@gmail.com", "date":"16.03.2016 17:23"}
	];
	
	//выполнить по success ОТ
	var rez = '';
	for(var i=0;i<json.length;i++){
		rez += '<tr>'+
		'<td>'+json[i].name+'</td>'+
		'<td>'+json[i].date+'</td>'+
		'<td class="td_delete_link"><a href="javascript:void(0)" class="delete_link delete_users_link" data-name="'+json[i].name+'" data-pool="'+pool_id+'"></a></td>'+
		'</tr>';
	}
	//в реальности timeout убрать 
	setTimeout(function(){
		hideModalWait('new_users_tbody');
		$("#new_users_tbody").html(rez);
		var scroll_height = $(window).height()-(70+66+26+26+80);
		$("#new_users_tbody").parents(".scroll_block").height(scroll_height);
		$("#new_users_tbody").parents(".scroll_block").jScrollPane();
		var top = ($(window).height()-$("#users_window").height())/2;
		$("#users_window").css('top',top);
	}, 2000);
	//выполнить по success ДО
}

function addNewUser(){
	if($("#new_user").val()!=""){
		$("#new_user").parents('div.form_row').removeClass('err');
		if(isValidEmail($("#new_user").val())){
			$("#new_user").parents('div.form_row').removeClass('err');
			//эмуляция добавления юзверя в список пула
			var date = new Date();
			var d = date.getDate(); if(d<10){d='0'+d;}
			var m = date.getMonth()+1; if(m<10){m='0'+m;}
			var y = date.getFullYear();
			var h = date.getHours(); if(h<10){h='0'+h;}
			var mn = date.getMinutes(); if(mn<10){mn='0'+mn;}
			var now_date = d+'.'+m+'.'+y+' '+h+':'+mn;
			var json = [{"name":$("#new_user").val(),"date":now_date, "pool":"1"}];
			var rez = '<tr>'+
			'<td>'+json[0].name+'</td>'+
			'<td>'+json[0].date+'</td>'+
			'<td class="delete_link"><a href="javascript:void(0)" class="delete_link delete_users_link" data-name="'+json[0].name+'" data-pool="'+json[0].pool+'"></a></td>'+
			'</tr>';
			$("#new_users_tbody").prepend(rez);
			$("#new_users_tbody").parents(".scroll_block").jScrollPane();
			$("#new_user").val('');
			$("#new_user").focus();
		}else{
			$("#new_user").parents('div.form_row').addClass('err');
			$("#new_user").parent('div').next('p.err_text').html('Incorrect user name');
		}
	}else{
		$("#new_user").parents('div.form_row').addClass('err');
		$("#new_user").parent('div').next('p.err_text').html('Enter user name');
	}
	return false;
}

function deleteNewUser(name, pool){
	closeMyConfirm();
	//эмуляция удаления юзверя из списка
	//выполнить по success, timeout естественно убрать
	setTimeout(function(){
		$("#new_users_tbody").find('a.delete_users_link[data-name="'+name+'"]').parents('tr').remove();
		$("#new_users_tbody").parents(".scroll_block").jScrollPane();
		myAlert('Sender was successfully deleted.', 'Delete sender', 'success');
	}, 1000);
}

function prepareSearch(){
	$("#filter_form input[type='text'], #filter_form input[type='hidden']").each(function(){
		$("#search_form").prepend('<input type="hidden" name="'+$(this).attr("name")+'" value="'+$(this).attr("value")+'" />');
	});
	return true;
}