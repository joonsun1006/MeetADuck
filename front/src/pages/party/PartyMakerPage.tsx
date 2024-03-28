import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/commons/Button';
import Card from '@/components/commons/Card';
import DatePickerInput from '@/components/party/DatePickerInput';
import ShareButton from '@/components/party/ShareButton';
import { loginState, partyState } from '@/recoil/atom';
import { Axios } from '@/services/axios';
import { partyInfoService } from '@/services/partyStartService';
import styles from '@/styles/party/PartyMaker.module.css';
import { Party } from '@/types/party';
import { ListProfile } from '@/types/user.interface';
import { ArrowsCounterClockwise } from '@phosphor-icons/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

function PartyMakerPage() {
  const setParty = useSetRecoilState(partyState);
  const setLogin = useSetRecoilState(loginState);
  const party = useRecoilValue(partyState);
  const login = useRecoilValue(loginState);
  const [refreshTime, setRefreshTime] = useState('');
  const [participants, setParticipants] = useState<ListProfile[]>([]);
  const [endDate, setEndDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(0); // 시간 상태 변수
  const [selectedMinute, setSelectedMinute] = useState(0); // 분 상태 변수
  const navigate = useNavigate();

  useEffect(() => {
    // 파티 목록 조회
    const fetchPartyInfo = async () => {
      try {
        const usersInfo = await Axios.get(`/api/guests/all/${party.partyId}`);
        console.log('useInfo', usersInfo);
        setParticipants(usersInfo.data);
        const currentTime = new Date();
        setRefreshTime(
          `${
            currentTime.getHours().toString().length < 2
              ? `오전 0${currentTime.getHours()}`
              : currentTime.getHours() < 12
                ? `오전 ${currentTime.getHours()}`
                : currentTime.getHours() < 22
                  ? `오후 0${currentTime.getHours() - 12}`
                  : `오후 ${currentTime.getHours() - 12}`
          }
            
            :${currentTime.getMinutes().toString().length < 2 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes()}`,
        );
        return usersInfo.data;
      } catch (err) {
        console.log('Err :', err);
        return Promise.resolve(err);
      }
    };

    fetchPartyInfo()
      .then((response: ListProfile[]) => {
        const newGuestId = response.filter((p) => p.userId === login.userId);
        if (newGuestId.length !== 0) {
          setLogin((prevLoginState) => ({
            ...prevLoginState,
            guestId: newGuestId[0].guestId,
          }));
        }
      })
      .then(() => {
        partyInfoService(party.partyId).then((data: Party) => {
          console.log(data);
          setParty(data);
        });
      });
  }, []);

  const refreshClickHandler = async () => {
    try {
      const usersInfo = await Axios.get(`/api/guests/all/${party.partyId}`);
      setParticipants(usersInfo.data);
      const currentTime = new Date();

      setRefreshTime(
        `${
          currentTime.getHours().toString().length < 2
            ? `오전 0${currentTime.getHours()}`
            : currentTime.getHours() < 12
              ? `오전 ${currentTime.getHours()}`
              : currentTime.getHours() < 22
                ? `오후 0${currentTime.getHours() - 12}`
                : `오후 ${currentTime.getHours() - 12}`
        }
          
          :${currentTime.getMinutes().toString().length < 2 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes()}`,
      );
    } catch (err) {
      alert(err.response.data);
      console.log('Error refreshing party info: ', err);
    }
  };

  const joinNumber = participants.length;

  const children = (
    <div className={styles.cardMargin}>
      <div className={`${styles.marginBottom} `}>
        <div className={`${styles.spaceB}`}>
          <div className={`FontS ${styles.SubTitle}`}>
            참여 현황
            <div onClick={refreshClickHandler} className={styles.marginL}>
              <ArrowsCounterClockwise weight="bold" size={16} />
            </div>
          </div>
          <span className="FontS">{joinNumber}명 참여중</span>
        </div>
        <div className={`FontXS FontComment`}>최근 업데이트 {refreshTime}</div>
      </div>
      <div className={`${styles.ScrollBox}`}>
        {participants.map((participant, index) => (
          <div key={index} className={styles.participant}>
            <img src={participant.thumbnailUrl} alt="ProfileImg" className={styles.profileImage} />
            <span className={`FontS FontBasic`}>{participant.nickname}</span>
            {party.userId === participant.userId && <div className={`${styles.Badge}`}>주최자</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const startHandler = async () => {
    try {
      const isoEndDate = endDate.toISOString(); // 선택한 날짜를 ISO 형식으로 변환
      const selectedDate = endDate.clone().set({ hour: selectedHour, minute: selectedMinute }); // 선택한 시간과 분을 반영한 날짜 설정
      const isoSelectedDate = selectedDate.toISOString(); // 선택한 날짜와 시간을 ISO 형식으로 변환
      console.log('isoSelectedDate :', isoSelectedDate);

      await Axios.patch(`/api/parties`, {
        accessCode: party.accessCode,
        endTime: isoSelectedDate, // 종료 시간을 선택한 날짜와 시간으로 설정
        userId: party.userId,
      });
      setParty((prevPartyState) => ({
        ...prevPartyState,
        endTime: selectedDate, // recoil 상태에 선택한 날짜와 시간으로 설정
      }));
      navigate('/hintinputform');
    } catch (err) {
      console.log('err:', err);
      alert(err.response.data);
    }
  };

  const deleteHandler = async () => {
    console.log('파티닫기');
    try {
      await Axios.delete(`/api/parties`, {
        data: {
          accessCode: party.accessCode,
          userId: party.userId,
        },
      });
      alert('파티가 삭제되었습니다');
      setLogin((prevLoginState) => ({
        ...prevLoginState,
        guestId: 0,
        partyId: 0,
      }));
      // sessionStorage.removeItem('sessionStorage');
      navigate('/party');
    } catch (err) {
      alert(err.response.data);
      navigate('/party');
    }
  };

  const leaveHandler = async () => {
    console.log('나가기');
    try {
      // 로그인 상태에서 JWT 토큰을 가져옵니다.
      // const jwtToken = login.jwtToken;
      const jwtToken = 123;

      // JWT 토큰이 존재하는 경우에만 요청을 보냅니다.
      if (jwtToken) {
        await Axios.delete(`/api/guests/${login.guestId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // JWT 토큰을 헤더에 추가합니다.
          },
        });
        setLogin((prevLoginState) => ({
          ...prevLoginState,
          partyId: 0,
        }));
        alert('파티를 나갔습니다.');
        navigate('/party');
      } else {
        // JWT 토큰이 없는 경우에는 어떻게 처리할지 결정합니다.
        console.log('JWT 토큰이 없습니다.');
      }
    } catch (err) {
      alert(err.response.data);
      navigate('/party');
    }
  };

  return (
    <div className={styles.margin}>
      <header className={styles.Title}>
        <span className={`FontXL FontBasic`}>{party.partyName}</span>
        <span>
          <ShareButton>참여 코드 공유</ShareButton>
        </span>
      </header>
      <Card {...{ tag: 4, children: children }} />
      <div className={styles.endWrapper}>
        {login.userId === party.userId ? (
          // recoil에 있는 party의 userId와 login의 userId가 같으면
          <>
            <div className={`FontM`}>종료 시간</div>
            <div className={`${styles.inputWrapper}`}>
              <DatePickerInput setEndDate={setEndDate} />
              <div className={styles.timeSelection}>
                <div>
                  <select
                    className={`${styles.selectBox}`}
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <option key={hour} value={hour}>
                        {`${hour}`.padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  시
                </div>
                <div>
                  <select
                    className={`${styles.selectBox}`}
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <option key={minute} value={minute}>
                        {`${minute}`.padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  분
                </div>
              </div>
            </div>
            <div className={`${styles.buttonWrapper}`}>
              <span className={`${styles.oneButton}`}>
                <Button onClickHandler={startHandler} bgc="filled">
                  시작하기
                </Button>
              </span>
              <span>
                <Button onClickHandler={deleteHandler} bgc="empty">
                  파티닫기
                </Button>
              </span>
            </div>
          </>
        ) : (
          // recoil에 있는 party의 userId와 login의 userId가 다르면
          <span>
            <Button onClickHandler={leaveHandler} bgc="empty">
              나가기
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}

export default PartyMakerPage;
