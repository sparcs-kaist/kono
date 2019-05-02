## kono-fakeserver

실제 코인노래방에 사람이 오가는 것을 상상하여 만든 시뮬레이션 서버.

### 작동 방법

```
$ git clone https://github.com/sparcs-kaist/kono.git
$ cd kono/kono-fakeserver
$ npm install
```
이후 다음 명령어로 localhost에서 원하는 포트 번호로 서버를 실행시킨다.
```
$ npm run server -- --port=<port number>
```

### HTTP Request
이 서버에 HTTP GET request를 보내면 response로 다음과 같은 응답을 얻을 수 있습니다.
```JSON
{
 timestamp: <timestamp>             // A timestamp of the arduino board, in milliseconds scale unsigned integer.
 room_id: <room_id>                 // The room id of this fake server, as set in cmd arguments.
 pir: [<0 | 1>]                     // An array of most recent PIR sensor outputs.
 supersonic: [<-1.0 | 2.0 ~ 400.0>] // An array of most recent supersonic sensor outputs.
 sound: [<0 ~ 1023>]                // An array of most recent sound sensor outputs.
 state: <0 | 1>                     // The 'correct state' of the current room, provided for debugging.
}
```