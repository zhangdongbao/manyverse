/* Copyright (C) 2018-2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {h} from '@cycle/react';
import {t} from '../../drivers/localization';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../Button';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography as Typ} from '../../global-styles/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.backgroundTextWeak,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  containerOpened: {
    paddingVertical: Dimensions.verticalSpaceTiny,
    paddingHorizontal: Dimensions.horizontalSpaceSmall,
    borderRadius: 3,
    flexDirection: 'row',
  },

  containerClosed: {
    marginVertical: Dimensions.verticalSpaceNormal,
    marginHorizontal: Dimensions.horizontalSpaceNormal,
    paddingVertical: Dimensions.verticalSpaceBig,
    paddingHorizontal: Dimensions.horizontalSpaceNormal,
    borderRadius: 10,
    height: 215,
    flexDirection: 'column',
  },

  iconOpened: {
    marginRight: Dimensions.horizontalSpaceSmall,
  },

  iconClosed: {
    position: 'absolute',
    top: Dimensions.verticalSpaceLarge,
    left: Dimensions.horizontalSpaceLarge,
    opacity: 0.1,
  },

  title: {
    fontSize: Typ.fontSizeLarge,
    fontFamily: Typ.fontFamilyReadableText,
    marginBottom: Dimensions.verticalSpaceSmall,
    ...Platform.select({
      default: {
        textAlign: 'left',
      },
      ios: {
        textAlign: 'center',
      },
    }),
  },

  description: {
    color: Palette.textWeak,
    fontSize: Typ.fontSizeNormal,
    fontFamily: Typ.fontFamilyReadableText,
    lineHeight: Typ.baseSize * Typ.baseLeading,
  },

  toggleOpened: {
    marginLeft: Dimensions.horizontalSpaceNormal,
    color: Palette.text,
    fontFamily: Typ.fontFamilyReadableText,
    fontSize: Typ.fontSizeNormal,
    fontWeight: 'bold',
  },

  toggleClosed: {
    color: Palette.textForBackgroundBrand,
    backgroundColor: Palette.textWeak,
    width: 'auto',
    alignSelf: 'center',
  },
});

export type Props = {
  description: string;
  opened: boolean;
  onPressToggle: () => void;
  style?: StyleProp<ViewStyle>;
};

export default class ContentWarning extends PureComponent<Props> {
  public render() {
    const {description, opened, style} = this.props;

    return h(
      View,
      {
        style: [
          styles.container,
          opened ? styles.containerOpened : styles.containerClosed,
          style ?? null,
        ] as readonly ViewStyle[],
      },
      [
        h(
          View,
          {key: 'x', style: opened ? styles.iconOpened : styles.iconClosed},
          [
            h(Icon, {
              size: opened ? 24 : 144,
              color: Palette.textWeak,
              name: 'alert',
            }),
          ],
        ),
        h(View, {style: {flexShrink: 1}}, [
          opened
            ? null
            : h(
                Text,
                {key: 'a', style: styles.title, selectable: true},
                t('compose.dialogs.content_warning.title'),
              ),
          h(
            Text,
            {
              key: 'b',
              numberOfLines: opened ? 1 : 4,
              ellipsizeMode: 'tail',
              style: styles.description,
              selectable: true,
            },
            description,
          ),
        ]),
        opened
          ? h(
              TouchableOpacity,
              {key: 'c', onPress: this.props.onPressToggle, activeOpacity: 0.4},
              [
                h(
                  Text,
                  {style: styles.toggleOpened},
                  t('message.content_warning.call_to_action.hide'),
                ),
              ],
            )
          : h(Button, {
              key: 'c',
              text: t('message.content_warning.call_to_action.show'),
              onPress: this.props.onPressToggle,
              strong: true,
              style: styles.toggleClosed,
              accessible: true,
            }),
      ],
    );
  }
}
