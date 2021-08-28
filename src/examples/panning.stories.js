import React from 'react';
import Wavesurfer from '../index';
import { usePanner, useFilters, useImpulseResponse, useEQ } from '../effects';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'WebAudio Filters',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'black'
}

const PannerControls = ({ min=-45, max=45 }) => {
  const [ x, setX ] = React.useState(0);
  const panner = usePanner({ positionX: x });
  useFilters([ panner ]);
  return <input type="range" min={min} max={max} defaultValue={0}
    onChange={e => setX(Math.sin(parseInt(e.target.value) * (Math.PI / 180)))} />
}

export const Panner = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps}>
        <PannerControls {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Panner.args = {  };

const EXAMPLE_IRS = {
  "Big Hall E001 M2S": "/ir/BIG%20HALL%20E001%20M2S.wav",
  "Big Hall E002 M2S": "/ir/BIG%20HALL%20E002%20M2S.wav",
  "Big Hall E003 M2S": "/ir/BIG%20HALL%20E003%20M2S.wav",
  "Mini Caves E001 M2S": "/ir/MINI%20CAVES%20E001%20M2S.wav",
  "DubWise E001 M2S": "/ir/DAMPED%20CAVE%20E004%20M2S.wav",
  "Filterverb E001 M2S": "/ir/DAMPED%20CAVE%20E005%20M2S.wav",
  "Gated Place E001 M2S": "/ir/HIGH%20DAMPING%20CAVE%20E001%20M2S.wav",
  "Small Church E001 M2S": "/ir/LARGE%20DAMPING%20CAVE%20E001%20M2S.wav",
  "Flangerspace E001 M2S": "/ir/DUBWISE%20E001%20M2S.wav",
  "Mega Diffusor E001 M2S": "/ir/FILTERVERB%20E001%20M2S.wav",
  "Corridor Flutter Echo E001 M2S": "/ir/GATED%20PLACE%20E001%20M2S.wav",
  "Medium Metal Room E001 M2S": "/ir/SMALL%20CHURCH%20E001%20M2S.wav",
  "Pipe & Carpet E001 M2S": "/ir/FLANGERSPACE%20E001%20M2S.wav",
  "Damped Cave E001 M2S": "/ir/MEGA%20DIFFUSOR%20E001%20M2S.wav",
  "Damped Cave E002 M2S": "/ir/CORRIDOR%20FLUTTER%20ECHO%20E001%20M2S.wav",
  "Damped Cave E003 M2S": "/ir/MEDIUM%20METAL%20ROOM%20E001%20M2S.wav",
  "Damped Cave E004 M2S": "/ir/HOTHALL%20COMP-1.wav",
  "Damped Cave E005 M2S": "/ir/REVGATEDDL1-1.wav",
  "High Damping Cave E001 M2S": "/ir/MEDIUM%20DAMPING%20CAVE%20E001%20M2S.wav",
  "Large Damping Cave E001 M2S": "/ir/MEDIUM%20DAMPING%20CAVE%20E002%20M2S.wav",
  "Medium Damping Cave E001 M2S": "/ir/MEDIUM%20DAMPING%20ROOM%20E001%20M2S.wav",
  "Medium Damping Cave E002 M2S": "/ir/PIPE%20&%20CARPET%20E001%20M2S.wav",
  "Medium Damping Room E001 M2S": "/ir/DAMPED%20CAVE%20E001%20M2S.wav",
  "HOTHALL COMP-1": "/ir/DAMPED%20CAVE%20E002%20M2S.wav",
  "REVGATEDDL1-1": "/ir/DAMPED%20CAVE%20E003%20M2S.wav",
  "WISSTLEPLATE-1": "/ir/STRANGEBOX-1.wav",
  "ROBOTVERB-1": "/ir/STRANGEBOX-2.wav",
  "STRANGEBOX-1": "/ir/WIDE%20HALL-1.wav",
  "STRANGEBOX-2": "/ir/WISSTLEPLATE-1.wav",
  "WIDE HALL-1": "/ir/ROBOTVERB-1.wav",
}


const IRControls = () => {
  const [ url, setUrl ] = React.useState(EXAMPLE_IRS["STRANGEBOX-1"]);

  const filt = useImpulseResponse(url);
  useFilters([ filt ]);
  return <select value={url||''} onChange={e => setUrl(e.target.value)}>
    <option value=''>None</option>
    {Object.entries(EXAMPLE_IRS).map(([ k, v]) => 
      <option value={v} key={v}>{k}</option>)}
  </select>
}

export const ImpulseResponse = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps}>
        <IRControls {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
ImpulseResponse.args = {  };


const EQControls = ({ freqs, min=-40, max=40 }) => {
  const EQ = React.useMemo(() => freqs.map((f, i) => ({ 
    f, type: i == 0 ? 'lowshelf' : i == freqs.length - 1 ? 'highshelf' : 'peaking' })))
  const filters = useEQ(EQ);
  useFilters([ ...filters ]);
  return !filters ? null : filters.map((f, i) => 
      <input type="range" min={min} title={filters[i].frequency.value} max={max} step={1} defaultValue={0}
        onChange={e => { 
          filters[i].gain.value = ~~e.target.value;
          console.log(filters[i].frequency.value, filters[i].gain.value)
         }} />)
}

export const EQ = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps}>
        <EQControls freqs={[32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]} {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
EQ.args = {  };