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

import {StyleSheet} from 'react-native';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography} from '../../global-styles/typography';

const _tabItem = {
  backgroundColor: Palette.backgroundBrand,
  paddingTop: Dimensions.verticalSpaceNormal,
  paddingBottom: Dimensions.verticalSpaceNormal,
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.backgroundVoid,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Palette.backgroundBrand,
    minHeight: Dimensions.toolbarAndroidHeight,
  },

  headerIcon: {
    width: Dimensions.iconSizeNormal + Dimensions.horizontalSpaceBig * 2,
    height: Dimensions.iconSizeNormal + Dimensions.verticalSpaceNormal * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    marginLeft: Dimensions.horizontalSpaceNormal,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.foregroundBrand,
    fontSize: Typography.fontSizeLarge,
    fontWeight: 'bold',
  },

  indicatorViewPager: {
    flex: 1,
    flexDirection: 'column-reverse',
    backgroundColor: Palette.backgroundBrandStrong,
  },

  tabItem: _tabItem,

  tabItemSelected: {
    ..._tabItem,
    borderBottomWidth: 4,
    borderBottomColor: Palette.backgroundBrandWeaker,
  },

  pageContainer: {
    backgroundColor: Palette.backgroundVoid,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pagePlaceholder: {
    fontSize: Typography.fontSizeLarge,
    fontFamily: Typography.fontFamilyReadableText,
    textAlign: 'center',
  },

  updatesDot: {
    backgroundColor: Palette.foregroundBrand,
    width: 7,
    height: 7,
    position: 'absolute',
    top: -4,
    right: 1,
    borderRadius: 4,
  },

  syncingProgressBar: {
    position: 'absolute',
    left: 2,
    right: 2,
    bottom: 4.9,
  },

  menuBackdrop: {
    backgroundColor: Palette.transparencyDarkStrong,
    opacity: 1,
  },
});

export const iconProps = {
  headerIcon: {
    size: Dimensions.iconSizeNormal,
    color: Palette.foregroundBrand,
  },

  tab: {
    size: Dimensions.iconSizeNormal,
    color: Palette.backgroundBrandStronger,
  },

  tabSelected: {
    size: Dimensions.iconSizeNormal,
    color: Palette.foregroundBrand,
  },
};

export const topBarTitle = {
  color: Palette.foregroundBrand,
  fontSize: Typography.fontSizeLarge,
};
