import {ScrollToSmooth, easeOutQuint} from 'scrolltosmooth/dist/scrolltosmooth.esm';

import {gsap} from 'gsap';
import {Observer} from 'gsap/Observer';

function isHidden(el) {
  return (el.offsetParent === null)
}


function playVid() {
    vid.play();
}

function pauseVid() {
    vid.pause();
}

const setupScrollSmooth = () => {
	const scrollToSmoothSettings = {
		container: document,
		targetAttribute: 'href',
		topOnEmptyHash: true,
		offset: null,
		duration: 800,
		durationRelative: true,
		durationMin: 300,
		durationMax: 5000,
		easing: easeOutQuint,
		onScrollStart: null,
		onScrollUpdate: null,
		onScrollEnd: null
	};
	
	const smoothScroll = new ScrollToSmooth('a', scrollToSmoothSettings);
	smoothScroll.init();
}

setupScrollSmooth();

gsap.registerPlugin(Observer);

let sections = document.querySelectorAll("section"),
  images = document.querySelectorAll(".bg"),
  headings = gsap.utils.toArray(".section-heading"),
  outerWrappers = gsap.utils.toArray(".outer"),
  innerWrappers = gsap.utils.toArray(".inner"),
  currentIndex = -1,
  wrap = gsap.utils.wrap(0, sections.length),
  animating;

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function gotoSection(index, direction) {
  const video: HTMLElement = document.getElementById(index + "");
  const videoPrev = document.getElementById((index - 1).toString());
  const videoNext = document.getElementById((index + 1).toString());
  if(video) {

    video.play();

  }
  if(videoPrev) {
    videoPrev.pause();
  }

  if(videoNext) {
    videoNext.pause();
  }


  index = wrap(index); // make sure it's valid
  animating = true;
  let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => animating = false
      });
  if (currentIndex >= 0) {
    // The first time this function runs, current is -1
    gsap.set(sections[currentIndex], { zIndex: 0 });
    tl.to(images[currentIndex], { yPercent: -15 * dFactor })
      .set(sections[currentIndex], { autoAlpha: 0 });
  }
  gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
  tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
      yPercent: i => i ? -100 * dFactor : 100 * dFactor
    }, { 
      yPercent: 0 
    }, 0)
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)

  currentIndex = index;
}



Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  onDown: () => !animating && gotoSection(currentIndex - 1, -1),
  onUp: () => !animating && gotoSection(currentIndex + 1, 1),
  tolerance: 10,
  preventDefault: true
});

gotoSection(0, 1);

