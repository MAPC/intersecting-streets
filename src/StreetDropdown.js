import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import $ from 'jquery'; 
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const endpoint = "//mapc-admin.carto.com/api/v2/sql?q=";

const PointsMap = ({ position, zoom, points, center }) => {
  return (
      <Map center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {
          points.map((point, index) => 
          <Marker position={[point.lat, point.lng]} key={index}>
          </Marker>
        )}
      </Map>)
} 

class StreetDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      initialStreets: [{
        name: '',
        value: 1
      }],
      intersectingStreets: [{
        name: '',
        value: 1
      }],
      selected: '',
      points: [{ lat: 42, lng: -71 }, { lat: 42, lng: -72 }],
      bounds: [[42, -71], [42, -72]],
      fetching: true,
      lat: 42,
      lng: -71,
      zoom: 17
    };
    this.query = '';

    this.OnDropdownChange = this.OnDropdownChange.bind(this);
    this.IntersectingPoints = this.IntersectingPoints.bind(this);
  }

  componentDidMount() {
    this.InitialStreets();
  }

  InitialStreets() {
    return $.getJSON(`${endpoint}SELECT DISTINCT(st_name_1) AS text%20, st_name_1 AS value FROM%20%22mapc-admin%22.survey_intersection%20WHERE town_id=1`)
      .then((data) => {
        this.setState({ initialStreets: data.rows });
      });
  }

  IntersectingStreets(street) {
    let encodedStreet = street;
    this.setState({ fetching: true });
    return $.getJSON(`${endpoint}SELECT DISTINCT(st_name_2) AS text, st_name_2 AS value FROM%20%22mapc-admin%22.survey_intersection%20WHERE st_name_1='${encodedStreet}' AND town_id=1`)
      .then((data) => {
        this.setState({ intersectingStreets: data.rows, fetching: false });
        this.IntersectingPoints(street);
      });
  }

  IntersectingPoints(street) {
    let encodedStreet = street;
    this.setState({ fetching: true });
    return $.getJSON(`${endpoint}SELECT DISTINCT(st_name_2) AS text, lat, long AS lng FROM%20%22mapc-admin%22.survey_intersection%20WHERE st_name_1='${encodedStreet}' AND town_id=1`)
      .then((data) => {
        let latlngs = data.rows.map((row) => { return [row.lat,row.lng]; });
        let center = new L.LatLngBounds(latlngs).getCenter();

        if (latlngs.length == 1) {
          this.setState({selected: data.rows[0].text });
        }

        this.setState({ points: data.rows, 
                        fetching: false, 
                        lat: center.lat, 
                        lng: center.lng });
      });
  }

  OnDropdownChange(event, data) {
    this.setState({ fetching: true });
    this.IntersectingStreets(data.value);
  }

  render() {
    const initialStreets = this.state.initialStreets;
    const intersectingStreets = this.state.intersectingStreets;
    const intersectingPoints = this.state.points.map((point,index) =>
      <li key={index}>
        {point.lat}, {point.lng}
      </li>
    );
    const onChange = this.OnDropdownChange;
    const fetching = this.state.fetching;
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="ui equal width grid">
        <div className="row">
          <PointsMap zoom={this.state.zoom} points={this.state.points} center={[this.state.lat,this.state.lng]} />
        </div>
        <div className="row">
          <div className="column">
            <Dropdown placeholder='Search for Street' fluid search selection options={ initialStreets } onChange={onChange} />
          </div>
          <div className="column">
            { fetching ? null : <Dropdown placeholder='Search for Intersecting Street' fluid search selection options={ intersectingStreets } /> }
          </div>
        </div>
        <div className="row">
          <div className="column">
            { this.state.selected }
          </div>
        </div>
      </div>
    )
  }
}

export default StreetDropdown
