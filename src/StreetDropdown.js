import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PointsMap from './PointsMap';
import $ from 'jquery'; 

const endpoint = "//mapc-admin.carto.com/api/v2/sql?q=";

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
      points: [],
      fetching: true
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
    const encodedStreet = street;
    console.log(encodedStreet);
    this.setState({ fetching: true });
    return $.getJSON(`${endpoint}SELECT DISTINCT(st_name_2) AS text, st_name_2 AS value FROM%20%22mapc-admin%22.survey_intersection%20WHERE st_name_1='${encodedStreet}' AND town_id=1`)
      .then((data) => {
        this.setState({ intersectingStreets: data.rows, fetching: false });
        this.IntersectingPoints(street);
      });
  }

  IntersectingPoints(street) {
    const encodedStreet =street;

    return $.getJSON(`${endpoint}SELECT DISTINCT(st_name_2) AS text, lat, long FROM%20%22mapc-admin%22.survey_intersection%20WHERE st_name_1='${encodedStreet}' AND town_id=1`)
      .then((data) => {
        this.setState({ points: data.rows, fetching: false });
      });
  }

  OnDropdownChange(event, data) {
    this.setState({ selected: data.value, fetching: true });
    this.IntersectingStreets(data.value);
  }

  render() {
    const initialStreets = this.state.initialStreets;
    const intersectingStreets = this.state.intersectingStreets;
    const intersectingPoints = this.state.points.map((point,index) =>
      <li key={index}>
        {point.lat}, {point.long}
      </li>
    );
    const onChange = this.OnDropdownChange;
    const fetching = this.state.fetching;

    return (
      <div className="ui equal width grid">
        <div className="row">
          <PointsMap points={this.state.points} onDropdownChange={this.OnDropdownChange} />
        </div>
        <div className="row">
          <div className="column">
            <Dropdown placeholder='Search for Street' fluid search selection options={ initialStreets } onChange={onChange} />
          </div>
          <div className="column">
            { fetching ? null : <Dropdown placeholder='Search for Intersecting Street' fluid search selection options={ intersectingStreets } /> }
          </div>
        </div>
      </div>
    )
  }
}

export default StreetDropdown