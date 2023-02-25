async function LoadGallery(){
 
          // Your code to generate the new HTML content
          var newContent = "";

          // var gallery = document.getElementById("gallery");

          var photoContainer = document.createElement("a");
          var photo = document.createElement("img");

          photoContainer.className = "photolink";
          photo.className = "photo";

          function addToGallery (photoData) {
            let content = "";
            let headers = photoData[0].split(",");
            for (var i = 1; i < photoData.length; i++) {
              var photoinfo = photoData[i].replace('\r','').split(",");
              var newPhotoContainer = photoContainer.cloneNode(true);
              var newPhoto = photo.cloneNode(true);
            
              //Set source of inner image and alt value first
              newPhoto.setAttribute(headers[0], photoinfo[0]); //Append attribute
              newPhoto.setAttribute(headers[1], photoinfo[1]); //Append attribute
              
              //Append tags to the photo class name
              let final_attr = photoinfo[headers.length - 1];
              if( newPhoto.getAttribute(headers[headers.length - 1]) != null) {
                final_attr =  newPhoto.getAttribute(headers[headers.length - 1])+" "+photoinfo[headers.length - 1];
              }
              newPhoto.setAttribute(headers[headers.length - 1],final_attr); 

              //Then set main image data
              for(var j = 2; j < headers.length - 1; j++) {
                if(photoinfo[j] != ""){
                  let final_attr = photoinfo[j];
                  if( newPhotoContainer.getAttribute(headers[j]) != null) {
                    final_attr =  newPhotoContainer.getAttribute(headers[j])+" "+photoinfo[j];
                  }
                  newPhotoContainer.setAttribute(headers[j],final_attr); //Append attribute
                }
              }
          
              newPhotoContainer.appendChild(newPhoto);
              content += newPhotoContainer.outerHTML;

            }
            return content;
          }


          // Read CSV file and extract photo URLs
          var csv = "/Art_Gallery/artwork.csv"; // Read the CSV file

          try {
            let response = await fetch(csv);
            let text = await response.text();
            let rows = text.replace('\r','').split("\n");
            newContent += addToGallery(rows);

            //Add to gallery
            var gallery = document.getElementById("gallery");
            gallery.innerHTML = newContent;

        } catch (error) {
          console.log(error)
        }
        console.log("Load Gallery complete");
    
};

function waitForElement(elementPath, callBack){
  window.setTimeout(function(){
    if($(elementPath).length){
      callBack(elementPath, $(elementPath));
    }else{
      waitForElement(elementPath, callBack);
    }
  },500)
}
async function Runinsequence(){
  await LoadGallery();

  waitForElement("#gallery",function(){
    //Initialize isotope gallery
    console.log("Starting Isotope");
    $('.grid').isotope({
      // options
      itemSelector: '.photo',
      percentPosition: true,
      layoutMode: 'masonry'
    });

    // bind filter button click
    $('.filters-button-group').on( 'click', 'button', function() {
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      $('.grid').isotope({ filter: filterValue });
    });

    // change is-checked class on buttons
    $('.button-gal-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'button', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $( this ).addClass('is-checked');
      });
    });
    console.log("Isotope initialized");

    console.log("Starting magnific");
    $('.portfolio .grid .photolink').magnificPopup({
      type: 'image',
      // other options
      gallery:{enabled:true},
      image: {
        // options for image content type
        titleSrc: function(item) {
            return item.el.attr('data-description') + '<small>' + item.el.attr('subtitle') + '</small>';
          }
      }
    });
    console.log("Loaded magnific");
  });

}

$(document).ready(function() {
  
  console.log("Starting Load Gallery");
  Runinsequence();
  
});
