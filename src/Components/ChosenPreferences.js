import React, { Component, useRef } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import '../css/ChosenPreferences.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default class ChosenPreferences extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSearchModal: false,
            currentSearchTerm: '',
            alreadyMoved: false,
            timer: null,
            data: null,
            width: 0,
            height: 0,
            endChosenModal: false,
            openedSearch: false,
            lengthOfArtistsFound: 20,
            showingData: false,
            swappingArtistHover: false,
            arrows: true,
            nextArrow: null,
            prevArrow: null
        }
    }

    updateSearchTerm = (e) => {
        let searchTerm = e.target.value;
        this.setState({ currentSearchTerm: searchTerm });
        clearTimeout(this.state.timer);

        if (searchTerm === '' || searchTerm === this.state.currentSearchTerm) return;
        let timer = this.setTimerToCallApi();
        this.setState({ timer });
    }

    setTimerToCallApi = () => {
        let timer = setTimeout(async () => {
            let { currentSearchTerm } = this.state;
            await this.searchForSpecificQuery(currentSearchTerm);
        }, 1000);

        return timer;
    }

    searchForSpecificQuery = async (searchString) => {
        searchString = encodeURIComponent(searchString);
        let response = await axios.get(`https://api.spotify.com/v1/search?q=${searchString}&type=artist,track,album`,
            {
                headers: {
                    'Authorization': "Bearer " + this.props.token,
                    'Content-Type': 'application/json'
                }
            });

        let data = response.data;
        if (data.artists) {
            data.artists.items.filter(artist => artist.images[0])
            data.artists.items.sort((a, b) => b.popularity - a.popularity);
        }

        let seenAlbums = {};
        if (data.albums) {
            let ret = data.albums.items.filter(album => {
                if (album.album_type === "single") return false;
                if (seenAlbums[album.name]) return false;
                seenAlbums[album.name] = true;
                return true;
            });
            data.albums.items = ret;
        }

        this.setState({ data, lengthOfArtistsFound: data.artists.items.length });
    }


    render() {
        let { preferences, changingPreferenceIndex, playSpecificArtist,
            updateMenu, updatePreference, setupPreference, currentRelatedArtists, openingMenu } = this.props;
        let { data, lengthOfArtistsFound, showingData } = this.state;

        let atLeastOne = preferences[0] || preferences[1] ||
            preferences[2] || preferences[3] || preferences[4];


        return (
            <div className="chosen-container">
                <div className="info-div" style={{ paddingTop: changingPreferenceIndex ? 'none' : '60px' }}>
                    {
                        changingPreferenceIndex == null ?
                            <>
                                <span className="info-span"> Here are some artists you enjoy.
                                    <span className="spotify-text"> </span> <br />
                                    <span> <span style={{ color: '#E36588' }}> Click </span>
                                        and <span style={{ color: 'sandybrown' }}> swap </span>
                                        out artists.
                                    </span>
                                </span>
                            </> : null
                    }
                </div>
                <div className="artist-image-list"
                    style={{
                        top: changingPreferenceIndex !== null ? '-5vh' : '30vh'
                    }}>
                    {atLeastOne ? [0, 1, 2, 3, 4].map((num, i) =>
                        <span
                            key={preferences[i].data.id}
                            className={`artist-box-container 
                            ${changingPreferenceIndex === num && this.props.openingMenu ? 'move-into-place-anim' : 'move-out-of-way-anim'}`}
                            style={{
                                left: `${-3 + 24 * i}%`, background: changingPreferenceIndex !== null ? 'linear-gradient(90deg, rgba(255,184,92,1) 0%, rgba(227,101,136,1) 75%)' : '',
                                animationDelay: changingPreferenceIndex === null ? Math.abs(2 - i) * 325 + 'ms' : null
                            }}>
                            {preferences[num] ?
                                <span
                                    key={preferences[num].name}
                                    onClick={(e) => setupPreference(num)}>
                                    {this.state.swappingArtistHover && num === changingPreferenceIndex ?
                                        <div class="arrow-circle-down" aria-hidden="true" /> : null}
                                    <img className="artist-image-ins"
                                        style={{ backgroundImage: 'cover' }}
                                        src={preferences[num].type === 'artist' ?
                                            preferences[num].data.images[2].url :
                                            preferences[num].data.album.images[2].url}
                                        alt=""
                                    />
                                    <span className="artist-image-name"
                                        style={{ top: changingPreferenceIndex === num ? '120%' : '' }}
                                    > {preferences[num].data.name} </span>
                                </span > :
                                <i className="fa fa-plus-square fa-5x" aria-hidden="true"></i>
                            }
                        </span>) : null}
                </div>
                {currentRelatedArtists !== null ?
                    <div className="related-search-container">
                        <div className="search-modal">
                            <div className="intro-search-modal">
                                <div className="add-button-intro">
                                </div>
                                <input
                                    onChange={e => { e.preventDefault(); this.updateSearchTerm(e) }}
                                    onFocus={e => { e.preventDefault(); this.setState({ showingData: true }) }}
                                    className="add-text-intro"
                                    id="input-text"
                                    value={this.state.currentSearchTerm}
                                    placeholder={`Search for an artist`}>
                                </input>
                                {this.state.showingData && this.state.currentSearchTerm ?
                                    <div className="cancel-times"
                                        onClick={e => {
                                            e.preventDefault(); document.getElementById('input-text').value = "";
                                            this.setState({
                                                showingData: false,
                                                currentSearchTerm: '', data: null
                                            })
                                        }} />
                                    : null
                                }
                            </div>
                            <div className="search-button-modal">
                                <div className={`generate-button ${changingPreferenceIndex !== null ? 'move-button-down-anim' : ''}`}
                                    onClick={() => { window.removeEventListener('wheel', this.addWheelListener); updateMenu() }}>
                                    Generate Playlist
                                </div>
                            </div>
                        </div>
                        <div className="related-artist-modal">
                            <>
                                {data === null || !showingData ?
                                    currentRelatedArtists.map((artist, i) =>
                                        <div key={artist.id}
                                            className="related-artist">
                                            <div
                                                className="replace-div">
                                                <span className="swap-side"
                                                    onMouseOver={_ => { this.setState({ swappingArtistHover: true }) }}
                                                    onMouseLeave={_ => { this.setState({ swappingArtistHover: false }) }}
                                                    onClick={(e) => { e.preventDefault(); updatePreference(artist, 'artist') }}>
                                                    <div className="arrow-circle-up"
                                                        onClick={(e) => { e.preventDefault(); updatePreference(artist, 'artist') }}
                                                        aria-hidden="true" />
                                                </span>
                                                <span className="play-side" onClick={(e) => { e.preventDefault(); playSpecificArtist(artist.uri, artist.name) }}>
                                                    <div className="play-inner"
                                                        onClick={(e) => { e.preventDefault(); playSpecificArtist(artist.uri, artist.name) }}
                                                        aria-hidden="true" />
                                                </span>
                                            </div>
                                            <img className="related-artist-img" src={artist.images[2].url} alt="" />
                                            <div className="related-artist-name">
                                                {artist.name}
                                            </div>
                                        </div>
                                    ) :
                                    data.artists.items.map((artist, i) => {
                                        if (artist.images[0]) {
                                            return (
                                                <div key={artist.id}
                                                    className="related-artist">
                                                    <div
                                                        onMouseOver={_ => { this.setState({ swappingArtistHover: true }) }}
                                                        onMouseLeave={_ => { this.setState({ swappingArtistHover: false }) }}
                                                        className="replace-div">
                                                        <span className="swap-side"
                                                            onClick={(e) => { e.preventDefault(); updatePreference(artist, 'artist') }}>
                                                            <div className="arrow-circle-up"
                                                                onClick={(e) => { e.preventDefault(); updatePreference(artist, 'artist') }}
                                                                aria-hidden="true" />
                                                        </span>
                                                        <span className="play-side"
                                                            onClick={(e) => { e.preventDefault(); playSpecificArtist(artist.uri, artist.name) }}>
                                                            <div className="play-inner" style={{ color: 'white' }}
                                                                onClick={(e) => { e.preventDefault(); playSpecificArtist(artist.uri, artist.name) }}
                                                                aria-hidden="true" />
                                                        </span>
                                                    </div>
                                                    <img className="related-artist-img" src={artist.images[0].url} alt="">
                                                    </img>
                                                    <div className="related-artist-name">
                                                        {artist.name}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null;
                                    })
                                }
                            </>
                        </div>
                    </div> : null}
            </div >
        )
    }
}
