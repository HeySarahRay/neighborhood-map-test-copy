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
    open: false
  };
  /**
   *
   * @return {void}@memberof App
   */
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
  locales = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "PRMOQPNHJGMAVOBG0MKXHK5LZEEGZ5S4CJ4Y4V5LA1FK0TH1",
      client_secret: "EXFLWZMM2IMF01R4UCWAADT5S4PC1URWLEMQJVF5C0JTV0RB",
      query: "park",
      near: "Grand Rapids",
      v: "20180323"
    };

    axios.get(endPoint + new URLSearchParams(parameters)).then(response => {
      this.setState(
        {
          venues: response.data.response.groups[0].items
        },
        this.renderMap()
      );
    });
  };

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  };

  /**
   *
   * @memberof App
   */
  initMap = () => {
    const mapEl = document.getElementById("map");
    mapEl.style.height = "100vh";

    let map = new window.google.maps.Map(mapEl, {
      center: new window.google.maps.LatLng(42.972434, -85.676548),
      zoom: 12
    });

    let infowindow = new window.google.maps.InfoWindow();

    const markers = this.state.venues.map(myVenue => {
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
        title: myVenue.venue.name
      });

      marker.addListener("click", toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
      }

      marker.addListener("click", function () {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      });
      return markers;
    });
  };
  updateQuery = (query) => {
    console.log(query)
  }
  /**
   *
   * @return
   * @memberof App
   */
  render() {
    return (
      <div className="App" role="application" aria-label="Map Application">
        <button className="hamburger" onClick={() => this.toggleDrawer()}>
          <i className="fas fa-bars" />
        </button>
        <CssBaseline />
        <div className="header">
          <Sidebar
            {...this.state}
            onMarkerClick={this.onMarkerClick}
            filtered={this.state.filtered}
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
function loadScript(url) {
  let index = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
