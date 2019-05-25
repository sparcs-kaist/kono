import React, { Component } from "react" ;
import { Link } from "react-router-dom";

function fullmap(props) {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width="428.663" height="459.27" viewBox="0 0 428.663 459.27">
      <g transform="translate(-702.812 -164.86)">
        <g transform="translate(728.923 236.023)">
          <path class="room1" d="M126.412,129.5,46.9,142.316s4.09,26.831,5.89,43.192,3.654,43.628,3.654,43.628l80.057-4.908" transform="translate(-46.9 -129.5)" fill="none" stroke="#333" stroke-miterlimit="10" stroke-width="2"/>
          <g transform="translate(79.512)">
            <line x1="10.034" y1="94.672" fill="#17499d"/>
            <line x1="10.034" y1="94.672" fill="none" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
          </g>
        </g>
        <path class="room2" d="M201.7,117.37l10.2,95.436,80.221-5.235L281.539,104.5Z" transform="translate(611.643 117.889)" fill="#fff" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
        <g transform="translate(898.253 191.086)">
          <path class="room3" d="M368.471,181.474l192.236-12.107s-2.727-42.264-5.454-66.805-8.18-55.462-8.18-55.462L357.4,77.585" transform="translate(-357.4 -47.1)" fill="none" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
          <g transform="translate(0 30.485)">
            <line x1="11.071" y1="103.889" fill="#e71f19"/>
            <line x1="11.071" y1="103.889" fill="none" stroke="#333" stroke-miterlimit="10" stroke-width="2"/>
          </g>
        </g>
        <g transform="translate(1018.721 318.207)">
          <path class="room4" d="M663.32,364.4l-82.348-.273s-.545-23.723-.818-38.992c-.164-9.544-1.854-39.7-1.854-39.7l82.839-5.235s2.181,32.339,2.181,44.882Z" transform="translate(-578.3 -280.2)" fill="#fff" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
        </g>
        <g transform="translate(1018.721 407.753)">
          <path class="room5" d="M663.32,444.4l-82.348.273s-.545,23.723-.818,38.992c-.164,9.544-1.854,45.155-1.854,45.155l82.293,5.235s2.727-35.611,2.727-48.154Z" transform="translate(-578.3 -444.4)" fill="#fff" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
        </g>
        <g transform="translate(948.698 492.936)">
          <path class="room6" d="M460.262,600.6l141.027,10.089s-2.89,35.284-4.744,51.644-7.635,54.153-7.635,54.153L449.9,695.218" transform="translate(-449.9 -600.6)" fill="#fff" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
          <line x1="10.362" y2="94.618" fill="#17499d" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
        </g>
        <path class="room7" d="M309.316,589.8,299.5,677.765,376.721,689.6l10.307-94.236Z" transform="translate(567.178 -102.754)" fill="#fff" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
        <path class="map-border" d="M75.368,406.839,410.757,458.1s16.36-71.441,16.906-215.3S408.576,1.1,408.576,1.1L1.2,66.542S17.015,144.2,15.106,242.8,4.09,395.986,4.09,395.986l22.032,3.381s3.436-29.013,4.8-39.919,3.817-40.083,3.817-40.083S77,304.641,84.093,300.551s17.451-16.088,20.178-21.269,6-14.724,6.381-21.541,0-29.721,0-29.721H82.73s.545,14.724,0,24.541-4.09,15.815-6.544,19.087-10.907,8.453-18.815,12-21,7.908-21,7.908,2.454-29.449,1.909-66.532S36.375,177.3,36.375,177.3" transform="translate(702.8 164.9)" fill="none" stroke="#333" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"/>
      </g>
      <text class="text" x="0" y="0" style="fill:red;">
        <tspan class="room1" x="38" y="125.82">First room</tspan>
        <tspan class="room2" x="114.3" y="116.4">Second room</tspan>
        <tspan class="room3" x="254.3" y="102.1">Third room</tspan>
        <tspan class="room4" x="316.7" y="202.2">Fourth room</tspan>
        <tspan class="room5" x="323.7" y="286.8">Fifth room</tspan>
        <tspan class="room6" x="228.7" y="383.9">Sixth room</tspan>
        <tspan class="room7" x="162.7" y="371">Seventh room</tspan>
      </text>
    </svg>
  );
}

function Boardheader(props) {
  return (
    <div className = "board-header">
      <p className = "board-name">{props.name}</p>
      <p className = "board-more"><Link to={props.link}>+ 더보기</Link></p>
    </div>
  );
}

function Notice(props){
return (
  <div className = "notice">
    <Boardheader
      name = "공지사항"
      link = "/notice"
    />
    <div className = "notice-body">
      <p className = "board-content">추가예정</p>
    </div>
  </div>
  );
}

function Lostfound(props){
  return (
  <div className = "lostfound">
    <Boardheader
      name = "분실물"
      link = "/lostfound"
    />
    <div className = "lostfound-body">
      <p className = "board-content">추가예정</p>
    </div>
  </div>
  );
}

class Roomstate extends Component {
  render() {
    const {rooms, onToggle} = this.props;

    return (
      <div className = "room-state">
        <object id="mapsvg" type="image/svg+xml" data="fullmap.svg" width = "50%">현재 브라우저는 iframe을 지원하지 않습니다.</object>
      </div>
    );
  }
}

class HomePage extends Component {
  constructor(props){
    super(props);
    this.state ={
      rooms: [//room number = id + 1
        {id: 0, content: '', checked: false},
        {id: 1, content: '', checked: false},
        {id: 2, content: '', checked: false},
        {id: 3, content: '', checked: false},
        {id: 4, content: '', checked: false},
        {id: 5, content: '', checked: false},
        {id: 6, content: '', checked: false},
      ]
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(id){
    const {room} = this.state;
    const index = rooms.findIndex(room => room.id===id);
    const selected = room[index];

    const nextRooms = [...rooms];

    for (nextRoom in nextRooms){
      nextRoom = {
        ...nextRoom,
        checked: false
      }
    }
    if (nextRooms[index].checked === true){
      nextRoom[index] = {
        ...selected,
        checked: false
      };
    }
    this.setState({
      rooms: nextRooms
    })
  }

  render() {
    const {handleToggle} = this;
    
    return (
      <div className = "homepage">
        <div className = "board">
          <Notice />
          <Lostfound />
        </div>
        <Roomstate
          rooms={this.state.rooms}
          onToggle={handleToggle}
        />
      </div>
    );
  }
}



export default HomePage;
