<?php

declare(strict_types=1);

namespace Drupal\eb_components\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Normalizes a YouTube URL (of any common shape) into an embeddable one.
 */
class EbVideoExtension extends AbstractExtension {

  public function getFunctions(): array {
    return [
      new TwigFunction('eb_youtube_embed_url', $this->embedUrl(...)),
    ];
  }

  /**
   * Builds a privacy-enhanced YouTube embed URL from any YouTube URL shape.
   *
   * Handles `watch?v=`, `youtu.be/`, `embed/`, and `shorts/` URLs, with or
   * without extra query parameters (timestamps, playlists, etc.).
   *
   * @param string|null $url
   *   A YouTube URL, as an editor would paste it from their browser.
   *
   * @return string|null
   *   The embeddable URL, or NULL if no valid video ID could be found.
   */
  public function embedUrl(?string $url): ?string {
    if (!$url) {
      return NULL;
    }
    $pattern = '/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/';
    if (!preg_match($pattern, $url, $matches)) {
      return NULL;
    }
    return 'https://www.youtube-nocookie.com/embed/' . $matches[1];
  }

}
