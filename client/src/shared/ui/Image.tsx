import type { CSSObject } from '@emotion/react';
import noneImage from '../../assets/no-image.svg';

type ImageProps = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  ariaHidden?: boolean;
  onClick?: () => void;
  styles?: CSSObject;
};

export default function Image({
  src = noneImage,
  alt,
  width,
  height,
  ariaHidden,
  onClick,
  styles,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      aria-hidden={ariaHidden}
      onClick={onClick}
      css={styles}
    />
  );
}
