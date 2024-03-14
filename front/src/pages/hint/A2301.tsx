import Card from '@/components/commons/Card';
import HintChats from '@/components/hint/HintChats';
import styles from '@/styles/hint/HintPage.module.css';
import { Answer } from '@/types/hint.ts';

type A2301Props = {
  nickname: string;
  hintList: Answer[];
};
function A2301(props: A2301Props) {
  const children = (
    <div>
      <div className={styles.Title}>
        <div className={`FontL`}>마니또 힌트</div>
        <div className="FontSTitle">{props.nickname}님의 마니또가 쓴 힌트에요.</div>
      </div>
      <div className={styles.ScrollConatiner}>
        {props.hintList.map((hint) => (
          <HintChats key={hint.hintId} {...hint} />
        ))}
      </div>
    </div>
  );
  return <Card {...{ tag: 2, children: children }}></Card>;
}

export default A2301;
