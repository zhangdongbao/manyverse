/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {Req, StagedPeerMetadata} from '../../../drivers/ssb';

export type Actions = {
  removeDhtInvite$: Stream<string>;
  bluetoothSearch$: Stream<any>;
  openStagedPeer$: Stream<StagedPeerMetadata>;
};

export default function ssb(actions: Actions) {
  return xs.merge(
    actions.removeDhtInvite$.map(
      invite => ({type: 'dhtInvite.remove', invite} as Req),
    ),
    actions.bluetoothSearch$.mapTo(
      {type: 'searchBluetooth', interval: 20e3} as Req,
    ),
    actions.openStagedPeer$
      .filter(peer => peer.source === 'bt')
      .map(peer => ({type: 'connectBluetooth', address: peer.key} as Req)),
  );
}
