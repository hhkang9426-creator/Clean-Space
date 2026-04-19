// Firebase 모듈 import (CDN 사용)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase 설정 (2단계에서 복사한 거 여기 붙여넣기)
const firebaseConfig = {
    apiKey: "AIzaSyDvdMirJlbehMiYGoeq2yQuCRaj737NJTo",
    authDomain: "clean-space-52003.firebaseapp.com",
    projectId: "clean-space-52003",
    storageBucket: "clean-space-52003.firebasestorage.app",
    messagingSenderId: "768574910086",
    appId: "1:768574910086:web:56ad65dfbabca680866b07"
  };

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 로그인 버튼
document.getElementById('googleLoginBtn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log('로그인 성공!');
            console.log('이름:', user.displayName);
            console.log('이메일:', user.email);
            console.log('프로필 사진:', user.photoURL);
            console.log('UID:', user.uid);  // Firebase가 준 고유 ID
        })
        .catch((error) => {
            console.error('로그인 실패:', error.message);
        });
});

// 로그아웃 버튼
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('로그아웃 완료');
        })
        .catch((error) => {
            console.error('로그아웃 실패:', error);
        });
});

// 로그인 상태 감지 (자동 실행)
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('googleLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (user) {
        // 로그인 상태
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userInfo.innerHTML = `
            <img src="${user.photoURL}" width="40" style="border-radius: 50%;">
            <p>안녕하세요, <strong>${user.displayName}</strong>님!</p>
            <p>${user.email}</p>
        `;
    } else {
        // 로그아웃 상태
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        userInfo.innerHTML = '';
    }
});
