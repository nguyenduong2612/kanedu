import { createAnimation, Animation } from "@ionic/react";

export const pageAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const DURATION = 300;

  const rootTransition = createAnimation()
    .duration(opts.duration || DURATION)
    .easing("cubic-bezier(0.3,0,0.66,1)");

  const enteringPage = createAnimation()
    .addElement(opts.enteringEl)
    .beforeRemoveClass("ion-page-invisible");

  const leavingPage = createAnimation().addElement(opts.leavingEl);

  // customized animation
  if (opts.direction === "forward") {
    enteringPage.fromTo("transform", "translateX(100%)", "translateX(0)");
    leavingPage.fromTo("opacity", "1", "0.25");
  } else {
    leavingPage.fromTo("transform", "translateX(0)", "translateX(100%)");
    enteringPage.fromTo("opacity", "0.25", "1");
  }

  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);
  return rootTransition;
};
