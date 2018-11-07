/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {Req} from '../../../drivers/ssb';

export type Actions = {
  removeDhtInvite$: Stream<string>;
  bluetoothSearch$: Stream<any>;
};

export default function ssb(actions: Actions) {
  return xs.merge(
    actions.removeDhtInvite$.map(
      invite => ({type: 'dhtInvite.remove', invite} as Req),
    ),
    actions.bluetoothSearch$.mapTo(
      {type: 'searchBluetooth', interval: 60e3} as Req,
    ),
  );
}
