((Drupal, once) => {
  Drupal.behaviors.ebSlideshow = {
    attach(context) {
      once('eb-slideshow', '.eb-slideshow', context).forEach((el) => {
        const slides = Array.from(el.querySelectorAll('.eb-slideshow__slide'));
        if (slides.length < 2) {
          return;
        }

        const slideSpeed = parseInt(el.dataset.slideSpeed, 10) || 4000;
        const transitionSpeed = parseInt(el.dataset.transitionSpeed, 10) || 400;
        el.style.setProperty('--eb-slideshow-transition-speed', `${transitionSpeed}ms`);

        const toggle = el.querySelector('.eb-slideshow__toggle');
        const segments = Array.from(el.querySelectorAll('.eb-slideshow__segment'));

        let index = 0;
        let timer = null;

        const goTo = (newIndex) => {
          slides[index].classList.remove('is-active');
          segments[index]?.classList.remove('is-active');
          index = newIndex;
          slides[index].classList.add('is-active');
          segments[index]?.classList.add('is-active');
        };

        const advance = () => goTo((index + 1) % slides.length);

        const play = () => {
          if (timer) {
            return;
          }
          el.classList.add('is-playing');
          if (toggle) {
            toggle.setAttribute('aria-label', Drupal.t('Pause slideshow'));
          }
          timer = setInterval(advance, slideSpeed);
        };

        const pause = () => {
          el.classList.remove('is-playing');
          if (toggle) {
            toggle.setAttribute('aria-label', Drupal.t('Play slideshow'));
          }
          clearInterval(timer);
          timer = null;
        };

        toggle?.addEventListener('click', () => {
          if (timer) {
            pause();
          }
          else {
            play();
          }
        });

        segments.forEach((segment, segmentIndex) => {
          segment.addEventListener('click', () => {
            goTo(segmentIndex);
            pause();
          });
        });

        play();
      });
    },
  };
})(Drupal, once);
