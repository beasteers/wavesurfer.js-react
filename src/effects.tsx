import { useState, useEffect, useMemo } from "react";
import { useDeepMemo, useEvent, useWavesurfer } from './utils';


// https://developer.mozilla.org/en-US/docs/Web/API/PannerNode
interface PannerNodeParams {
    coneInnerAngle?: number;
    coneOuterAngle?: number;
    coneOuterGain?: number;
    distanceModel?: string;
    maxDistance?: number;
    orientationX?: number;
    orientationY?: number;
    orientationZ?: number;
    panningModel?: number;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    refDistance?: number;
    rolloffFactor?: number;
}


export const usePanner = (props: PannerNodeParams={}) => {
    const { wavesurfer: ws } = useWavesurfer();
    const [ panner, setPanner ] = useState(null);
    const [ ready, setReady ] = useState(ws && ws._isReady);
    useEvent(ws, 'ready', () => { setReady(true) });
    useEffect(() => {
        if(!ws || !ready) return;
        const panner = ws.backend.ac.createPanner();
        setPanner(panner);
        ws.backend.setFilter(panner); // this erases other filters ???
        // investigate: https://wavesurfer-js.org/api/file/src/webaudio.js.html#lineNumber208
        return () => {  };
    }, [ws, ready]);
    props = useDeepMemo(props);
    useEffect(() => {
        if(!panner) return;
        for(let [ k, v ] of Object.entries(props)) {
            if(panner[k].value !== v) panner[k].value = v;
        }
    }, [ panner, props ]);
    return panner;
}

export const useEQ = (EQ: object[]) => {
    const { wavesurfer: ws } = useWavesurfer();
    const ac = ws && ws.backend && ws.backend.ac;
    const n = EQ.length;
    const filters = useMemo(() => ac ? [...Array(n).keys()].map(i => ac.createBiquadFilter()) : [], [ac, n])
    useEffect(() => {
        for(let i in filters) {
            const f = filters[i];
            const p = EQ[i];
            f.frequency.value = p.f;
            f.type = p.type || 'peaking';
            f.gain.value = ~~(p.gain || 0);
            f.Q.value = p.Q || 1;
            f.detune.value = p.detune || 0;
        }
    }, [ac, filters, EQ])
    return filters;
}

export const useImpulseResponse =(url: string | number[]) => {
    const { wavesurfer: ws } = useWavesurfer();
    const ac = ws && ws.backend && ws.backend.ac;
    const [ hasIR, setHasIR ] = useState(false);
    const convolver = useMemo(() => ac && ac.createConvolver(), [ ac ])

    useEffect(() => {
        if(!ac || !convolver) return;
        if(url && typeof url == 'string') {
            fetch(url)
                // .then(x => { console.log(x); return x })
                .then(r => r.arrayBuffer())
                .then(x => ac.decodeAudioData(x))
                .then(x => { convolver.buffer = x; setHasIR(true); })
        }
        else {
            convolver.buffer = url || null;
            setHasIR(!!convolver.buffer);
        }
    }, [ ac, url, convolver ]);
    return hasIR ? convolver : null;
}

// export const useDistortion = (curve: number[], oversample='none') => {
//     const { wavesurfer: ws } = useWavesurfer();
//     const ac = ws && ws.backend && ws.backend.ac;
//     const filt = useMemo(() => ac && ac.createConvolver(), [ ac ])
//     useEffect(() => { filt && (filt.curve = curve) }, [ filt, curve ]);
//     useEffect(() => { filt && (filt.oversample = oversample) }, [ filt, oversample ]);
// }

// // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper#example
// function exampleDistortionCurve(n: number=50, n_samples=44100) {
//     const curve = new Float32Array(n_samples);
//     for (let i = 0; i < n_samples; ++i ) {
//       let x = i * 2 / n_samples - 1;
//       curve[i] = ( 3 + n ) * x * 20 * (Math.PI/180) / ( Math.PI + n * Math.abs(x) );
//     }
//     return curve;
// };


export const useFilters = (filters: any[]) => {
    const { wavesurfer: ws } = useWavesurfer();
    const backend = ws && ws.backend
    useEffect(() => {
        backend && backend.setFilters(filters.filter(x=>x));
    }, [ backend, filters ]) // FIXME ??
}