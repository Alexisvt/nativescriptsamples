import { View } from 'ui/core/view';
import { AnimationDefinition } from 'ui/animation';
import { AnimationCurve } from 'ui/enums';

const DURATION = 250;
const SCALEFACTOR = 1.8;

export function fadeZoom(view: View) {
  return view.animate({
    duration: 500,
    opacity: 1.0,
    scale: { x: 1.0, y: 1.0 }
  });
}

export function popAnimate(view: View) {

  let defPopUp = <AnimationDefinition>{
    duration: DURATION,
    scale: { x: SCALEFACTOR, y: SCALEFACTOR },
    curve: AnimationCurve.easeIn
  };

  let defPopDown = <AnimationDefinition>{
    duration: DURATION,
    scale: { x: 1.0, y: 1.0 },
    curve: AnimationCurve.easeOut
  };

  return view.animate(defPopUp).then(() => view.animate(defPopDown));
}