import React, { useEffect } from "react";
import { StWrapper } from "../../components/UI/StIndex";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  __detailPost,
  __deletePost,
  __updatePost,
  __postZZim,
} from "../../redux/modules/postSlice";
import arrow_forward from "../../asset/arrow_forward.svg";
import emptyHeart from "../../asset/emptyHeart.svg";
import fullHeart from "../../asset/fullHeart.svg";
import {
  StFlex,
  StSpaceBetween,
} from "../../components/UI/CardStyle.js/StCommon";
import {
  StBackBtn,
  StBtnBox,
  StChatBtn,
  StContainer,
  StContents,
  StContentsWrapper,
  StCrsContainer,
  StCrsImg,
  StCrsLeftButton,
  StCrsRightButton,
  StDeadLineButton,
  StDeleteButton,
  StGroupImgs,
  StHidden,
  StHopeDay,
  StLocation,
  StMagam,
  StMainImg,
  StNickname,
  StProfile,
  StTags,
  StTitle,
  StUpdateButton,
  StUserInfo,
  StWishBtn,
  StZZimImg,
} from "./StPostDetail";
import CrsLeft from "../../asset/CrsLeft.svg";
import CrsRight from "../../asset/CrsRight.svg";
import { useRef } from "react";
import { useState } from "react";
import A from "../../asset/emptyHeart.svg";
const PostDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { userId } = useSelector((state) => state.userSlice.userInfo);
  const zMsg = useSelector((state) => state.postSlice.ZZimMsg?.message);
  const logedIn = useSelector((state) => state.userSlice.isLogin);
  const detail = useSelector((state) => state?.postSlice?.postInfo);
  const deadLine = detail?.isDeadLine;
  const curr = new Date(detail.appointed);
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  const kRTimeDiff = 9 * 60 * 60 * 1000;
  const KrCurr = new Date(utc + kRTimeDiff);
  const KoreaDate = KrCurr.toLocaleDateString();
  const tag = detail.tag?.split(",");
  const crsRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const TotalSlides = detail?.imageUrls?.length - 4;

  const preRef = useRef(null);
  console.log("user:", userId);
  console.log("detail:", detail);

  const deletePost = () => {
    dispatch(__deletePost(postId));
    alert("게시물이 삭제되었습니다.홈으로 돌아갑니다!");
    navigate("/");
  };
  const updatePost = () => {
    navigate(`/post/update/${postId}`);
  };

  const changeDeadLine = () => {
    // const formData = new FormData();
    if (deadLine === 1) {
      // formData.append("isDeadLine", 2);
      dispatch(__updatePost({ data: { isDeadLine: parseInt(2) }, id: postId }));
    } else {
      // formData.append("isDeadLine", 1);
      // dispatch(__updatePost({ formData, id: postId }));
      dispatch(__updatePost({ data: { isDeadLine: parseInt(1) }, id: postId }));
    }
  };
  console.log("deadLine:", deadLine);
  const ZZim = (e) => {
    dispatch(__postZZim(postId));
    if (zMsg === "찜") {
      e.target.src = emptyHeart;
    } else {
      e.target.src = fullHeart;
    }
  };
  const moveCrsLeft = () => {
    if (currentSlide === 0) {
      setCurrentSlide(TotalSlides);
      // 마지막 사진으로 이동
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };
  const moveCrsRight = () => {
    if (currentSlide >= TotalSlides) {
      //더 이상 넘어갈 슬라이드가 없으면
      setCurrentSlide(0); //1번째 사진으로 넘어간다
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const preview = (img) => {
    preRef.current.src = img;
  };

  useEffect(() => {
    dispatch(__detailPost(postId));
    console.log("디스패치 됩니다");
  }, [deadLine]);
  useEffect(() => {
    crsRef.current.style.transition = "all 0.5s ease-in-out";
    crsRef.current.style.transform = `translateX(-${currentSlide * 12.88}em)`;
  }, [currentSlide]);

  return (
    <StWrapper>
      <StContainer>
        <StSpaceBetween>
          <StBackBtn onClick={() => navigate(-1)}>
            <img src={arrow_forward} alt="back_button" />
          </StBackBtn>
          <StFlex>
            {userId === detail?.userId && (
              <>
                {deadLine === 2 ? (
                  <>
                    <StDeadLineButton onClick={changeDeadLine}>
                      마감취소
                    </StDeadLineButton>
                  </>
                ) : (
                  <StDeadLineButton onClick={changeDeadLine}>
                    마감
                  </StDeadLineButton>
                )}
              </>
            )}
            {userId === detail?.userId && (
              <StUpdateButton onClick={updatePost}>수정</StUpdateButton>
            )}
            {logedIn && (
              <>
                {userId === detail.userId && (
                  <StDeleteButton onClick={deletePost}>삭제</StDeleteButton>
                )}
              </>
            )}
          </StFlex>
        </StSpaceBetween>
        <StFlex>
          <StTitle>{detail?.title}</StTitle>
          {deadLine === 1 ? null : <StMagam>마감</StMagam>}
        </StFlex>
        <StUserInfo>
          <StFlex>
            <StProfile src={detail?.userImage}></StProfile>
            <div>
              <StNickname>{detail?.userName}</StNickname>
              <StLocation>
                {detail?.location1}&gt;{detail?.location2}
              </StLocation>
            </div>
          </StFlex>
        </StUserInfo>
        <StHopeDay>희망일:{KoreaDate}</StHopeDay>

        <StMainImg ref={preRef} src={detail.mainImage}></StMainImg>
        <StGroupImgs value={currentSlide + 1}>
          <StCrsLeftButton
            src={CrsLeft}
            onClick={moveCrsLeft}
          ></StCrsLeftButton>
          <StCrsRightButton
            src={CrsRight}
            onClick={moveCrsRight}
          ></StCrsRightButton>

          <StHidden>
            <StCrsContainer ref={crsRef}>
              {detail.imageUrls?.map((item, idx) => {
                return (
                  <StCrsImg
                    src={item}
                    key={idx}
                    onClick={() => preview(item)}
                  />
                );
              })}
            </StCrsContainer>
          </StHidden>
        </StGroupImgs>
        <StContentsWrapper>
          <StContents>{detail.content}</StContents>
        </StContentsWrapper>
        <StFlex>
          {tag?.map((item, idx) => {
            return <StTags key={idx}>{item}</StTags>;
          })}
        </StFlex>
        {logedIn && (
          <>
            {userId !== detail?.userId && (
              <StBtnBox>
                <StChatBtn
                  onClick={() => {
                    navigate(`/chat/${postId}/${detail?.userId}`);
                  }}
                >
                  문의하기
                </StChatBtn>
                <StWishBtn>
                  <StZZimImg onClick={ZZim} src={emptyHeart} alt="wish" />
                  찜하기
                </StWishBtn>
              </StBtnBox>
            )}
          </>
        )}
      </StContainer>
    </StWrapper>
  );
};

export default PostDetail;
