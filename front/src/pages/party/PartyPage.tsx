import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import duckLogo from '@/assets/images/RubberDuckWithLogo.png';
import Button from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import { loginState } from '@/recoil/atom';
import { Axios } from '@/services/axios';
import styles from '@/styles/party/Partyjoin.module.css';
import { useRecoilValue, useSetRecoilState } from 'recoil';

function PartyPage() {
  const [usersInput, setUsersInput] = useState('');
  const navigate = useNavigate();
  const setContent = useSetRecoilState(loginState);
  const content = useRecoilValue(loginState);

  const joinHandler = async () => {
    console.log('참여하기 클릭!');
    const accessCode = usersInput;
    const userId = content.userId;
    try {
      const response = await Axios.get(`/api/parties/${accessCode}/users/${userId}`);
      console.log(response);
      // navigate('/partymaker')
    } catch (err) {
      console.log('err :', err);
    }
  };

  const createHandler = async () => {
    console.log('이번엔 만들기 클릭!');
    navigate('/partycreate');
  };

  const handleInputChange = (value: string) => {
    setUsersInput(value);
  };

  return (
    <div className={styles.container}>
      <img src={duckLogo} alt="duckLogo" className={styles.marginTop} />
      <div className={`FontBasic FontL ${styles.joinTitle} `}>파티 참여 코드</div>
      <div className={styles.marginTop}>
        <Input usersInput={usersInput} onChange={handleInputChange} />
      </div>
      <div className={styles.marginTop}>
        <Button bgc="filled" onClickHandler={joinHandler}>
          참여하기
        </Button>
      </div>

      <div className={styles.noPartySection}>파티가 없으신가요?</div>
      <Button bgc="empty" onClickHandler={createHandler}>
        만들기
      </Button>
    </div>
  );
}

export default PartyPage;
