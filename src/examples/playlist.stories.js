import React from 'react';
import Wavesurfer from '../index';
import { Container, AudioControlButtons, audioUrl, pannerAudioUrl, transcriptSampleAudioUrl } from './share';

export default {
    title: 'Playlist',
    component: Wavesurfer,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: '#428bca',
  progressColor: '#31708f',
  height: 120,
  barWidth: 3
}

const tracks = [
  { name: 'czskamaarù – Trou', url: audioUrl },
  { name: '日本人の話し', url: pannerAudioUrl },
  { name: 'Рассказы о сновидениях', url: transcriptSampleAudioUrl },
]

export const Playlist = ({ ...props }) => {
  const [ index, setIndex ] = React.useState(0);
  const { url, name } = tracks[index];
  const stepTrack = (step=1) => setIndex((index + step) % tracks.length)
  return (
    <Container>
      <Wavesurfer url={url} {...WavesurferProps} {...props}
        onReady={ws => ws.play()} 
        onFinish={ws => stepTrack()}>
        {url && <p>Currently playing: {name || url}</p>}

        <ul>{tracks.map((t, i) => 
          <li key={i} onClick={() => { setIndex(i) }}>{i === index ? '** ' : ''}{t.name}</li>)}
        </ul>

        <AudioControlButtons />
        <button onClick={() => stepTrack(-1)}>Previous Track</button>
        <button onClick={() => stepTrack(1)}>Next Track</button>
      </Wavesurfer>
    </Container>
  )
}
Playlist.args = {  };