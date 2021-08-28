import Wavesurfer from '../index';
import { MinimapPlugin } from '../plugins';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Minimap',
    component: MinimapPlugin,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'violet',
  progressColor: 'purple',
  loaderColor: 'purple',
  cursorColor: 'navy',
}

export const Minimap = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps}>
        <MinimapPlugin {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Minimap.args = { ...MinimapPlugin.defaultProps };