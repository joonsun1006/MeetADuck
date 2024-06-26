-- 외래키 제약조건 무시
SET foreign_key_checks = 0;




-- parties
INSERT INTO parties (party_id, access_code, party_name, start_time, end_time, deleted, user_id) VALUES
(1, 'abc123', '블랙펄', NOW(), (NOW() + INTERVAL 7 DAY), 0, 1);

-- chats 
INSERT INTO chats (maniti_id, created_time, party_id) VALUES
(12, NOW(), 1),
(13, NOW(), 1),
(14, NOW(), 1),
(15, NOW(), 1),
(16, NOW(), 1),
(11, NOW(), 1);

-- guests
INSERT INTO guests (guest_id, maniti_id, voted_id, party_id, chat_id, user_id) VALUES
(11, 12, NULL, 1, 1, 1),
(12, 13, NULL, 1, 2, 2),
(13, 14, NULL, 1, 3, 3),
(14, 15, NULL, 1, 4, 4),
(15, 16, NULL, 1, 5, 5),
(16, 11, NULL, 1, 6, 6);


-- 서버 시간대를 UTC로 초기화
-- SET GLOBAL time_zone = '+00:00';

-- users
INSERT INTO users (kakao_id, nickname, profile_url, thumbnail_url, birthday, phonenumber) VALUES
(10001, '강지수', 'http://example.com/profiles/kang', 'http://example.com/thumbnails/kang', '0101', '010-1234-5678'),
(10002, '김현영', 'http://example.com/profiles/kim', 'http://example.com/thumbnails/kim', '0202', '010-2345-6789'),
(10003, '안준선', 'http://example.com/profiles/ahn', 'http://example.com/thumbnails/ahn', '0303', '010-3456-7890'),
(10004, '양희승', 'http://example.com/profiles/yang', 'http://example.com/thumbnails/yang', '0404', '010-4567-8901'),
(10005, '전원빈', 'http://example.com/profiles/jeon', 'http://example.com/thumbnails/jeon', '0505', '010-5678-9012'),
(10006, '최지웅', 'http://example.com/profiles/choi', 'http://example.com/thumbnails/choi', '0606', '010-6789-0123');


-- hints
INSERT INTO hints (hint_content) VALUES 
("별자리는 무엇인가요?"),
("가장 좋아하는 색깔은 무엇인가요?"),
("최근에 본 가장 인상 깊은 영화는 무엇인가요?"),
("좋아하는 음식과 싫어하는 음식은 무엇인가요?"),
("여행 가고 싶은 나라는 어디인가요?"),
("가장 좋아하는 계절은 무엇인가요?"),
("취미는 무엇인가요?"),
("읽고 있는 책이나 최근에 읽은 책은 무엇인가요?"),
("가장 좋아하는 음악 장르는 무엇인가요?"),
("가장 좋아하는 동물은 무엇인가요?"),
("즐겨 보는 유튜브 채널이 있다면?"),
("자신만의 스트레스 해소 방법은 무엇인가요?"),
("가장 좋아하는 운동은 무엇인가요?"),
("가장 최근에 감동받은 일은 무엇인가요?"),
("가장 기억에 남는 생일 선물은 무엇인가요?"),
("기억에 남는 여행지는 어딘가요?"),
("가장 좋아하는 TV 프로그램은 무엇인가요?"),
("어릴 적 꿈은 무엇이었나요?"),
("가장 기억에 남는 꿈은 무엇인가요?"),
("어떤 종류의 영화를 가장 좋아하나요?"),
("가장 좋아하는 음료는 무엇인가요?"),
("가장 좋아하는 과일은 무엇인가요?"),
("주말에 주로 무엇을 하나요?"),
("MBTI가 어떻게 되나요?"),
("강아지 vs 고양이?"),
("짜장면 vs 짬뽕?"),
("여름 vs 겨울?"),
("본인의 TMI는?"),
("산 vs 바다?");


-- topics
INSERT INTO topics (topic_content) VALUES 
("한 달 동안 인터넷 없이 생활하기 VS 한 달 동안 친구들과 만나지 않기"),
("영원히 여름 날씨 VS 영원히 겨울 날씨"),
("매일 같은 옷만 입기 VS 매일 같은 음식만 먹기"),
("우주 여행 한 번 가기 VS 지구상에서 원하는 곳 어디든 평생 무료로 여행하기"),
("모든 언어를 유창하게 할 수 있게 되기 VS 모든 악기를 마스터할 수 있게 되기"),
("미래를 볼 수 있는 능력 VS 과거로 돌아갈 수 있는 능력"),
("하루에 24시간을 모두 깨어있기 VS 하루에 2시간만 자고 항상 상쾌하게 일어나기"),
("모든 책을 읽을 수 있는 능력 VS 모든 음악을 들을 수 있는 능력"),
("평생 동안 슈퍼히어로 영화만 보기 VS 평생 동안 로맨틱 코미디 영화만 보기"),
("시간을 멈출 수 있는 능력 VS 마음을 읽을 수 있는 능력"),
("평생 동안 취미를 즐기며 살기 VS 꿈의 직업을 가지고 일하며 살기"),
("고립된 섬에서 혼자 살기 VS 붐비는 도시에서 항상 사람들과 함께 살기"),
("모든 게임에서 이기는 능력 VS 모든 시험에서 만점 받는 능력"),
("매일 웃긴 일만 일어나는 삶 VS 매일 신나는 모험이 있는 삶"),
("소설 속 세계로 들어갈 수 있는 능력 VS 영화 속 세계로 들어갈 수 있는 능력"),
("모든 음식이 맛있게 느껴지는 능력 VS 필요할 때마다 음식을 마법처럼 만들어내는 능력"),
("영원히 젊게 살기 VS 원하는 것을 얻을 수 있는 무한한 지혜 가지기"),
("과거의 중대한 실수 하나를 바로잡을 수 있는 기회 VS 미래의 중대한 성공을 보장받는 기회"),
("세상의 모든 지식을 알기 VS 세상의 모든 재능을 가지기"),
("평생 동안 원하는 책을 무제한으로 얻을 수 있기 VS 평생 동안 원하는 음악을 무제한으로 들을 수 있기");


-- missions
INSERT INTO missions (mission_content) VALUES
('마니띠를 위한 손으로 그린 그림을 선물하세요'),
('마니띠가 좋아하는 캐릭터를 그려서 선물하세요'),
('마니띠가 좋아하는 음료를 가져다 주세요'),
('마니띠를 위한 작은 간식을 준비하세요'),
('마니띠의 스트레스를 줄일 수 있는 작은 장난감을 선물하세요'),
('마니띠의 가방이나 책상에 몰래 응원문구를 담은 포스트잇을 붙여주세요'),
('마니띠에게 노래를 추천해주세요'),
('마니띠의 배경화면을 위한 예쁜 이미지를 찾아서 보내주세요'),
('마니띠의 책상에 익명의 격려 카드를 남겨주세요'),
('마니띠에게 재미있는 수수께끼를 보내주세요'),
('마니띠에게 좋은 아침이나 좋은 밤 메시지를 보내주세요'),
('마니띠에게 따뜻한 응원의 메시지를 보내주세요'),
('마니띠에게 소소한 일상의 행복을 담은 짧은 시를 써서 보내주세요'),
('마니띠의 생일을 작성 후, 캡쳐해주세요'),
('마니띠의 혈액형을 작성 후, 캡쳐해주세요'),
('마니띠의 MBTI를 작성 후, 캡쳐해주세요'),
('마니띠에게 초상화를 선물하세요'),
('마니띠 이름으로 삼행시를 작성해서 전달해주세요'),
('마니띠에게 피로회복제를 선물하세요'),
('마니띠에게 본인을 잘 설명하는 키워드 1개를 알려주세요'),
('마니띠에게 오늘의 TMI를 알려주세요');
