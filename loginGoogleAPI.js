import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// ⬇️ Firestore 관련 추가
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    // 본인의 설정값
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // ⬅️ Firestore 인스턴스
const provider = new GoogleAuthProvider();

// 구글 로그인
document.getElementById('googleLoginBtn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            
            // ⬇️ Firestore에 사용자 정보 저장
            await saveUserToFirestore(user, 'google');
            
            console.log('로그인 성공!');
        })
        .catch((error) => {
            console.error('로그인 실패:', error.message);
        });
});

// 사용자 정보를 Firestore에 저장하는 함수
async function saveUserToFirestore(user, provider) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        // 첫 로그인: 새 사용자 등록
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: provider,  // 'google', 'kakao', 'naver' 등
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
        });
        console.log('새 사용자 등록:', user.displayName);
    } else {
        // 재방문: 마지막 로그인 시간만 업데이트
        await setDoc(userRef, {
            lastLoginAt: serverTimestamp()
        }, { merge: true });
        console.log('기존 사용자:', user.displayName);
    }
}

// 로그아웃
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth);
});

// 로그인 상태 감지
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('googleLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userInfo.innerHTML = `
            <img src="${user.photoURL}" width="40" style="border-radius: 50%;">
            <p>안녕하세요, <strong>${user.displayName}</strong>님!</p>
            <p>${user.email}</p>
        `;
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        userInfo.innerHTML = '';
    }
});
