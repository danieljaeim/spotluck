import React, { Component } from 'react'
import axios from 'axios';
import '../css/Success.css';
import Thumbnail from '../Components/Thumbnail';
import PreferenceBar from '../Components/PreferenceBar';
import ChosenPreferences from '../Components/ChosenPreferences';

const SEED_URI = "https://api.spotify.com/v1/recommendations?";

export default class Success extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 'artists',
            time_range: 'short_term',
            limit: 5,
            select: new Array(50).fill(false),
            artists: null,
            tracks: null,
            newartisttracks: null,
            recSeed: null,
            thumbnailOn: true,
            selectedTrack: null,
            searchSeed: '',
            hovering: null,
            hoverIndex: null,
            changingPreferenceIndex: null,
            itemToSwap: null,
            clickToSelect: false,
            openingMenu: true,
            showThumb: false,
            currentRelatedArtists: null,
            sortByNew: false,
            tracklisturi: [],
            preferences: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null
            },
            relatedArtists: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null
            }
        }
    }

    componentDidMount = () => {
        setTimeout(async () => {
            await this.callSpotifyApi();
        }, 50);
    }

    // let's just assume this only gets called when Success first mounts
    callSpotifyApi = async () => {
        const { limit } = this.state;

        let preferences = {};

        let response = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=${limit}&offset=0`, {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        });
        let artists = response.data.items;

        if (artists.length !== 5) {
            response = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=5&offset=0`, {
                headers: {
                    'Authorization': "Bearer " + this.props.token,
                    'Content-Type': 'application/json'
                }
            });
            artists = response.data.items;
        }

        if (artists.length !== 5) {
            response = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5&offset=0`, {
                headers: {
                    'Authorization': "Bearer " + this.props.token,
                    'Content-Type': 'application/json'
                }
            });
            artists = response.data.items;
        }

        if (artists.length !== 5) {
            response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    'Authorization': "Bearer " + this.props.token,
                    'Content-Type': 'application/json'
                }
            });

            const playlistids = response.data.items.map(pl => pl.id);
            let count = 0;
            for (let id of playlistids) {
                if (count >= 4) break;
                const playlist_res = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
                    headers: {
                        'Authorization': "Bearer " + this.props.token,
                        'Content-Type': 'application/json'
                    }
                });

                let data = playlist_res.data.items;
                data.sort((a, b) => b.added_at - a.added_at)
                for (let track of data) {
                    if (count > 4) break;
                    preferences[count] = { data: track.track, type: 'track' }
                    count++;
                }
            }

            preferences = {
                0: { data: artists[0], type: 'track' },
                1: { data: artists[1], type: 'track' },
                2: { data: artists[2], type: 'track' },
                3: { data: artists[3], type: 'track' },
                4: { data: artists[4], type: 'track' },
            }

            this.setState({ artists, preferences });
            await this.callForRecommend();
            return;
        }

        preferences = {
            0: { data: artists[0], type: 'artist' },
            1: { data: artists[1], type: 'artist' },
            2: { data: artists[2], type: 'artist' },
            3: { data: artists[3], type: 'artist' },
            4: { data: artists[4], type: 'artist' },
        }

        //adding related artists
        let relatedArtists = {}
        for (let i = 0; i < 5; i++) {
            let id = preferences[i].data.id;
            let response = await axios.get(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
                headers: {
                    'Authorization': "Bearer " + this.props.token,
                    'Content-Type': 'application/json'
                }
            });

            let artists = response.data.artists;
            relatedArtists[i] = artists;
        }

        this.setState({ artists, preferences, relatedArtists });
        await this.callForRecommend();
        return;
    }

    callForRecommend = async () => {
        const { preferences, select, tracks, sortByNew } = this.state;

        let copyTracks = [];
        select.forEach((val, i) => {
            if (select[i]) {
                copyTracks.push(tracks[i]);
            }
        });

        let selectArr = new Array(50).fill(false);
        for (let i = 0; i < copyTracks.length; i++) {
            selectArr[i] = true;
        }

        let tracksLeft = 50 - copyTracks.length;
        if (tracksLeft === 0) return;

        let seedBase = `limit=${!sortByNew ? 50 : 85}&`;
        let seedArtist = 'seed_artists=';
        let seedTrack = 'seed_tracks=';
        let changed = false;

        for (let i = 0; i < 5; i++) {
            if (preferences[i].data != null) {
                changed = true;
                if (preferences[i].type === "artist") {
                    seedArtist += preferences[i].data.id;

                    if (i <= 3) seedArtist += ',';

                } else if (preferences[i].type === "track") {
                    seedTrack += preferences[i].data.id;

                    if (i <= 3) seedTrack += ',';
                }
            }
        }

        if (seedArtist !== 'seed_artists=') {
            seedBase += seedArtist;
        }

        if (seedTrack !== 'seed_tracks=') {
            seedBase += "&";
            seedBase += seedTrack;
        }

        let recRequestURL = SEED_URI + seedBase;
        if (!changed) {
            recRequestURL = `https://api.spotify.com/v1/recommendations?limit=${tracksLeft}&seed_genres=pop`
        }

        const seed_response = await axios.get(recRequestURL, {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        });

        let artistNames = [];
        for (let i = 0; i < 5; i++) {
            artistNames.push(preferences[i].data.name);
        }

        seed_response.data.tracks.sort((a, b) => b.popularity - a.popularity);

        for (let i = 0; i < tracksLeft; i++) {
            let track = seed_response.data.tracks[i];
            if (!copyTracks.some(t => t.name.localeCompare(track.name) === 0)) {
                copyTracks.push(track);
            }
            if (sortByNew) {
                if (artistNames.indexOf(track.artists[0].name) < 0) {
                    copyTracks.push(track);
                }
            }
        }

        let sortByNewTracks = [...seed_response.data.tracks].sort((a, b) => {
            if (artistNames.indexOf(a.artists[0].name) < 0 && artistNames.indexOf(b.artists[0].name) < 0) {
                return a.popularity > b.popularity ? -1 : 1;
            }
            if (artistNames.indexOf(a.artists[0].name) >= 0 && artistNames.indexOf(b.artists[0].name) >= 0) {
                return a.popularity > b.popularity ? -1 : 1;
            }
            if (artistNames.indexOf(a.artists[0].name) >= 0) {
                return 1;
            } else {
                return -1;
            }
        });

        let tracklisturi = copyTracks.map(t => t.uri);
        this.setState({ tracks: copyTracks, select: selectArr, tracklisturi, newartisttracks: sortByNewTracks });
    }

    updateSelectedTrack = (track) => {
        this.setState({ selectedTrack: track });
    }

    updateSearchSeed = (seedStr) => {
        this.setState({ searchSeed: seedStr });
    }

    updateHoveredObj = (e, index) => {
        if (!e) {
            this.setState({ hovering: null, sample_uri: null, hoverIndex: null });
            return;
        }
        e.preventDefault();
        let objData = {
            sample_uri: e.currentTarget.dataset.sampleUri,
            img: e.currentTarget.children[0].children[1].currentSrc,
            trackName: e.currentTarget.children[0].children[2].children[0].textContent,
            artistName: e.currentTarget.children[0].children[2].children[1].textContent,
        }
        
        this.setState({ hovering: objData, sample_uri: objData.sample_uri, hoverIndex: index });
    }

    updateTimeRange = async (time_range) => {
        const { type, limit } = this.state;
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${limit}&offset=0`, {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        })
        const artists = response.data.items;

        const preferences = {
            0: { data: artists[0], type: 'artist' },
            1: { data: artists[1], type: 'artist' },
            2: { data: artists[2], type: 'artist' },
            3: { data: artists[3], type: 'artist' },
            4: { data: artists[4], type: 'artist' },
        }

        this.setState({ artists, time_range, preferences });
        this.callForRecommend();
    }

    updateHoverUri = (sample_uri) => {
        this.setState({ sample_uri });
    }

    updatePreference = async (preferenceObject, type) => {
        if (this.state.changingPreferenceIndex === null) {
            return;
        }

        for (let i = 0; i < 5; i++) {
            if (preferenceObject.name === this.state.preferences[i].data.name) {
                return;
            }
        }

        let indexToReplace = this.state.changingPreferenceIndex;
        let preferences = { ...this.state.preferences };
        preferences[indexToReplace] = { data: preferenceObject, type }

        let response = await axios.get(`https://api.spotify.com/v1/artists/${preferenceObject.id}/related-artists`, {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        });

        let currentRelatedArtists = response.data.artists;
        let relatedArtists = { ...this.state.relatedArtists, [this.state.changingPreferenceIndex]: currentRelatedArtists }

        this.setState(st => ({ preferences, relatedArtists, currentRelatedArtists }));
        this.callForRecommend();
    }

    setupPreference = (index) => {
        let { changingPreferenceIndex, relatedArtists } = this.state;

        if (index === changingPreferenceIndex) {
            // this.setState({ changingPreferenceIndex: null, currentRelatedArtists: null });
            return;
        }

        let currentRelatedArtists = relatedArtists[index];
        this.setState({ changingPreferenceIndex: index, currentRelatedArtists });
    }

    playSpecificArtist = (uri, artistName) => {
        axios.put('https://api.spotify.com/v1/me/player/play', 
        { "context_uri": uri} , {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        });

        this.setState({ currentPlaying: artistName });
    }

    playSpecificSong = (uri, songname) => {
        axios.put('https://api.spotify.com/v1/me/player/play', { "uris": [uri] }, {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        });

        this.setState({ currentPlaying: songname });
    }

    queueUpSongs = () => {
        axios.put('https://api.spotify.com/v1/me/player/play', 
        { "uris": this.state.tracklisturi, "offset": { "position": 0 } } , {
            headers: {
                'Authorization': "Bearer " + this.props.token,
                'Content-Type': 'application/json'
            }
        });
    }

    lockSpecificTrack = (index) => {
        let selectCopy = [...this.state.select];
        selectCopy[index] = !selectCopy[index];

        this.setState({ select: selectCopy });
    }

    updateMenu = () => {
        window.removeEventListener('wheel', (e) => {
        });
        this.setState({ openingMenu: false })
    }

    updateSortByNew = () => {
        this.setState(st => ({ sortByNew: !st.sortByNew }));
    }

    render() {
        const { token, deviceId, changePlayerSettings } = this.props;
        const { tracks, newartisttracks, hovering, preferences, sample_uri, changingPreferenceIndex,
            select, hoverIndex, currentPlaying, sortByNew, tracklisturi, openingMenu, showThumb, updateSortByNew, currentRelatedArtists, relatedArtists } = this.state;

        return (
            <div className="app-container">
                <div className="darken" 
                    style={{ background: openingMenu ? '' : 'rgba(0, 0, 0, 0.8)',
                    zIndex: openingMenu ? -1 : 3 }}
                    onClick={e => this.setState({openingMenu: true })} />
                {/* <button onClick={e => this.setState({ openingMenu: true })}></button> */}
                <ChosenPreferences
                    preferences={preferences}
                    changingPreferenceIndex={changingPreferenceIndex}
                    updateMenu={this.updateMenu}
                    setupPreference={this.setupPreference}
                    updatePreference={this.updatePreference}
                    playSpecificArtist={this.playSpecificArtist}
                    currentRelatedArtists={currentRelatedArtists}
                    relatedArtists={relatedArtists}
                    token={token}
                    openingMenu={openingMenu}
                />
                {!openingMenu ? 
                    <Thumbnail
                        select={select}
                        sortByNew={sortByNew}
                        token={token}
                        changePlayerSettings={changePlayerSettings}
                        lockSpecificTrack={this.lockSpecificTrack}
                        updateTimeRange={this.updateTimeRange}
                        updateHoveredObj={this.updateHoveredObj}
                        updateSelectedTrack={this.updateSelectedTrack}
                        playSpecificSong={this.playSpecificSong}
                        updatePreference={this.updatePreference}
                        callForRecommend={this.callForRecommend}
                        queueUpSongs={this.queueUpSongs}
                        updateSortByNew={this.updateSortByNew}
                        tracks={tracks}
                        newartisttracks={newartisttracks}
                        deviceId={deviceId}
                        hovering={hovering}
                        hoverIndex={hoverIndex}
                        sampleUri={sample_uri}
                        tracklisturi={tracklisturi}
                    />
                : null }
            </div>
        )
    }
}