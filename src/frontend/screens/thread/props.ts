/* Copyright (C) 2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {FeedId, MsgId} from 'ssb-typescript';
import {MsgAndExtras} from '../../ssb/types';

type Basics = {
  selfFeedId: FeedId;
  replyToMsgId?: MsgId;
};

export type Props =
  | (Basics & {rootMsgId: MsgId; rootMsg?: never})
  | (Basics & {rootMsg: MsgAndExtras; rootMsgId?: never});
