import Wavesurfer from '../index';
import { SpectrogramPlugin } from '../plugins';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Spectrogram',
    component: SpectrogramPlugin,
    // argTypes: {},
    args: { cmap: 'magma' }
};

const WavesurferProps = {
  waveColor: '#A8DBA8',
  progressColor: '#3B8686',
}

export const Spectrogram = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps}>
      <SpectrogramPlugin {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Spectrogram.args = { ...SpectrogramPlugin.defaultProps };