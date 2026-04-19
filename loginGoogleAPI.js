//전역 함수로 설정
window.handleCredentialResponse = function (response) {
	console.log('handleCredentialResponse 호출');
	//토큰 값을 디코딩해서 JSON으로 반환
	//decodeJwtResponse <- 디코딩하는 함수
	const responsePayload = decodeJwtResponse(response.credential);
	
	//디코딩한 정보를 콘솔창에 출력
	console.log('Full Name: ' + responsePayload.name);
	console.log('Email: ' + responsePayload.email);
	
	//값 전송
	sendforwardGooglelogin(responsePayload.name, responsePayload.email)
}

function decodeJwtResponse(id_token) {
	console.log('decodeJwtResponse 호출');
	//받아온 토큰 값을 디코딩하여 정보 전송
	//id_token을 '.'으로 나누어 중간에 있는 payload 부분(base64Url)을 추출
	const base64Url = id_token.split('.')[1];
	//URL-safe Base64 형식에서 표준 Base64 형식으로 변환 ('-' -> '+', '_' -> '/')
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	//Base64로 인코딩된 문자열을 디코딩하고 각 문자의 유니코드 값을 %인코딩된 형식으로 변환한 후, 이를 다시 문자열로 조합하여 JSON 형식의 payload로 만듦
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		//각 문자의 유니코드 값을 %XX 형식으로 변환
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join('')); //변환된 값을 하나의 문자열로 조합
	//최종적으로 JSON 타입으로 변환해 반환
	return JSON.parse(jsonPayload);
}
window.handleCredentialResponse = function (response) {
    console.log('handleCredentialResponse 호출');
    
    const responsePayload = decodeJwtResponse(response.credential);
    
    console.log('Full Name: ' + responsePayload.name);
    console.log('Email: ' + responsePayload.email);
    
    // 서버로 전송 (서버 준비되면 주석 해제)
    // sendforwardGooglelogin(responsePayload.name, responsePayload.email);
    
    alert(`로그인 성공!\n이름: ${responsePayload.name}\n이메일: ${responsePayload.email}`);
};
