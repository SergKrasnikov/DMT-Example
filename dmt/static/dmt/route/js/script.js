$(document).ready(function() {
// --------route menu hamburger for adaptive -----
	$('.route_humburger').click(function(){
		$('.route_humburger_menu').slideToggle('slow');
	});
	$('body').click(function(ev){
		if($('.route_humburger_menu').css('display')=='block'){
			if(!$(ev.target).is('.route_humburger_menu, .route_humburger_menu *, .route_humburger')){
				$('.route_humburger_menu').slideToggle('slow');
			}
		}  
	});

//------------- route ip show/hide--------------
	$('.route_list_ips').click(function(){
		if($(this).children().html() == 'show'){
			$(this).siblings('.ip_num_block').show();
			$(this).children().html('hide');
		}
		else 	if($(this).children().html() == 'hide'){
			$(this).siblings('.ip_num_block').hide();
			$(this).children().html('show');
		}
		return false;
	});

// ------------ высота экрана для футера-----------
	win_h = $(window).height() - 170;
	$('.wrapper').css('min-height', win_h + 'px');
	$( window ).resize(function() {
		win_h = $(window).height() - 170;
		$('.wrapper').css('min-height', win_h + 'px');
	});

});