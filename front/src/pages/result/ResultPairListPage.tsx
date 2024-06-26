import Card from '@/components/commons/Card';
import ResultList from '@/components/result/ResultList';
import styles from '@/styles/result/ResultPage.module.css';
import { ResultListProps } from '@/types/result';
import { PairRank } from '@/types/user.interface';

type ResultPairListProps = {
  me: PairRank;
  pairList: ResultListProps;
};
function ResultPairListPage(resultPairListProps: ResultPairListProps) {
  const myManito = resultPairListProps.pairList.pairList.find((it) => {
    return it.manito.manitiId === resultPairListProps.me.guestId;
  })?.manito;

  const children = (
    <div>
      <div className={`${styles.Title}`}>
        <div className={`FontMTitle`}>나의 마니또는 {myManito!.nickname}입니다</div>
        <div className={`${styles.SubTitles}`}>
          <div className="FontSBold">마니또 발표</div>
          <div className={`FontSBold  ${styles.SubTitle}`}>
            <div>마니또</div>
            <div>마니띠</div>
          </div>
        </div>
      </div>
      <div className={styles.ScrollConatiner}>
        <ResultList {...resultPairListProps.pairList} />
      </div>
    </div>
  );
  return (
    <>
      <img className={styles.ProfileUrl} src={myManito!.thumbnailUrl} alt="profileImage" />
      <Card {...{ tag: 3, children: children }} />
    </>
  );
}

export default ResultPairListPage;
