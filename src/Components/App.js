import React from 'react';
import '../css/App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Landing from '../Components/Landing';
import Agreement from '../Components/Agreement';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      token: null,
      deviceId: "",
      position: 0,
      duration: 0,
      playing: true,
      premium: true,
      redirect: false, // BACKBURNER: figure out how to redirect when the user clicks cancel
      curTrack: null,
      trackTimer: 0, 
      currentTimer: null, 
      curVolume: 0.05
    }
    this.playerCheckInterval = null;
  }

  checkPlayerInterval = () => {
    if (this.state.token != null) {
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  transferPlaybackHere() {
    const { deviceId, token } = this.state;
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [deviceId],
        "play": true,
      }),
    });
  }

  checkForPlayer = () => {
    const { token, curTrack } = this.state;

    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Daniel Web Spotify Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.3
      });

      this.player.on('initialization_error', e => { console.error(e); });
      this.player.on('authentication_error', e => {
        this.setState({ loggedIn: false });

      });
      this.player.on('account_error', e => { console.error(e); });
      this.player.on('playback_error', e => { console.error(e); });

      // Playback status updates
      this.player.on('player_state_changed', state => {
        console.log('state changed')
        console.log(this.state.curTrack)
        if (this.state.curTrack) {
          if (this.state.curTrack.duration !== state.duration) {
            this.newSong();
          }
        }
        this.setState({ curTrack: state })
      });

      // Ready
      this.player.on('ready', async data => {
        let { device_id } = data;
        console.log("Let the music play on!");
        this.player.setVolume(this.state.curVolume);
        await this.setState({ deviceId: device_id, premium: true });
        this.transferPlaybackHere();
      });

      // Connect to the player!
      this.player.connect().then(success => {
        if (success) {
          this.changeCurrentTrackTime(0);
          this.transferPlaybackHere();
          console.log("The Web Player successfully connected to Spotify!")
        }
      });
    }
  }

  changePlayerSettings = async (control) => {
    switch (control) {
      case ('pause'):
        this.setState({ playing: false })
        this.player.pause();
        break;
      case ('toggle'):
        this.setState(st => ({ playing: !st.playing }))
        this.player.togglePlay();
        break;
      case ('next'):
        this.player.nextTrack();
        this.newSong();
        break;
      case ('previous'):
        this.player.previousTrack();
        this.newSong();
        break;
      default:
    }
  }

  newSong = async () => {
    await clearInterval(this.state.currentTimer);
    this.startTimer(0);
  }

  pauseTimer = async () => {
    let timer = this.state.currentTimer;
    await clearInterval(timer);
  }

  restartTimer = async () => {
    let timer = setInterval(e => {
      this.setState(st => ({ trackTimer: st.trackTimer + 1000 }))
    }, 1000);

    this.setState({ currentTimer: timer });
  }

  startTimer = (start) => {
    this.setState({ trackTimer: +start })
    let timer = setInterval(e => {
      this.setState(st => ({ trackTimer: st.trackTimer + 1000 }))
    }, 1000);

    this.setState({ currentTimer: timer });
  }

  changeCurrentTrackTime = (time) => {
    if (this.state.trackTimer == 0) {
      this.startTimer(time);
      this.player.seek(time);
    } else {
      this.setState({ trackTimer: +time })
      this.player.seek(time);
    }
  }
  
  changeCurrentVolume = (volume) => {
    this.setState({ curVolume: volume })
    this.player.setVolume(volume)
  }

  getPlayerState = async () => {
    return this.player.getCurrentState;
  }

  validateLogIn = async (validated, token) => {
    if (validated) {
      await this.setState({ token });
      this.checkPlayerInterval();
    }
  }

  render() {
    const { loggedIn, redirect, token, deviceId, curTrack, curVolume, playing, trackTimer } = this.state;

    return (
      <Router>
        <Switch>
          <Route exact path='/landing' render={props => 
            <Landing {...props} 
                    changeCurrentTrackTime={this.changeCurrentTrackTime}
                    changeCurrentVolume={this.changeCurrentVolume}
                    pauseTimer={this.pauseTimer}
                    restartTimer={this.restartTimer}
                    curTrack={curTrack} 
                    curVolume={curVolume}
                    playing={playing} 
                    changePlayerSettings={this.changePlayerSettings} 
                    deviceId={deviceId} token={token} 
                    redirect={redirect} 
                    loggedIn={loggedIn} 
                    validateLogin={this.validateLogIn} 
                    trackTimer={trackTimer}
                    /> } />
          <Route exact path='/' render={props => <Agreement {...props} />} />
        </Switch>
      </Router>
    )

  }
}

