import Wavesurfer from '../index';
import { CursorPlugin } from '../plugins';
import { Container, AudioControlButtons, audioUrl, globalProps } from './share';

export default {
    title: 'Cursor',
    component: CursorPlugin,
    subcomponents: { Wavesurfer },
    argTypes: {
      // color: { control: 'color' },
      // shadowColor: { control: 'color' },
      // delay: { control: 'number' },
    },
};

export const Cursor = ({ ...props }) => {
  
    return <Container>
    <Wavesurfer url={audioUrl} {...globalProps}>
    <CursorPlugin {...props} />
      <AudioControlButtons />
    </Wavesurfer>
  </Container>
  }
  Cursor.args = {
    ...CursorPlugin.defaultProps,
    showTime: true,
    opacity: 1,
    customShowTimeStyle: {
        'background-color': '#000',
        color: '#fff',
        padding: '2px',
        'font-size': '10px'
    }
};