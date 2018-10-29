/**
 * Manyverse is a mobile app for Secure Scuttlebutt networks
 *
 * Copyright (C) 2017 Andre 'Staltz' Medeiros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Stream} from 'xstream';
import {ReactSource} from '@cycle/react';
import {FeedId} from 'ssb-typescript';
import {StagedPeerMetadata as Staged} from '../../../drivers/ssb';
import {NavSource} from 'cycle-native-navigation';
import {State} from './model';
import sample from 'xstream-sample';

export default function intent(
  reactSource: ReactSource,
  navSource: NavSource,
  state$: Stream<State>,
  fabPress$: Stream<string>,
) {
  const back$ = navSource.backPress();
  return {
    showLANHelp$: reactSource.select('lan-mode').events('press'),

    showDHTHelp$: reactSource.select('dht-mode').events('press'),

    showPubHelp$: reactSource.select('pub-mode').events('press'),

    openStagedPeer$: reactSource
      .select('staged-list')
      .events('pressPeer') as Stream<Staged>,

    closeInviteMenu$: back$
      .compose(sample(state$))
      .filter(state => !!state.inviteMenuTarget)
      .mapTo(null),

    goBack$: back$
      .compose(sample(state$))
      .filter(state => !state.inviteMenuTarget)
      .mapTo(null),

    shareDhtInvite$: reactSource
      .select('slide-in-menu')
      .events('select')
      .filter(val => val === 'share')
      .compose(sample(state$))
      .map(
        state =>
          'dht:' +
          (state.inviteMenuTarget as Staged).key +
          ':' +
          state.selfFeedId,
      ),

    removeDhtInvite$: reactSource
      .select('slide-in-menu')
      .events('select')
      .filter(val => val === 'delete')
      .compose(sample(state$))
      .map(state => (state.inviteMenuTarget as Staged).key),

    infoClientDhtInvite$: reactSource
      .select('slide-in-menu')
      .events('select')
      .filter(val => val === 'info')
      .compose(sample(state$))
      .filter(state => (state.inviteMenuTarget as Staged).role !== 'server')
      .mapTo(null),

    infoServerDhtInvite$: reactSource
      .select('slide-in-menu')
      .events('select')
      .filter(val => val === 'info')
      .compose(sample(state$))
      .filter(state => (state.inviteMenuTarget as Staged).role === 'server')
      .mapTo(null),

    goToPeerProfile$: reactSource
      .select('connections-list')
      .events('pressPeer') as Stream<FeedId>,

    goToPasteInvite$: fabPress$.filter(action => action === 'invite-paste'),

    goToCreateInvite$: fabPress$.filter(action => action === 'invite-create'),
  };
}
