<p align="center">
    <a href="https://github.com/sparcs-kaist/kono">
        <img src="Services-Kono.svg" width="250"/>
    </a>
    <p align="center">
        A brand-new SPARCS service, develop in progress since April 2019
        <br />
        <a href="http://52.79.92.127">
            Service
        </a>
        |
        <a href="https://docs.kono.sparcs.org">
            Documentation
        </a>
    </p>
</p>

# About
kono는 SPARCS에서 2019년 4월부터 개발중인 프로젝트입니다. 카이스트 코인노래방의 7개 방의 사용 여부를 실시간으로 받아 웹 서비스로 제공합니다. 코인노래방을 운영하는 카이스트 학생복지위원회(https://welfare.kaist.ac.kr/) 관리자를 위한 공지사항, 알림, 분실물 게시 서비스도 제공합니다.
## 개발 서버 실행
```bash
# 의존성 설치
npm install

# localhost:3000 개발 모드
npm run dev

# 개발 서버 테스트
npm run test:dev
```
## 프로젝트 구조 및 개발 스택
kono는 여러 개의 micro service가 함께 작동합니다. 현재 프로젝트의 최상위 file structure는 다음과 같습니다.
```
kono
├── kono-api
├── kono-arduino
└── kono-front
```
* `kono-api`는 API 서버로, front-end 서비스를 위한 API와 코인노래방으로부터 들어오는 데이터를 `kono-arudino`가 데이터베이스에 추가할 수 있는 API를 제공합니다.
> - 개발 스택
>   - Express.js
>   - Knex.js
> - 적용 기술
>   - JWT (JSON Web Token)
>   - HTTP Cookie
>   - Webpack
>   - mocha.js (Test Framework)
* `kono-front`는 front-end 서비스로, 코인노래방 상태를 사용자에게 보여주고 간단한 공지사항 게시판 기능 또한 제공합니다. Light/dark theme 전환과 언어 설정을 지원합니다.
> - 개발 스택
>   - React.js (React Hooks)
>   - React-redux
>   - SASS
* `kono-arduino`는 코인노래방에 실제로 부착된 센서와 Arduino ESP8266 module로부터 데이터를 수집하여 `kono-api` 서버를 활용하여 데이터베이스에 추가합니다.
## 라이선스
kono 프로젝트는 MIT License를 사용하고 있습니다.
>Copyright 2019 SPARCS kono Team
>
>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
