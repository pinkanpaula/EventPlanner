var myDataRef = new Firebase('https://glowing-torch-6752.firebaseio.com/');
      var eventDesc=document.querySelector('#eventDesc');
      var email=document.querySelector('#email');
      var create=document.querySelector('#create');
      var eventLoc=document.querySelector('#eventLoc');
      var eventN=document.querySelector('#notes');
      //var closePopup=document.querySelector('#popupclose');
      var newEventDate;
      var newEventDate4Val;
      var newEventTime;
      
      var emailRegex=/([^@]+)@([^\.]+)\.([^\.]+)/g;
      var numRegex=/([0-9])/g;
     
      
      function storeData(){
        var eventName=document.querySelector('#event_name');        
        myDataRef.push({eventLocation:eventLoc.value,eventDescription:eventDesc.value,eventTitle:eventName.value,eventTime:newEventDate+" at "+newEventTime,eventNote:eventN.value});       
      }
      
     function displayData(eLocation,eDescription,eTitle,eDate,eTime,eNote){
        
        document.querySelector('#teventDesc').style.color="#87cefa";
        document.querySelector('#teventLoc').style.color="#87cefa";
        document.querySelector('#teventTime').style.color="#87cefa";
	document.querySelector('#dnote').style.color="#87cefa";
        
        document.querySelector('#tEventTitle').innerText=eTitle;
        document.querySelector('#teventDesc').innerText=eDescription;
        document.querySelector('#teventLoc').innerText=eLocation;
        document.querySelector('#teventTime').innerText=eTime;
        document.querySelector('#teventDesc').innerText=eventDesc.value;
        document.querySelector('#teventLoc').innerText=eventLoc.value;
	if(eNote.value!==null){
	  document.querySelector('#Note').style.display="inline-block";
	  document.querySelector('#dnote').style.display="inline-block";
	  document.querySelector('#dnote').innerHTML=eNote;
	}
     }
        
        
      function displayErr(){
        //document.querySelector('#err').innerHTML=email.validationMessage+"</p>"+eventDesc.validationMessage;
        document.querySelector('#err1').innerHTML=eventDesc.validationMessage
        document.querySelector('#err2').innerHTML=email.validationMessage;
        document.querySelector('#err3').innerHTML=eventDate.validationMessage;
      }
            
      function displaySuccess(){
        document.querySelector('#popup').innerHTML="<div class='toolbar'><a class='close' onclick='closePopup()'>close</a></div><p><div align='center'>Your event is saved, please check the details above</div>";	
        document.querySelector('#popup').style.display="inline-block";
      }
      
      function closePopup(){
	document.querySelector('#popup').style.display='none';   
      }
    
      //Submit event
      create.onclick=function(){	
        formatDate();
        storeData();
        
        myDataRef.startAt().limit(1).once('child_added', function(snapshot) {
            var message = snapshot.val();
            displayData(message.eventLocation, message.eventDescription, message.eventTitle, message.eventDate, message.eventTime, message.eventNote);
	});
	
        displaySuccess();       
        return false;
      };
      
      function formatDate(){
        var eventTime=document.querySelector("#startTime").value;
        var eventDate=document.querySelector('#eventDate').value.split("-");
        var fdate=eventDate[0]+"-"+eventDate[1]+"-"+eventDate[2];
        var fmtDate=new Date(eventDate[0],eventDate[2],eventDate[1]);
        newEventDate=new moment(fdate).format("MMMM Do YYYY");
        newEventTime=new moment(fdate+" "+eventTime).format('LT');
	newEventDate4Val=new moment(fdate).format("YYYY-MM-DD");
      }
 
      function validate1(){
        if(emailRegex.test(email.value)){
           email.setCustomValidity("");
        }
        else{         
          email.setCustomValidity("incorrect email format");
        }
        displayErr();
      }
      
       function validate2(){
        if(numRegex.test(eventDesc.value)){
          eventDesc.setCustomValidity("event description should not be a number");          
        }
        else{         
          eventDesc.setCustomValidity("");
        }
        displayErr();
      }
      
      function validate3(){
	formatDate();
	var now = moment().format("YYYY-MM-DD");
	if(newEventDate4Val < now){
	  eventDate.setCustomValidity("event date should not be a backdate"); 
	}
	else{
	  eventDate.setCustomValidity(""); 
	}
	displayErr();
      }
      
function initMap() {
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        // Create the search box and link it to the UI element.
        var searchBox=new google.maps.places.SearchBox(eventLoc);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(eventLoc);       
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());        
        });
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
    searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
      map.fitBounds(bounds);
    });
    }