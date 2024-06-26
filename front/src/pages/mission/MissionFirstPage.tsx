import arrowButton from '@/assets/images/ArrowButton.png';
import Card from '@/components/commons/Card';
import styles from '@/styles/mission/Mission.module.css';

type MissionFirstProps = {
  nickname: string;
  setCheckDate: React.Dispatch<React.SetStateAction<string | null>>;
};

function MissionFirstPage(props: MissionFirstProps) {
  const checkHandler = () => {
    const checkDate = new Date().getDate().toString();
    sessionStorage.setItem('checkDate', checkDate.toString());
    props.setCheckDate(checkDate);
    console.log('미션 확인!');
  };

  const children = (
    <div className={`${styles.checkContainer}`}>
      <div className={`${styles.marginBottom}`}>
        <div className={`FontL FontBasic`}>{props.nickname}님의</div>
        <div className={`FontL FontBasic`}>오늘의 미션은...</div>
      </div>
      <img src={arrowButton} alt="arrowButton" onClick={checkHandler} />
    </div>
  );
  return <Card {...{ tag: 1, children: children }}></Card>;
}

export default MissionFirstPage;
