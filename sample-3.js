import React, { useState } from 'react';
import { bem } from 'utils';
import PropTypes from 'prop-types';
import { PolaroidImageSlider, BlueButton } from 'components';
import './styles.styl';
import { DICTIONARY, ROUTES } from 'constants';

import {
  TITLE,
  TEXT,
  SLIDER_LIST,
} from './constants';

const { photoArt } = ROUTES;

const b = bem('what-included');

const { SEE_PHOTO_ART } = DICTIONARY;

const defaultProps = {
  className: '',
  sliderList: SLIDER_LIST,
  buttonText: SEE_PHOTO_ART,
  buttonLink: photoArt,
  withoutButton: false,
};

const propTypes = {
  className: PropTypes.string,
  sliderList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  withoutButton: PropTypes.bool,
};

const WhatIncluded = ({
  className,
  sliderList,
  buttonText,
  buttonLink,
  withoutButton,
}) => {
  const [index, setCount] = useState(0);

  const changeText = (value) => {
    setCount(value);
  };

  return (
    <article className={b({ mix: className })}>
      <div className={b('container')}>
        <div className={b('stripe-three')} />
        <div className={b('slider', { main: true })}>
          <PolaroidImageSlider
            slideList={sliderList}
            afterChange={changeText}
            lazyLoad={false}
            autoplay
            autoplaySpeed={12000}
            pauseOnHover
          />
          <div className={b('stripe-one')} />
          <div className={b('stripe-two')} />
        </div>
        <div className={b('text-block')}>
          <h2 className={b('title')}>{sliderList[index].title || TITLE}</h2>
          <div className={b('slider', { mobile: true })}>
            <PolaroidImageSlider
              slideList={sliderList}
              afterChange={changeText}
              lazyLoad={false}
              autoplay
              autoplaySpeed={12000}
              pauseOnHover
            />
            <div className={b('stripe-one')} />
            <div className={b('stripe-two')} />
          </div>
          <p className={b('text')}>{sliderList[index].text || TEXT}</p>
          {
            !withoutButton && (
              <div className={b('btn-block')}>
                <a
                  className={b('link')}
                  href={buttonLink}
                >
                  <BlueButton className={b('btn')}>{buttonText}</BlueButton>
                </a>
              </div>
            )
          }
        </div>
      </div>
    </article>
  );
};


WhatIncluded.propTypes = propTypes;
WhatIncluded.defaultProps = defaultProps;

export default WhatIncluded;
