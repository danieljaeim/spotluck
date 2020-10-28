import React, { Component } from 'react';
import '../css/Searchbar.css';

export default class Searchbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSearch: ''
        };
    }

    submitSearchTerm = (e) => {

    }

    updateSearchTerm = (e) => {
        let currentSearch = e.target.value;
        this.setState({ currentSearch });
    }

    render() {
        return (
            <div className="searchbar-container">

            </div>
        )
    }
}
