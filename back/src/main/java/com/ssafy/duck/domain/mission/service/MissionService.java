package com.ssafy.duck.domain.mission.service;

import com.ssafy.duck.domain.guest.entity.Guest;
import com.ssafy.duck.domain.guest.exception.GuestErrorCode;
import com.ssafy.duck.domain.guest.exception.GuestException;
import com.ssafy.duck.domain.guest.repository.GuestRepository;
import com.ssafy.duck.domain.guest.service.GuestService;
import com.ssafy.duck.domain.mission.dto.request.MissionImageUpdateReq;
import com.ssafy.duck.domain.mission.dto.request.MissionPassReq;
import com.ssafy.duck.domain.mission.dto.request.MissionSuccessReq;
import com.ssafy.duck.domain.mission.dto.response.MissionRes;
import com.ssafy.duck.domain.mission.dto.response.MyManitoMissionRes;
import com.ssafy.duck.domain.mission.entity.Mission;
import com.ssafy.duck.domain.mission.entity.MissionStatus;
import com.ssafy.duck.domain.mission.exception.MissionErrorCode;
import com.ssafy.duck.domain.mission.exception.MissionException;
import com.ssafy.duck.domain.mission.repository.MissionRepository;
import com.ssafy.duck.domain.mission.repository.MissionStatusRepository;
import com.ssafy.duck.domain.party.dto.request.StartReq;
import com.ssafy.duck.domain.party.dto.response.PartyRes;
import com.ssafy.duck.domain.party.entity.Party;
import com.ssafy.duck.domain.party.exception.PartyErrorCode;
import com.ssafy.duck.domain.party.exception.PartyException;
import com.ssafy.duck.domain.party.repository.PartyRepository;
import com.ssafy.duck.domain.party.service.PartyService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MissionService {

    private final PartyService partyService;
    private final GuestService guestService;

    private final PartyRepository partyRepository;
    private final GuestRepository guestRepository;
    private final MissionRepository missionRepository;
    private final MissionStatusRepository missionStatusRepository;

    public List<Mission> fetch() {
        return missionRepository.findAll();
    }

    public void set(List<Mission> allMissions, StartReq startReq) {
        int period = PartyRes.calcDate(Instant.now() + "", startReq.getEndTime());
        Collections.shuffle(allMissions);
        List<Mission> subMissions = allMissions.subList(0, period * 3);
        Party party = partyRepository.findByAccessCode(startReq.getAccessCode())
                .orElseThrow(() -> new PartyException(PartyErrorCode.NOT_FOUND_PARTY));
        List<Guest> guests = guestRepository.findByParty_PartyId(party.getPartyId());
        for (Guest guest : guests) {
            Instant now = Instant.now();
            int day = -1, count = 0;
            for (Mission mission : subMissions) {
                if (count++ % 3 == 0) day++;
                MissionStatus missionStatus = MissionStatus.builder()
                        .getTime(now.plus(Duration.ofDays(day)))
                        .confirmTime(null)
                        .successTime(null)
                        .failedTime(null)
                        .missionImageUrl(null)
                        .mission(mission)
                        .guest(guest)
                        .build();
                missionStatusRepository.save(missionStatus);
            }
        }
    }


    public List<MissionRes> findTodayMissionsByGuestId(Long guestId){
        List<MissionRes> missionResList = new ArrayList<>();

        Instant today = Instant.now();
        List<MissionStatus> missionStatusList = missionStatusRepository.findAllByGuestGuestIdAndGetTimeBefore(guestId, today);

        int firstMission = missionStatusList.size()-3;
        Instant checkConfirmTime = Instant.now();
        if(missionStatusList.get(firstMission).getConfirmTime() != null){
            checkConfirmTime = missionStatusList.get(firstMission).getConfirmTime();
        }else {
            MissionPassReq missionPassReq = MissionPassReq.builder().
                    missionStatusId(missionStatusList.get(firstMission).getMissionStatusId())
                    .build();
            updateConfirmTimeByMissionStatusId(missionPassReq);
        }
        missionResList.add(MissionRes.builder()
                .missionStatusId(missionStatusList.get(firstMission).getMissionStatusId())
                .confirmTime(checkConfirmTime)
                .missionContent(missionRepository.findById(missionStatusList.get(firstMission).getMission().getMissionId()).get().getMissionContent())
                .missionImageUrl(missionStatusList.get(firstMission).getMissionImageUrl())
                .build());

        for(int i = missionStatusList.size()-2; i < missionStatusList.size(); i++){
            missionResList.add(MissionRes.builder()
                    .missionStatusId(missionStatusList.get(i).getMissionStatusId())
                    .confirmTime(missionStatusList.get(i).getConfirmTime())
                    .missionContent(missionRepository.findById(missionStatusList.get(i).getMission().getMissionId()).get().getMissionContent())
                    .missionImageUrl(missionStatusList.get(i).getMissionImageUrl())
                    .build());
        }

        return missionResList;
    }

    public void updateConfirmTimeByMissionStatusId(MissionPassReq missionPassReq){
        Long missionStatusId = missionPassReq.getMissionStatusId();
        MissionStatus beforemissionStatus = missionStatusRepository.findById(missionStatusId)
                .orElseThrow(() -> new MissionException(MissionErrorCode.MISSION_NOT_FOUND));
        MissionStatus aftermissionStatus = MissionStatus.builder()
                .missionStatusId(beforemissionStatus.getMissionStatusId())
                .getTime(beforemissionStatus.getGetTime())
                .confirmTime(Instant.now())
                .successTime(beforemissionStatus.getSuccessTime())
                .failedTime(beforemissionStatus.getFailedTime())
                .missionImageUrl(beforemissionStatus.getMissionImageUrl())
                .mission(beforemissionStatus.getMission())
                .guest(beforemissionStatus.getGuest())
                .build();

        missionStatusRepository.save(aftermissionStatus);

    }

    public void updateMissionImageUrlByMissionStatusId(MissionImageUpdateReq missionImageUpdateReq){
        Long missionStatusId = missionImageUpdateReq.getMissionStatusId();
        String missionImageUrl = missionImageUpdateReq.getMissionImageUrl();
        MissionStatus beforemissionStatus = missionStatusRepository.findById(missionStatusId)
                .orElseThrow(() -> new MissionException(MissionErrorCode.MISSION_NOT_FOUND));
        MissionStatus aftermissionStatus = MissionStatus.builder()
                .missionStatusId(beforemissionStatus.getMissionStatusId())
                .getTime(beforemissionStatus.getGetTime())
                .confirmTime(beforemissionStatus.getConfirmTime())
                .successTime(beforemissionStatus.getSuccessTime())
                .failedTime(beforemissionStatus.getFailedTime())
                .missionImageUrl(missionImageUrl)
                .mission(beforemissionStatus.getMission())
                .guest(beforemissionStatus.getGuest())
                .build();

        missionStatusRepository.save(aftermissionStatus);
    }

    public MyManitoMissionRes findMissionResultsByGuestId(Long guestId){
        Guest guest = guestRepository.findByManitiId(guestId)
                .orElseThrow(() -> new GuestException(GuestErrorCode.MANITO_NOT_FOUND));
        Instant today = Instant.now();
        List<MissionStatus> missionStatusList = missionStatusRepository.findAllByGuestGuestIdAndGetTimeBefore(guest.getGuestId(), today);
        MyManitoMissionRes myManitoMissionRes = null;
        for(int i = missionStatusList.size()-3; i < missionStatusList.size(); i++){
            if(missionStatusList.get(i).getMissionImageUrl() != null){
                myManitoMissionRes = MyManitoMissionRes.builder()
                        .missionStatusId(missionStatusList.get(i).getMissionStatusId())
                        .getTime(missionStatusList.get(i).getGetTime())
                        .confirmTime(missionStatusList.get(i).getConfirmTime())
                        .successTime(missionStatusList.get(i).getSuccessTime())
                        .failedTime(missionStatusList.get(i).getFailedTime())
                        .missionContent(missionRepository.findById(missionStatusList.get(i).getMission().getMissionId()).get().getMissionContent())
                        .missionImageUrl(missionStatusList.get(i).getMissionImageUrl())
                        .build();
            }
        }

        return myManitoMissionRes;
    }

    public void updateSuccessTime(MissionSuccessReq missionSuccessReq){
        Long missionStatusId = missionSuccessReq.getMissionStatusId();
        boolean missionSuccessResult = missionSuccessReq.getMissionSuccessResult();
        MissionStatus beforemissionStatus = missionStatusRepository.findById(missionStatusId)
                .orElseThrow(() -> new MissionException(MissionErrorCode.MISSION_NOT_FOUND));
        if(missionSuccessResult){
            MissionStatus aftermissionStatus = MissionStatus.builder()
                    .missionStatusId(beforemissionStatus.getMissionStatusId())
                    .getTime(beforemissionStatus.getGetTime())
                    .confirmTime(beforemissionStatus.getConfirmTime())
                    .successTime(Instant.now())
                    .failedTime(null)
                    .missionImageUrl(beforemissionStatus.getMissionImageUrl())
                    .mission(beforemissionStatus.getMission())
                    .guest(beforemissionStatus.getGuest())
                    .build();
            missionStatusRepository.save(aftermissionStatus);
        }else {
            MissionStatus aftermissionStatus = MissionStatus.builder()
                    .missionStatusId(beforemissionStatus.getMissionStatusId())
                    .getTime(beforemissionStatus.getGetTime())
                    .confirmTime(beforemissionStatus.getConfirmTime())
                    .successTime(null)
                    .failedTime(Instant.now())
                    .missionImageUrl(beforemissionStatus.getMissionImageUrl())
                    .mission(beforemissionStatus.getMission())
                    .guest(beforemissionStatus.getGuest())
                    .build();
            missionStatusRepository.save(aftermissionStatus);
        }

    }

    // hint에서 사용 : 마니또의 미션 수행 실패 개수 반환
    // 실패 개수 = 어제까지 미션 status 조회 후 전체 개수/3 - 성공 개수
    public int calcMissionFailCount(Long manitoId) {
        Instant today = Instant.now();
//        today = today.plus(Duration.ofDays(1)); // 테스트를 위해 오늘 날짜 변경
//        System.out.println("calcMissionFailCount " + today);

        List<MissionStatus> missionStatusList = missionStatusRepository.findAllByGuestGuestIdAndGetTimeBefore(manitoId, today);
        int failCount = missionStatusList.size() / 3; // 어제까지의 미션 개수
        for (MissionStatus ms : missionStatusList) {
            if (ms.getSuccessTime() != null)
                failCount--;
        }
        return failCount;
    }

}