import React from 'react';
import Wavesurfer from '../index';
import { MarkersPlugin, Marker, useImage } from '../plugins';

import { Container, AudioControlButtons, audioUrl, globalProps, markerImageUrl, objectFlatten, objectUnflatten } from './share';

export default {
    title: 'Markers',
    component: MarkersPlugin,
    argTypes: {
      
    },
};

export const Markers = (props_) => {
  const { markers, ...props } = objectUnflatten(props_);
  console.log(markers)
  const img = useImage(markerImageUrl);

  return (
    <Container>
      <Wavesurfer url={audioUrl}>
        <MarkersPlugin {...props}>
          {markers && (markers.map(({ useDemoImage, ...m }) => 
                  useDemoImage ? (img ? { markerElement: img, ...m } : null) : m )
                .map((m, i) => m && <Marker key={i} {...m} />))}
        </MarkersPlugin>
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Markers.args = {
  ...globalProps,
  ...objectFlatten([
    { time: 0, label: "BEGIN", color: '#ff990a' },
    { time: 5.5, label: "V1", color: '#ff990a' },
    { time: 12, position: "bottom", useDemoImage: true },
    { time: 24, label: "END(ish)", color: '#00ffcc', position: 'top' },
  ].map(m => ({ ...Marker.xdefaultProps, useDemoImage: false, ...m })), 'markers')
};