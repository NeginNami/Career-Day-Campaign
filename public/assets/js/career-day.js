$(document).ready(function(){

    $(document).on("submit","#choose-store-form",function(event){
        event.preventDefault();
        var storeID=$("#storeID").val();
        var name=$("#name").text();
        var lastName=$("#lastName").text();
        var found = false;

        console.log(name);
        console.log(lastName);
        console.log(storeID);

        console.log(storeID.length);

        if(storeID.length!==3 || isNaN(storeID))
            alert("The store number you entered is not valid, please try again.");
        else{
            $.get("/all-stores", function(data) {
                console.log(data);
                for(i=0;i<data.length;i++){
                    if(data[i].id==storeID)
                        found=true;
                }
                if(found){
                    console.log(name);
                    console.log(lastName);
                    $.ajax({
                        method: "PUT",
                        url: "/stores/update/" + storeID,
                        data:{firstname:name,lastname:lastName}
                      })
                      .done(function(data) {
                        console.log(data);
                        console.log("done");
                      });
                } else{
                    alert("Your desired store ID can not be found.")
                }
              });
        }

    });

});