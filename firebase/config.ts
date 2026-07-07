export type FirebaseEnvironmentConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

declare const process: {
  env: Record<string, string | undefined>;
};

function readExpoPublicEnv(key: string) {
  return process.env[key] ?? '';
}

export const firebaseEnvironmentConfig: FirebaseEnvironmentConfig = {
  apiKey: readExpoPublicEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: readExpoPublicEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: readExpoPublicEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: readExpoPublicEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readExpoPublicEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readExpoPublicEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
};

export function hasFirebaseEnvironmentConfig(config = firebaseEnvironmentConfig) {
  return Object.values(config).every(Boolean);
}
