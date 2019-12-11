import React, { useState, useEffect } from "react";
import { Slider } from 'react-semantic-ui-range';
import numeral from 'numeral';
import API from './utils/API.js';
import Map from './components/Map';
import ColorRamp from './components/ColorRamp'
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { MdPauseCircleFilled } from "react-icons/md";



const App = () => {
    const title = 'Job and Worker Density'
    const [table1, table2] = ['WAC_jobDensity_2002_2017.json', 'RAC_jobDensity_2002_2017.json' ]
    const data1 = require(`./data/${table1}`);
    const data2 = require(`./data/${table2}`);

    const style = {
        colormap: 'density',
        nshades: 72,
        opacity: .7
    }

    const mapContainerStyle = { padding: '10px', float: 'left', width: '50%', height: '70vh', marginTop: '20px'}

    // console.log(data1);
    // console.log(data2);

    const [year, setYear] = useState(2002);
    const [geoJSON, setGeoJSON] = useState();
    const [mapBounds, setMapBounds] = useState();
    
    const [minYear, maxYear] = [2002, 2017];
    const [minValue, maxValue] = [0, 5000]

    const sliderSettings = {
        start: year,
        min: minYear,
        max: maxYear,
        step: 1,
        onChange: value => setYear(value),
    };

    const getGeoJSON = () => {

        const url = `https://opendata.arcgis.com/datasets/4a77e16669bf4ee5afce19812980d6a1_51.geojson`

        API.getData(url)
            .then(res => setGeoJSON(res.data))
            .catch(err => console.error(err))
    };

    const [ playStatus, setPlayStatus ] = useState({
        direction: null,
        playing: false,
    });

    const [timerID, setTimerID] = useState();

    const playSlider = (init, duration, status, steps) => {
        
        // addSliderListner();

        const yearSteps = status.direction === 'forward' ? steps : status.direction === 'reverse' ? -1 * steps : steps;
        let year = init;

        const increment = () => {
            year > maxYear || year < minYear ? setPlayStatus({ playing: false }) : setYear(year);
            year = year + yearSteps;
        }

        let timer = setInterval(increment, duration);

        setTimerID(timer)
    }

    const stopSlider = () => clearInterval(timerID);
    
    const sliderStartStop = (init, duration, status, steps) => !playStatus.playing ? stopSlider() : 
        playStatus.direction ? playSlider(init, duration, status, steps) : null;
        


    // const [ playStatus, setPlayStatus ] = useState({
    //     direction: null,
    //     playing: false,
    // });

    // const [timerID, setTimerID] = useState();


    useEffect(() => getGeoJSON(), []);
    useEffect(() => sliderStartStop(year, 50, playStatus, 1), [playStatus.playing]);


    return(
        <div style={{textAlign: 'center', height: '100vh'}}>
            <h1 style={{fontSize: '3em'}}>{year}</h1>
            <div styl={{width: '100%'}}>
            <div style={{float: 'left', width: '10%'}}>
                { 
                playStatus.playing && playStatus.direction === 'reverse' ? 
                <MdPauseCircleFilled 
                    style={{float: 'right', width: '30px', height: '30px'}} 
                    onClick={() => setPlayStatus({playing: false})}
                /> :
                <IoIosArrowDropleftCircle 
                    style={{
                        float: 'right', 
                        width: '30px', 
                        height: '30px', 
                        fill: playStatus.direction === 'forward' && playStatus.playing ? 'lightgrey' : null
                    }} 
                    onClick={() => playStatus.direction === 'forward' && playStatus.playing ? null : setPlayStatus({playing: true, direction: 'reverse'})}
                />
                }
            </div>
            <div onClick={playStatus.playing ? () => setPlayStatus({ playing: false }) : null} id={'income-slider'} style={{float: 'left', width: '80%'}}>

            
            <Slider
                    style={{float: 'center', width: '100%'}} 
                    value={year} 
                    settings={sliderSettings} 
                    color='red'
            />
            </div>
            <div style={{float: 'left', width: '10%'}}>
                {
                playStatus.playing && playStatus.direction === 'forward' ?
                <MdPauseCircleFilled 
                    style={{float: 'left', width: '30px',  height: '30px'}} 
                    onClick={() => setPlayStatus({playing: false})}
                /> :
                <IoIosArrowDroprightCircle 
                    style={{
                        float: 'left', 
                        width: '30px',  
                        height: '30px',
                        fill: playStatus.direction === 'reverse' && playStatus.playing ? 'lightgrey' : null
                    }} 
                    onClick={() => playStatus.direction === 'reverse' && playStatus.playing ? null : setPlayStatus({playing: true, direction: 'forward'}) }
                />
                }    
            </div>
            </div>
            <div style={mapContainerStyle}>  

                <Map 
                    style={style} 
                    year={year}
                    data={data1}
                    name={'left'}
                    minvalue={minValue}
                    maxvalue={maxValue}
                    mapbounds={mapBounds}
                    setMapBounds={setMapBounds}
                    geojson={geoJSON} 
                /> 
                <div style={{height: '3%', textAlign: 'center'}}>
                    <h1>Job Density</h1>
                </div>
            </div>
            <div style={mapContainerStyle}>  

                <Map 
                    style={style} 
                    year={year}
                    data={data2}
                    name={'right'}
                    minvalue={minValue}
                    maxvalue={maxValue}
                    mapbounds={mapBounds}
                    setMapBounds={setMapBounds}
                    geojson={geoJSON} 
                /> 
                                <div style={{height: '3%', textAlign: 'center'}}>
                    <h1>Worker Density</h1>
                </div>


            </div>
            <h2>Jobs/Workers per Sqaure Mile</h2>
            <ColorRamp minvalue={minValue} maxvalue={maxValue} marginBottom='20px' style={style} />

        </div>
    )
};

export default App;