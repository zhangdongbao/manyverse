/* Copyright (C) 2018-2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const pull = require('pull-stream');
const cat = require('pull-cat');
const backoff = require('pull-backoff');
const switchMap = require('pull-switch-map');
const combineLatest = require('pull-combine-latest');
import {Peer as PeerKV} from 'ssb-conn-query/lib/types';
import run = require('promisify-tuple');
import {imageToImageUrl} from './helpers/about';
import {Callback} from './helpers/types';
import {StagedPeerKV} from '../../shared-types';

type HostingDhtInvite = {seed: string; claimer: string; online: boolean};

function augmentPeerWithExtras(ssb: any) {
  const getAbout = ssb.cachedAbout.socialValue;
  return async ([addr, peer]: PeerKV, cb: Callback<[string, any]>) => {
    // Fetch name
    const nameOpts = {key: 'name', dest: peer.key};
    const [e1, nameResult] = await run(getAbout)(nameOpts);
    if (e1) return cb(e1);
    const name = nameResult || undefined;

    // Fetch avatar
    const avatarOpts = {key: 'image', dest: peer.key};
    const [e2, val] = await run(getAbout)(avatarOpts);
    if (e2) return cb(e2);
    const imageUrl = imageToImageUrl(val);

    // Fetch 'isInDB' boolean
    const isInDB: boolean = ssb.conn.db().has(addr);

    cb(null, [addr, {name, imageUrl, isInDB, ...peer}]);
  };
}

function augmentPeersWithExtras(ssb: any) {
  return async (kvs: Array<PeerKV>, cb: Callback<Array<PeerKV>>) => {
    const peers: Array<PeerKV> = [];
    for (const kv of kvs) {
      const [err, peer] = await run<any>(augmentPeerWithExtras(ssb))(kv);
      if (err) {
        cb(err);
        return;
      }
      peers.push(peer);
    }
    cb(null, peers);
  };
}

export = {
  name: 'connUtils',
  version: '1.0.0',
  manifest: {
    persistentConnect: 'async',
    persistentDisconnect: 'async',
    peers: 'source',
    stagedPeers: 'source',
  },
  permissions: {
    master: {
      allow: [
        'persistentConnect',
        'persistentDisconnect',
        'peers',
        'stagedPeers',
      ],
    },
  },
  init: function init(ssb: any) {
    return {
      persistentConnect(address: string, data: any, cb: Callback<any>) {
        // if we had 'autoconnect=false', then make it true
        ssb.conn.db().update(address, (prev: any) => {
          if (!prev.autoconnect) return {autoconnect: true};
          else return {};
        });

        ssb.conn.connect(address, data, cb);
      },

      persistentDisconnect(address: string, cb: Callback<any>) {
        // if we had 'autoconnect=true', then make it false
        ssb.conn.db().update(address, (prev: any) => {
          if (prev.autoconnect) return {autoconnect: false};
          else return {};
        });

        // disconnect
        ssb.conn.disconnect(address, cb);
      },

      peers() {
        return pull(
          ssb.conn.peers(),
          switchMap((peers: Array<PeerKV>) =>
            pull(
              cat([pull.once(0), backoff(1e3, 2, 60e3)]),
              pull.map(() => peers),
            ),
          ),
          pull.through((peers: Array<PeerKV>) => {
            for (const [, data] of peers) {
              if (data.key) ssb.cachedAbout.invalidate(data.key);
            }
          }),
          pull.asyncMap(augmentPeersWithExtras(ssb)),
        );
      },

      stagedPeers() {
        const connStagedPeers = pull(
          ssb.conn.stagedPeers(),
          pull.asyncMap(augmentPeersWithExtras(ssb)),
        );

        //#region DHT-related hacks (TODO ideally this should go through CONN)
        const hostingDHT = pull(
          cat([pull.values([[]]), ssb.dhtInvite.hostingInvites()]),
          pull.map((invites: Array<HostingDhtInvite>) =>
            invites
              .filter(invite => !invite.online)
              .map(
                ({seed}) =>
                  [
                    `dht:${seed}:${ssb.id}`,
                    {key: seed, type: 'dht', role: 'server'},
                  ] as StagedPeerKV,
              ),
          ),
        );

        const stagedTotal = pull(
          combineLatest(connStagedPeers, hostingDHT),
          pull.map(([as, bs]: any) => [...as, ...bs]),
        );
        //#endregion

        return stagedTotal;
      },
    };
  },
};
