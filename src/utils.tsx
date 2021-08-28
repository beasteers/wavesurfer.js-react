import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from "react";
import WaveSurfer_ from "wavesurfer.js";
import colormap from 'colormap';
import deepEqual from "fast-deep-equal/react";
import { any } from "micromatch";


export const validWs = (ws: WaveSurfer_ | undefined) => ws && !ws.isDestroyed

export const WSContext = React.createContext({ wavesurfer: null, loaded: null });
export const useWavesurfer = () => useContext(WSContext);



const randstr = () => (Math.random() + 0.0000006).toString(36).split('.').pop()
export const useId = (prefix: string='') => useMemo(() => (prefix||'id') + '-' + randstr(), [prefix])


export const logsError = (func: Function): Function => {
    return (...args: any): any => {
        try { return func(...args); }
        catch (e) { console.error(e); }
    }
}

interface dictobject { [key: string]: any; }
export const objChanges = (keys: Array<string>, src: dictobject, update: dictobject): dictobject => {
    const o: dictobject = {};
    for(let k of keys) {
        if(update[k] !== undefined && src[k] !== update[k]) {
            o[k] = update[k];
        }
    }
    return o;
}


// hooks

export const useDeepMemo = (next: any): any => {
    let ref = useRef(next);
    if(!deepEqual(ref.current, next)) {
        console.log('change', next, 'original', ref.current)
        ref.current = next;
    }
    return ref.current;
}

export const useColormap = (name: string | null): any => useMemo(() => name ? colormap({ 
    colormap: name, nshades: 256, format: 'float' 
}) : null, [ name ]);


// export const useEvent = (ref: any, event: string | null, callback: Function | null, { receiveRef=false }={}) => {
//     useEffect(() => {
//         if(!(ref && event && callback)) return;
//         // console.log(!!ref, event, callback)
//         const cb = receiveRef ? ((...args: any) => callback(ref, ...args)) : callback;
//         ref.on(event, cb);
//         return () => { ref.un(event, cb) };
//     }, [ ref, event, callback, receiveRef ]);
// }

// this way you don't have to worry about using useCallback since the callback is bound via ref.
export const useEvent = (ref: any, event: string | null, callback: Function | null, { receiveRef=false }={}) => {
    const cbref = useRef(null);
    cbref.current = callback;
    const hasCallback = !!callback;
    useEffect(() => {
        if(!(ref && event && hasCallback)) return;
        console.log('event', event)
        const cb = (...args: any) => { 
            console.log(event); 
            receiveRef ? cbref.current(ref, ...args) : cbref.current(...args)
        };
        const s=5||8
        ref.on(event, cb);
        return () => { console.log('removing event:', event);ref.un(event, cb) };
    }, [ ref, event, hasCallback, receiveRef ]);
}

// export const useReadyEvent = (ref: any, callback: Function | null, { key='isReady' }={}) => {
//     const onceRef = useRef(false);
//     const ready = ref && ref[key];
//     const cb = useCallback(() => {
//         if(onceRef.current) return;
//         callback();
//         onceRef.current = true;
//     }, [callback])
//     useEvent(ref, 'ready', !ready && cb, { receiveRef: true });
//     useEffect(() => { ready && cb() }, [ready, cb]);
// }


// export const usePeaks = (divisions: number=null) => {
//     const { wavesurfer: ws, loaded } = useWavesurfer();
//     const [ peaks, setPeaks ] = useState();
//     useEffect(() => {
//         setPeaks(ws && loaded && ws.isReady ? ws.backend.getPeaks(divisions) : null)
//     }, [ ws, loaded, divisions ])
//     return peaks;
// }


export const splitSilence = (peaks: Array<number>, duration: number, { minSeconds=0.25, minValue=0.0015 }={}) => {
    const length = peaks.length;
    const coef = duration / length;
    const minLen = minSeconds / coef;
    // Gather silence indices
    const silences = peaks.map((x, i) => Math.abs(x) <= minValue ? i : null).filter(x=>x!=null);
    // Cluster silence values
    // Filter silence clusters by minimum length
    const clusters = silences.reduce((cl, x, i) => {
        if (!i || x !== silences[i-1] + 1) { cl.push([]); }
        cl[cl.length - 1].push(x);
        return cl;
    }, []).filter(c => c.length >= minLen)
    // Create regions on the edges of silences
    const regions = clusters.map((c, i) => ({ 
      start: c[c.length-1], end: clusters[i+1] ? clusters[i+1][0] : length-1 
    }));
    // Add an initial region if the audio doesn't start with silence
    const first = clusters[0];
    if (first && first[0] !== 0) { 
      regions.unshift({ start: 0, end: first[first.length - 1] }); 
    }
    // Filter regions by minimum length
    // Return time-based regions
    return regions.filter((r) => r.end - r.start >= minLen).map((r) => ({
        start: Math.round(r.start * coef * 10) / 10,
        end: Math.round(r.end * coef * 10) / 10
    }));
}

// export const useOnceEvent = (ref: any, event: string | null, callback: Function | null) => {
//     useEffect(() => {
//         if(!(ref && event && callback)) return;
//         ref.once(event, callback);
//         return () => { ref.un(event, callback) };
//     }, [ref, event, callback]);
// }

export const useBlobUrl = (object: any, options: object | null=null): string | null => {
    const url = useMemo(() => 
        object ? URL.createObjectURL(new Blob([object], options || undefined)) : null, 
        [ object, options ])
    useEffect(() => (() => { url && URL.revokeObjectURL(url) }), [url]);
    return url
}


// class Promise2(Promise) {
//     constructor() {
//         super();
//     }
// }

// export const usePromise = () => {
//     const ref = useRef({ resolve: null, reject: null })
//     const promise = useMemo(() => (new Promise((resolve, reject) => {
//         promise.resolve = resolve;
//         promise.reject = reject;
//     })), [])
//     return [ promise, ref.current.resolve, ref.current.reject ];
// }


// export const useArrayRef = (xs: object[], key: Function) => {
//     const ref = useRef({ });

//     const currentRefKeys = Object.keys(ref.current);
//     const create = [];
//     const update = [];
//     const remove = [];
//     const same = [];
//     for(let i in xs) {
//         const k = key ? key(xs[i]) : i;
//         const i_src = currentRefKeys.indexOf(k)
//         if(i_src >= 0) {
//             if(xs[i] == ref.current[k]) {
//                 same.push(xs[i]);
//             } else {
//                 update.push([ ref.current[k], xs[i] ]);
//             }
//             currentRefKeys.splice(i_src, 1);
//         } else {
//             create.push(xs[i]);
//             ref.current[k] = xs[i];
//         }
//     }
//     for(let k of currentRefKeys) {
//         remove.push(ref.current[k]);
//         delete ref.current[k];
//     }
//     return [ create, update, remove, same, xs ];
// }

// const [ create, update, remove, same, xs ] = useArrayRef([
//     { f: 10 },
//     { f: 20 },
// ], (x=>x.f))