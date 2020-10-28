import React, { Component } from 'react'
import '../css/Menu.css'

export default class Menu extends Component {
    render() {
        const {callSpotifyApi} = this.props;
        return (
            <div className="menu_container">
                <button className='button_success' onClick={async () => await callSpotifyApi()}> CLICK FOR ARTISTS </button>
            </div>
        )
    }
}
