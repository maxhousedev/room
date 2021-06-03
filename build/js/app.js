'use strict';

gsap.registerPlugin(ScrollToPlugin);
document.addEventListener('DOMContentLoaded', function () {
  // media
  var minMobileL = window.matchMedia('(min-width: 425px)');
  var minPhoneWide = window.matchMedia('(min-width: 768px)');
  var minTablet = window.matchMedia('(min-width: 992px)'); // DOM

  var btnBurger = document.querySelector('.burger');
  var heroImg = document.querySelectorAll('.hero-slider__img'); // events

  var click = new Event('click'); // hero slider

  new Swiper('#hero-slider', {
    loop: true,
    navigation: {
      nextEl: '.swiper-prev',
      prevEl: '.swiper-next'
    },
    grabCursor: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
      pageUpDown: true
    }
  }); // gsap timeline
  // section innovation

  var aboutTimeline = gsap.timeline();
  aboutTimeline.from('.title', {
    opacity: 0,
    y: -100,
    duration: 2
  }, '<-0.5').from('.innovation-description', {
    opacity: 0,
    duration: 2
  }, '<1').from('.shop-link', {
    opacity: 0,
    duration: 2
  }, '<'); // scroll

  document.querySelectorAll('a[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var scrollToID = e.target.getAttribute('href');
      var offset = -5;

      var scrollToTop = function scrollToTop() {
        return gsap.to(window, {
          delay: 2,
          duration: 2,
          scrollTo: {
            y: 0,
            offsetY: offset
          },
          ease: "power2"
        });
      };

      if (e.target.hasAttribute('data-close')) {
        btnBurger.dispatchEvent(click);

        if (scrollToID !== "#") {
          gsap.to(window, {
            delay: 1,
            duration: 2,
            scrollTo: {
              y: scrollToID,
              offsetY: offset
            },
            ease: "power2"
          });
        } else {
          scrollToTop();
        }
      } else {
        scrollToTop();
      }
    });
  }); // MobileL

  if (minMobileL.matches) {
    heroImg.forEach(function (image, index) {
      image.setAttribute('src', "img/hero/".concat(index + 1, ".jpg"));
    });
  } // untill phone-wide


  if (!minPhoneWide.matches) {
    // gsap timeline
    // hidden menu on phone
    var menuTimeline = gsap.timeline({
      paused: true
    }); // hidden menu on phone

    menuTimeline.to('.header-logo', {
      opacity: 0
    }).to('.header-nav', {
      y: 0,
      opacity: 1
    }).from('.nav__item', {
      x: 200,
      stagger: 0.25
    }); // burger click

    btnBurger.addEventListener('click', function () {
      // animate burger btn
      this.classList.toggle('is-active'); // unscrolable and overlay

      document.body.classList.toggle('no-scroll'); // animate hidden menu

      if (this.classList.contains('is-active')) {
        menuTimeline.play();
      } else {
        menuTimeline.reverse();
      }
    });
  } // tablet 


  if (minTablet.matches) {
    // gsap timeline
    // section about
    var aboutTimeline = gsap.timeline();
    aboutTimeline.from('.img_dark', {
      opacity: 0,
      xPercent: -100,
      yPercent: -100,
      scale: 0.25,
      rotation: -720,
      duration: 1.5
    }).from('.img_light', {
      opacity: 0,
      xPercent: 100,
      yPercent: -100,
      scale: 0.25,
      rotation: 720,
      duration: 1.5
    }, '<0.5').from('.about-header', {
      opacity: 0,
      y: -100,
      duration: 2
    }, '<-0.5').from('.about-description', {
      opacity: 0,
      duration: 2
    }, '<1');
  }
});