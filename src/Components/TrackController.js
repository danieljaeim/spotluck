import React, { Component } from 'react'

export default class TrackController extends Component {
    render() {
        
        const { deviceId, changePlayerSettings } = this.props;

        return (
            <div>
                <button onClick={changePlayerSettings('pause')}> </button>
                <button> PLAY </button>
                <button> NEXT </button>
            </div>
        )
    }
}
