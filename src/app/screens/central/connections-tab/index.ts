/**
 * Manyverse is a mobile app for Secure Scuttlebutt networks
 *
 * Copyright (C) 2017 Andre 'Staltz' Medeiros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Stream} from 'xstream';
import {ReactElement} from 'react';
import {StateSource, Reducer} from '@cycle/state';
import {Command as AlertCommand} from 'cycle-native-alert';
import {ReactSource} from '@cycle/react';
import {Command, NavSource} from 'cycle-native-navigation';
import {SharedContent} from 'cycle-native-share';
import {IFloatingActionProps as FabProps} from 'react-native-floating-action';
import {NetworkSource} from '../../../drivers/network';
import {SSBSource, Req} from '../../../drivers/ssb';
import {DialogSource} from '../../../drivers/dialogs';
import view from './view';
import intent from './intent';
import model, {State} from './model';
import floatingAction from './fab';
import alert from './alert';
import ssb from './ssb';
import navigation from './navigation';

export type Sources = {
  screen: ReactSource;
  navigation: NavSource;
  state: StateSource<State>;
  network: NetworkSource;
  ssb: SSBSource;
  fab: Stream<string>;
  dialog: DialogSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  alert: Stream<AlertCommand>;
  state: Stream<Reducer<State>>;
  ssb: Stream<Req>;
  fab: Stream<FabProps>;
  share: Stream<SharedContent>;
  exit: Stream<any>;
};

export function connectionsTab(sources: Sources): Sinks {
  const actions = intent(
    sources.screen,
    sources.navigation,
    sources.state.stream,
    sources.fab,
  );
  const vdom$ = view(sources.state.stream);
  const command$ = navigation(actions, sources.state.stream);
  const reducer$ = model(
    sources.state.stream,
    actions,
    sources.ssb,
    sources.network,
  );
  const fabProps$ = floatingAction(sources.state.stream);
  const ssb$ = ssb(actions);
  const alert$ = alert(actions, sources.state.stream);
  const share$ = actions.shareDhtInvite$.map(inviteCode => ({
    message:
      'Connect with me on Manyverse by pasting this invite code there:\n\n' +
      inviteCode,
    title: 'Manyverse Invite Code',
    dialogTitle: 'Give this invite code to one friend',
  }));

  return {
    alert: alert$,
    navigation: command$,
    screen: vdom$,
    state: reducer$,
    fab: fabProps$,
    ssb: ssb$,
    share: share$,
    exit: actions.goBack$,
  };
}
