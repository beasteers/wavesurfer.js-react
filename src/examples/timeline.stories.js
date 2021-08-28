import Wavesurfer from '../index';
import { TimelinePlugin } from '../plugins';
import { Container, AudioControlButtons, audioUrl } from './share';

export default {
    title: 'Timeline',
    component: TimelinePlugin,
    // argTypes: {},
};

const WavesurferProps = {
  waveColor: 'violet',
  progressColor: 'purple',
  loaderColor: 'purple',
  cursorColor: 'navy',
}

export const Timeline = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps} {...props}>
        <TimelinePlugin {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}
Timeline.args = { ...TimelinePlugin.defaultProps };


export const TimelineNotches = ({ ...props }) => {
  return (
    <Container>
      <Wavesurfer url={audioUrl} {...WavesurferProps} {...props}>
        <TimelinePlugin {...props} />
        <AudioControlButtons />
      </Wavesurfer>
    </Container>
  )
}

/**
 * Use formatTimeCallback to style the notch labels as you wish, such
 * as with more detail as the number of pixels per second increases.
 *
 * Here we format as M:SS.frac, with M suppressed for times < 1 minute,
 * and frac having 0, 1, or 2 digits as the zoom increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override timeInterval, primaryLabelInterval and/or
 * secondaryLabelInterval so they all work together.
 *
 * @param: seconds
 * @param: pxPerSec
 */
 function formatTimeCallback(sec, pxPerSec) {
  sec = Number(sec);
  const min = Math.floor(sec / 60);
  sec = sec % 60;

  // fill up seconds with zeroes
  const secondsStr = (
    pxPerSec >= 25 * 10 ? sec.toFixed(2) : 
    pxPerSec >= 25 * 1 ? sec.toFixed(1) : 
    Math.round(sec).toString());
  return min > 0 ? `${min}:${sec<10?'0':''}${secondsStr}` : secondsStr;
}

/**
* Use timeInterval to set the period between notches, in seconds,
* adding notches as the number of pixels per second increases.
*
* Note that if you override the default function, you'll almost
* certainly want to override formatTimeCallback, primaryLabelInterval
* and/or secondaryLabelInterval so they all work together.
*
* @param: pxPerSec
*/
const timeInterval = (pxPerSec) => {
  if (pxPerSec >= 25 * 100) { return 0.01; }
  else if (pxPerSec >= 25 * 40) { return 0.025; }
  else if (pxPerSec >= 25 * 10) { return 0.1; }
  else if (pxPerSec >= 25 * 4) { return 0.25; }
  else if (pxPerSec >= 25) { return 1; }
  else if (pxPerSec * 5 >= 25) { return 5; }
  else if (pxPerSec * 15 >= 25) { return 15; }
  return Math.ceil(0.5 / pxPerSec) * 60;
}

/**
* Return the cadence of notches that get labels in the primary color.
* EG, return 2 if every 2nd notch should be labeled,
* return 10 if every 10th notch should be labeled, etc.
*
* Note that if you override the default function, you'll almost
* certainly want to override formatTimeCallback, primaryLabelInterval
* and/or secondaryLabelInterval so they all work together.
*
* @param pxPerSec
*/
const primaryLabelInterval = (pxPerSec) => {
  if (pxPerSec >= 25 * 100) { return 10; } 
  else if (pxPerSec >= 25 * 40) { return 4; } 
  else if (pxPerSec >= 25 * 10) { return 10; } 
  else if (pxPerSec >= 25 * 4) { return 4; } 
  else if (pxPerSec >= 25) { return 1; } 
  else if (pxPerSec * 5 >= 25) { return 5; } 
  else if (pxPerSec * 15 >= 25) { return 15; } 
  return Math.ceil(0.5 / pxPerSec) * 60;
}

/**
* Return the cadence of notches to get labels in the secondary color.
* EG, return 2 if every 2nd notch should be labeled,
* return 10 if every 10th notch should be labeled, etc.
*
* Secondary labels are drawn after primary labels, so if
* you want to have labels every 10 seconds and another color labels
* every 60 seconds, the 60 second labels should be the secondaries.
*
* Note that if you override the default function, you'll almost
* certainly want to override formatTimeCallback, primaryLabelInterval
* and/or secondaryLabelInterval so they all work together.
*
* @param pxPerSec
*/
const secondaryLabelInterval = (pxPerSec) => (
  Math.floor(10 / timeInterval(pxPerSec))) // draw one every 10s as an example


TimelineNotches.args = { 
  ...Timeline.args,
  formatTimeCallback: formatTimeCallback,
  timeInterval: timeInterval,
  primaryLabelInterval: primaryLabelInterval,
  secondaryLabelInterval: secondaryLabelInterval,
  primaryColor: 'blue',
  secondaryColor: 'red',
  primaryFontColor: 'blue',
  secondaryFontColor: 'red'
};