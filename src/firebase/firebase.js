import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { 
  appEnvironment,
  devConfig,
  prodConfig,
} from "./firebaseConfig";

// initialize firebase app
const app = initializeApp(appEnvironment === "DEV" ? devConfig : prodConfig);
// get auth for app
const auth = getAuth(app);

export {
  app,
  auth,
};
