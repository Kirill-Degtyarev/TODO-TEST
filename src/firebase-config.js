import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp({
    apiKey: 'AIzaSyBuHpoeO_IabOUo5VuKIChvKK-mYTC1yb4',
    authDomain: 'todo-1471d.firebaseapp.com',
    projectId: 'todo-1471d',
    storageBucket: 'todo-1471d.appspot.com',
    messagingSenderId: '470590797567',
    appId: '1:470590797567:web:9c2cad3e4a436ca061feca',
    measurementId: 'G-7FLEK8PZX9',
});

export const db = getFirestore(app);
export const auth = getAuth(app);
