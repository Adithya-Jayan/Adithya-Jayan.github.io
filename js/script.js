async function LoadGallery(){
 

      // Check if the new content exists in local storage
      var newContent = localStorage.getItem("newContent");

      if (newContent) {
          // If the new content exists in local storage, add it to the page
          var gallery = document.getElementById("gallery");
          gallery.innerHTML = newContent;

          setTimeout(function() {
            // Call the unitegallery function after the new HTML content has been added
                jQuery("#gallery").unitegallery({
                  tiles_max_columns: 10
              });
            },100);

      } else {
          // If the new content does not exist in local storage, generate it and store it in local storage

          // Your code to generate the new HTML content
          var newContent = "";

          // var gallery = document.getElementById("gallery");

          var photoContainer = document.createElement("a");
          photoContainer.href = "https://adithya-jayan.github.io/";

          var photo = document.createElement("img");
          photo.style = "display:none";

          photo.className = "photo";

          function addToGallery (photoData) {
            let content = "";
            let headers = photoData[0].split(",");
            for (var i = 1; i < photoData.length; i++) {
              var photoinfo = photoData[i].split(",");
              var newPhotoContainer = photoContainer.cloneNode(true);
              var newPhoto = photo.cloneNode(true);
            
              for(var j = 0; j < headers.length; j++) {
                if(photoinfo[j] != ""){
                  newPhoto.setAttribute(headers[j],photoinfo[j]);
                }
              }

              newPhoto.style="display:none";
          
              newPhotoContainer.appendChild(newPhoto);
              content += newPhotoContainer.outerHTML;

            }
            return content;
          }


          // Read CSV file and extract photo URLs
          var csv = "../Art_Gallery/artwork.csv"; // Read the CSV file

          try {
            let response = await fetch(csv);
            let text = await response.text();
            let rows = text.split("\r\n");
            newContent += addToGallery(rows);


            // Store the new content in local storage
            localStorage.setItem("newContent", newContent);

            //Add to gallery
            var gallery = document.getElementById("gallery");
            gallery.innerHTML = newContent;

            setTimeout(function() {
              // Call the unitegallery function after the new HTML content has been added
                  jQuery("#gallery").unitegallery({
                    tiles_max_columns: 10
                });
              },100);
        } catch (error) {
          console.log(error)
        }
      }
};


$(document).ready(function() {
  LoadGallery();
});
