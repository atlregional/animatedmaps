import React from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON } from 'react-leaflet';
import colormap from 'colormap';

const Map = props => {

    const numberOfBins = props.style.nshades;
    const colorMap = props.style.colormap;

    // console.log(props.geojson)
      
    let colors = colormap({
      colormap: colorMap,
      nshades: numberOfBins,
      format: 'hex',
      alpha: 1
    }).reverse();

    return (
        <LeafletMap
          key={'leaflet-map-' + props.name}
          center={[33.8, -84.4]}
          zoom={9}
          maxZoom={18}
          bounds={props.mapbounds}
          attributionControl={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={false}
          onMoveEnd={e => props.setMapBounds(e.target.getBounds())}
        >
            {props.geojson && props.data ?
                <GeoJSON
                key={'map-layer-' + props.name}
                data={props.geojson}
                filter={feature => feature.properties['PLNG_REGIO'] !== 'NON-ARC'}
                style={feature => {

                    const minValue = props.minvalue;
                    const maxValue = props.maxvalue;
                    const geoid = parseInt(feature.properties['GEOID10'])
                    // console.log(geoid);
                    const tractDataObj = props.data.find(geo => geoid === geo['GEOID']);
                    // console.log(tractDataObj)
                    const value = tractDataObj ? tractDataObj[props.year] : null;
                    // console.log(value)
                    const distFromMin = value - minValue;
                    const range = maxValue - minValue;
                    const binningRatio = distFromMin/range;
                    const indexRange = numberOfBins - 1;
            
                    const color = value ? colors[Math.floor(value === 0 ? 0 : binningRatio * indexRange)] : null;
        
                    return ({
                        color: value < minValue ? colors[0] : value > maxValue ? colors[colors.length -1] : color,
                        weight: 1,
                        fillColor: value ? value < minValue ? colors[0] : value > maxValue ? colors[colors.length -1] : color : 'orange',
                        fillOpacity: props.style.opacity 
                        })
                  }}
                />
                : null
             }
            <TileLayer 
                key={'tile-layer-dark'}
                attribution={'&copy <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'}
                url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'}
                
            />
        </LeafletMap>
    )
}
export default Map;