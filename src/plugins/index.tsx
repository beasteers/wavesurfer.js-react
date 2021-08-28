import React, { useState, useEffect, useContext } from "react";
import styled from 'styled-components';

import { PluginClass } from "wavesurfer.js";
import SpectrogramPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min";
import TimelinePlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MinimapPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.minimap.min";
import CursorPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
// import PlayheadPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.playhead.min";
import RegionsPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import MarkersPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.markers.min";
import MediaSessionPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.mediasession.min";
import MicrophonePlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min";
import ElanPlugin_ from "wavesurfer.js/dist/plugin/wavesurfer.elan.min";

import { useId, useDeepMemo, useColormap, useEvent, useBlobUrl, objChanges, useWavesurfer, validWs } from '../utils';



const SpectrogramDiv = styled.div`
    width: 100%;
    & spectrogram canvas {
        left: 0;
    }
`;

const TimelineDiv = styled.div`
    width: 100%;
`;

const MinimapDiv = styled.div`
    width: 100%;
`;

const ElanDiv = styled.div`
    width: 100%;
`;




// Plugins

const usePlugin = (PluginClass: PluginClass, options: object=null): any => {
    const { wavesurfer: ws } = useWavesurfer();
    const [ plugin, setPlugin ] = useState(null);
    options = options || null;
    useEffect(() => {
        if(!ws || !PluginClass) return;
        // create and initialize the plugin
        const plugin = PluginClass.create({ ...options, wavesurfer: ws });
        setPlugin(plugin)
        ws.addPlugin(plugin).initPlugin(plugin.name);
        console.log('added plugin', options, plugin)
        // destructor for the plugin
        return () => 
            window && validWs(ws) && 
            ws[plugin.name] && 
            ws.initialisedPluginList[plugin.name] && 
            ws.destroyPlugin(plugin.name);
    }, [ws, PluginClass, options])
    return ws && plugin && ws[plugin.name];
}

/** useEffect, except it doesn't fire when the first argument is not true and 
 * re-fires when the first arg changes. */
const useEffectIf = (required: any, effect: (() => void | undefined), dependencies: any[]=[]) => {
    const cb = required ? effect : () => {};
    useEffect(cb, [required, ...dependencies])
}




interface CustomShowTimeStyleParams { [index: string]: string | number}
interface CursorParams {
    /** Hide the cursor when the mouse leaves the waveform */
    hideOnBlur?: boolean;
    /** The width of the cursor */
    width?: string;
    /** The color of the cursor */
    color?: string;
    /** The opacity of the cursor */
    opacity?: string | number;
    /** The border style of the cursor */
    style?: string;
    /** The z-index of the cursor element */
    zIndex?: number;
    /** An object with custom styles which are applied to the cursor element */
    customStyle?: any;
    /** Show the time on the cursor. */
    showTime?: boolean;
    /** An object with custom styles which are applied to the cursor time element. */
    customShowTimeStyle?: CustomShowTimeStyleParams;
    /** Use true to make the time on the cursor follow the x and the y-position 
     * of the mouse. Use false to make the it only follow the x-position of the mouse. */
    followCursorY?: boolean;
    /** Formats the timestamp on the cursor. */
    formatTimeCallback?: Function;
}

export const CursorPlugin: React.FC<CursorParams> = (props) => {
    const options = useDeepMemo(props);
    usePlugin(CursorPlugin_, options);
    // all options are used in init() - need to recreate plugin
    //   except followCursorY, formatTimeCallback
    return null;
}
CursorPlugin.defaultProps = {
    width: '1px', color: 'black', opacity: '0.25', style: 'solid', zIndex: 4,
    customStyle: {}, customShowTimeStyle: {},
    showTime: false, formatTimeCallback: null,
    followCursorY: false, hideOnBlur: true,
}
// https://wavesurfer-js.org/api/typedef/index.html#static-typedef-CursorPluginParams







interface ElanTiers { [index: string]: boolean; }
interface ElanProps {
    /** The location of ELAN XML data */
    url?: string;
    /** the ELAN XML data as a string (overrides url) */
    xml?: string;
    /** If set only shows the data tiers with the TIER_ID in this object. */
    tiers?: ElanTiers;
    onReady?: Function;
    onSelect?: Function;
}
export const ElanPlugin: React.FC<ElanProps> = ({ url, xml, tiers, onReady, onSelect }) => {
    const id = useId('elan');
    url = useBlobUrl(xml) || url;
    const options = useDeepMemo({ container: '#' + id });
    const plugin = usePlugin(ElanPlugin_, options);
    useEffectIf(plugin, () => { plugin.load(url) }, [ url ])
    useEffectIf(plugin, () => { plugin.params.tiers = tiers }, [ tiers ])
    useEvent(plugin, 'ready', onReady);
    useEvent(plugin, 'select', onSelect);
    return <ElanDiv id={id}></ElanDiv>;
}
ElanPlugin.defaultProps = { url: null, tiers: null }





// const MarkersContext = React.createContext();
// const useMarkers = () => useContext(MarkersContext);

interface MarkersProps {}

export const MarkersPlugin: React.FC<MarkersProps> = ({ children, ...props }) => {
    const id = useId('markers');
    const options = useDeepMemo({ ...props, container: '#' + id });
    usePlugin(MarkersPlugin_, options);
    return <>{children}</>;
    // return <MarkersContext.Provider value={plugin}>{children}</MarkersContext.Provider>;
}

interface MarkerProps {
    time?: number;
    label?: string;
    color?: string;
    position?: string;
    markerElement?: any;
    element?: any;
}

export const Marker: React.FC<MarkerProps> = ({ element, ...props }) => {
    const { wavesurfer: ws } = useWavesurfer();
    if(!props.markerElement && element) props.markerElement = element;
    props = useDeepMemo(props);
    useEffect(() => {
        if(!validWs(ws) || props.time == null) return;
        let m: any;
        const id = setInterval(() => {
            if(ws && ws.markers && ws.markers.wrapper) { m = ws.markers.add(props); clearInterval(id) }
        }, 200)

        return () => {
            clearInterval(id);
            if(!m) return;
            const i = ws.markers.markers.indexOf(m);
            i >= 0 && validWs(ws) && ws.markers && ws.markers.remove(i);
        };
    }, [ws, props]);
    return null;
}






interface MediaSessionMetadataArtwork { src: string; sizes?: string; type?: string; }
interface MediaSessionMetadata {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: MediaSessionMetadataArtwork[];
}
interface MediaSessionProps { metadata?: MediaSessionMetadata }
export const MediaSessionPlugin: React.FC<MediaSessionProps> = ({ metadata }) => {
    // const options = useDeepMemo({ metadata });
    const plugin = usePlugin(metadata && MediaSessionPlugin_);
    const meta = useDeepMemo(metadata);
    useEffectIf(plugin, () => { plugin.metadata = meta; plugin.update() }, [ plugin, meta ])
    return null;
}
MediaSessionPlugin.defaultProps = { metadata: null }







// interface MicrophoneConstraints { audio: boolean; video: boolean; }
interface MicrophoneProps {
    bufferSize?: number;
    // constraints?: MicrophoneConstraints;
    audio: boolean; 
    video: boolean;
    numberOfInputChannels?: number;
    numberOfOutputChannels?: number;
    started?: boolean;
    running?: boolean;
    clears?: boolean;
    onReady?: Function;
    onError?: Function;
}

export const MicrophonePlugin: React.FC<MicrophoneProps> = ({ 
        started, running, bufferSize, audio, video, 
        numberOfInputChannels, numberOfOutputChannels,
        onReady, onError }) => {
    const { wavesurfer: ws } = useWavesurfer();
    const options = useDeepMemo({ bufferSize, constraints: {audio, video}, numberOfInputChannels, numberOfOutputChannels });
    const mic = usePlugin(MicrophonePlugin_, options);
    // useEffectIf(mic, () => { mic.constraints = {audio, video} }, [ audio, video ])
    // useEffectIf(mic, () => { mic.bufferSize = bufferSize || 4096 }, [ bufferSize ])
    // useEffectIf(mic, () => { mic.numberOfInputChannels = numberOfInputChannels || 1 }, [ numberOfInputChannels ])
    // useEffectIf(mic, () => { mic.numberOfOutputChannels = numberOfOutputChannels || 1 }, [ numberOfOutputChannels ])
    useEffect(() => {
        if(!mic || !started) return;
        mic.start();
        return () => mic.stopDevice();
    }, [ mic, started ]);
    useEffect(() => {
        if(!mic || !running) return;
        mic.play();
        return () => mic.pause();
    }, [ mic, running ]);
    useEvent(ws, 'deviceReady', onReady);
    useEvent(ws, 'deviceError', onError);
    return null;
}
MicrophonePlugin.defaultProps = {
    bufferSize: 4096,
    // constraints: { audio: true, video: false },
    audio: true, video: false,
    numberOfInputChannels: 1,
    numberOfOutputChannels: 1,
    started: true,
    running: true,
}









interface MinimapProps {
    showRegions?: boolean;
    regionsPluginName?: string;
    showOverview?: boolean;
    overviewBorderColor?: string;
    overviewBorderSize?: number;
    height?: number;
}
export const MinimapPlugin: React.FC<MinimapProps> = ({ showRegions, regionsPluginName, height, ...props }) => {
    const { wavesurfer: ws } = useWavesurfer();
    const id = useId('minimap');
    if(height) props.height = height;
    const options = useDeepMemo({ ...props, container: '#' + id });
    let plugin = usePlugin(MinimapPlugin_, options);
    // plugin = plugin && ws[plugin.name];
    useEffectIf(plugin, () => { plugin.params.showRegions = showRegions }, [ showRegions ])
    useEffectIf(plugin, () => { plugin.params.regionsPluginName = regionsPluginName || 'regions' }, [ regionsPluginName ])
    // useEffectIf(plugin && plugin.drawer && plugin.drawer.wrapper, () => { 
    //     console.log(height || Math.max(Math.round(ws.params.height / 4), 20))
    //     plugin.drawer.setHeight(height || Math.max(Math.round(ws.params.height / 4), 20)) 
    //     plugin.render();
    // }, [ ws, height ])
    return <MinimapDiv id={id}></MinimapDiv>;
}
MinimapPlugin.defaultProps = {
    showRegions: false,
    showOverview: false,
    overviewBorderColor: 'green',
    regionsPluginName: 'regions',
    overviewBorderSize: 2,
    // height: undefined,
}
// https://wavesurfer-js.org/api/typedef/index.html#static-typedef-MinimapPluginParams








// const PlayheadPlugin = (props) => {
//     const options = useDeepMemo(props);
//     usePlugin(PlayheadPlugin_, options);
//     return null;
// }
// PlayheadPlugin.defaultProps = {
//     returnOnPause: true,
//     moveOnSeek: true,
//     draw: true
// }








const RegionsContext = React.createContext(null);
const useRegions = () => useContext(RegionsContext);

interface RegionsProps {
    /** Enable creating regions by dragging with the mouse */
    dragSelection?: number; 
    /** (number) The sensitivity of the mouse dragging */
    slop?: number; 
    /** (number) Snap the regions to a grid of the specified multiples in seconds */
    snapToGridInterval?: number; 
    /** (number) Shift the snap-to-grid by the specified seconds. May also be negative. */
    snapToGridOffset?: number; 
    /** (number) Maximum number of regions that may be created by the user at one time. */
    maxRegions?: number; 
    /** (function) Allows custom formating for region tooltip. */
    formatTimeCallback?: number; 
    /** from container edges' Optional width for edgeScroll to start */
    edgeScrollWidth?: string;
    regions?: object[];
}

export const RegionsPlugin: React.FC<RegionsProps> = ({ children, ...props }) => {
    const id = useId('region');
    const options = useDeepMemo({ ...props, container: '#' + id });
    const plugin = usePlugin(RegionsPlugin_, options);
    // TODO
    return <RegionsContext.Provider value={plugin}>{children}</RegionsContext.Provider>;
}
RegionsPlugin.defaultProps = {
    dragSelection: null,
    slop: 2,
    snapToGridInterval: null,
    snapToGridOffset: null,
    maxRegions: null,
    formatTimeCallback: null,
    edgeScrollWidth: '5%',
}
// https://wavesurfer-js.org/api/typedef/index.html#static-typedef-RegionsPluginParams

const updatableRegionProps = [
    "start", "end", "loop", "color", "handleStyle", "data", "resize", 
    "drag", "maxLength", "minLength", "attributes" ];


export const Region: React.FC<any> = ({
    onOver, onLeave,
    onClick, onDoubleClick,
    onIn, onOut, onRemove,
    onUpdate, onUpdateEnd,
    ...props
}) => {
    // const regions = useRegions();
    const { wavesurfer: ws } = useWavesurfer();
    const [ region, setRegion ] = useState(null);

    useEffect(() => {
        if(!ws || !ws.regions) return;
        const r = ws.regions.list[props.id] || ws.addRegion(props)
        setRegion(r)
        return () => { r.remove() };
    }, [ ws ]);

    useEffect(() => {
        region && region.update(objChanges(updatableRegionProps, region, props));
    }, updatableRegionProps.map(k => props[k]));

    useEvent(region, "click", onClick);
    useEvent(region, "over", onOver);
    useEvent(region, "leave", onLeave);
    useEvent(region, "dbclick", onDoubleClick);
    useEvent(region, "in", onIn);
    useEvent(region, "out", onOut);
    useEvent(region, "remove", onRemove);
    useEvent(region, "update", onUpdate);
    useEvent(region, "update-end", onUpdateEnd);
    return null;
}




interface SpectrogramPluginOptions {
    /** The colormap to use. See https://www.npmjs.com/package/colormap for options. */
    cmap?: string;
    /** The fft window size. Must be a power of 2. */
    fftSamples?: number;
    /** Set to true to display frequency labels. */
    labels?: boolean;
    /** Size of the overlapping window. Must be < fftSamples. Auto deduced from canvas size by default. */
    noverlap?: number;
    /** The window function to be used. One of these: 'bartlett', 'bartlettHann', 'blackman', 
     * 'cosine', 'gauss', 'hamming', 'hann', 'lanczoz', 'rectangular', 'triangular' */
    windowFunc?: string;
    /** Some window functions have this extra value. (Between 0 and 1)  */
    alpha?: number;
    /**  */
    frequenciesDataUrl?: string;
}
export const SpectrogramPlugin: React.FC<SpectrogramPluginOptions> = ({ 
        fftSamples, cmap, alpha, windowFunc, noverlap, ...props }) => {
    const colors = useColormap(cmap);
    const id = useId('spectrogram');
    const options = useDeepMemo({ 
        fftSamples, colorMap: colors, alpha, windowFunc, noverlap, ...props, container: '#' + id });
    const plugin = usePlugin(SpectrogramPlugin_, options);
    
    // these are set in init, but seem to be overrideable. idk.
    // useEffectIf(plugin, () => { plugin.fftSamples = fftSamples; plugin.render() }, [fftSamples])
    // useEffectIf(plugin, () => { plugin.colorMap = colors; plugin.render() }, [colors])
    // useEffectIf(plugin, () => { plugin.alpha = alpha; plugin.render() }, [alpha])
    // useEffectIf(plugin, () => { plugin.windowFunc = windowFunc; plugin.render() }, [windowFunc])
    // useEffectIf(plugin, () => { plugin.noverlap = noverlap; plugin.render() }, [noverlap])
    return <SpectrogramDiv id={id}></SpectrogramDiv>;
}
SpectrogramPlugin.defaultProps = {
    cmap: null, 
    fftSamples: 512, 
    labels: false,
}






interface TimelineProps {
    /** the height (in pixels) of the timeline. The default is 20. */
    height?: number; 
    /** the height (in percent) of the minor notch lines in the timeline. The default is 90. */
    notchPercentHeight?: number; 
    /** number of intervals that records consists of. Usually it is equal to the duration in minutes. 
     * (Integer or function which receives pxPerSec value and reurns value) */
    timeInterval?: number; 
    /** number of primary time labels. (Integer or function which receives pxPerSec value and reurns value) */
    primaryLabelInterval?: number; 
    /** number of secondary time labels (Time labels between primary labels, integer or function which 
     * receives pxPerSec value and reurns value). */
    secondaryLabelInterval?: number; 
    /** offset (in seconds) for the start of the timeline. The value may also be negative and the default is 0. */
    offset?: number; 
    /** the color of the modulo-ten notch lines (e.g. 10sec, 20sec). The default is '#000'. */
    primaryColor?: string; 
    /** the color of the non-modulo-ten notch lines. The default is '#c0c0c0'. */
    secondaryColor?: string; 
    /** the colour of the labels next to the main notches (e.g. 10sec, 20sec). The default is '#000'. */
    primaryFontColor?: string; 
    /** the colour of the labels next to the secondary notches (e.g. 5sec, 15sec). The default is '#c0c0c0'. */
    secondaryFontColor?: string; 
    unlabeledNotchColor?: string;
    /** custom time format callback. (Function which receives number of seconds and returns formatted string) */
    formatTimeCallback?: Function;    
    labelPadding?: number; 
    fontFamily?: string;
    fontSize?: number;
    duration?: number;
    zoomDebounce?: false;
}

export const TimelinePlugin: React.FC<TimelineProps> = (props) => {
    const id = useId('timeline');
    const options = useDeepMemo({ ...props, container: '#' + id });
    usePlugin(TimelinePlugin_, options);
    return <TimelineDiv id={id}></TimelineDiv>;
}
TimelinePlugin.defaultProps = {
    height: 20,
    notchPercentHeight: 90,
    labelPadding: 5,
    offset: 0,
    // timeInterval: ,
    // primaryLabelInterval: ,
    // secondaryLabelInterval: ,
    primaryColor: '#000',
    secondaryColor: '#c0c0c0',
    primaryFontColor: '#000',
    secondaryFontColor: '#000',
    unlabeledNotchColor: '#c0c0c0',
    fontFamily: 'Arial',
    fontSize: 10,
    duration: null,
    zoomDebounce: false,
}








export const useImage = (url: string, { element=null }={}) => {
    const [ el, setEl ] = useState(null);
    useEffect(() => {
        if(!url) return;
        var img = element || new Image();
        img.src = url;
        img.onload = () => { setEl(img) }
    }, [ url ]);
    return el;
}