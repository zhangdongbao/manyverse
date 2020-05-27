/* Copyright (C) 2018-2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import debounce from 'xstream/extra/debounce';
import {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {h} from '@cycle/react';
import {FeedId, MsgId, Msg} from 'ssb-typescript';
import {withXstreamProps} from 'react-xstream-hoc';
import {
  PressReactionsEvent,
  PressAddReactionEvent,
  ThreadSummaryWithExtras,
  Reactions,
} from '../ssb/types';
import {Dimensions} from '../global-styles/dimens';
import MessageContainer from './messages/MessageContainer';
import MessageFooter from './messages/MessageFooter';
import MessageHeader from './messages/MessageHeader';

export type Props = {
  thread: ThreadSummaryWithExtras;
  selfFeedId: FeedId;
  onPressFork?: (ev: {rootMsgId: MsgId}) => void; // FIXME: delete this?
  onPressReactions?: (ev: PressReactionsEvent) => void;
  onPressAddReaction?: (ev: PressAddReactionEvent) => void;
  onPressReply?: (ev: {msgKey: MsgId; rootKey: MsgId}) => void;
  onPressAuthor?: (ev: {authorFeedId: FeedId}) => void;
  onPressEtc?: (msg: Msg) => void;
  onPressExpand: (ev: {rootMsgId: MsgId}) => void;
};

/**
 * in pixels
 */
const CARD_HEIGHT = 350;
/**
 * in pixels
 */
const HEADER_HEIGHT = 40;
/**
 * in pixels
 */
const FOOTER_HEIGHT = 70;

export const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: CARD_HEIGHT,
  },

  header: {
    flex: 0,
    height: HEADER_HEIGHT,
    marginBottom: 0, // FIXME: maybe this should be inside MessageHeader?
  },

  post: {
    marginVertical: Dimensions.verticalSpaceNormal,
    flex: 1,
  },

  footer: {
    flex: 0,
    height: FOOTER_HEIGHT,
    marginBottom: -Dimensions.verticalSpaceBig,
  },
});

const MessageFooter$ = withXstreamProps(MessageFooter, 'reactions');

export default class ThreadCard extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const {
      thread,
      selfFeedId,
      onPressAddReaction,
      onPressReactions,
      onPressReply,
      onPressAuthor,
      // onPressExpand, // FIXME: implement this
      onPressEtc,
    } = this.props;
    const {root} = thread;
    const metadata = root.value._$manyverse$metadata;
    const reactions = (
      metadata.reactions ?? (xs.never() as Stream<Reactions>)
    ).compose(debounce(80)); // avoid DB reads flickering

    return h(MessageContainer, {style: styles.container}, [
      h(MessageHeader, {
        key: 'mh',
        style: styles.header,
        msg: root,
        name: metadata.about.name,
        imageUrl: metadata.about.imageUrl,
        onPressAuthor,
      }),
      h(View, {style: styles.post}, [
        h(Text, {key: 'a', numberOfLines: 1}, `root: ${root.key}`),
        h(Text, {key: 'b'}, `replies: ${thread.replyCount}`),
      ]),
      h(MessageFooter$, {
        key: 'mf',
        style: styles.footer,
        msg: root,
        selfFeedId,
        reactions,
        replyCount: thread.replyCount,
        onPressReactions,
        onPressAddReaction,
        onPressReply,
        onPressEtc,
      }),
    ]);
  }
}
