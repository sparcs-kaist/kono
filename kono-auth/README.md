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
        - result: `"success" | "failure"`
        - token: 로그인 성공시 발급되는 JWT Token.