$(document).ready(function(){

    $(document).on("submit","#choose-store-form",function(event){
        event.preventDefault();
        var storeID=$("#storeID").val();
        var name=$("#name").text();
        var lastName=$("#lastName").text();
        var found = false;
        var deleteDesire=false;

      /*  console.log(name);
        console.log(lastName);
        console.log(storeID);

        console.log(storeID.length); */
        if(storeID.length==0) deleteDesire=true;
        console.log(storeID);

        if((storeID.length!==3 && !deleteDesire) || isNaN(storeID))
            alert("The store number you entered is not valid, please try again.");
                else if (!deleteDesire) {
                    
                    $.get("/all-stores", function(data) {
                        //console.log(data);
                        for(i=0;i<data.length;i++){
                            if(data[i].id==storeID)
                                found=true;
                        }
                        if(found){
                            console.log(name);
                            console.log(lastName);
                            console.log(storeID);
                            $.ajax({
                                method: "PUT",
                                url: "/stores/update/" + storeID,
                                data:{firstname:name,lastname:lastName}
                            })
                            .done(function(data) {
                                console.log(data);
                                alert("Thanks! Store # "+storeID+" has been selected as your host.");
                            });
                        } else{
                            alert("Your desired store ID can not be found.")
                        }
                    });
                }
                        else{
                            console.log("you want to delete");
                            $.ajax({
                                method: "PUT",
                                url: "/supervisors/remove-selected-store/",
                                data:{firstname:name,lastname:lastName}
                            })
                            .done(function(data) {
                                console.log(data);
                                alert("Thanks! You have successfully removed the store you selected before");
                            });
                        }

    });

});