import React from 'react';
import Wavesurfer, { useWavesurfer } from '../index';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Zoom',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'black'
}

const ZoomSlider = ({ onChange, max=null }) => {
  const { wavesurfer: ws } = useWavesurfer();
  return ws && (
    <p>
      <b>-</b>
      <input type="range" 
          defaultValue={ws.defaultParams.minPxPerSec} min={50} 
          max={max || ws.defaultParams.minPxPerSec * 30} onChange={onChange} />
      <b>+</b>
    </p>
  )
}

export const Zoom = ({ ...props }) => {
  const [ zoom, setZoom ] = React.useState(null)
  console.log(zoom)
  return (
    <Container>
        <Wavesurfer url={audioUrl} zoom={zoom} {...WavesurferProps} {...props}>
          <AudioControlButtons />
          <ZoomSlider onChange={e => setZoom(e.target.value)} />
        </Wavesurfer>
      </Container>
  )
}
Zoom.args = {};