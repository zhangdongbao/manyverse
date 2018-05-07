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

import {StyleSheet, Animated} from 'react-native';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography} from '../../global-styles/typography';

export const navigatorStyle = {
  statusBarColor: Palette.brand.backgroundDarker,
  navBarHidden: true,
};

export const avatarSizeCollapsed = Dimensions.avatarSizeNormal;
export const avatarSizeExpanded = Dimensions.avatarSizeBig;
export const avatarSizeExpandedHalf = avatarSizeExpanded * 0.5;
export const avatarSizeCollapseRatio = avatarSizeCollapsed / avatarSizeExpanded;
export const avatarCollapsedTranslateX = 28;
// TODO figure out this math properly, emulating transform-origin
// Dimensions.toolbarAndroidHeight -
// Dimensions.horizontalSpaceBig +
// Dimensions.horizontalSpaceSmall;
export const avatarCollapsedTranslateY = -28;
// TODO figure out this math properly, emulating transform-origin
// -Dimensions.toolbarAndroidHeight +
// (Dimensions.toolbarAndroidHeight - avatarSizeCollapsed) * 0.5;
const nameHeight = 35;
const descriptionAreaHeight = 105;

const scrollTransitionInputRange = [0, 100];

export function coverScrolling(animValue: Animated.Value) {
  return {
    marginTop: 0,
    // animValue.interpolate({
    //   inputRange: scrollTransitionInputRange,
    //   outputRange: [0, -avatarSizeExpandedHalf],
    //   extrapolate: 'clamp',
    // }),
  };
}

export function avatarScrolling(animValue: Animated.Value) {
  return {
    transform: [
      {
        translateX: animValue.interpolate({
          inputRange: scrollTransitionInputRange,
          outputRange: [0, avatarCollapsedTranslateX],
          extrapolate: 'clamp',
        }),
      },
      {
        translateY: animValue.interpolate({
          inputRange: scrollTransitionInputRange,
          outputRange: [0, avatarCollapsedTranslateY],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: animValue.interpolate({
          inputRange: scrollTransitionInputRange,
          outputRange: [1, avatarSizeCollapseRatio],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
}

export function nameScrolling(animValue: Animated.Value) {
  return {
    transform: [
      {
        translateX: animValue.interpolate({
          inputRange: scrollTransitionInputRange,
          outputRange: [0, 2],
          extrapolate: 'clamp',
        }),
      },
      {
        translateY: animValue.interpolate({
          inputRange: scrollTransitionInputRange,
          outputRange: [0, -8],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
}

export function descriptionAreaScrolling(animValue: Animated.Value) {
  return {
    marginTop: animValue.interpolate({
      inputRange: scrollTransitionInputRange,
      outputRange: [0, -descriptionAreaHeight],
      extrapolate: 'clamp',
    }),
  };
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Palette.brand.voidBackground,
    flexDirection: 'column',
  },

  navbar: {
    alignSelf: 'stretch',
    zIndex: 20,
  },

  cover: {
    backgroundColor: Palette.brand.background,
    height: avatarSizeExpandedHalf,
    zIndex: 10,
  },

  avatarBackground: {
    height: avatarSizeExpanded,
    width: avatarSizeExpanded,
    position: 'relative',
    top: -avatarSizeExpandedHalf,
    left: Dimensions.horizontalSpaceBig,
    zIndex: 30,
    borderRadius: Dimensions.avatarBorderRadius,
    backgroundColor: Palette.indigo1,
  },

  avatar: {
    position: 'absolute',
    borderRadius: Dimensions.avatarBorderRadius,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  nameWrapper: {
    maxWidth: 220,
    height: nameHeight,
    top:
      -avatarSizeExpanded -
      avatarSizeExpandedHalf +
      Dimensions.verticalSpaceSmall,
    left: Dimensions.horizontalSpaceBig + 80 + Dimensions.horizontalSpaceBig,
    zIndex: 30,
  },

  name: {
    color: 'white',
    fontSize: Typography.fontSizeLarge,
    fontFamily: Typography.fontFamilyReadableText,
    fontWeight: 'bold',
  },

  descriptionArea: {
    top: -avatarSizeExpanded - nameHeight,
    marginBottom: -avatarSizeExpanded,
    zIndex: 10,
    paddingTop: avatarSizeExpandedHalf + Dimensions.verticalSpaceNormal,
    paddingBottom: Dimensions.verticalSpaceNormal,
    paddingLeft: Dimensions.horizontalSpaceBig,
    paddingRight: Dimensions.horizontalSpaceBig,
    backgroundColor: Palette.brand.textBackground,
    height: descriptionAreaHeight,
  },

  description: {
    fontSize: Typography.fontSizeNormal,
    color: Palette.brand.text,
  },

  follow: {
    position: 'absolute',
    top: Dimensions.verticalSpaceSmall,
    right: Dimensions.horizontalSpaceBig,
    zIndex: 40,
  },

  feed: {
    top: -avatarSizeExpandedHalf + Dimensions.verticalSpaceNormal * 0.5,
    bottom: 0,
    backgroundColor: Palette.brand.voidBackground,
    alignSelf: 'stretch',
  },

  feedWithHeader: {
    top: -avatarSizeExpandedHalf + Dimensions.verticalSpaceNormal,
    bottom: 0,
    backgroundColor: Palette.brand.voidBackground,
    alignSelf: 'stretch',
  },
});
