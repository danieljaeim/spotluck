import React, { Component } from 'react'

export default class ListView extends Component {
    render() {

        const { tracks } = this.props;

        return (
            <div>
                {tracks ? tracks.map(track =>
                    <div className='track-style'>
                        <img className='image-style'
                            height={140}
                            width={140}
                            alt=""
                            src={`${track.album.images[1].url}`}
                        />
                    </div>
                ) : null }
            </div>
        )
    }
}
