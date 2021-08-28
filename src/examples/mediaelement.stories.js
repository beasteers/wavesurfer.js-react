import React from 'react';
import Wavesurfer from '../index';
import { Container, AudioControlButtons, audioUrl, videoUrl } from './share';

export default {
    title: 'Media Element',
    component: Wavesurfer,
    // argTypes: {},
};


export const AudioElement = ({ ...props }) => {
  const [ media, setMedia ] = React.useState(null);
  return (
    <div>
      <audio ref={setMedia} src={audioUrl} />
      <Container>
        <Wavesurfer url={media} backend='MediaElement' {...props}>
          <AudioControlButtons />
        </Wavesurfer>
      </Container>
    </div>
  )
}
AudioElement.args = {};


export const VideoElement = ({ ...props }) => {
  const [ media, setMedia ] = React.useState(null);
  return (
    <div>
      <video ref={setMedia} src={videoUrl} />
      <Container>
        <Wavesurfer url={media} backend='MediaElement' {...props}>
          <AudioControlButtons />
        </Wavesurfer>
      </Container>
    </div>
  )
}
VideoElement.args = {};



// var wavesurfer = WaveSurfer.create({
//   container: document.querySelector('#wave'),
//   backend: 'MediaElementWebAudio'
// });
// // You have to use the same methods of MediaElement backend to load the audio file, passing peaks
// wavesurfer.load('big_audio.mp3', normalizedPeaks, 11625);

// // Example for StereoPanner node
// wavesurfer.panner = wavesurfer.backend.ac.createStereoPanner();
// let sliderPanner = document.querySelector('[data-action="pan"]');
// sliderPanner.addEventListener('input', () => {
//   wavesurfer.panner.pan.value = Number(sliderPanner.value);
// });
// wavesurfer.backend.setFilter(wavesurfer.panner)