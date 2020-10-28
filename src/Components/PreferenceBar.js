import React, { Component } from 'react';
import axios from 'axios';
import '../css/PreferenceBar.css';
import Preference from '../Components/Preference';
import SearchModal from '../Components/SearchModal';

export default class PreferenceBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSearchModal: false,
            currentSearchTerm: '',
            timer: null,
            data: null
        }
    }

    searchForSpecificQuery = async (searchString) => {
        searchString = encodeURIComponent(searchString);
        let response = await axios.get(`https://api.spotify.com/v1/search?q=${searchString}&type=artist,track,album`,
            {
                headers: {
                    'Authorization': "Bearer " + this.props.token,
                    'Content-Type': 'application/json'
                }
            });

        let data = response.data;
        if (data.artists) {
            data.artists.items.sort((a, b) => b.popularity - a.popularity);
        }

        let seenAlbums = {};
        if (data.albums) {
            let ret = data.albums.items.filter(album => {
                if (album.album_type === "single") return false;
                if (seenAlbums[album.name]) return false;
                seenAlbums[album.name] = true;
                return true;
            });
            data.albums.items = ret;
        }

        this.setState({ data });
    }

    turnModalOn = (bool) => {
        if (bool === undefined) {
            this.setState(st => ({ showSearchModal: !st.showSearchModal }));
        } else {
            this.setState({ showSearchModal: bool });
        }
    }

    updateSearchTerm = (e) => {
        let searchTerm = e.target.value;
        this.setState({ currentSearchTerm: searchTerm });
        clearTimeout(this.state.timer);

        if (searchTerm === '' || searchTerm === this.state.currentSearchTerm) return;
        let timer = this.setTimerToCallApi();
        this.setState({ timer });
    }

    setTimerToCallApi = () => {
        let timer = setTimeout(async () => {
            let { currentSearchTerm } = this.state;
            await this.searchForSpecificQuery(currentSearchTerm);
        }, 1000);

        return timer;
    }

    render() {
        const { preferences, token, updatePreference, setupPreference,
            changingPreferenceIndex } = this.props;
        let { data } = this.state;

        return (
            <div className="searchmodal-container"
                tabIndex="0"
                onBlur={() => this.turnModalOn(true)}>
            </div>
        );
    }
}
