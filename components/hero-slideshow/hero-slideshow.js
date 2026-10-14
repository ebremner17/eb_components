((Drupal, once) => {
  Drupal.behaviors.ebHeroSlideshow = {
    attach(context) {
      once('eb-hero-slideshow', '.eb-hero-slideshow', context).forEach((el) => {
        const slides = el.querySelectorAll('.eb-hero-slideshow__slide');
        if (slides.length < 2) {
          return;
        }

        const slideSpeed = parseInt(el.dataset.slideSpeed, 10) || 4000;
        const transitionSpeed = parseInt(el.dataset.transitionSpeed, 10) || 400;
        el.style.setProperty('--eb-hero-transition-speed', `${transitionSpeed}ms`);

        let index = 0;
        setInterval(() => {
          slides[index].classList.remove('is-active');
          index = (index + 1) % slides.length;
          slides[index].classList.add('is-active');
        }, slideSpeed);
      });
    },
  };
})(Drupal, once);
