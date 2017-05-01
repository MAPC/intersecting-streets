import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const MyMarkersList = ({ markers }) => {
  const items = markers.map((point, index) => 
    <Marker position={[point.lat, point.lng]} key={index}>
    </Marker>
  )
  return <div>{items}</div>
};


class PointsMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 42,
      lng: -71,
      zoom: 13,
      points: props.points
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const points = this.state.points;
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {
          this.state.points.map((point, index) => 
          <Marker position={[point.lat, point.lng]} key={index}>
          </Marker>
        )}
      </Map>
    );
  }
}

export default PointsMap
