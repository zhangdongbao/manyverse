/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {
  Command,
  PopCommand,
  NavSource,
  PushCommand,
} from 'cycle-native-navigation';
import {Msg, MsgId, About} from 'ssb-typescript';
import {SSBSource, Likes} from '../../drivers/ssb';
import {ReactSource, h} from '@cycle/react';
import {ReactElement} from 'react';
import {Dimensions} from '../../global-styles/dimens';
import {navOptions as rawMessageScreenNavOptions} from '../raw-msg';
import {Screens} from '../..';
import { View, Text } from 'react-native';
import { Reducer, StateSource } from '@cycle/state';

export type Props = {msgKey: MsgId, likes: Likes};

export type Sources = {
  props: Stream<Props>;
  screen: ReactSource;
  navigation: NavSource;
  state: StateSource<State>;
  ssb: SSBSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<State>>;
};

export type State = {
  likers: Stream<Array<About>>;
}

export const navOptions = {
  topBar: {
    visible: true,
    drawBehind: false,
    height: Dimensions.toolbarAndroidHeight,
    title: {
      text: 'Likes',
    },
    backButton: {
      icon: require('../../../../images/icon-arrow-left.png'),
      visible: true,
    },
  },
};

export type Actions = {
  goBack$: Stream<any>;
  goToRawMsg$: Stream<Msg>;
};

function navigation(actions: Actions) {
  const pop$ = actions.goBack$.mapTo({
    type: 'pop',
  } as PopCommand);

  const toRawMsg$ = actions.goToRawMsg$.map(
    msg =>
      ({
        type: 'push',
        layout: {
          component: {
            name: Screens.RawMessage,
            passProps: {msg},
            options: rawMessageScreenNavOptions,
          },
        },
      } as PushCommand),
  );

  return xs.merge(pop$, toRawMsg$);
}

function intent(navSource: NavSource, reactSource: ReactSource) {
  return {
    goBack$: navSource.backPress(),

    goToRawMsg$: reactSource.select('accounts').events('pressMsg'),
  };
}

export function accounts(sources: Sources): Sinks {
  const actions = intent(sources.navigation, sources.screen);

  const vdom$ = sources.state.stream
    .map(state => state.likers)
    .flatten()
    .map(likers => {
      return h(View, {},
        [
          h(Text, {}, `${likers.map(like => like.name).join(', ')} # ${likers.map(like => like.imageUrl).join(', ')}`),
        ]
      )
    });

  const command$ = navigation(actions);

  const reducer$ = sources.props.map(
    props =>
      function propsReducer(): State {
        if (props.likes === null) {
          return { likers: xs.from([]) }
        } else {
          return { likers: sources.ssb.liteAbout$(props.likes) }
        }
      },
  );

  return {
    screen: vdom$,
    navigation: command$,
    state: reducer$,
  };
}
