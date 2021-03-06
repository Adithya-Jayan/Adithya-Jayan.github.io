//selecting required elements
const gallery = document.querySelectorAll(".owl-carousel .image"),
previewBox = document.querySelector(".preview-box");

//preview image script 
window.onload = ()=>{ //once window loaded
	for(let i = 0; i < gallery.length; i++){
		gallery[i].onclick = ()=>{
			console.log(i);
			previewBox.classList.add("show");
		}
	}	
}

//sticky navbar script
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
		 $('html').css("scrollBehavior", "auto");
	});
	
	$('.navbar .menu li a').click(function(){
		// applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
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
		autoplay: false,
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
	// read more function
	$('.readmore-btn').click(function(){
		if($('.skills .skills-content .left p').hasClass('show'))
		{
			$('.skills .skills-content .left p').removeClass("show");
			$('.skills .skills-content .left p').this.innerHTML = "close";
		}else{
			$('.skills .skills-content .left p').addClass("show");
			$('.skills .skills-content .left p').this.innerHTML = "read more";
		}
	});
});