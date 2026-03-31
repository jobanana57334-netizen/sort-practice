// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// 建立一個安全取得環境變數的輔助小工具
const getEnv=(key)=>{
    // 1. 優先檢查是否在 Vite / 現代瀏覽器環境
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        return import.meta.env[key];
    }
    
    // 2. 檢查是否在 Node.js 環境 (加上 typeof process 的安全檢查)
    // 這一行是修復你報錯的關鍵！
    // 加上下面這行註解，告訴 ESLint 忽略這一區塊的「未定義」檢查
    /*eslint-disable no-undef*/
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    /*eslint-enable no-undef*/
    return undefined;
}

const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    databaseURL: getEnv('VITE_FIREBASE_DB_URL'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID'),
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 取得資料庫實例並導出
export const db= getDatabase(app);