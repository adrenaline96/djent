import React, { Component } from 'react';
import { assoc, last, map, split } from 'ramda';

import logoPath from 'assets/images/logo.png';
import facebookLogoPath from 'assets/images/F_icon.svg';

import Expandable from 'components/Expandable';
import Spinner from 'components/Spinner';
import SwipeableViews from 'components/SwipeableViews';

import Instruments from 'containers/Instruments';
import Modal from 'containers/Modal';
import Player from 'containers/Player';
import Sequences from 'containers/Sequences';

import { defaultAllowedLengths } from 'reducers/sequences';

import presets, { backwardsCompatibility } from 'utils/presets';
import { getActiveSoundsFromHitTypes } from 'utils/instruments';
import { getLongURLFromShareID, getPresetFromData, handleGoogleAPI } from 'utils/short-urls';

import {
    presetToPlaylistItem,
} from 'utils/riffs';

import { isMobile } from 'utils/mobile';
import { compose, getHashQueryParam, logError, throttle } from 'utils/tools';

export default class Main extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        activePageIndex: 0,
        googleAPIHasLoaded: false
    }

    componentWillMount = () => {
        this.setupBackButtonController();

        const shareID = this.props.params.shareID;

        handleGoogleAPI()
            .then(() => {
                if (shareID) this.setupSharedItemsAndUpdate(shareID);
                this.setState({ googleAPIHasLoaded: true });
            })
            .catch(e => logError(e));

        if (!shareID) {
            const presetID = this.props.params.presetID || this.props.activePresetID;
            const preset = presets.find(p => p.id === presetID)
                         || presets.find(p => p.id === this.props.activePresetID);
            return this.props.actions.applyPreset(preset);
        }

        this.props.actions.enableModal({
            content: (<Spinner subtext="Loading..." />),
            isCloseable: false,
            className: 'modal--auto-width',
        });
    }

    componentDidMount = () => {
        this.refreshOnWindowResize();
    }

    componentWillUpdate = (nextProps) => {
        if (!this.props.params.shareID && nextProps.params.shareID) {
            this.setupSharedItemsAndUpdate(nextProps.params.shareID);
        }
    }

    componentWillUnmount = () => {
        window.removeEventListener('popstate', this.backToHome);
    }

    setupSharedItems = (shareID) => {
        const longURLPromises = shareID.split('-')
            .map(getLongURLFromShareID);

        return Promise.all(longURLPromises)
            .then(longURLs => {
                if (longURLs.length === 1 && longURLs[0].includes('-')) {
                    return compose(this.setupSharedItems, last, split('/'))(longURLs[0]);
                }
                const dataStrings = longURLs
                    .map(getHashQueryParam('share'));
                const sharedPresets = dataStrings
                    .map(this.dataStringToPreset);

                this.props.actions.applyPreset(sharedPresets[0]);

                const playlistPromises = sharedPresets
                    .map(presetToPlaylistItem);

                return Promise.all(playlistPromises)
                    .then(map(assoc('isLocked', true)));
            });
    }

    setupSharedItemsAndUpdate = (shareID) => {
        this.setupSharedItems(shareID)
            .then((audioPlaylist) => {
                this.props.actions.updateAudioPlaylist(audioPlaylist);
                this.props.actions.disableModal();
            })
            .catch(logError);
    }

    dataStringToPreset = (dataString) => compose(
        this.insertSoundsIntoPresetInstruments,
        preset => backwardsCompatibility(preset, defaultAllowedLengths),
        getPresetFromData,
    )(dataString);

    insertSoundsIntoPresetInstruments = preset => {
        preset.settings.instruments = preset.settings.instruments
            .map(i => {
                const inst = this.props.instruments.find(ins => ins.id === i.id);
                const sounds = getActiveSoundsFromHitTypes(i.predefinedHitTypes)
                    .map(sound => ({ ...inst.sounds.find(s => s.id === sound.id), ...sound }));
                return { ...i, sounds };
            });

        return preset;
    }

    refreshOnWindowResize = () => {
        const throttledFn = throttle(() => this.forceUpdate(), 500);
        window.addEventListener('resize', throttledFn);
    }

    setupBackButtonController = () => {
        window.addEventListener('popstate', this.backToHome);
    }

    backToHome = () => {
        if (document.location.hash !== '#fwd') {
            this.changeActivePageIndex(0);
        }
    }

    setActivePageIndex = (index) => {
        if (this.state.activePageIndex !== index) this.setState({ activePageIndex: index });
    }

    applySharedPreset = (data) => {
        let sharedPreset = getPresetFromData(data);

        if (sharedPreset) {
            // TODO: missed this bit out lol
            sharedPreset = backwardsCompatibility(sharedPreset, defaultAllowedLengths);
            sharedPreset.settings.instruments = sharedPreset.settings.instruments
                .map(i => ({ ...i, sounds: getActiveSoundsFromHitTypes(i.predefinedHitTypes) }));

            this.props.actions.applyPreset(sharedPreset);
        }

        this.props.actions.disableModal();
    }

    changeActivePageIndex = (index) => {
        if (this.state.activePageIndex === index) return;
        document.location.hash = index === 0 ? '' : '#fwd';
        this.setActivePageIndex(index);
    };

    render = () => {
        const tabs = ['Player', 'Sequences', 'Instruments']
            .map((tabName, i) => (
                <div
                    key={i}
                    className={`nav-tab ${i === this.state.activePageIndex ? 'is-active' : ''}`}
                    onClick={() => this.changeActivePageIndex(i)}
                >
                    <div className="nav-tab__inner">
                        { tabName }
                    </div>
                </div>
            ));
        const isMobileView = isMobile();
        const headerContent =  (
            <div className="">
                <div className="group-spacing-x">
                    <div className="u-flex-row u-flex-justify">
                        <img className="header__logo" src="assets/images/logo.png" />
                        <a className="" href="https://www.facebook.com/djenerationstation/" target="_blank">
                            <img
                                className="header__icon social-icon"
                                src="assets/images/F_icon.svg"
                                width="39"
                                height="39"
                            />
                        </a>
                    </div>
                </div>
            </div>
        );
        const expandableTitleClass = 'title-primary u-txt-large dropdown-icon-before group-padding-x group-padding-x-small@mobile group-capped-x group-centered u-curp';
        const views = isMobileView
            ? (
                <SwipeableViews
                    viewHeight={true}
                    resistance={true}
                    index={this.state.activePageIndex}
                    onChangeIndex={(i) => this.changeActivePageIndex(i)}
                >
                    <Player
                        route={this.props.route}
                        googleAPIHasLoaded={this.state.googleAPIHasLoaded}
                    />
                    <Sequences route={this.props.route} />
                    <Instruments route={this.props.route} />
                </SwipeableViews>
            )
            : (
                <div>
                    <Player
                        route={this.props.route}
                        googleAPIHasLoaded={this.state.googleAPIHasLoaded}
                    />
                    <div className="group-padding-y u-bdrb">
                        <Expandable
                            title="Sequences"
                            titleClassName={expandableTitleClass}
                            enableStateSave={true}
                        >
                            <Sequences route={this.props.route} />
                        </Expandable>
                    </div>
                    <div className="group-padding-y u-bdrb">
                        <Expandable
                            title="Instruments"
                            titleClassName={expandableTitleClass}
                            enableStateSave={true}
                        >
                            <Instruments route={this.props.route} />
                        </Expandable>
                    </div>
                </div>
            );

        return (
            <section>
                <Modal />
                <div className="site">
                    <div className="site__content" ref="content">
                        <div className="header" ref="header">
                            <div className="group-capped-x group-centered">
                                { headerContent }
                            </div>
                        </div>

                        { views }
                    </div>

                    {
                        isMobile
                      ? (
                          <div className="site__fixed">
                              <div className="u-flex-row u-flex-justify-around">
                              {
                                  isMobileView
                                  ? tabs
                                  : null
                              }
                              </div>
                          </div>
                        )
                      : null
                    }
                </div>
            </section>
        );
    }

}