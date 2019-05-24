## kono-auth

An authentication server for kono

### 설치
```
$ git clone https://github.com/sparcs-kaist/kono.git
$ cd kono/kono-auth
$ npm install
```
Dev-server 실행
```
$ npm run start:dev
```
Build
```
$ npm run build
```

### APIs
- POST /login
    - request
        - password: `<관리자 계정 비밀번호>`
    - response
        - 로그인 성공
            - 200 OK
            - { "msg": "login success" }
            - Cookie의 `access_token` 필드에 발급된 JWT를 넣어준다. (유효 시간 1시간)
        - 로그인 실패
            - 403 Forbidden
            - { "msg": "wrong password" }
        - 서버 에러
            - 500 Internal Server Error