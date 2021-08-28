import React from 'react';
import Wavesurfer from '../index';
import { MicrophonePlugin } from '../plugins';

import { Container } from './share';

export default {
    title: 'Microphone',
    component: MicrophonePlugin,
    // argTypes: {},
};

export const Microphone = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer waveColor='black'>
      <MicrophonePlugin {...props} />
      </Wavesurfer>
    </Container>
  )
}
Microphone.args = { ...MicrophonePlugin.defaultProps };