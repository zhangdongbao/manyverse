/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {ReactSource} from '@cycle/react';
import {h} from '@cycle/react';
import {StateSource} from '@cycle/state';
import {View, Text, StyleSheet} from 'react-native';
import {Palette} from '../../../global-styles/palette';
import {Dimensions} from '../../../global-styles/dimens';
import HeaderMenuButton from '../../../components/HeaderMenuButton';
import {ReactElement} from 'react';
import {Typography} from '../../../global-styles/typography';
import HeaderCloseButton from '../../../components/HeaderCloseButton';
import {Req} from '../../../drivers/ssb';

export type State = {
  currentTab: 'public' | 'connections';
};

export type Sources = {
  screen: ReactSource;
  state: StateSource<State>;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  ssb: Stream<Req>;
  menuPress: Stream<any>;
};

export const styles = StyleSheet.create({
  container: {
    height: Dimensions.toolbarAndroidHeight,
    alignSelf: 'stretch',
    backgroundColor: Palette.backgroundBrand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Dimensions.horizontalSpaceBig,
  },

  title: {
    marginLeft: Dimensions.horizontalSpaceLarge,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.foregroundBrand,
    fontSize: Typography.fontSizeLarge,
    fontWeight: 'bold',
  },
});

function intent(reactSource: ReactSource) {
  return {
    menu$: reactSource.select('menuButton').events('press'),
  };
}

function tabTitle(tab: 'public' | 'connections') {
  if (tab === 'public') return 'Messages';
  if (tab === 'connections') return 'Connections';
  return '';
}

function ssb(reactSource: ReactSource) {
  return xs.merge(
    reactSource
      .select('labInit')
      .events('press')
      .mapTo({type: 'lab.init'} as Req),
    reactSource
      .select('labIndexes')
      .events('press')
      .mapTo({type: 'lab.indexes'} as Req),
    reactSource
      .select('labQuery')
      .events('press')
      .mapTo({type: 'lab.query'} as Req),
  );
}

function view(state$: Stream<State>) {
  return state$.map(state =>
    h(View, {style: styles.container}, [
      HeaderMenuButton('menuButton'),
      HeaderCloseButton('labInit'),
      HeaderCloseButton('labIndexes'),
      HeaderCloseButton('labQuery'),
      h(Text, {style: styles.title}, tabTitle(state.currentTab)),
    ]),
  );
}

export function topBar(sources: Sources): Sinks {
  const actions = intent(sources.screen);
  const vdom$ = view(sources.state.stream);
  const ssb$ = ssb(sources.screen);

  return {
    screen: vdom$,
    ssb: ssb$,
    menuPress: actions.menu$,
  };
}
