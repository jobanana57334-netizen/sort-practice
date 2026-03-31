
import * as dotenv from 'dotenv';
import {ref,set,enableLogging} from 'firebase/database';
import familyData from './db.json' with {type:'json'};

// 1. 載入環境變數 (讀取 Vite 的 .env.local)
dotenv.config({path:'.env.local'});

// 2. 使用動態匯入確保 db 在環境變數載入後才初始化
// 這是 Node.js ESM 確保順序的最穩做法
const {db} = await import('./firebase.js');
// 定義寫入函數

const initializeData=async()=>{
    // 🚀 第一步：開啟全偵錯模式
    // 這會讓終端機噴出一大堆連線細節，幫助我們抓到兇手
    enableLogging(true);
    try{
        /*eslint-disable no-undef*/
        console.log('📡 正在嘗試連線至：', process.env.VITE_FIREBASE_DB_URL);
        /*eslint-enable no-undef */
        const familyRef = ref(db, 'family');

        // 使用 Promise.race 來強制捕獲連線失敗
        // 這樣如果 10 秒沒動靜，我們會強迫拋出一個錯誤進入 catch
        await Promise.race([
            set(familyRef, familyData.family),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Firebase 連線超時，可能網址無效或網路封鎖")), 10000)
            )
        ]);
        console.log('✅ 資料已成功同步至雲端！');
        /*eslint-disable no-undef*/
        process.exit(0);
        /*eslint-enable no-undef*/
    }catch(error){
        // 🚀 第二步：印出具體錯誤物件
        console.error('❌ 【具體錯誤回報】');
        console.error('錯誤代碼 (Code):', error.code);     // 例如: PERMISSION_DENIED
        console.error('錯誤訊息 (Message):', error.message); // 詳細原因
        console.error('完整堆疊 (Stack):', error.stack);
        /*eslint-disable no-undef*/
        process.exit(1);
        /*eslint-enable no-undef*/
    }
};

initializeData();