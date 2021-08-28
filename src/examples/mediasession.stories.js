import React from 'react';
import Wavesurfer from '../index';
import { MediaSessionPlugin } from '../plugins';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Media Session',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'black'
}

export const MediaSession = ({ ...props }) => {
  return (
    <Container>
        <Wavesurfer url={audioUrl} {...WavesurferProps} {...props}>
          <MediaSessionPlugin metadata={{
              metadata: {
                  title: 'Wavesurfer.js Example',
                  artist: 'The Wavesurfer.js Project',
                  album: 'Media Session Example',
                  artwork: [
                    {src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png'},
                    {src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png'},
                    {src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png'},
                    {src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png'},
                    {src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png'},
                    {src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png'},
                  ]
              }
          }} />
          <AudioControlButtons />
        </Wavesurfer>
      </Container>
  )
}
MediaSession.args = {};