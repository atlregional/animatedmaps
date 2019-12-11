import React from "react";
// import API from "../../utils/API";
import colormap from 'colormap';

const colorRampWidth = 30;
const lableWidth = (100 - colorRampWidth)/2

const ColorRamp = props => {

    const numberOfBins = props.style.nshades;
    const colorMap = props.style.colormap;
    const marginBottom = props.marginBottom;

    const colors = colormap({
        colormap: colorMap,
        nshades: numberOfBins,
        format: 'hex',
        alpha: 1
      })

    const binWidthRatio = colorRampWidth/numberOfBins;
    const binWidth = String(binWidthRatio) + "%";

    return (
        <div 
            style={{
                float: 'center',
                width: '100%',
                height: '5%',
                margin: '5px 0px 10px 0px'
            }}
        >
            <div
                style={{
                    borderRadius: '5px 0 0 5px',
                    fontSize: '2em',
                    textAlign: 'right',
                    float: 'left',
                    height: '100%',
                    width: String(lableWidth) + '%',
                    marginBottom: marginBottom,
                    paddingRight: '5px',
                }}
            >
                {props.minvalue}
            </div>
            { 
            colors ? 
            colors.map(color => 
            <div 
                style={{
                    float: 'left',
                    height: '40px',
                    backgroundColor: color,
                    width: binWidth,
                    marginBottom: marginBottom,
                    opacity: props.style.opacity,
                }}
            />) 
            : null
            }
            <div
                style={{
                    borderRadius: '0 5px 5px 0',
                    fontSize: '2em',
                    textAlign: 'left',
                    float: 'left',
                    height: '100%',
                    width: String(lableWidth) + '%',
                    marginBottom: marginBottom,
                    paddingLeft: '5px'
                }}
            >
                {props.maxvalue}
            </div>
        </div>
    );
};

export default ColorRamp;