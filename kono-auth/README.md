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
- POST /api/v1/auth/login
    - request
        - password: `<관리자 계정 비밀번호>`
    - response
        - 성공
            - 200 OK
            - { "msg": "login success" }
            - Cookie의 `access_token` 필드에 발급된 JWT를 넣어준다. (유효 시간 1시간)
        - 실패 (비밀번호 불일치)
            - 403 Forbidden
            - { "msg": "wrong password" }
        - 실패 (`password` field가 없을 때)
            - 400 Bad Request
            - { "msg": "password field required" }
        - 서버 에러
            - 500 Internal Server Error
            - { "msg": "server error" }
- GET /api/v1/auth/check
    - response
        - 성공 (유효한 `access_token` cookie)
            - 204 No Content
        - 실패 (로그인 되지 않은 경우)
            - 403 Forbidden
- POST /api/v1/auth/logout
    - response
        - 성공
            - 204 No Content
            - Cookie의 `access_token` 필드의 값을 제거한다.
        - 실패 (로그인 되지 않은 경우)
            - 403 Forbidden
- PUT /api/v1/auth/password
    - request
        - password: `<새로운 비밀번호>`
    - response
        - 성공
            - 204 No Content
            - DB의 패스워드가 갱신된다.
        - 실패 (로그인 되지 않은 경우)
            - 403 Forbidden
        - 실패 (유효하지 않은 비밀번호, 너무 긴 비밀번호)
            - 400 Bad Request
            - { "msg": "invalid password" }
        - 서버 에러
            - 500 Internal Server Error
            - { "msg": "server error" }
