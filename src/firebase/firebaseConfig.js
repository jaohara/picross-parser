// import dotenv from 'dotenv';
// dotenv.config();

// const devConfig = {
export const devConfig = {
  apiKey: import.meta.env.VITE_DEV_API_KEY,
  appId: import.meta.env.VITE_DEV_APP_ID,
  authDomain: import.meta.env.VITE_DEV_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_DEV_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_DEV_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_DEV_PROJECT_ID,
  storageBucket: import.meta.env.VITE_DEV_STORAGE_BUCKET,
};

// const prodConfig = {
export const prodConfig = {
  apiKey: import.meta.env.VITE_PROD_API_KEY,
  appId: import.meta.env.VITE_PROD_APP_ID,
  authDomain: import.meta.env.VITE_PROD_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_PROD_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_PROD_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_PROD_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PROD_STORAGE_BUCKET,
};

// const appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT;
export const appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT;
