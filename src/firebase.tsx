import React, { useEffect, useState, FunctionComponent } from "react";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

interface IFirebaseProvider {
  children: React.ReactNode | JSX.ElementChildrenAttribute;
}

interface IFirebaseContext {
  user: firebase.User | null;
  loaded: boolean;
}

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DB,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MID,
};
firebase.initializeApp(config);
firebase.analytics();

export const appAuth = firebase.auth();

export const FirebaseContext = React.createContext<IFirebaseContext>({
  user: null,
  loaded: false,
});

export const AuthProvider: FunctionComponent<IFirebaseProvider> = ({
  children,
}: IFirebaseProvider) => {
  const [user, setUser] = useState<firebase.User | null>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((loggedInUser) => {
      setLoaded(true);
      setUser(loggedInUser);
    });
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loaded } as IFirebaseContext}>
      {children}
    </FirebaseContext.Provider>
  );
};

const storageRef = firebase.storage();

const uploadMetadata = {
  cacheControl: "public,max-age=3000",
};

export const uploadImage = (image: any, timestamp: number): any =>
  storageRef
    .ref(`/images/${timestamp + image.name}`)
    .put(image, uploadMetadata);

const databaseRef = firebase.database();

export const categoryRef = (uid = null): any =>
  databaseRef.ref(
    `categories/${uid || databaseRef.ref().child("categories").push().key}`
  );

export const categoriesRef = (): any => databaseRef.ref("categories");

export default firebase;
