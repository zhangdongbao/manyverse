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
import {Command} from 'cycle-native-asyncstorage';
import {State, StagedPeer} from './model';
import dropRepeats from 'xstream/extra/dropRepeats';

function isDhtInviteWithNote(invite: StagedPeer) {
  return !!invite.note && invite.source === 'dht';
}

export function noteStorageKeyFor(invite: StagedPeer) {
  return `dhtInviteNote:${invite.key}`;
}

export default function asyncStorage(state$: Stream<State>) {
  const command$ = state$
    .compose(dropRepeats((s1, s2) => s1.stagedPeers === s2.stagedPeers))
    .filter(state => state.stagedPeers.some(isDhtInviteWithNote))
    .map(state => {
      const keyValuePairs = state.stagedPeers
        .filter(isDhtInviteWithNote)
        .map(peer => [noteStorageKeyFor(peer), peer.note]);
      return {type: 'multiSet', keyValuePairs} as Command;
    });

  return command$;
}
