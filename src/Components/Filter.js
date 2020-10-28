import React, { Component } from 'react'
import '../css/Filter.css';

export default class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { updateSearchSeed, artists } = this.props;

        return (
            <div className="filter-container">
                {artists.map(artist => 
                    <div> {artist} </div>
                )}
            </div>
        )
    }
}
