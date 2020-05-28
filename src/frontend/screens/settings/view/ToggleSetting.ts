/* Copyright (C) 2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {PureComponent} from 'react';
import {h} from '@cycle/react';
import {
  View,
  Text,
  Platform,
  TouchableNativeFeedback,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {Palette} from '../../../global-styles/palette';
import {Typography} from '../../../global-styles/typography';
import {Dimensions} from '../../../global-styles/dimens';

const Touchable = Platform.select<any>({
  android: TouchableNativeFeedback,
  default: TouchableOpacity,
});

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Dimensions.verticalSpaceNormal,
    paddingHorizontal: Dimensions.horizontalSpaceBig,
    minHeight: 60,
  },

  titleSubtitleColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },

  title: {
    fontSize: Typography.fontSizeNormal,
    color: Palette.text,
  },

  subtitle: {
    fontSize: Typography.fontSizeSmall,
    color: Palette.textWeak,
  },
});

export type Props = {
  title: string;
  subtitle?: string;
  value: boolean;
  accessibilityLabel: string;
  onValueChange?: (value: boolean) => void;
};

export default class ToggleSetting extends PureComponent<Props> {
  public render() {
    const {
      title,
      subtitle,
      value,
      onValueChange,
      accessibilityLabel,
    } = this.props;

    const touchableProps: any = {
      onPress: () => {
        this.props.onValueChange?.(!value);
      },
      pointerEvents: 'box-only',
      accessible: true,
      accessibilityRole: 'switch',
      accessibilityLabel,
    };
    if (Platform.OS === 'android') {
      touchableProps.background = TouchableNativeFeedback.Ripple(
        Palette.backgroundVoid,
      );
    }

    return h(Touchable, touchableProps, [
      h(View, {style: styles.container}, [
        h(View, {style: styles.titleSubtitleColumn}, [
          h(Text, {style: styles.title}, title),
          subtitle ? h(Text, {style: styles.subtitle}, subtitle) : null,
        ]),
        h(Switch, {
          ...Platform.select({
            ios: {
              trackColor: {
                false: Palette.backgroundBrand,
                true: Palette.backgroundBrand,
              },
            },
          }),
          value,
          onValueChange,
        }),
      ]),
    ]);
  }
}
