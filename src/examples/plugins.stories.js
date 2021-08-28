import React, { useState } from 'react';
import Wavesurfer from '../index';
import { MinimapPlugin, TimelinePlugin, CursorPlugin, SpectrogramPlugin, RegionsPlugin, Region } from '../plugins';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Plugin System',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'black'
}

const PLUGINS = {
  minimap: MinimapPlugin,
  timeline: TimelinePlugin, 
  cursor: CursorPlugin, 
  spectrogram: SpectrogramPlugin, 
  regions: () => <RegionsPlugin><Region start={1} end={6} /></RegionsPlugin>,
}

export const PluginSystem = ({ ...props }) => {
  const [ active, setActive ] = useState(() => {
    return Object.keys(PLUGINS).reduce((o, k) => { o[k] = false; return o }, {})
  })

  return (
    <Container>
        {Object.keys(PLUGINS).map(
          k => <div key={k}><input type='checkbox' onChange={e => 
            setActive({ ...active, [k]: e.target.checked })} /> {k}</div>
        )}
        <Wavesurfer url={audioUrl} {...WavesurferProps} {...props}>
          <AudioControlButtons />
          {Object.entries(PLUGINS).map(([ name, Plugin ]) => active[name] && <Plugin key={name} />)}
        </Wavesurfer>
      </Container>
  )
}
PluginSystem.args = {};