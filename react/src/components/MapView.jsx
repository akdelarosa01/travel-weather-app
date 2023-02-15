import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import olms from 'ol-mapbox-style';
import * as proj from 'ol/proj';
import '../App.css';

function MapView(props) {
    let latitude = props.latitude;
    let longitude = props.longitude;

    let mapContainer = undefined;

    useEffect(() => {
        const initialState = {
            lat: latitude,
            lng: longitude,
            zoom: 10
        };

        const myAPIKey = '8eb7200d787b4ef2a2b74f8ccced3a56';
        const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-carto/style.json';

        olms(mapContainer, `${mapStyle}?apiKey=${myAPIKey}`).then((map) => {
            map.getView().setCenter(proj.transform([initialState.lng, initialState.lat], 'EPSG:4326', 'EPSG:3857'));
            map.getView().setZoom(initialState.zoom);
        });
    }, [mapContainer]);

    return (<div style={{height:'100%',width:'100%'}} className="map-container" ref={el => mapContainer = el}></div>)
}

export default MapView;

