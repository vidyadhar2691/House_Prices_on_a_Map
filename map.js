//Name:Vidyadhar Angadiyavar
var zwsid = "Type your Zillow API key here";

var request = new XMLHttpRequest();
var map;
var geocoder;
var marker;
var zamount=0;
var zstreet;
var zcity;
var zstate;
var zzip;
var count=1;

//Map gettting ready on loading the page

function initialize () {
	var mapOptions = {
    	zoom:16 ,
    	center: new google.maps.LatLng(32.75, -97.13)
  	};
  	map = new google.maps.Map(document.getElementById('new_map'),
      	mapOptions);
	info= new google.maps.InfoWindow();

	google.maps.event.addListener(map, 'click', clickedAddress);
}

//extract the longitude and latitude from reverse geocoding 
function clickedAddress(event)
{
 
	getAddress(event.latLng);
}
//getting the address from longitude and latitude
function getAddress(point) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({latLng: point}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
		if (results[0]) {
		sendRequest1(results[0].formatted_address) ;
			
		}
	  }
	});
  }

//google.maps.event.addDomListener(window, 'load', init);


//function to map the address on the map
function map_result(abc){
	var address=abc;
	
	geocoder=new google.maps.Geocoder();
    	geocoder.geocode( { 'address': address}, function(results, status) {
      		if (status == google.maps.GeocoderStatus.OK) {
        		map.setCenter(results[0].geometry.location);
        		marker = new google.maps.Marker({
            		map: map,
            		position: results[0].geometry.location
        	});
		
		var infowindow = new google.maps.InfoWindow({
		content:'<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">'+zstreet+","+zcity+","+zstate+","+zzip+"<br>Zestimate:$"+zamount+'</div>'
		});
		infowindow.open(map,marker);
      		}else {
        		alert('Geocode was not successful for the following reason: ' + status);
      		}
    	});

}




function xml_to_string ( xml_node ) {
   if (xml_node.xml)
      return xml_node.xml;
   var xml_serializer = new XMLSerializer();
   return xml_serializer.serializeToString(xml_node);
}

//display the properties selected by the user

function displayResult () {
    if (request.readyState == 4) {
	var xml = request.responseXML.documentElement;
	if(xml.getElementsByTagName("message")[0].getElementsByTagName("code")[0].childNodes[0].nodeValue==0)
	{	
        //var xml = request.responseXML.documentElement;
        var lati = xml_to_string(xml.getElementsByTagName("result")[0].getElementsByTagName("address")[0].getElementsByTagName("latitude")[0]);
	var longi= xml_to_string(xml.getElementsByTagName("result")[0].getElementsByTagName("address")[0].getElementsByTagName("longitude")[0]);
	var check= xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0];
	if(check && check.childNodes.length){
	zamount=xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].childNodes[0].nodeValue;
	}
	else{
	zamount=0;
	alert("The response from zillow.com returned a null value for amount, for this property. Fault of zillow.com"); //This is because some adddresses in zillow.com returns a null value for zestimate
	}
	
	
	
	zstreet=xml.getElementsByTagName("result")[0].getElementsByTagName("address")[0].getElementsByTagName("street")[0].childNodes[0].nodeValue;
	zcity=xml.getElementsByTagName("result")[0].getElementsByTagName("address")[0].getElementsByTagName("city")[0].childNodes[0].nodeValue;
	zstate=xml.getElementsByTagName("result")[0].getElementsByTagName("address")[0].getElementsByTagName("state")[0].childNodes[0].nodeValue;
	zzip=xml.getElementsByTagName("result")[0].getElementsByTagName("address")[0].getElementsByTagName("zipcode")[0].childNodes[0].nodeValue;
	
	map_result(zstreet+","+zcity+","+zstate+" "+zzip);
	
	document.getElementById("output").appendChild(document.createTextNode(count+"\)."));
	document.getElementById("output").appendChild(document.createElement('BR'));
	document.getElementById("output").appendChild(document.createTextNode(zstreet+","+zcity+","+zstate+" "+zzip));
	document.getElementById("output").appendChild(document.createElement('BR'));
	document.getElementById("output").appendChild(document.createTextNode("This can be your new home  at $ "+zamount+" only"));
	document.getElementById("output").appendChild(document.createElement('BR'));
	document.getElementById("output").appendChild(document.createElement('BR'));

	count++;
	}
	else{
	alert("This property is not for Sale");
	}
    }
}

//Sending request to zillow.com

function sendRequest () {
    request.onreadystatechange = displayResult;
    var addtext = document.getElementById("address").value.split(",");
    var street=encodeURI(addtext[0]);
	
	if(isNaN(addtext[1].trim())){

    	var city=addtext[1].trim();
	var state=addtext[2].trim();
	request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street+"&citystatezip="+city+"+"+state);
	
	}
	else{
	var city="";
	var state="";
	var zipcode=addtext[1].trim();
        request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street+"&citystatezip="+city+"+"+state+"+"+zipcode);
	}

    request.withCredentials = "true";
    request.send(null);
}


//--------------------------------------------------
//sending request to zillow.com
function sendRequest1 (address) {

	 request.onreadystatechange = displayResult;
    var addtext = address.split(",");
	
    var street=encodeURI(addtext[0]);

	
	if(isNaN(addtext[1].trim())){

    	var city=addtext[1].trim();
	var state=addtext[2].trim();
	
	request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street+"&citystatezip="+city+"+"+state);
	
	}
	else{
	var city="";
	var state="";
	var zipcode=addtext[1].trim();
        request.open("GET","proxy.php?zws-id="+zwsid+"&address="+street+"&citystatezip="+city+"+"+state+"+"+zipcode);
	}

    request.withCredentials = "true";
    request.send(null);
}


//function to clear form 
function clear_form(){
count=1;
initialize ();
document.getElementById("output").innerHTML=null;
document.getElementById("address").value=null;
}

