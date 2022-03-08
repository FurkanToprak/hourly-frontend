// eslint-disable-next-line import/prefer-default-export
export const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
if (googleClientId === '') {
  throw Error('Google client ID missing!');
}

export const realmAppId = process.env.REACT_APP_REALM_APP_ID || '';
if (realmAppId === '') {
  throw Error('Realm app ID missing!');
}
