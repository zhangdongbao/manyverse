/* Copyright (C) 2018-2019 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require('path');
const labInit = require('@staltz/binary-tests/init');
const labIndexes = require('@staltz/binary-tests/indexes');
const labQuery = require('@staltz/binary-tests/query');

function init(sbot: any, config: any) {
  return {
    init: (cb: any) => {
      console.log('LAB init');
      const offset = path.join(config.path, 'flume/log.offset');
      const aligned = path.join(config.path, 'lablog.aligned');
      labInit({offset, aligned}, cb);
    },

    indexes: (cb: any) => {
      console.log('LAB indexes');
      const aligned = path.join(config.path, 'lablog.aligned');
      labIndexes({aligned}, cb);
    },

    query: (cb: any) => {
      console.log('LAB query');
      const aligned = path.join(config.path, 'lablog.aligned');
      labQuery({aligned}, cb);
    },
  };
}

export = {
  name: 'lab',
  version: '1.0.0',
  manifest: {
    init: 'async',
    indexes: 'async',
    query: 'async',
  },
  permissions: {
    master: {
      allow: ['init', 'indexes', 'query'],
    },
  },
  init,
};
