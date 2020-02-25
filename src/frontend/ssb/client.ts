/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import ssbClient from 'react-native-ssb-client';
import manifest from './manifest';
import hooksPlugin from './plugins/hooks';
import publishUtilsPlugin from './plugins/publishUtils';
import contactsPlugin from './plugins/contacts';
import syncingNotifications from './plugins/syncing-notifications';

function makeClient() {
  return ssbClient(manifest)
    .use(hooksPlugin())
    .use(publishUtilsPlugin())
    .use(contactsPlugin())
    .use(syncingNotifications())
    .callPromise();
}

// type ClientAPIFromManifest = {
//   [key in keyof typeof manifest]: typeof manifest[key] extends string
//     ? CallableFunction
//     : {
//         [key2 in keyof typeof manifest[key]]: CallableFunction;
//       };
// };

export default makeClient;
