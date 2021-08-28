import Wavesurfer from '../index';
import { Container, AudioControlButtons, audioUrl, WSButton } from './share';

export default {
    title: 'Mute',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'black'
}

export const Mute = ({ ...props }) => {
  return (
    <Container>
        <Wavesurfer url={audioUrl} {...WavesurferProps} {...props}>
          <AudioControlButtons />
          <WSButton onClick={ws => ws.toggleMute()}>Toggle Mute</WSButton>
          <WSButton onClick={ws => ws.setMute(true)}>Mute</WSButton>
          <WSButton onClick={ws => ws.setMute(false)}>Unmute</WSButton>
        </Wavesurfer>
      </Container>
  )
}
Mute.args = {};