/* Copyright (C) 2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {Stream} from 'xstream';
import {Command} from 'cycle-native-navigation';
import {Reducer, StateSource} from '@cycle/state';
import {GlobalEvent} from '../../drivers/eventbus';
import {SSBSource} from '../../drivers/ssb';
import {Command as LocalizationCmd} from '../../drivers/localization';
import {FSSource} from '../../drivers/fs';
import model, {State} from './model';
import intent from './intent';
import navigation from './navigation';
import localization from './localization';

export type Sources = {
  state: StateSource<State>;
  ssb: SSBSource;
  fs: FSSource;
  globalEventBus: Stream<GlobalEvent>;
};

export type Sinks = {
  state: Stream<Reducer<State>>;
  navigation: Stream<Command>;
  localization: Stream<LocalizationCmd>;
};

export function global(sources: Sources): Sinks {
  const actions = intent(sources.globalEventBus);
  const cmd$ = navigation(actions, sources.state.stream);
  const reducer$ = model(sources.ssb);
  const updateLocalization$ = localization(sources.fs);

  return {
    navigation: cmd$,
    state: reducer$,
    localization: updateLocalization$,
  };
}
