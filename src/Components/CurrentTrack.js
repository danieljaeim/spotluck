import React, { Component } from 'react'
import '../css/CurrentTrack.css';

export default class CurrentTrack extends Component {

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = Math.floor(Math.floor(millis % 60000) / 1000);
        let ret = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        return ret;
    }

    render() {
        const { changePlayerSettings, changeCurrentTrackTime, changeCurrentVolume, pauseTimer, restartTimer, curTrack, curVolume, playing, trackTimer } = this.props;

        return (
            curTrack ?
                <div className="cur-track-container">
                    <div className="top-container">
                        <div className="cur-track-img-container">
                            <img className="cur-track-img" src={curTrack.track_window.current_track.album.images[0].url} alt="" />
                        </div>
                        <div className="cur-track-name"> {curTrack.track_window.current_track.name} </div>
                        <div className="cur-artist-name"> {curTrack.track_window.current_track.artists[0].name}</div>
                    </div>
                    <div className="button-bar">
                        <div className="control-btn prev-track fa-2x" onClick={() => changePlayerSettings('prev')} />
                        <button className="control-btn toggle-button" onClick={() => changePlayerSettings('toggle')}>
                            {playing ?
                                <div onClick={_ => pauseTimer()} className="cur-pause" aria-hidden="true" /> :
                                <div onClick={_ => restartTimer()} className="cur-play" aria-hidden="true" />}
                        </button>
                        <div className="control-btn next-track" onClick={() => changePlayerSettings('next')} />
                    </div>
                    <div className="song-slider">
                        <span className="song-start-time"> {this.millisToMinutesAndSeconds(trackTimer)} </span>
                        <input onChange={(e) => { e.preventDefault(); changeCurrentTrackTime(e.target.value) }} type="range" className="slider" min="0" max={`${curTrack.duration}`} step="1000" value={`${trackTimer}`}></input>
                        <span className="song-end-time"> {this.millisToMinutesAndSeconds(curTrack.duration)} </span>
                    </div>
                    <div className="volume-slider">
                        <span className="song-star" />
                        <input onChange={(e) => { e.preventDefault(); changeCurrentVolume(e.target.value) }} type="range" className="vol-slider" min="0" max="1" step="0.025" value={`${curVolume}`}></input>
                        <span className="song-end-time"> {this.millisToMinutesAndSeconds(curTrack.duration)} </span>
                    </div>
                </div > : <div></div>
        )
    }
}
