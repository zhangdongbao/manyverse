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

import {Stream} from 'xstream';
import {View, Animated, Image, Text} from 'react-native';
import {h} from '@cycle/native-screen';
import Feed from '../../components/Feed';
import Button from '../../components/Button';
import ToggleButton from '../../components/ToggleButton';
import NavBarWithBack from '../../components/NavBarWithBack';
import {SSBSource} from '../../drivers/ssb';
import {
  styles,
  coverScrolling,
  avatarScrolling,
  nameScrolling,
  descriptionAreaScrolling,
} from './styles';
import {State} from './model';
import {Screens} from '../..';
import {isRootPostMsg} from 'ssb-typescript/utils';

function renderCover(state: State) {
  return h(Animated.View, {
    style: [styles.cover, coverScrolling(state.yOffset)],
  });
}

function renderAvatar(state: State) {
  return h(
    Animated.View,
    {
      style: [styles.avatarBackground, avatarScrolling(state.yOffset)],
    },
    [
      h(Image, {
        style: styles.avatar,
        source: {uri: state.about.imageUrl || undefined},
      }),
    ],
  );
}

function renderName(state: State) {
  return h(
    Animated.View,
    {style: [styles.nameWrapper, nameScrolling(state.yOffset)]},
    [
      h(
        Text,
        {
          style: styles.name,
          numberOfLines: 1,
          ellipsizeMode: 'middle',
          accessible: true,
          accessibilityLabel: 'Profile Name',
        } as any,
        state.about.name,
      ),
    ],
  );
}

function renderDescription(state: State, isSelfProfile: boolean) {
  return h(
    Animated.View,
    {
      style: [styles.descriptionArea, descriptionAreaScrolling(state.yOffset)],
      accessible: true,
      accessibilityLabel: 'Profile Description',
    },
    [
      isSelfProfile
        ? h(Button, {
            selector: 'editProfile',
            style: styles.follow,
            text: 'Edit profile',
            accessible: true,
            accessibilityLabel: 'Edit Profile Button',
          })
        : h(ToggleButton, {
            selector: 'follow',
            style: styles.follow,
            text: state.about.following === true ? 'Following' : 'Follow',
            toggled: state.about.following === true,
          }),

      h(
        Text,
        {style: styles.description, numberOfLines: 2},
        state.about.description || '',
      ),
    ],
  );
}

export default function view(state$: Stream<State>, ssbSource: SSBSource) {
  return state$.map((state: State) => {
    const isSelfProfile = state.displayFeedId === state.selfFeedId;

    return {
      screen: Screens.Profile,
      vdom: h(View, {style: styles.container}, [
        h(NavBarWithBack, {style: styles.navbar}),
        renderCover(state),
        renderAvatar(state),
        renderName(state),
        renderDescription(state, isSelfProfile),

        h(Feed, {
          style: isSelfProfile ? styles.feedWithHeader : styles.feed,
          selector: 'feed',
          getReadable: state.getFeedReadable,
          getPublicationsReadable: isSelfProfile
            ? state.getSelfRootsReadable
            : null,
          publication$: isSelfProfile
            ? ssbSource.publishHook$.filter(isRootPostMsg)
            : null,
          selfFeedId: state.selfFeedId,
          animatedYOffset: state.yOffset,
          showPublishHeader: isSelfProfile,
        }),
      ]),
    };
  });
}
