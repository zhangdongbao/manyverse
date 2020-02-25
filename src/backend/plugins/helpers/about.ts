/* Copyright (C) 2020 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const blobIdToUrl = require('ssb-serve-blobs/id-to-url');

export function imageToImageUrl(val: any) {
  let image: string | null = val;
  if (!!val && typeof val === 'object' && val.link) image = val.link;
  const imageUrl: string | undefined = image ? blobIdToUrl(image) : undefined;
  return imageUrl;
}
