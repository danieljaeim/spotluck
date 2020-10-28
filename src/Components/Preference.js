import React, { Component } from 'react';
import '../css/Preference.css';

export default class Preference extends Component {
    render() {

        const { pref, ranking, setupPreference} = this.props;
        return (
            pref.data ? 
            <div key={pref.data.name} 
                 className="preference-container" 
                 style={{borderBottom: ( ranking > 0 && ranking < 5) ? '1px black solid' : '' }} 
                 onClick={() => setupPreference}>
                <img className="preference-img" src={pref.type === 'artist' ? pref.data.images[1].url : pref.data.album.images[1].url} alt=""></img>
                <span className="preference-name">{pref.data.name}</span>
            </div> : null
        )
    }
}
