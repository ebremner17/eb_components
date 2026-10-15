((Drupal, once) => {
  Drupal.behaviors.ebGallery = {
    attach(context) {
      once('eb-gallery', '.eb-gallery', context).forEach((el) => {
        const thumbs = Array.from(el.querySelectorAll('.eb-gallery__thumb'));
        if (!thumbs.length) {
          return;
        }

        const lightbox = el.querySelector('.eb-gallery__lightbox');
        const stageImage = el.querySelector('.eb-gallery__stage-image');
        const counter = el.querySelector('.eb-gallery__counter');
        const closeButton = el.querySelector('.eb-gallery__close');
        const prevButton = el.querySelector('.eb-gallery__prev');
        const nextButton = el.querySelector('.eb-gallery__next');

        let index = 0;
        let lastFocused = null;

        const show = (newIndex) => {
          index = (newIndex + thumbs.length) % thumbs.length;
          const img = thumbs[index].querySelector('img');
          stageImage.src = img.src;
          stageImage.alt = img.alt;
          counter.textContent = `${index + 1} / ${thumbs.length}`;
        };

        const onKeydown = (event) => {
          if (event.key === 'Escape') {
            close();
          }
          else if (event.key === 'ArrowLeft') {
            show(index - 1);
          }
          else if (event.key === 'ArrowRight') {
            show(index + 1);
          }
        };

        const open = (startIndex) => {
          lastFocused = document.activeElement;
          show(startIndex);
          lightbox.hidden = false;
          closeButton.focus();
          document.addEventListener('keydown', onKeydown);
        };

        function close() {
          lightbox.hidden = true;
          document.removeEventListener('keydown', onKeydown);
          if (lastFocused) {
            lastFocused.focus();
          }
        }

        thumbs.forEach((thumb, i) => {
          thumb.addEventListener('click', () => open(i));
        });

        closeButton.addEventListener('click', close);
        prevButton.addEventListener('click', () => show(index - 1));
        nextButton.addEventListener('click', () => show(index + 1));
        lightbox.addEventListener('click', (event) => {
          if (event.target === lightbox) {
            close();
          }
        });
      });
    },
  };
})(Drupal, once);
