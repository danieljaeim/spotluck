import React, { Component } from 'react';
import '../css/Success.css';
import '../css/Thumbnail.css';

const colorfilter = ['330036', '38182F', '330036', '8D0101', 'FE0B0B', 'FCA122', 'FDCC86'];

export default class Thumbnail extends Component {

    render() {
        const { tracks, newartisttracks, token, sortByNew, updateSortByNew, queueUpSongs, updateMenu,
            callForRecommend, playSpecificSong, updateHoveredObj, lockSpecificTrack, select, hoverIndex } = this.props;

        let chosentracks = sortByNew ? newartisttracks : tracks;

        return (
            <span className="thumbnail-container">
                {/* <span className="thumbnail-filter">
                    <span className="filter-by-title">
                        <span className="filter-title-text">
                            Title
                        </span>
                    </span>
                    <span className="filter-by-artist">
                        <span className='filter-artist-text'>
                            Artist
                        </span>
                    </span>
                    <span className="filter-by-sort">
                        <span className='filter-sort-text'>
                            Popularity
                        </span>
                    </span>
                </span> */}
                <div className="tracklist">
                    {chosentracks ? chosentracks.map((track, i) =>
                        <div className='track-style'
                            key={i}
                            data-sample-uri={track.preview_url}
                            onMouseLeave={e => updateHoveredObj(null)}
                            onMouseEnter={e => updateHoveredObj(e, i)}
                        >
                            {/* <span className="track_number"> {i + 1}. </span> */}
                            <div className="name_artist_container">
                                <div className="img-hover" onClick={() => playSpecificSong(track.uri, track.name)}>
                                    <div className="play-circle" />
                                </div>
                                <img className='imageStyle'
                                    onClick={() => playSpecificSong(track.uri, track.name)}
                                    alt=""
                                    src={`${track.album.images[2].url}`}
                                />
                                <span className="underline-area"
                                    style={{ borderTop: i > 0 ? (select[i - 1]) ? '1px #E36588 solid' : '1px #82A6B1 solid' : 'none' }}
                                >
                                    <h4 className='track_name'>
                                        {track.name.indexOf('(') === -1 ? track.name : track.name.slice(0, track.name.indexOf('('))} </h4>
                                    <span className="artist_name">
                                        {track.artists[0].name}
                                    </span>
                                    <span className="track-popularity">
                                        {new Array(Math.ceil((track.popularity / 10).toFixed(2))).fill(0).map((tile, i) =>
                                            <span className="fill-up-popularity" style={{ backgroundColor: '#' + colorfilter[i] }} />
                                        )}
                                    </span>
                                </span>
                            </div>
                            <span className="bookmark-button"
                                onClick={() => lockSpecificTrack(i)}>
                                {select[i] ? <i class="fa lock-button fa-lock fa-2x" aria-hidden="true"></i> : null}
                                {!select[i] ? <i class="fa lock-button fa-unlock fa-2x" aria-hidden="true"></i> : null}
                            </span>
                        </div>) : null}
                </div>
                <div className="tracks-edit">
                    <div className="add-playlist-button">
                    </div>
                    <div className="refresh-tracks-button"
                        onClick={_ => callForRecommend()}>
                        <div class="refresh" aria-hidden="true" />
                    </div>
                    <div className="play-playlist-button"
                        onClick={_ => queueUpSongs()}>
                        <div class="play-circle-o" aria-hidden="true" />
                    </div>
                    <div className="return-button"
                        onClick={_ => queueUpSongs()}>
                        <div class="return" onClick={ _ => updateMenu() } aria-hidden="true" />
                    </div>
                    <div className="edit-settings">
                        <span className="check-new-artists">
                            <div className="new-artist"
                                onClick={_ => updateSortByNew()}>
                                {sortByNew ?
                                    <div className="check-square" aria-hidden="true" /> :
                                    <div className="times-circle" aria-hidden="true" />
                                }
                            </div>
                            <span className="new-artist-label"> Prioritize new artists </span>
                        </span>
                    </div>
                </div>
                {/* {hovering ? <InfoScreen changePlayerSettings={changePlayerSettings} deviceId={deviceId} hovering={hovering} /> : null} */}
            </span>
        )
    }
}

