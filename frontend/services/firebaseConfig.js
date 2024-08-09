// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getIdToken } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWgREkR9PUOciHCnpGg4Ag0NAVwLjvqiw",
  authDomain: "my-app-ifocus.firebaseapp.com",
  projectId: "my-app-ifocus",
  storageBucket: "my-app-ifocus.appspot.com",
  messagingSenderId: "982876115962",
  appId: "1:982876115962:web:c327175f06708886454a43",
  measurementId: "G-LQDLGJSGWG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const createUserWithRole = async (email, password, phone, role) => {
    try {
        // Cria o usuário com Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Adiciona a "role" ao Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            phone: phone,
            role: role
        });

        console.log("User created with role:", role);
    } catch (error) {
        console.error("Error creating user with role:", error.message);
    }
};

const getAuthToken = async () => {
  const user = getAuth().currentUser;
  if (!user) {
    console.error('User is not authenticated');
    return null;
  }
  try {
    const token = await user.getIdToken(true);  // Force refresh
    return token;
  } catch (error) {
    console.error('Failed to get token', error);
    return null;
  }
};

// const getUserId = async () => {
//   const user = getAuth().currentUser;
//   console.log("USER", user)
//   user_id = user.uid
//   console.log("USER", user)
//   return user;
// }

export { auth, db, app, createUserWithRole, getAuthToken };