import styles from "../CSS/ReservUserModal.module.css";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Review from "./Review";
import axios from "axios";
import { useFindState, useActions } from "../store/Statefind";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PaymentButton from "./Checkout";

function ReservUserModal({
  activeModal,
  closeModal,
  selectmodal,
  completeReview,
  completeSub,
  bid,
  pid,
  Price,
}) {
  const [cnt, setCnt] = useState(0);
  const [BookingDetail, setBookingDetail] = useState([]);
  const findState = useFindState();
  const { changeState } = useActions();
  const [date, setDate] = useState();

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [InputCnt, setInputCnt] = useState();

  const handleDateChange = (date) => {
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
    setSelectedDay(date.getDate());
  };

  const Name = sessionStorage.getItem("name");
  const Tel = sessionStorage.getItem("pNumber");

  let book_id = bid;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/back/api/booking_detail", {
          params: { book_id },
        });
        let CopyData = [...BookingDetail];
        CopyData = response.data.booking_info;
        setBookingDetail(CopyData);
      } catch (err) {
        console.log("RevervUserModal1에서 에러발생", err.message);
      }
    };

    fetchData();
  }, [findState]);

  useEffect(() => {
    const ReservationfetchData = async () => {
      const fcount = InputCnt;
      const fdate = date;

      console.log(pid, fcount, fdate, Price);
      try {
        const response = await axios.post("/back/api/reservation/register", {
          pid,
          fcount,
          fdate,
        });
      } catch (err) {
        console.log("RevervUserModal2에서 에러발생", err.message);
      }
    };

    ReservationfetchData();
  }, [findState]);

  const tileDisabled = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return view === "month" && date < today;
  };

  const calendarMinDate = new Date();

  const handleQuitReservationButton = async (booking_id) => {
    try {
      const response = await axios.post("back/api/partner/booking_cancel", {
        booking_id,
      });
      console.log("예약취소: ", response.data);
      closeModal();
      //여기에 모달을닫는코드작성
    } catch (err) {
      console.log("예약 취소 에러", err.message);
    }
  };

  console.log(BookingDetail, "ddd ");

  return (
    <Modal
      isOpen={activeModal}
      onRequestClose={closeModal}
      className={styles.ModalContainer}
      shouldCloseOnOverlayClick={true}
    >
      <div className={styles.ModalForm}>
        <div className={styles.Header}>
          <button onClick={closeModal}>ⅹ</button>
          {
            {
              상세보기: <div>1회 체험 예약 정보</div>,
              구독신청: <div>구독신청</div>,
            }[selectmodal]
          }
        </div>
        <hr></hr>

        <div className={styles.main}>
          {
            {
              상세보기: (
                <div className={styles.MainContainer}>
                  <div className={styles.Content} style={{ marginTop: "0rem" }}>
                    <p>파트너 정보</p>
                    <div>
                      <span>이름</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.USER_NAME}</span>
                      <span>휴대폰 번호</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.USER_TEL}</span>
                    </div>
                  </div>

                  <div className={styles.Content}>
                    <p>예약자 정보</p>
                    <div>
                      <span>이름</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.PARTNER_NAME}</span>
                      <span>휴대폰 번호</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.PARTNER_TEL}</span>
                    </div>
                  </div>

                  <div className={styles.Content}>
                    <p>예약 상세 정보</p>
                    <div>
                      <span>목적</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.PURPOSE}</span>
                      <div></div>
                      <span>헬스 경력</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.EXPERIENCE}</span>
                      <div></div>
                      <span>선호 시간대</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.PRTIME}</span>
                    </div>
                  </div>

                  <div className={styles.Content}>
                    <p>1회 체험 일시</p>
                    <div>
                      <span>날짜</span>
                      <span className={styles.line}>|</span>
                      <span>
                        {BookingDetail.YEAR}.{BookingDetail.MONTH}.
                        {BookingDetail.DAY}
                      </span>
                      <div></div>
                      <span>시간</span>
                      <span className={styles.line}>|</span>
                      <span>{BookingDetail.TIME}</span>
                    </div>
                  </div>
                </div>
              ),

              구독신청: (
                <div className={styles.MainContainer}>
                  {
                    {
                      0: (
                        <div className={styles.ApplyContent}>
                          <div>한달동안 진행할 PT 횟수를 입력해주세요</div>
                          <input
                            placeholder="회"
                            value={InputCnt}
                            onChange={(e) => {
                              setInputCnt(e.target.value);
                            }}
                          ></input>
                          <p>* 최대 30일까지만 입력 가능합니다.</p>
                        </div>
                      ),

                      1: (
                        <div className={styles.ApplyContent}>
                          <div>PT를 시작할 날짜를 선택해주세요</div>
                          <div className={styles.calenderContainer}>
                            <Calendar
                              className={styles.Calendar}
                              onChange={handleDateChange}
                              tileDisabled={tileDisabled}
                              minDate={calendarMinDate}
                            />
                          </div>
                        </div>
                      ),

                      2: (
                        <div className={styles.ApplyContent}>
                          <div>구독 정보를 확인해주세요</div>

                          <div className={styles.info}>
                            <p>파트너 정보</p>
                            <span>이름</span>
                            <span className={styles.line}>|</span>
                            <span style={{ marginRight: "3rem" }}>{Name}</span>
                            <span>휴대폰 번호</span>
                            <span className={styles.line}>|</span>
                            <span>{Tel}</span>
                          </div>

                          <div className={styles.info}>
                            <p>PT 정보</p>
                            <span>횟수</span>
                            <span className={styles.line}>|</span>
                            <span style={{ marginRight: "3rem" }}>
                              {InputCnt}회
                            </span>
                            <span>회당 가격</span>
                            <span className={styles.line}>|</span>
                            <span>{Price}원</span>

                            <div></div>
                            <span>시작일</span>
                            <span className={styles.line}>|</span>
                            <span style={{ marginRight: "3rem" }}>
                              {selectedYear}.{selectedMonth}.{selectedDay}
                            </span>
                            <span>종료일</span>
                            <span className={styles.line}>|</span>
                            <span>
                              {selectedYear}.{selectedMonth + 1}.{selectedDay}
                            </span>
                          </div>

                          <div className={styles.infoprice}>
                            <div>총 결제 금액</div>
                            <div>{InputCnt * Price}원</div>
                          </div>
                        </div>
                      ),
                    }[cnt]
                  }
                </div>
              ),
            }[selectmodal]
          }

          {
            {
              상세보기: (
                <div
                  className={styles.footer}
                  style={
                    selectmodal === "상세보기"
                      ? { justifyContent: "end" }
                      : null
                  }
                >
                  <button
                    style={
                      selectmodal === "상세보기"
                        ? { backgroundColor: "white", color: "black" }
                        : null
                    }
                    onClick={() => {
                      handleQuitReservationButton(bid);
                    }}
                  >
                    예약 취소
                  </button>
                </div>
              ),

              구독신청: (
                <div className={styles.footer}>
                  {0 < cnt && cnt < 4 ? (
                    <button
                      style={{ backgroundColor: "white", color: "black" }}
                      onClick={() => {
                        setCnt(cnt - 1);
                      }}
                    >
                      이전
                    </button>
                  ) : null}
                  {cnt < 2 ? (
                    <button
                      onClick={() => {
                        setCnt(cnt + 1);
                      }}
                    >
                      다음
                    </button>
                  ) : null}
                  {cnt == 2 ? (
                    <PaymentButton price={InputCnt * Price}></PaymentButton>
                  ) : null}
                </div>
              ),
            }[selectmodal]
          }
        </div>
      </div>
    </Modal>
  );
}

export default ReservUserModal;
