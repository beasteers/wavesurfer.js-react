import React, { useState, useEffect, useCallback } from 'react';
import Wavesurfer, { useWavesurfer } from '../index';
import { ElanPlugin, RegionsPlugin, Region } from '../plugins';
import { useEvent } from '../utils';
import { Container, AudioControlButtons, elanXmlUrl, elanUrlBase } from './share';
import styled from 'styled-components';

export default {
    title: 'Elan',
    component: Wavesurfer,
    // argTypes: {},
};


const ElanContainer = styled.div`
  & tbody tr.success td {
    background: rgb(223, 240, 216);
  }
  & tbody tr:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const WavesurferProps = {
  waveColor: 'violet',
  progressColor: 'purple',
  loaderColor: 'purple',
  cursorColor: 'navy',
  selectionColor: '#d0e9c6',
  loopSelection: false,
}

const ElanApp = ({ setUrl }) => {
  const { wavesurfer: ws } = useWavesurfer();
  const elan = ws && ws.elan;
  const [ [ ann, row ], setAnnotation ] = useState(() => [ null, null ]);
  console.log(ann, row, setAnnotation)

  useEvent(ws, 'audioprocess', (time) => {
    if(!elan) return;
    const annotation = elan.getRenderedAnnotation(time);
    if(ann !== annotation) { 
      setAnnotation([ annotation, annotation ? elan.getAnnotationNode(annotation) : null ]); 
    }
  });

  useEffect(() => {
    if(!elan || !ann || !row) return;
    row.classList.add('success');
    let before = row.previousSibling;
    if (before) { ws.elan.container.scrollTop = before.offsetTop; }
    return () => { row.classList.remove('success') }
  }, [ elan, ann, row ])

  return <ElanContainer>
    <RegionsPlugin>
      {ann && <Region start={ann.start} end={ann.end} resize={false} color={'rgba(223, 240, 216, 0.7)'} />}
    </RegionsPlugin>
    <AudioControlButtons />
    <ElanPlugin url={elanXmlUrl} tiers={{ Text: true, Comments: true }} 
      onReady={data => { setUrl(elanUrlBase + data.media.url) }}
      onSelect={(start, end) => { ws.backend.play(start, end) }} />
  </ElanContainer>
}

export const Elan = ({ ...props }) => {
  const [ url, setUrl ] = React.useState(null);
  return (
    <Container>
        <Wavesurfer url={url} {...WavesurferProps} {...props}>
          <ElanApp setUrl={setUrl} />
        </Wavesurfer>
      </Container>
  )
}
Elan.args = {};