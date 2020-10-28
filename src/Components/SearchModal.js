import React, { Component } from 'react'
import '../css/SearchModal.css';
import { Spinner } from 'react-bootstrap';

export default class SearchModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            data: null
        }
    }

    render() {
        const { preferences, data, setupPreference, changingPreferenceIndex, updatePreference } = this.props;

        let atLeastOne = preferences[0] || preferences[1] ||
            preferences[2] || preferences[3] || preferences[4];

        return (
            <div>
                <div className="artist-image-list-search">
                    {atLeastOne ? [0, 1, 2, 3, 4].map((num, i) =>
                        <div key={preferences[i].data.id}
                            onMouseDown={(e) => setupPreference(num)}>
                            <img
                                style={{
                                    opacity: changingPreferenceIndex === num ? 0.5 : 1,
                                    borderRadius: (preferences[num].type === 'artist' ? '38px' : '5px')
                                }}
                                className="artist-image-ins-search"
                                src={preferences[num].type === 'artist' ?
                                    preferences[num].data.images[1].url :
                                    preferences[num].data.album.images[1].url} alt=""
                            />
                            <span className="artist-image-name-search" style={{ left: `${155 * i + 30}px` }}> {preferences[num].data.name} </span>
                        </div>)
                        : null}
                </div>
                <div className="track-artist-title-container">
                    <div className="artists-title"> Artists </div>
                    <div className="tracks-title"> Tracks </div>
                </div>
                <div className="search-modal-container">
                    {data ?
                        <div>
                            {data.artists.items ? <div className="artist-list-search">
                                {data.artists.items.map((artist, i) =>
                                    artist.images[2] && (i < 10) ?
                                        <div className="artist-list-item"
                                            onClick={() => updatePreference(artist, 'artist')}>
                                            <img className="artist-img" src={artist.images[2].url} alt="" />
                                            <div className="artist-name"> {artist.name} </div>
                                        </div>
                                        : null)
                                }
                            </div> : null}
                            {data.tracks.items ? <div className="track-list-search">
                                {data.tracks.items.map((track, i) =>
                                    <span className="track-list-item"
                                        onClick={(e) => { e.preventDefault(); updatePreference(track, 'track') }}
                                        style={{
                                            visibility: (i === data.tracks.items.length - 1) ? 'hidden' : 'visible'
                                        }}>
                                        <img className="track-img" src={track.album.images[2].url} alt="" />
                                        <div className="track-name"> {track.name} </div>
                                        <div className="track-artist"> {track.artists[0].name} </div>
                                    </span>
                                )}
                            </div> : null}
                        </div> :
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    }
                </div>
            </div>
        )
    }
}
