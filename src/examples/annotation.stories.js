import React from 'react';
import Wavesurfer, { useWavesurfer } from '../index';
import { RegionsPlugin, Region, TimelinePlugin, CursorPlugin, MinimapPlugin } from '../plugins';
import { useEvent, useId } from '../utils';
import { Container, AudioControlButtons, annotatedVideoUrl, videoMetaUrl, annotatedAudioUrl, annotatedAudioPeaksUrl, audioMetaUrl } from './share';

export default {
    title: 'Annotation',
    component: Wavesurfer,
    // argTypes: {},
};





const LabeledInput = ({ label, name, textArea=false, value, ...props }) => {
  const id = useId(name)
  const [ value_, setValue ] = React.useState(value);
  props.onChange = e => setValue(e.target.value);
  props.value = value_;
  return <>
    <label htmlFor={id}>{label}</label>
    {textArea ? <textarea id={id} name={name} {...props} /> : 
                <input id={id} name={name} {...props} />}
  </>
}

const AnnotationEditor = ({ metaUrl, localName='regions' }) => {
  const { wavesurfer: ws } = useWavesurfer();
  const [ regions, setRegions ] = React.useState(null);
  const [ selected, setSelected ] = React.useState(null);
  // const selected = regions && i != null  && regions[i];
  React.useEffect(() => (() => { console.log('asdjfkasdfkjashdfkj') }), [])

  // query regions data
  React.useEffect(() => {
    const saved = localStorage[localName] ? JSON.parse(localStorage[localName]) : null;
    const set = rs => {
      setRegions(rs.map(r => { 
        r.color = randomColor(0.25); 
        return r;
      }));
    }
    if(saved) {
      console.log('loading regions from localstorage:', saved)
      set(saved);
      return;
    }
    fetch(metaUrl).then(r => r.json()).then(d => set(d)).then(console.log).catch(console.error)
  }, [ metaUrl ]);

  // Play on click, loop on shift click
  useEvent(ws, 'region-click', (region, e) => { 
    console.log(region, e);
    e.stopPropagation(); e.shiftKey ? region.playLoop() : region.play(); 
  })
  useEvent(ws, 'region-play', (r) => {
      r.once('out', () => { ws.play(r.start).then(() => ws.pause()) });
  });
  // auto-save
  useEvent(ws, 'region-update-end', () => saveRegions(ws, localName));
  // useEvent(ws, 'region-updated', () => saveRegions(ws));
  useEvent(ws, 'region-removed', !!regions && (() => saveRegions(ws, localName)));  // FIXME

  // select
  useEvent(ws, 'region-in', r => setSelected(r));
  useEvent(ws, 'region-out', r => setSelected(null));

  return <div>
    <RegionsPlugin regions={regions} {...regionProps}>
      {regions && regions.map((r, i) => <Region key={i} {...r} />)}
    </RegionsPlugin>

    {selected && selected.data.note && <p style={{
      color: 'red', fontSize: 'large',
    }}>{selected.data.note}</p>}

    {selected && (<>
      <form onSubmit={e => { e.preventDefault() }}>
        <LabeledInput label='Begin' value={Math.round(selected.start * 100) / 100} onBlur={
          e => selected && selected.update({ start: e.target.value })} />
        <LabeledInput label='End' value={Math.round(selected.end * 100) / 100} onBlur={
          e => selected && selected.update({ end: e.target.value })} />
        <LabeledInput label='Note' textArea value={selected.data.note} onBlur={e => 
            selected && selected.update({ data: { note: e.target.value } })} />
      </form>

      <button onClick={() => saveRegions(ws)}>Save Region</button>
      <button onClick={() =>  {
        if (selected) {
            const i = ws.regions.list.indexOf(selected);
            if(i >= 0) { ws.regions.list[i].remove(); setSelected(null) }
        }
      }}>Delete Region</button>

    </>)}
    <button onClick={() => {
      window.open('data:application/json;charset=utf-8,'+encodeURIComponent(localStorage[localName]));
    }}>Export</button>
    <button onClick={() => { localStorage[localName] = null; }}>Reset</button>
  </div>
}

/**
 * Save annotations to localStorage.
 */
const saveRegions = (ws, localName='regions') => {
  // console.log('saving regions', ws.regions.list)
  localStorage[localName] = JSON.stringify(
      Object.values(ws.regions.list).map(({ start, end, data, attributes }) => 
        ({ start, end, data, attributes })));
}

const randomColor = (alpha) => {
  return ('rgba(' + [ ~~(Math.random() * 255), ~~(Math.random() * 255), ~~(Math.random() * 255), alpha || 1] + ')');
}


const WavesurferProps = {
  // height: 100,
  pixelRatio: 1,
  minPxPerSec: 100,
  scrollParent: true,
  normalize: true,
  minimap: true,
  // splitChannels: false,
  backend: 'MediaElement',
}


const minimapProps = {
  height: 30,
  waveColor: '#ddd',
  progressColor: '#999'
}


const regionProps = {
  dragSelection: { color: randomColor(0.25) }
}


export const Annotator = ({ ...props }) => {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <Container>
        <Wavesurfer url={annotatedAudioUrl} peaks={annotatedAudioPeaksUrl} {...WavesurferProps} {...props} normalize xhr={{mode: 'no-cors'}}>
          <TimelinePlugin />
          <CursorPlugin />
          <MinimapPlugin {...minimapProps} />
          <AudioControlButtons />
          <AnnotationEditor localName='audioAnnotatorRegions' metaUrl={audioMetaUrl} />
        </Wavesurfer>
      </Container>
    </div>
  )
}


export const VideoAnnotator = ({ ...props }) => {
  const [ videoRef, setVideoRef ] = React.useState(null);
  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <video ref={setVideoRef} src={annotatedVideoUrl} width="100%" />
      <Container>
        <Wavesurfer url={videoRef} {...WavesurferProps} {...props}>
          <TimelinePlugin />
          <CursorPlugin />
          <MinimapPlugin {...minimapProps} />
          <AudioControlButtons />
          <AnnotationEditor localName='videoAnnotatorRegions' metaUrl={videoMetaUrl} />
        </Wavesurfer>
      </Container>
    </div>
  )
}
VideoAnnotator.args = {};
