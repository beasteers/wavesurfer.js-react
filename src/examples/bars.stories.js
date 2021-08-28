import Wavesurfer from '../index';
import { Container, audioUrl, AudioControlButtons, globalProps, stereoAudioUrl, objectFlatten, objectUnflatten } from './share';

export default {
    title: 'Bars',
    component: Wavesurfer,
    args: {
      waveColor: '#bfc3f0',
      progressColor: '#4353FF',
      cursorColor: '#4353FF',
      height: 200,
    },
    argTypes: {},
};

const WavesurferProps = globalProps;

export const Bars = ({ ...props }) => {
    return (
      <Container>
        <Wavesurfer url={audioUrl} {...WavesurferProps} {...props}>
          <AudioControlButtons />
        </Wavesurfer>
      </Container>
    )
}
Bars.args = {
  barGap: null,
  barWidth: 2,
  barHeight: 1,
};

export const RoundedBars = Bars.bind({})
RoundedBars.args = {
  barGap: 3,
  barWidth: 3,
  barHeight: 1,
  barRadius: 3,
}


export const SplitChannels = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={stereoAudioUrl} {...WavesurferProps} {...objectUnflatten(props)}>
        <AudioControlButtons />
      </Wavesurfer>
    </Container>)
}
SplitChannels.args = {
  ...Bars.args,
  splitChannels: true,
  ...objectFlatten({
    overlay: false,
    channelColors: {
        0: { progressColor: '#ddbcfb', waveColor: 'pink' },
        1: { progressColor: '#f0208a', waveColor: 'purple' }
    }
  }, 'splitChannelsOptions'),
};