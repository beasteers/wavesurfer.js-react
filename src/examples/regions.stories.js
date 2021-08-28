import Wavesurfer from '../index';
import { RegionsPlugin, Region } from '../plugins';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Regions',
    component: RegionsPlugin,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: '#A8DBA8',
  progressColor: '#3B8686',
}

const regions = [
  {
      start: 1,
      end: 3,
      loop: false,
      color: 'hsla(400, 100%, 30%, 0.5)'
  }, {
      start: 5,
      end: 7,
      loop: false,
      color: 'hsla(200, 50%, 70%, 0.4)',
      minLength: 1,
  }
]

export const Regions = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps}>
        <RegionsPlugin {...props}>
          {regions.map((r, i) => <Region {...r} />)}
        </RegionsPlugin>
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Regions.args = { ...RegionsPlugin.defaultProps };