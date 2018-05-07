/**
 * MMMMM is a mobile app for Secure Scuttlebutt networks
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

import {PureComponent} from 'react';
import {
  View,
  TouchableNativeFeedback,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Dimensions} from '../global-styles/dimens';
import {Palette} from '../global-styles/palette';
import {h} from '@cycle/native-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.brand.background,
    height: Dimensions.toolbarAndroidHeight,
    flexDirection: 'row',
  },

  backButton: {
    width: Dimensions.toolbarAndroidHeight,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type Props = {
  onBack?: () => void;
  style?: ViewStyle;
};

export default class NavBarWithBack extends PureComponent<Props, any> {
  public render() {
    const props = this.props;
    const touchableProps = {
      background: TouchableNativeFeedback.Ripple(Palette.brand.background),
      onPress: () => {
        if (this.props.onBack) this.props.onBack();
      },
    };

    // const viewProps = {
    //   style: [
    //     strong ? styles.containerStrong : styles.container,
    //     style,
    //   ] as ViewStyle,
    // };

    const containerStyle = props.style
      ? [styles.container, props.style]
      : styles.container;

    return h(View, {style: containerStyle}, [
      h(TouchableNativeFeedback, touchableProps, [
        h(View, {style: styles.backButton}, [
          h(Icon, {
            size: Dimensions.iconSizeNormal,
            color: Palette.white,
            name: 'arrow-left',
          }),
        ]),
      ]),
    ]);
  }
}
