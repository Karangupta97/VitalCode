const base64UrlToUint8Array = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob(padded);
  const bytes = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; i += 1) {
    bytes[i] = raw.charCodeAt(i);
  }

  return bytes;
};

const uint8ArrayToBase64Url = (value) => {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value || []);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const parseAuthenticatorAttachment = (credential) => {
  if (typeof credential.authenticatorAttachment === 'string') {
    return credential.authenticatorAttachment;
  }
  return null;
};

const credentialToJSON = (credential) => {
  if (!credential) {
    return null;
  }

  const response = credential.response || {};

  const base = {
    id: credential.id,
    type: credential.type,
    rawId: uint8ArrayToBase64Url(credential.rawId),
    authenticatorAttachment: parseAuthenticatorAttachment(credential),
    clientExtensionResults:
      typeof credential.getClientExtensionResults === 'function'
        ? credential.getClientExtensionResults()
        : {},
  };

  if (response.attestationObject) {
    return {
      ...base,
      response: {
        clientDataJSON: uint8ArrayToBase64Url(response.clientDataJSON),
        attestationObject: uint8ArrayToBase64Url(response.attestationObject),
        transports:
          typeof response.getTransports === 'function' ? response.getTransports() : [],
      },
    };
  }

  return {
    ...base,
    response: {
      clientDataJSON: uint8ArrayToBase64Url(response.clientDataJSON),
      authenticatorData: uint8ArrayToBase64Url(response.authenticatorData),
      signature: uint8ArrayToBase64Url(response.signature),
      userHandle: response.userHandle
        ? uint8ArrayToBase64Url(response.userHandle)
        : null,
    },
  };
};

const prepareAuthenticationOptions = (optionsJSON) => {
  return {
    ...optionsJSON,
    challenge: base64UrlToUint8Array(optionsJSON.challenge),
    allowCredentials: (optionsJSON.allowCredentials || []).map((credential) => ({
      ...credential,
      id: base64UrlToUint8Array(credential.id),
    })),
  };
};

const prepareRegistrationOptions = (optionsJSON) => {
  return {
    ...optionsJSON,
    challenge: base64UrlToUint8Array(optionsJSON.challenge),
    user: {
      ...optionsJSON.user,
      id: base64UrlToUint8Array(optionsJSON.user.id),
    },
    excludeCredentials: (optionsJSON.excludeCredentials || []).map((credential) => ({
      ...credential,
      id: base64UrlToUint8Array(credential.id),
    })),
  };
};

export const isDoctorBiometricSupported = () => {
  return Boolean(
    window.PublicKeyCredential &&
      navigator.credentials &&
      typeof navigator.credentials.get === 'function' &&
      typeof navigator.credentials.create === 'function'
  );
};

export const authenticateDoctorBiometric = async (optionsJSON) => {
  if (!isDoctorBiometricSupported()) {
    throw new Error('Biometric authentication is not supported on this device/browser.');
  }

  const publicKey = prepareAuthenticationOptions(optionsJSON);
  const credential = await navigator.credentials.get({ publicKey });

  if (!credential) {
    throw new Error('Biometric verification was not completed.');
  }

  return credentialToJSON(credential);
};

export const registerDoctorBiometric = async (optionsJSON) => {
  if (!isDoctorBiometricSupported()) {
    throw new Error('Biometric registration is not supported on this device/browser.');
  }

  const publicKey = prepareRegistrationOptions(optionsJSON);
  const credential = await navigator.credentials.create({ publicKey });

  if (!credential) {
    throw new Error('Biometric registration was not completed.');
  }

  return credentialToJSON(credential);
};
