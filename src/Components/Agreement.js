import React, { Component } from 'react';
import '../css/Agreement.css';

export default class Agreement extends Component {
    render() {

        const client_id = "85844184835545fe8096eb6a8d2934b8"
        const scopes = "streaming user-read-email user-read-private user-top-read user-modify-playback-state";

        return (
            <div className="agreement-container">
                <div className="sliding-background"></div>
                <div className="agreement-header">
                    <div className="agreement-modal">
                        <div className="agreement-description">
                            <h3 className="agreement-title"> Spotluck </h3>
                            <div className="app-description"> A new way to discover music. Powered by you. </div>
                        </div>
                        <div className="agreement-button">
                            <a
                                className="agreement-link"
                                href={"https://accounts.spotify.com/authorize" +
                                    `?client_id=${client_id}` +
                                    `&response_type=token` +
                                    `&redirect_uri=https://danieljaeim.com/spotluck/#/landing` +
                                    `&scope=${scopes ? (encodeURIComponent(scopes).split(" ").join("%20")) : ''}`}
                                target="_blank">
                                Login with Spotify
                    </a>
                        </div>
                    </div>
                    <div className="spotluck-preview">
                        <div className="preview-div"/>
                    </div>
                </div>
            </div>
        )
    }
}
