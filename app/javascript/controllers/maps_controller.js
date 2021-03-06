import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["field", "map", "latitude", "longitude"]

  connect() {
    if (typeof (google) != "undefined") {
      this.initMap()
    }
  }

  initMap() {
     this.map = new google.maps.Map(this.mapTarget, {
      center: new google.maps.LatLng(this.data.get("latitude") || 39.5, this.data.get("longitude") || -98.35),
      zoom: 8
     })
     
    this.autocomplete_handle()
  }

    autocomplete_handle() {
    const autocomplete = new google.maps.places.Autocomplete(this.fieldTarget)

    autocomplete.bindTo('bounds', this.map)
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name'])

    const marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29),
      animation: google.maps.Animation.DROP
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      marker.setVisible(false)

      if (!place.geometry) {
        window.alert(`No details available for input: ${place.name}`)
        return
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport)
      
      } else {
        this.map.setCenter(place.geometry.location)
        this.map.setZoom(8)
      }

      marker.setPosition(place.geometry.location)
      marker.setVisible(true)

      this.latitudeTarget.value = place.geometry.location.lat()
      this.longitudeTarget.value = place.geometry.location.lng()
    })
  }

}