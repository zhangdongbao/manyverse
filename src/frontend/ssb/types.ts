/* Copyright (C) 2018-2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {Msg, Content, FeedId, About, MsgId} from 'ssb-typescript';
import {Stream} from 'xstream';
import {Peer as ConnQueryPeer} from 'ssb-conn-query/lib/types';

export type Reactions = Array<[FeedId, string]> | null;

export type PressAddReactionEvent = {
  msgKey: MsgId;
  value: 0 | 1;
  reaction: string | null;
};

export type PressReactionsEvent = {
  msgKey: MsgId;
  reactions: Reactions;
};

export type MsgAndExtras<C = Content> = Msg<C> & {
  value: {
    _$manyverse$metadata: {
      reactions?: Stream<NonNullable<Reactions>>;
      about: {
        name?: string;
        imageUrl: string | null;
      };
      contact?: {
        name?: string;
      };
    };
  };
};

export type ThreadSummary<C = Content> = {
  root: Msg<C>;
  replyCount: number;
};

export type ThreadSummaryWithExtras = {
  root: MsgAndExtras;
  replyCount: number;
};

export type ThreadAndExtras = {
  messages: Array<MsgAndExtras>;
  full: boolean;
  errorReason?: 'blocked' | 'missing' | 'unknown';
};

export type PrivateThreadAndExtras = ThreadAndExtras & {
  recps: Array<{
    id: string;
    name?: string;
    imageUrl: string | null | undefined;
  }>;
};

export type AnyThread = ThreadAndExtras | PrivateThreadAndExtras;

export type AboutAndExtras = About & {
  id: FeedId;
  followsYou?: boolean;
};

export type PeerKV = ConnQueryPeer;

export type StagedPeerMetadata = {
  key: string;
  type: 'lan' | 'dht' | 'internet' | 'bt';
  role?: 'client' | 'server';
  note?: string;
};

export type StagedPeerKV = [string, StagedPeerMetadata];
