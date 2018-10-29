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
import {DialogSource} from '../../../drivers/dialogs';
import {Palette} from '../../../global-styles/palette';

export type Actions = {
  noteDhtInvite$: Stream<any>;
};

export default function dialog(actions: Actions, dialogSource: DialogSource) {
  return {
    addNoteFromDialog$: actions.noteDhtInvite$
      .map(() =>
        dialogSource.prompt(
          'Add note',
          'Write a private (just for yourself) note about this invite code. ' +
            'For example: "This is for Alice"',
          {
            contentColor: Palette.textWeak,
            positiveColor: Palette.text,
            positiveText: 'Add',
            negativeColor: Palette.text,
            negativeText: 'Cancel',
          },
        ),
      )
      .flatten()
      .filter(res => res.action === 'actionPositive')
      .map(res => (res as any).text as string),
  };
}
