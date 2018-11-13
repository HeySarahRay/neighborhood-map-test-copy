/* List of imports */
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import React, { Component } from "react";
import "../css/App.css";
import Sidebar from "./Sidebar";
/**
 *
 * @class App
 * @extends Component
 */
class App extends Component {
  state = {
    venues: [],
    open: false,
      filteredVenues: [],
    markers: []
  };
  /**
   *
   * @return {void}@memberof App
   */
  /* Ensuring that the project will display */
  componentDidMount() {
    window.gm_authFailure = () => {
      alert(
        "Oops! Google Map is not available right now. Please try again later."
      );
    };
    this.locales();
  }
  /**
   *
   * @memberof App
   */
  /* Loading Google map */
  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC6ZwjgQJzRbSx0ekvOuEaHl0vazf32kkM&callback=initMap"
    );
    window.initMap = this.initMap;
  };
  /**
   *
   * @memberof App
   */
  /* Foursquare API to assist with locations */
  locales = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "PRMOQPNHJGMAVOBG0MKXHK5LZEEGZ5S4CJ4Y4V5LA1FK0TH1",
      client_secret: "EXFLWZMM2IMF01R4UCWAADT5S4PC1URWLEMQJVF5C0JTV0RB",
      query: "park",
      near: "Grand Rapids",
      v: "20180323"
    };
/* HTTP client API */
    axios.get(endPoint + new URLSearchParams(parameters)).then(response => {
      this.setState(
        {
          venues:
          response.data.response.groups[0].items,
          filteredVenues:
          response.data.response.groups[0].items
        },
        this.renderMap()
      );
    });
  };
/* Sidebar function */
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  };

  /**
   *
   * @memberof App
   */
  /* Causes map to display specific information about the location of my map, as well as information about the locations within */
  initMap = () => {
    const mapGR = document.getElementById("map");
    mapGR.style.height = "100vh";

    let map = new window.google.maps.Map(mapGR, {
      center: new window.google.maps.LatLng(42.972434, -85.676548),
      zoom: 12
    });

    let infowindow = new window.google.maps.InfoWindow();
    let markers=[]
    this.state.venues.map(myVenue => {
      let contentString = `${myVenue.venue.name +
        ", " +
        myVenue.venue.location.city +
        ", " +
        myVenue.venue.location.address}`;

      let marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        animation: window.google.maps.Animation.DROP,
        map: map,
          title: myVenue.venue.name,
          id: myVenue.venue.id
      });

      marker.addListener("click", toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 750);
        }
      }

      marker.addListener("click", function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        });
        markers.push(marker);
      });
      this.setState({
          markers
      })
  };
  /* Help with finding the markers through the sidebar from Fatemeh */
    clickListItem = id => {
        let selectedMarker = this.state.markers.find(marker => marker.id === id);
        selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => selectedMarker.setAnimation(null), 750);
        /* TODO: Insert code to make InfoWindow display when venueList item is clicked */
    }
  /**
   *
   * @memberof App
   */
  updateQuery = (query) => {
    console.log(query)
    console.log(this.state.venues)
    let matchedVenues = []
    if (!query){
      this.setState({
        filteredVenues: this.state.venues
      })
    }
    this.state.venues.forEach(venue => {
      if(venue.venue.name.toLowerCase().includes(query.toLowerCase())){
        matchedVenues.push(venue)
      }
    })
    console.log(matchedVenues)
    this.setState({
      filteredVenues: matchedVenues
    })
  }
  /**
   *
   * @return
   * @memberof App
   */
/* Render state of the app */
/*Assistance on Sidebar provided by Daphne*/
    render() {
        console.log(this.state.markers)
    return (
      <div className="App" role="application" aria-label="Map Application">
        <button className="hamburger" onClick={() => this.toggleDrawer()}>
          <i className="fas fa-bars" />
        </button>
        <CssBaseline />
        <div className="header">
          <Sidebar
            {...this.state}
            venues={this.state.venues}
            onMarkerClick={this.onMarkerClick}
            filtered={this.state.filteredVenues}
            open={this.state.open}
            toggleDrawer={this.toggleDrawer}
            filterVenues={this.updateQuery}
            clickListItem={this.clickListItem}
          />
        </div>
        <div id="map" />
      </div>
    );
  }
}
/**
 *
 * @param  {any} url
 * @return {void}
 */
/* Loads map function */
function loadScript(url) {
  let index = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
