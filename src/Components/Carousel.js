import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "react-bootstrap";
import styled from "styled-components";

const TallOuterContainer = styled.div.attrs(({ dynamicHeight }) => ({
    style: { height: `${dynamicHeight}px` }
}))`
  position: relative;
  width: 100%;
`;

const StickyInnerContainer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const HorizontalTranslateContainer = styled.div.attrs(({ translateX }) => ({
    style: { transform: `translateX(${translateX}px)` }
}))`
  position: absolute;
  height: 100%;
  will-change: transform;
`;

const calcDynamicHeight = objectWidth => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return objectWidth - vw + vh + 150;
};

const handleDynamicHeight = (ref, setDynamicHeight) => {
    const objectWidth = ref.current.scrollWidth;
    const dynamicHeight = calcDynamicHeight(objectWidth);
    setDynamicHeight(dynamicHeight);
};

const applyScrollListener = (ref, setTranslateX) => {
    window.addEventListener("scroll", () => {
        const offsetTop = -ref.current.offsetTop;
        setTranslateX(offsetTop);
    });
};

export default (props) => {
    const [dynamicHeight, setDynamicHeight] = useState(null);
    const [translateX, setTranslateX] = useState(0);

    const containerRef = useRef(null);
    const objectRef = useRef(null);

    const resizeHandler = () => {
        handleDynamicHeight(objectRef, setDynamicHeight);
    };

    useEffect(() => {
        handleDynamicHeight(objectRef, setDynamicHeight);
        window.addEventListener("resize", resizeHandler);
        applyScrollListener(containerRef, setTranslateX);
    }, []);

    return (
        <TallOuterContainer dynamicHeight={dynamicHeight}>
            <StickyInnerContainer ref={containerRef}>
                <HorizontalTranslateContainer translateX={translateX} ref={objectRef}>
                    <div className="related-artist-modal">
                        {props.currentRelatedArtists.map(artist =>
                            <div key={artist.id}
                                className="related-artist">
                                <div
                                    className="replace-div">
                                    <span className="swap-side">
                                        <i className="fa fa-circle" style={{ color: 'white' }} />
                                        <i className="fa fa-arrow-circle-up"
                                            onClick={(e) => { e.preventDefault(); props.updatePreference(artist, 'artist') }}
                                            aria-hidden="true" />
                                    </span>
                                    <span className="play-side">
                                        <i className="fa fa-play inner" style={{ color: 'white' }}
                                            onClick={(e) => { e.preventDefault(); props.playSpecificArtist(artist.uri, artist.name) }}
                                            aria-hidden="true" />
                                        <i className="fa fa-play outer" style={{ color: 'black' }} />
                                    </span>
                                </div>
                                <img className="related-artist-img" src={artist.images[2].url} alt="">
                                </img>
                                <div className="related-artist-name">
                                    {artist.name}
                                </div>
                            </div>
                        )}
                    </div>
                </HorizontalTranslateContainer>
            </StickyInnerContainer>
        </TallOuterContainer>
    );
};
