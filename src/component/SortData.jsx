import { useState, useEffect } from 'react';
// 1. 修正路徑，並補上 query
import { ref, query, orderByChild, onValue } from 'firebase/database'; 
import {db} from '../../firebase.js';

const SortData = () => {
    const [familyList, setFamilyList] = useState([]);
    const [sortField, setSortField] = useState('age');
    const [isDec,setIsDec]= useState(false);
    useEffect(() => {
        const familyRef = ref(db, 'family');
        // 現在 query 已經正確引入，這行就能跑了
        const sortedQuery = query(familyRef, orderByChild(sortField));

        const unsubscribe = onValue(sortedQuery, (snapshot) => {
            console.log("目前排序欄位:", sortField);
            const tempArray = [];
            // 維持排序的關鍵
            // 1. 先抓出升序排列的原始資料
            snapshot.forEach(childSnapshot => {
                tempArray.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            // 2. 根據 isDec 狀態決定是否反轉陣列
            if(isDec){
                tempArray.reverse();
            }
            setFamilyList(tempArray);
        }, (error) => {
            console.error("Firebase 讀取失敗:", error);
        });

        return () => unsubscribe();
    }, [sortField,isDec]); // 依賴 isDec，當它改變時也重新執行

    return (
    // bg-dark = 深色背景, text-light = 白色文字, rounded = 圓角, shadow = 陰影
    <div className='container p-4 bg-dark text-light rounded shadow-sm mt-4'>
        <h2 className='h2 fw-bold mb-4'>👨‍👩‍👧‍👦 家庭成員資料表</h2>

        <div className='d-flex align-items-center mb-4'>
            <label className='me-2 small text-secondary'>排序依據:</label>
            {/* form-select 是 Bootstrap 的下拉選單樣式 */}
            <select 
                className='form-select form-select-sm w-auto bg-secondary text-white border-0'
                onChange={(e) => setSortField(e.target.value)}
                value={sortField}
            >
                <option value="age">年齡 (Age)</option>
                <option value="height">身高 (Height)</option>
                <option value="weight">體重 (Weight)</option>
            </select>

            {/* btn btn-outline-primary 是 Bootstrap 的按鈕樣式 */}
            <button
                onClick={() => setIsDec(!isDec)}
                className={`btn btn-sm ms-3 ${isDec ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
                {isDec ? '降冪 (大到小)' : '升冪 (小到大)'}
            </button>
        </div>

        <div className='row row-cols-1 g-3'>
            {familyList.map(member => (
                <div className='col' key={member.id}>
                    {/* card 是 Bootstrap 的卡片組件 */}
                    <div className='card bg-secondary text-white border-0 border-start border-4 border-info shadow-sm'>
                        <div className='card-body'>
                            <h3 className='h5 card-title text-info'>{member.title}</h3>
                            <p className='card-text small mb-0'>
                                年齡: <span className='fw-bold'>{member.age}</span> 歲 |
                                身高: <span className='fw-bold'>{member.height}</span> 公分 |
                                體重: <span className='fw-bold'>{member.weight}</span> 公斤
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}

export default SortData;