/* Copyright (C) 2018-2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {PeerKV, StagedPeerKV} from '../../../../../ssb/types';
import {t} from '../../../../../drivers/localization';

type KV = PeerKV | StagedPeerKV;

type Type =
  | 'bt'
  | 'lan'
  | 'internet'
  | 'dht'
  | 'pub'
  | 'room'
  | 'room-endpoint'
  | '?';

function detectType(data: KV[1]): Type {
  if (data.type === 'bt') return 'bt';
  if (data.type === 'lan') return 'lan';
  if (data.type === 'internet') return 'internet';
  if (data.type === 'dht') return 'dht';
  if (data.type === 'pub') return 'pub';
  if (data.type === 'room') return 'room';
  if (data.type === 'room-endpoint') return 'room-endpoint';
  const hubData = data as PeerKV[1];
  if (hubData.source === 'local') return 'lan';
  if (hubData.source === 'pub') return 'pub';
  if (hubData.source === 'internet') return 'internet';
  if (hubData.source === 'dht') return 'dht';
  if (hubData.inferredType === 'bt') return 'bt';
  if (hubData.inferredType === 'lan') return 'lan';
  if (hubData.inferredType === 'tunnel') return 'room-endpoint';
  if (hubData.inferredType === 'dht') return 'dht';
  if (hubData.inferredType === 'internet') return 'internet';
  return '?';
}

export function peerModeIcon(peer: KV[1]): string {
  const type = detectType(peer);
  switch (type) {
    case 'bt':
      return 'bluetooth';

    case 'lan':
      return 'wifi';

    case 'dht':
    case 'room-endpoint':
      return 'account-network';

    case 'pub':
    case 'room':
    case 'internet':
      return 'server-network';

    default:
      return 'help-network';
  }
}

export function peerModeDescription(data: KV[1]): string {
  const type = detectType(data);
  switch (type) {
    case 'bt':
      return t('connections.peers.types.bluetooth');

    case 'lan':
      return t('connections.peers.types.lan');

    case 'dht':
      return t('connections.peers.types.dht.connected');

    case 'room-endpoint':
      return t('connections.peers.types.room.endpoint');

    case 'room':
      return t('connections.peers.types.room.server');

    case 'pub':
      return t('connections.peers.types.pub');

    case 'internet':
      return t('connections.peers.types.server');

    default:
      return t('connections.peers.types.unknown');
  }
}

// TODO remove this when we rewrite ssb-dht-invite to make use of CONN
export function peerModeStagedDescription(peer: KV[1]): string {
  const type = detectType(peer);
  switch (type) {
    case 'bt':
      return t('connections.peers.types.bluetooth');

    case 'lan':
      return t('connections.peers.types.lan');

    case 'dht':
      if (peer.role === 'client')
        return t('connections.peers.types.dht.staging.client');
      else if (peer.role === 'server')
        return t('connections.peers.types.dht.staging.host');
      else return t('connections.peers.types.dht.staging.unknown');

    case 'room-endpoint':
      return t('connections.peers.types.room.endpoint');

    case 'room':
      return t('connections.peers.types.room.server');

    case 'pub':
      return t('connections.peers.types.pub');

    case 'internet':
      return t('connections.peers.types.server');

    default:
      return t('connections.peers.types.unknown');
  }
}

export function peerModeName(addr: KV[0], data: KV[1]): string {
  const type = detectType(data);
  const secondary =
    type === 'bt' ||
    type === 'lan' ||
    type === 'dht' ||
    type === 'room-endpoint'
      ? data.note || data.key
      : addr;
  return (data as any).name ?? secondary;
}
