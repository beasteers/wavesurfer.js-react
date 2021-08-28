import Wavesurfer, { useWavesurfer } from '../index';
// import { 
//   SpectrogramPlugin, CursorPlugin, TimelinePlugin, MinimapPlugin, 
//   RegionsPlugin, Region, MarkersPlugin, Marker, MicrophonePlugin } from './plugins';
import styled from 'styled-components';

// export default {
//   title: 'Wavesurfer',
//   component: Wavesurfer,
//   argTypes: {
//     // color: { control: 'color' },
//     // shadowColor: { control: 'color' },
//     // delay: { control: 'number' },
//   },
// };
export const parameters = () => ({
  controls: {
    matchers: {
      color: /color$/i,
      date: /Date$/,
    },
    exclude: ['audioContext'],
  },
});

export const ContainerDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
`;
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const AudioControlsDiv = styled.div`
  width: 100%;
  display: flex;
`;

export const Container = ({ children, ...props }) => (
  <ContainerDiv {...props}><Wrapper>{children}</Wrapper></ContainerDiv>)

export const audioUrl = 'https://wavesurfer-js.org/example/media/demo.wav'
export const pannerAudioUrl = 'https://wavesurfer-js.org/example/panner/media.wav'
export const transcriptSampleAudioUrl = 'https://wavesurfer-js.org/example/elan/transcripts/001z.mp3'
export const stereoAudioUrl = 'https://wavesurfer-js.org/example/media/stereo.mp3'
export const markerImageUrl = 'https://wavesurfer-js.org/example/markers/settings_icon.png'
export const videoUrl = 'https://wavesurfer-js.org/example/media/demo_video.mp4'
export const annotatedVideoUrl = 'https://wavesurfer-js.org/example/media/nasa.mp4'
export const videoMetaUrl = 'https://wavesurfer-js.org/example/media/nasa.json'
export const elanUrlBase = 'https://wavesurfer-js.org/example/elan/transcripts/'
export const elanXmlUrl = 'https://wavesurfer-js.org/example/elan/transcripts/001z.xml'
export const annotatedAudioUrl = 'https://www.archive.org/download/mshortworks_001_1202_librivox/msw001_03_rashomon_akutagawa_mt_64kb.mp3'
export const annotatedAudioPeaksUrl = 'https://wavesurfer-js.org/example/annotation/rashomon.json';
export const audioMetaUrl = 'https://wavesurfer-js.org/example/annotation/annotations.json'

export const globalProps = {
  'progressColor': '#457d80',//'#87ffe9',
  waveColor: '#51cbdc',//'#b0ecff',
}

export const WSButton = ({ onClick, children }) => {
    const { wavesurfer: ws } = useWavesurfer();
    return <button onClick={() => { ws && onClick && onClick(ws) }}>{children}</button>;
}

export const PlayButton = () => <WSButton onClick={ws => ws.playPause()}>Play / Pause</WSButton>
export const BackwardButton = () => <WSButton onClick={ws => ws.skipBackward()}>Back</WSButton>
export const ForwardButton = () => <WSButton onClick={ws => ws.skipForward()}>Forward</WSButton>
// export const MuteButton = () => <WSButton onClick={ws => ws.mute()}>Mute</WSButton>

export const AudioControlButtons = () => {
    return <AudioControlsDiv><BackwardButton /><PlayButton /><ForwardButton /></AudioControlsDiv>
}

export const Template = ({ url=null, children, controls=true, ...props }) => (
  <Container>
    <Wavesurfer url={url || audioUrl} {...props}>
      {children}
      {controls && <AudioControlButtons />}
    </Wavesurfer>
  </Container>
);


export const objectMap = (o, func) => (
    Object.entries(o).map(func).filter(x=>x).reduce(
        (o, x) => x ? Object.assign(o, Array.isArray(x) ? { [x[0]]: x[1] } : x) : o, {}))

// export const objectFlatten = (o, prefix, sep='_') => {
//     return objectMap(o, ([ k, v ]) => {
//         const kk = prefix ? prefix + sep + k : k;
//         if(typeof v !== 'object') return  [ kk, v ];
//         return objectFlatten(v, kk);
//     })
// }

// https://stackoverflow.com/a/59787588
export const objectFlatten = (ob, prefix=false, result=null) => {
    result = result || {};
    // Preserve empty objects and arrays, they are lost otherwise
    if (prefix && typeof ob === 'object' && ob !== null && Object.keys(ob).length === 0) {
      result[prefix] = Array.isArray(ob) ? [] : {};
      return result;
    }
  
    prefix = prefix ? prefix + '.' : '';
    for (const i in ob) {
      if (Object.prototype.hasOwnProperty.call(ob, i)) {
        if (typeof ob[i] === 'object' && ob[i] !== null) {
            objectFlatten(ob[i], prefix + i, result);
        } 
        else { result[prefix + i] = ob[i]; }
      }
    }
    return result;
  }

export const objectUnflatten = (ob) => {
    const result = {};
    for (const i in ob) {
      if (Object.prototype.hasOwnProperty.call(ob, i)) {
        const keys = i.match(/^\.+[^.]*|[^.]*\.+$|(?:\.{2,}|[^.])+(?:\.+$)?/g); // Just a complicated regex to only match a single dot in the middle of the string
        keys.reduce((r, e, j) => {
          return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 === j ? ob[i] : {}) : []);
        }, result);
      }
    }
    return result;
}

// export const objectUnflatten = (o, sep='_', alwaysObjs=false) => {
//     const o2 = {}
//     for(let [k,v] of Object.entries(o).sort((a,b) => a>b)) {
//         const ks = k.split(sep).map(k => alwaysObjs || isNaN(parseInt(k)) ? k : parseInt(k));
//         let oi = o2;
//         for(let i in ks) {
//             i = parseInt(i); // why ????
//             if(i >= ks.length - 2) break;
//             if(!oi[ks[i]]) oi[ks[i]] = alwaysObjs || isNaN(ks[i + 1]) ? {} : [];
//             if(Array.isArray(oi)) {
//                 while() {

//                 }
//             } else {
              
//             }
//             console.log(i, ks[i], oi[ks[i]], oi)
//             oi = oi[ks[i]];
//         }
//         oi[ks[ks.length - 1]] = v;
//     }
//     return o2;
// }