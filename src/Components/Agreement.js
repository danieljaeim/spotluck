import React, { Component } from 'react';
import '../css/Agreement.css';

export default class Agreement extends Component {
    render() {

        const client_id = "10bb0e9003e748e684be1160d29f3562"
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
                                    "&response_type=token" +
                                    // "&redirect_uri=https://serene-hollows-75057.herokuapp.com/landing" +
                                    "&redirect_uri=http://localhost:3000/landing" +
                                    `&scope=${scopes ? encodeURIComponent(scopes) : ''}`}>
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
