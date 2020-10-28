import React, { Component } from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import '../css/App.css';

import Success from './Success';
import CurrentTrack from '../Components/CurrentTrack';
import Navbar from '../Components/Navbar';

export default class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            readyToRedirect: false
        }
    }

    componentDidMount = async () => {
        const search = window.location.hash;
        const hash = queryString.parse(search).access_token;

        if (hash) {
            await this.props.validateLogin(true, hash);
        } else if (window.location.search === '?error=access_denied') {
            this.setState({ readyToRedirect: true })
        }
    }

    render() {
        const { token, deviceId, changePlayerSettings, curTrack, curVolume, changeCurrentTrackTime, changeCurrentVolume, playing, trackTimer } = this.props;
        const { readyToRedirect } = this.state;

        if (readyToRedirect) {
            this.setState({ readyToRedirect: false})
            return <Redirect to={'/'}/>
        }

        return (
            <div className="root-container">
                <Navbar />
                <Success changePlayerSettings={changePlayerSettings} deviceId={deviceId} token={token}/>
                <CurrentTrack changeCurrentTrackTime={changeCurrentTrackTime} changeCurrentVolume={changeCurrentVolume} playing={playing} curTrack={curTrack} curVolume={curVolume} trackTimer={trackTimer} changePlayerSettings={changePlayerSettings} />
            </div>
        )
    }
}
