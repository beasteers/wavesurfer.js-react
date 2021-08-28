import React, { useState, useEffect, useCallback } from "react";
import styled from 'styled-components';
import WaveSurfer_ from "wavesurfer.js";

import { useId, useWavesurfer, WSContext, validWs, useDeepMemo, useEvent } from './utils';


export { useWavesurfer };

const WavesurferDiv = styled.div`
    position: relative;
    width: 100%;
    & > * {
        width: 100%;
    }
`;


interface SplitChannelOptions {
    overlay?: boolean;
    channelColors?: object;
    filterChannels?: Array<number>;
    relativeNormalization?: boolean;
}

// type MediaType = "audio" | "video";
// type Backend = 'WebAudio'|'MediaElement'|'MediaElementWebAudio';

interface WaveSurferProps {

    url?: string;
    blob?: any;
    peaks?: any;
    preload?: string;
    volume?: number;
    mute?: boolean;
    // playbackRate?: number;
    playEnd?: number;
    filteredChannels?: any;
    zoom?: number;

    /* core wavesurfer.js props */

    /** Speed at which to play audio. Lower number is slower. */
    audioRate?: number;
    /** Use your own previously initialized AudioContext or leave blank. */
    audioContext?: AudioContext | null;
    // /** Use your own previously initialized ScriptProcessorNode or leave blank. */
    // audioScriptProcessor: ScriptProcessorNode | undefined;
    /** If a scrollbar is present, center the waveform on current progress */
    autoCenter?: boolean;
    autoCenterRate?: number;
    autoCenterImmediately?: boolean;
    /** 'WebAudio'|'MediaElement'|'MediaElementWebAudio' In most cases you don't have to set this manually. 
     * MediaElement is a fallback for unsupported browsers. MediaElementWebAudio allows to use WebAudio API 
     * also with big audio files, loading audio like with MediaElement backend (HTML5 audio tag). You have 
     * to use the same methods of MediaElement backend for loading and playback, giving also peaks, so the 
     * audio data are not decoded. In this way you can use WebAudio features, like filters, also with audio 
     * with big duration. For example: wavesurfer.load(url | HTMLMediaElement, peaks, preload, duration); 
     * wavesurfer.play(); wavesurfer.setFilter(customFilter); */
    backend?: string;
    /** Change background color of the waveform container. */
    backgroundColor?: string | null;
    /** The optional spacing between bars of the wave, if not provided will be calculated in legacy format. */
    barGap?: number | null;
    /** The height of the wave bars. */
    barHeight?: number;
    /** The radius of the wave bars. Makes bars rounded */
    barRadius?: number;
    /** Draw the waveform using bars. */
    barWidth?: number;
    /** If specified, draw at least a bar of this height, eliminating waveform gaps */
    barMinHeight?: number;
    /** Close and nullify all audio contexts when the destroy method is called. */
    closeAudioContext?: boolean;
    /** The fill color of the cursor indicating the playhead position. */
    cursorColor?: string;
    /** Measured in pixels. */
    cursorWidth?: number;
    /** Optional audio length so pre-rendered peaks can be display immediately for example. */
    duration?: number;
    dragSelection?: boolean;
    /** Whether to fill the entire container or draw only according to minPxPerSec. */
    fillParent?: boolean;
    /** Force decoding of audio using web audio when zooming to get a more detailed waveform. */
    forceDecode?: boolean;
    /** The height of the waveform. Measured in pixels. */
    height?: number;
    /** Whether to hide the horizontal scrollbar when one would normally be shown. */
    hideScrollbar?: boolean;
    /** Whether the mouse interaction will be enabled at initialization. You can switch this parameter at any time later on. */
    interact?: boolean;
    ignoreSilenceMode?: boolean;
    /** (Use with regions plugin) Enable looping of selected regions */
    loopSelection?: boolean;
    /** Maximum width of a single canvas in pixels, excluding a small overlap (2 * pixelRatio, rounded up to 
     * the next even integer). If the waveform is longer than this value, additional canvases will be used to 
     * render the waveform, which is useful for very large waveforms that may be too wide for browsers to draw 
     * on a single canvas. */
    maxCanvasWidth?: number;
    /** (Use with backend MediaElement or MediaElementWebAudio) this enables the native controls for the media element */
    mediaControls?: boolean;
    mediaContainer?: any;
    /** (Use with backend MediaElement or MediaElementWebAudio) 'audio'|'video' ('video' only for MediaElement) */
    mediaType?: string;
    /** Minimum number of pixels per second of audio. */
    minPxPerSec?: number;
    /** If true, normalize by the maximum peak instead of 1.0. */
    normalize?: boolean;
    /** Use the PeakCache to improve rendering speed of large waveforms */
    partialRender?: boolean;
    /** The pixel ratio used to calculate display */
    pixelRatio?: number;
    /** The fill color of the part of the waveform behind the cursor. When progressColor and waveColor are the 
     * same the progress wave is not rendered at all. */
    progressColor?: string;
    /** Set to false to keep the media element in the DOM when the player is destroyed. This is useful when 
     * reusing an existing media element via the loadMediaElement method. */
    removeMediaElementOnDestroy?: boolean;
    /** Can be used to inject a custom renderer. */
    renderer?: any;
    /** If set to true resize the waveform, when the window is resized. This is debounced with a 
     * 100ms timeout by default. If this parameter is a number it represents that timeout. */
    responsive?: boolean | number;
    /** If set to true, renders waveform from right-to-left. */
    rtl?: boolean;
    /** Whether to scroll the container with a lengthy waveform. Otherwise the waveform is shrunk to 
     * the container width (see fillParent). */
    scrollParent?: boolean;
    /** Number of seconds to skip with the skipForward() and skipBackward() methods. */
    skipLength?: number;
    /** Render with separate waveforms for the channels of the audio */
    splitChannels?: boolean;
    /** Options for splitChannel rendering */
    splitChannelsOptions?: SplitChannelOptions;
    /** Render the waveform vertically instead of horizontally. */
    vertical?: boolean;
    /** The fill color of the waveform after the cursor. */
    waveColor?: string;
    /** XHR options. For example: let xhr = { cache: 'default', mode: 'cors', method: 'GET', 
     * credentials: 'same-origin', redirect: 'follow', referrer: 'client', requestHeaders: [ 
     * { key: 'Authorization', value: 'my-token' } ] }; */
    xhr?: object | null;

    // Events: https://wavesurfer-js.org/docs/events.html
    onAudioprocess?: Function;
    onDblclick?: Function;
    onDestroy?: Function;
    onError?: Function;
    onFinish?: Function;
    onInteraction?: Function;
    onLoading?: Function;
    onMute?: Function;
    onPause?: Function;
    onPlay?: Function;
    onReady?: Function;
    onScroll?: Function;
    onSeek?: Function;
    onVolume?: Function;
    onWaveform?: Function;
    onZoom?: Function;
};

// set using e.g. getHeight setHeight
const wsDeclarativeSet = (ws: WaveSurfer_, name: string, value: any) => {
    if(value !== undefined && validWs(ws) && ws['get'+name]() !== value) {
        const old = ws['get'+name]()
        ws['set'+name](value);
        // console.log('called', 'set'+name, old, ws['get'+name](), value)
        return true;
    }
    return false;
};

// set top level ws param values
const wsParamsSet = (ws: WaveSurfer_, key: string, value: any) => {
    if(ws && value !== undefined && ws.params[key] !== value) {
        ws.params[key] = value;
        return true;
    }
    return false;
}

// set nested ws param values
const wsParamsNestedSet = (ws: WaveSurfer_, key: string, value: any) => {
    if(ws && value !== undefined && ws.params[key] !== value) {
        ws.params[key] = Object.assign({}, ws.defaultParams[key] || {}, value);
        return true;
    }
    return false;
}

const WaveSurfer: React.FC<WaveSurferProps> = ({ ...props }) => {
    const { 
        url, peaks, blob, preload, duration,
        children, 
        volume, mute,  audioRate, 
        playEnd, filteredChannels, zoom,
        backgroundColor, cursorColor, progressColor, waveColor, height, cursorWidth,
        // params
        skipLength, interact, forceDecode, minPxPerSec, ignoreSilenceMode, xhr, removeMediaElementOnDestroy,
        splitChannels, splitChannelsOptions, loopSelection, autoCenterRate,
        // drawer params
        barGap, barWidth: barWidth_, barHeight, barRadius, barMinHeight, autoCenter, autoCenterImmediately,
        // redraw
        scrollParent, fillParent, normalize, pixelRatio,
        // events  
        onAudioprocess, onDblclick, onDestroy, onError, onFinish, onInteraction, onLoading, 
        onMute, onPause, onPlay, onReady, onScroll, onSeek, onVolume, onWaveform, onZoom,
        ...initProps } = props
    const barWidth = barWidth_ || null;

    const id = useId('wavesurfer');
    const [ ws, setWs ] = useState(null);
    const initProps_ = useDeepMemo(initProps);
    useEffect(() => {
        const ws = id && WaveSurfer_.create({ ...props, container: '#' + id });
        console.log('Recreated', ws)
        setWs(ws);
        return () => { window && ws.destroy() };
    }, [ id, initProps_ ]);

    const [ loaded, setLoaded ] = useState(null);
    useEvent(ws, 'ready', () => {
        setLoaded((new Date()).getTime())
    })

    // params used by wavesurfer 
    useEffect(() => { wsParamsSet(ws, 'autoCenterRate', autoCenterRate) }, [ws, autoCenterRate]);
    useEffect(() => { wsParamsSet(ws, 'forceDecode', forceDecode) }, [ws, forceDecode]);
    useEffect(() => { wsParamsSet(ws, 'ignoreSilenceMode', ignoreSilenceMode) }, [ws, ignoreSilenceMode]);
    useEffect(() => { wsParamsSet(ws, 'interact', interact) }, [ws, interact]);
    useEffect(() => { wsParamsSet(ws, 'loopSelection', loopSelection) }, [ws, loopSelection]);
    useEffect(() => { wsParamsSet(ws, 'removeMediaElementOnDestroy', removeMediaElementOnDestroy) }, [ws, removeMediaElementOnDestroy]);
    useEffect(() => { wsParamsSet(ws, 'skipLength', skipLength) }, [ws, skipLength]);
    useEffect(() => { wsParamsSet(ws, 'xhr', xhr) }, [ws, xhr]);

    // params used by wavesurfer that require redraw
    const setDraw = (ws: WaveSurfer_, k: string, v: any) => { wsParamsSet(ws, k, v) && ws.drawBuffer() };
    const setNestedDraw = (ws: WaveSurfer_, k: string, v: any) => { wsParamsNestedSet(ws, k, v) && ws.drawBuffer() };
    useEffect(() => { setDraw(ws, 'minPxPerSec', minPxPerSec) }, [ws, minPxPerSec]);
    useEffect(() => { setDraw(ws, 'pixelRatio', pixelRatio) }, [ws, pixelRatio]);
    useEffect(() => { setDraw(ws, 'cursorWidth', cursorWidth) }, [ws, cursorWidth]);
    useEffect(() => { setDraw(ws, 'scrollParent', scrollParent) }, [ws, scrollParent]);
    useEffect(() => { setDraw(ws, 'fillParent', fillParent) }, [ws, fillParent]);
    useEffect(() => { setDraw(ws, 'normalize', normalize) }, [ws, normalize]);
    useEffect(() => { setDraw(ws, 'splitChannels', splitChannels) }, [ws, splitChannels]);
    const splitChannelsOptions_ = useDeepMemo(splitChannelsOptions);
    useEffect(() => { setNestedDraw(ws, 'splitChannelsOptions', splitChannelsOptions_) }, [ws, splitChannelsOptions_]);

    // params used by wavesurfer.drawer
    useEffect(() => { setDraw(ws, 'barGap', barGap) }, [ws, barGap]);
    useEffect(() => { setDraw(ws, 'barWidth', barWidth) }, [ws, barWidth]);
    useEffect(() => { setDraw(ws, 'barHeight', barHeight) }, [ws, barHeight]);
    useEffect(() => { if(wsParamsSet(ws, 'barRadius', barRadius)) { ws.drawer.barRadius = barRadius; ws.drawBuffer() } }, [ws, barRadius]);
    useEffect(() => { setDraw(ws, 'barMinHeight', barMinHeight) }, [ws, barMinHeight]);
    useEffect(() => { setDraw(ws, 'autoCenter', autoCenter) }, [ws, autoCenter]);
    useEffect(() => { setDraw(ws, 'autoCenterImmediately', autoCenterImmediately) }, [ws, autoCenterImmediately]);

    // getter/setters provided by wavesurfer
    useEffect(() => { validWs(ws) && zoom !== undefined && ws.zoom(zoom) }, [ws, zoom])
    useEffect(() => { wsDeclarativeSet(ws, 'Volume', volume) }, [ws, volume]);
    useEffect(() => { wsDeclarativeSet(ws, 'Mute', mute) }, [ws, mute]);
    useEffect(() => { wsDeclarativeSet(ws, 'Height', height) }, [ws, height]);
    useEffect(() => { wsDeclarativeSet(ws, 'PlayEnd', playEnd) }, [ws, playEnd]);
    useEffect(() => { wsDeclarativeSet(ws, 'PlaybackRate', audioRate) }, [ws, audioRate]);
    useEffect(() => { wsDeclarativeSet(ws, 'WaveColor', waveColor) }, [ws, waveColor]);
    useEffect(() => { wsDeclarativeSet(ws, 'CursorColor', cursorColor) }, [ws, cursorColor]);
    useEffect(() => { wsDeclarativeSet(ws, 'ProgressColor', progressColor) }, [ws, progressColor]);
    useEffect(() => { wsDeclarativeSet(ws, 'BackgroundColor', backgroundColor) }, [ws, backgroundColor]);
    useEffect(() => { wsDeclarativeSet(ws, 'FilteredChannels', filteredChannels) }, [ws, filteredChannels]);

    // load audio
    useEffect(() => { 
        if(!(validWs(ws) && url)) return;
        if(peaks && typeof peaks == 'string') {
            console.log('load peaks', peaks)
            fetch(peaks).then(r=>r.json()).then(peaks => {
                ws.load(url, peaks, preload, duration); 
                console.log('load', url, peaks)
            })
        } else {
            ws.load(url, peaks, preload, duration); 
            console.log('load', url) 
        }
    }, [ws, url])
    // useEffect(() => { ws && blob && ws.loadBlob(blob) }, [ws, blob])

    // wavesurfer events
    useEvent(ws, 'audioprocess', onAudioprocess, { receiveRef: true });
    useEvent(ws, 'dblclick', onDblclick, { receiveRef: true });
    useEvent(ws, 'destroy', onDestroy, { receiveRef: true });
    useEvent(ws, 'error', onError, { receiveRef: true });
    useEvent(ws, 'finish', onFinish, { receiveRef: true });
    useEvent(ws, 'interaction', onInteraction, { receiveRef: true });
    useEvent(ws, 'loading', onLoading, { receiveRef: true });
    useEvent(ws, 'mute', onMute, { receiveRef: true });
    useEvent(ws, 'pause', onPause, { receiveRef: true });
    useEvent(ws, 'play', onPlay, { receiveRef: true });
    useEvent(ws, 'ready', onReady, { receiveRef: true });
    useEvent(ws, 'scroll', onScroll, { receiveRef: true });
    useEvent(ws, 'seek', onSeek, { receiveRef: true });
    useEvent(ws, 'volume', onVolume, { receiveRef: true });
    useEvent(ws, 'waveform', onWaveform, { receiveRef: true });
    useEvent(ws, 'zoom', onZoom, { receiveRef: true });



    return <WSContext.Provider value={{ wavesurfer: ws, loaded }}>
        <WavesurferDiv id={id}></WavesurferDiv>
        {ws && typeof children == 'function' ? children(ws) : children}
    </WSContext.Provider>
}

const internalWavesurferDefaults: WaveSurferProps = {
    audioRate: 1,
    autoCenter: true,
    autoCenterRate: 5,
    autoCenterImmediately: false,
    backend: 'WebAudio',
    // backgroundColor: null,
    barGap: 0,
    barWidth: 0,
    barHeight: 1,
    barRadius: 0,
    barMinHeight: 0,

    cursorColor: '#333',
    cursorWidth: 1,
    dragSelection: true,

    // drawingContextAttributes: {
    //   // Boolean that hints the user agent to reduce the latency
    //   // by desynchronizing the canvas paint cycle from the event
    //   // loop
    //   desynchronized: false
    // },
    // duration: null,
    fillParent: true,
    forceDecode: false,
    height: 128,
    hideScrollbar: false,
    ignoreSilenceMode: false,
    interact: true,
    loopSelection: true,
    maxCanvasWidth: 4000,
    mediaContainer: null,
    mediaControls: false,
    // mediaType: 'audio',
    minPxPerSec: 20,
    normalize: false,
    partialRender: false,
    // pixelRatio: window.devicePixelRatio || screen.deviceXDPI / screen.logicalXDPI,
    progressColor: '#555',
    removeMediaElementOnDestroy: true,
    // renderer: _drawer.default,
    responsive: false,
    rtl: false,
    scrollParent: false,
    skipLength: 2,
    splitChannels: false,
    splitChannelsOptions: {
      overlay: false,
      channelColors: {},
      filterChannels: [],
      relativeNormalization: false
    },
    vertical: false,
    waveColor: '#999',
    xhr: {},
};

WaveSurfer.defaultProps = {
    ...internalWavesurferDefaults,
    responsive: 300,
    // zoom: 1,
};

export default WaveSurfer;
