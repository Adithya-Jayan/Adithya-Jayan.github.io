async function LoadGallery(){
 
          // Your code to generate the new HTML content
          var newContent = "";

          // var gallery = document.getElementById("gallery");

          var photoContainer = document.createElement("a");
          var photo = document.createElement("img");

          photoContainer.id = "DynamicGallery";
          photoContainer.className = "photolink";
          photo.className = "photo";

          function addToGallery (photoData) {
            let content = "";
            let headers = photoData[0].split(",");
            for (var i = 1; i < photoData.length; i++) {
              var photoinfo = photoData[i].split(",");
              var newPhotoContainer = photoContainer.cloneNode(true);
              var newPhoto = photo.cloneNode(true);
            
              //Set source of inner image and alt value first
              newPhoto.setAttribute(headers[0], photoinfo[0]); //Append attribute
              newPhoto.setAttribute(headers[1], photoinfo[1]); //Append attribute

              //Then set main image data
              for(var j = 2; j < headers.length; j++) {
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

async function Runinsequence(){
  await LoadGallery();
}

function waitForElement(elementPath, callBack){
  window.setTimeout(function(){
    if($(elementPath).length){
      callBack(elementPath, $(elementPath));
    }else{
      waitForElement(elementPath, callBack);
    }
  },500)
}

$(document).ready(function() {
  
  console.log("Starting Load Gallery");
  Runinsequence();

  waitForElement("#DynamicGallery",function(){
    //Initialize isotope gallery
    console.log("Starting Isotope");
    $('.grid').isotope({
      // options
      itemSelector: '.photo',
      percentPosition: true,
      layoutMode: 'masonry'
    });
    console.log("Isotope initialized");

    console.log("Starting magnific");
    $('.portfolio .grid .photolink').magnificPopup({
      type: 'image',
      // other options
      gallery:{enabled:true}
    });
    console.log("Loaded magnific");
});
  
});
