<?php

declare(strict_types=1);

namespace Drupal\eb_components\Twig;

use Drupal\Core\StreamWrapper\PublicStream;
use Drupal\image\Entity\ImageStyle;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Applies an eb_components image style to a Canvas image prop's resolved URL.
 *
 * Canvas's own image prop shape always resolves to the original file's raw
 * URL (@see \Drupal\canvas\Plugin\Field\FieldTypeOverride\ImageItemOverride)
 * and never applies a Drupal image style. To get crop-based derivatives
 * (@see eb_components.info.yml's `crop` dependency) into a component's
 * rendered markup, this reverses that URL back into the original file's
 * `public://` URI and builds the requested image style's derivative URL from
 * it.
 */
class EbImageStyleExtension extends AbstractExtension {

  public function getFunctions(): array {
    return [
      new TwigFunction('eb_image_style', $this->applyStyle(...)),
    ];
  }

  /**
   * Builds an image style derivative URL from a Canvas image prop's URL.
   *
   * @param string|null $url
   *   The `src` value of a Canvas image prop: the original file's resolved,
   *   browser-accessible URL.
   * @param string $style_name
   *   An image style machine name.
   *
   * @return string|null
   *   The derivative URL, or the original URL if it cannot be resolved back
   *   to a `public://` URI, or if the image style does not exist.
   */
  public function applyStyle(?string $url, string $style_name): ?string {
    if (!$url) {
      return $url;
    }
    $uri = $this->resolvePublicUri($url);
    $style = $uri ? ImageStyle::load($style_name) : NULL;
    return $style ? $style->buildUrl($uri) : $url;
  }

  private function resolvePublicUri(string $url): ?string {
    $marker = '/' . PublicStream::basePath() . '/';
    $position = \strpos($url, $marker);
    if ($position === FALSE) {
      return NULL;
    }
    $relative_path = \explode('?', \substr($url, $position + \strlen($marker)), 2)[0];
    return 'public://' . $relative_path;
  }

}
