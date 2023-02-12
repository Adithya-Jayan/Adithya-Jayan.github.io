function LoadGallery(){
 
    var gallery = document.getElementById("gallery");

    var photoContainer = document.createElement("a");
    photoContainer.href = "https://adithya-jayan.github.io/";

    var photo = document.createElement("img");
    photo.style = "display:none";


    var photo = document.createElement("img");
    photo.className = "photo";

    function addToGallery (photoData) {
      for (var i = 0; i < photoData.length; i++) {
        var photoinfo = photoData[i].split(",");
        var newPhotoContainer = photoContainer.cloneNode(true);
        var newPhoto = photo.cloneNode(true);
      
        newPhoto.alt = photoinfo[0];
        newPhoto.src = photoinfo[1];
        newPhoto.setAttribute("data-image",photoinfo[2]);
        newPhoto.setAttribute("data-description",photoinfo[3]);
        newPhoto.style="display:none";
      
        if (photoinfo.length > 4){
          newPhoto.setAttribute("data-type","youtube");
          newPhoto.setAttribute("data-videoid",photoinfo[4]);
        }
      
        newPhotoContainer.appendChild(newPhoto);
        gallery.appendChild(newPhotoContainer);

      }
    }


    // Read CSV file and extract photo URLs
    var csv = "artwork.csv"; // Read the CSV file

    let photoData = fetch('artwork.csv')
      .then(response => response.text())
      .then(text => text.split("\r\n"))
      .then(rows => {addToGallery(rows);})
      .catch(error => {
        console.log(error);
        reject("Oops");
      });

      setTimeout(function() {
        // Call the unitegallery function after the new HTML content has been added
            jQuery("#gallery").unitegallery({
              tiles_max_columns: 10
          });
        
          jQuery("#gallery_test").unitegallery({
              tiles_max_columns: 10
          });
        },100);

};


$(document).ready(function() {
  LoadGallery();
});
