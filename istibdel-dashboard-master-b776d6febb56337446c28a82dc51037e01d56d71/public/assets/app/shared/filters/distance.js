angular.module('b4bhcom.shared')
    .filter('distance', function() {
	return function(point,position) {
	
                
                var latLngA = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                var latLngB = new google.maps.LatLng(point.latitude, point.longitude);
               
                var distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
               distance= distance/1000;
                return Math.round(distance*100)/100;
               
           
    
	}
});