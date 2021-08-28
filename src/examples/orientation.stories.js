import Wavesurfer from '../index';
import { Container, audioUrl, AudioControlButtons } from './share';

export default {
    title: 'Orientations',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: '#A8DBA8',
  progressColor: '#3B8686',
}

export const Rtl = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} rtl={true} {...WavesurferProps} {...props}>
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Rtl.args = {};


export const Vertical = ({ height, ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} vertical={true} height={height} {...WavesurferProps} {...props}>
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Vertical.args = {
  height: 200
};