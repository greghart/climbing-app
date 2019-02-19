import * as express from 'express';

interface Options extends express.CookieOptions {
  // Whether cookies are local or not.
  isLocal?: boolean;
  // Whether cookies should just last length of browser session
  browserSession?: boolean;
}

/**
 * Get the options to use for setting up cookies.
 * @param {object} options Options to use.
 * @returns object used for both session `cookie` options and `setCookie`.
 */
function getCookieOptions(_options: Options = {}) {
  const options = {
    isLocal: false,
    browserSession: false,
    ..._options,
  };
  let cookieOptions: express.CookieOptions;
  if (options.isLocal) {
    cookieOptions = {
      signed: true,
      httpOnly: true,
    };
  } else {
    cookieOptions = {
      domain: '.power-putty.com',
      secure: true,
      httpOnly: true,
      signed: true,
    };
  }
  // cookie will only last for the current browser session
  if (options.browserSession) {
    cookieOptions.expires = undefined;
  }
  if (options.maxAge) {
    cookieOptions.maxAge = options.maxAge;
  }
  return cookieOptions;
}

export default getCookieOptions;
