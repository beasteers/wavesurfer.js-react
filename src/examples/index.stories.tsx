import React from 'react';
import Wavesurfer, { useWavesurfer } from '../index';
import { 
  SpectrogramPlugin, CursorPlugin, TimelinePlugin, MinimapPlugin, 
  RegionsPlugin, Region, MarkersPlugin, Marker, MicrophonePlugin } from '../plugins';
import styled from 'styled-components';

export default {
  title: 'Basic',
  component: Wavesurfer,
  argTypes: {
    // color: { control: 'color' },
    // shadowColor: { control: 'color' },
    // delay: { control: 'number' },
  },
};
const parameters = () => ({
  controls: {
    matchers: {
      color: /color$/i,
      date: /Date$/,
    },
    exclude: ['audioContext'],
  },
});

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
`;
const Wrapper = styled.div`
  width: 100%;
`;

const audioUrl = 'https://wavesurfer-js.org/example/media/demo.wav'

const globalProps = {
  'progressColor': '#87ffe9',
  waveColor: '#b0ecff',
}

const PlayButton = () => {
    const { wavesurfer: ws } = useWavesurfer();
    return <button onClick={() => { ws && ws.playPause() }}>Play / Pause</button>;
}

const Template = ({ url=null, children, ...props }) => (
  <Container><Wrapper>
    <Wavesurfer url={url || audioUrl} {...props}>
      {children}
      <PlayButton />
    </Wavesurfer>
  </Wrapper></Container>);

export const Basic = Template.bind({});
Basic.args = Wavesurfer.defaultProps;
Basic.parameters = parameters;


export const Cursor = ({ ...props }) => {
  return <Template>
    <CursorPlugin {...props} />
  </Template>
}
Cursor.args = {
  ...CursorPlugin.defaultProps,
  ...globalProps,
  showTime: true,
  opacity: 1,
  customShowTimeStyle: {
      'background-color': '#000',
      color: '#fff',
      padding: '2px',
      'font-size': '10px'
  }
};

export const Spectrogram = ({ ...props }) => {
  return <Template>
    <SpectrogramPlugin {...props} />
  </Template>
}
Spectrogram.args = SpectrogramPlugin.defaultProps;

export const Timeline = ({ ...props }) => {
  return <Template>
    <TimelinePlugin {...props} />
  </Template>
}
Timeline.args = TimelinePlugin.defaultProps;

export const Minimap = ({ ...props }) => {
  return <Template>
    <MinimapPlugin {...props} />
  </Template>
}
Minimap.args = MinimapPlugin.defaultProps;

export const Regions = ({ ...props }) => {
  return <Template>
    <RegionsPlugin {...props}>
      <Region start={5} end={10} />
    </RegionsPlugin>
  </Template>
}
Regions.args = RegionsPlugin.defaultProps;

export const Markers = ({ ...props }) => {
  return <Template>
    <MarkersPlugin {...props}>
      <Marker time={10} />
      <Marker time={20} position='top' />
      <Marker time={22} label='hi' />
    </MarkersPlugin>
  </Template>
}
Markers.args = MarkersPlugin.defaultProps;


export const Microphone = ({ ...props }) => {
  return <Template>
    <MicrophonePlugin {...props} />
  </Template>
}
Microphone.args = MicrophonePlugin.defaultProps;

