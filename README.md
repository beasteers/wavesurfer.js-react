# Wavesurfer.js-React

TODO:
 - Build Storybook and host on github pages
 - Make sure that type definitions are rendered
 - Test that the 

[Documentation]()

## Kitchen Sink Example

```jsx
import Wavesurfer, { useWavesurfer } from '..';
import { 
    CursorPlugin, 
    MinimapPlugin,
    MediaSessionPlugin,
    MarkersPlugin, Marker,
    RegionsPlugin, Region,
    SpectrogramPlugin,
    TimelinePlugin
} from '../plugins';

import styled from 'styled-components';

const ContainerDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    & > div {
        width: 100%;
        height: 100%;
    }
`;
const Container = ({ children, ...props }) => (
  <ContainerDiv {...props}><div>{children}</div></ContainerDiv>
)

export const KitchenSink = ({ url }) => {
    const wsProps = {
        barGap: 3,
        barWidth: 3,
        barHeight: 1,
        barRadius: 3,
    }
    const markers = [
        { time: 0, label: "BEGIN", color: '#ff990a' },
        { time: 5.5, label: "V1", color: '#ff990a' },
        { time: 12, position: "top", label: "V2" },
    ]
    const regions = [
        {start: 1, end: 3, loop: false, color: 'hsla(400, 100%, 30%, 0.5)' }, 
        {start: 5, end: 7, loop: false, color: 'hsla(200, 50%, 70%, 0.4)', minLength: 1}
    ]

    return (
        <Container>
            <Wavesurfer url={url} {...wsProps}>

            {/* Plugins */}

            <CursorPlugin showTime opacity={0.8} />
            <MinimapPlugin showOverview />
            <SpectrogramPlugin cmap='magma' />
            <TimelinePlugin />

            <MarkersPlugin>
                {markers && (markers.map((m, i) => m && <Marker key={i} {...m} />))}
            </MarkersPlugin>

            <RegionsPlugin>
                {regions.map((r, i) => <Region {...r} />)}
            </RegionsPlugin>

            <MediaSessionPlugin metadata={{
              metadata: {
                  title: 'Wavesurfer.js Example',
                  artist: 'The Wavesurfer.js Project',
                  album: 'Media Session Example',
                  artwork: [
                    {src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png'},
                    {src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png'},
                    {src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png'},
                    {src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png'},
                    {src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png'},
                    {src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png'},
                  ]
              }
          }} />

            {/* Control Buttons */}

            <Control onClick={ws => ws.playPause()}>Play / Pause</Control>
            <Control onClick={ws => ws.skipBackward()}>Back</Control>
            <Control onClick={ws => ws.skipForward()}>Forward</Control>
            <Control onClick={ws => ws.toggleMute()}>Toggle Mute</Control>
            <Control onClick={ws => ws.setMute(true)}>Mute</Control>
            <Control onClick={ws => ws.setMute(false)}>Unmute</Control>
            </Wavesurfer>
        </Container>
    )
}

const Control = ({ onClick, children }) => {
    const { wavesurfer: ws } = useWavesurfer();
    return <button onClick={(...args) => { ws && onClick && onClick(ws, ...args) }}>{children}</button>;
}
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
