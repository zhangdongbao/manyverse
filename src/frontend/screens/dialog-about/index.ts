/* Copyright (C) 2018-2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {Command, NavSource} from 'cycle-native-navigation';
import {ReactSource, h} from '@cycle/react';
import {ReactElement} from 'react';
import {StyleSheet, NativeModules} from 'react-native';
import {Options} from 'react-native-navigation';
import {t} from '../../drivers/localization';
import MarkdownDialog from '../../components/dialogs/MarkdownDialog';

const version = NativeModules.BuildConfig.VERSION_NAME;

export type Sources = {
  screen: ReactSource;
  navigation: NavSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
};

export const navOptions: Options = MarkdownDialog.navOptions;

export const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});

export function dialogAbout(sources: Sources): Sinks {
  const repoLink = 'https://gitlab.com/staltz/manyverse';
  const authorsLink =
    'https://gitlab.com/staltz/manyverse/-/raw/master/AUTHORS';

  const vdom$ = xs.of(
    h(MarkdownDialog, {
      sel: 'dialog',
      title: t('dialog_about.title'),
      content:
        '[manyver.se](https://manyver.se)\n' +
        t('dialog_about.version', {version}) +
        '\n\n' +
        t('dialog_about.copyright') +
        ' 2018-2020 ' +
        `[${t('dialog_about.authors')}](${authorsLink})\n` +
        '\n' +
        `[${t('dialog_about.repository')}](${repoLink})\n` +
        t('dialog_about.licensed', {license1: 'MPL 2.0', license2: 'AGPL 3.0'}),
    }),
  );

  const command$ = xs
    .merge(
      sources.navigation.backPress(),
      sources.screen.select('dialog').events('close'),
    )
    .mapTo({type: 'dismissModal'} as Command);

  return {
    screen: vdom$,
    navigation: command$,
  };
}
