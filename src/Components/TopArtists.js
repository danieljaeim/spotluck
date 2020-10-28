import React, { Component } from 'react'
import '../css/TopArtists.css'

export default class TopArtists extends Component {
    render() {

        const {artists} = this.props;

        return (
            <div className="artists_list">
                {artists.map(artist =>
                    <div>
                        <img src={artist.images[2].url} alt=""/>
                    </div>
                )}
            </div>
        )
    }
}
