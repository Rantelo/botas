/**
 * Random scripts
 * @module Scripts
 */
'use strict'
/**
 * Signature generating algorithm: (extracted from https://developers.google.com/maps/documentation/maps-static/get-api-key#client-id)
 *
 * 1. Generate query with clientID (signature is not added yet)
 * 2. Strip domain from request ( localhost:3000/  -- /maps/api/static?center=... )
 * 3. Retrieve private key, originally in Base64
 *    Sign the URL using HMAC-SHA1. First decode the private key.
 *    Note that Base64 for URLS replaces + and / with - and _
 * 4. Encode the resulting binary signature using the modified Base64
 * 5. Attach the signature to the URL
 **/
const crypto = require('crypto');
const { parse, format } = require('url');

const unmakeWebSafe = webSafeString => webSafeString
  .replace(/-/g, '+')
  .replace(/_/g, '/');

const makeWebSafe = unsafeString => unsafeString
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const decodeBase64Hash = key => Buffer.from ?
  Buffer.from(key, 'base64') :
  new Buffer( key, 'base64');

const encodeBase64Hash = (key, data) => crypto
  .createHmac('sha1', key)
  .update(data)
  .digest('base64');

/**
 * sign
 *
 * @param path
 * @param secret
 * @returns {undefined}
 */
const signGoogleMapsURL = (path, secret) => {
  const uri = parse(path);
  const webSafeSecret = decodeBase64Hash(unmakeWebSafe(secret));
  const signature = makeWebSafe(encodeBase64Hash(webSafeSecret, uri.path));

  return format(uri) + `&signature=${signature}`;
}

module.exports = signGoogleMapsURL;

