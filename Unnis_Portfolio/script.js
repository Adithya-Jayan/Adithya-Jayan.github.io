////selecting all required elements
//const gallery = document.querySelectorAll(".art .carousel .card .img"),
//previewBox = document.querySelector(".preview-box");
//
//window.onload = ()=>{ //once window loaded
//	for (let i = 0; i < gallery.length; i++) {
//		/*gallery[i].onclick = ()=>{
//			console.log(i);
//			previewBox.classList.add("show");
//		}*/
//		console.log(i);
//	}
//}



$(document).ready(function(){
	$(window).scroll(function(){
		if(this.scrollY > 20){
			$('.navbar').addClass("sticky");
		}else{
			$('.navbar').removeClass("sticky");
		}
		if(this.scrollY > 500){
			$('.scroll-up-btn').addClass("show");
		}else{
			$('.scroll-up-btn').removeClass("show");
		}
	});
	
	// slide-up script
	$('.scroll-up-btn').click(function(){
		$('html').animate({scrollTop: 0});
	});
	
	//toggle menu/navbar script
	$(".menu-btn").click(function(){
		$('.navbar .menu').toggleClass("active");
		$('.menu-btn i').toggleClass("active");
	});
	
	//typing animation script
	var typed = new Typed(".typing", {
		strings: ["Artist", "Game Developer", "Programmer", "3D Modeller"],
		typeSpeed: 100,
		backSpeed: 60,
		loop: true
	});
	
	var typed = new Typed(".typing-2", {
		strings: ["Artist", "Game Developer", "Programmer", "3D Modeller"],
		typeSpeed: 100,
		backSpeed: 60,
		loop: true
	});
	
	//owl carousel script
	$('.carousel').owlCarousel({
		margin: 20,
		loop: false,
		autoplayTimeOut: 2000,
		autoplayHoverPause: true,
		responsive: {
			0:{
				items: 1,
				nav: false				
			},
			600:{
				items: 2,
				nav: false				
			},
			1000:{
				items: 3,
				nav: false				
			}
		}
	});
});