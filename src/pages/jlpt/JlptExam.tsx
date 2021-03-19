import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonLabel,
  IonItem,
  IonList,
  IonBackButton,
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonButton,
  IonAlert,
  IonLoading,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import useExam from "../../hooks/jlpt/useExam";
import useTabbar from "../../hooks/useTabbar";
import "./JlptExam.scss";

const Loading: React.FC = () => {
  return <IonLoading message="Vui lòng đợi" duration={0} isOpen={true} />;
};

interface MatchParams {
  id: string;
}

interface JlptExamPageProps extends RouteComponentProps<MatchParams> {}

const JlptExam: React.FC<JlptExamPageProps> = ({ match }) => {
  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();
  const [seconds, setSeconds] = useState<number>();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useTabbar();
  const examId = match.params.id;
  const exam = useExam(examId);

  useEffect(() => {
    const setTimer = () => {
      if (exam.level) {
        var timeLimit: number;
        switch (exam.level) {
          case "5":
            timeLimit = Date.now() + 6300000;
            break;
          case "4":
            timeLimit = Date.now() + 7500000;
            break;
          case "3":
            timeLimit = Date.now() + 8400000;
            break;
          case "2":
            timeLimit = Date.now() + 9300000;
            break;
          case "1":
            timeLimit = Date.now() + 10200000;
            break;
        }

        var timer = setInterval(() => {
          var now = Date.now();

          var distance = timeLimit - now;

          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setHours(hours);
          setMinutes(minutes);
          setSeconds(seconds);

          if (distance <= 0) {
            let submitBtn = document.getElementById("submit-btn");
            submitBtn?.click();
            clearInterval(timer);
          }
        }, 1000);

        return () => clearInterval(timer);
      }
    };

    setTimer();
  }, [exam.level]);

  useEffect(() => {
    setTimeout(function () {
      let allQues = document.getElementsByClassName(`ques`);
      Array.prototype.forEach.call(allQues, function (ques) {
        if (ques) {
          ques.style.display = "none";
        }
      });
  
      let showQues = document.getElementsByClassName(`part-0`);
      Array.prototype.forEach.call(showQues, function (ques) {
        if (ques) {
          ques.style.display = "block";
        }
      });
    }, 500);
  }, []);

  const handleChangeAnswer = (newValue: number, i: number) => {
    let temp = [...exam.submitAnswer];
    temp[i] = newValue;

    exam.setSubmitAnswer(temp);
  };

  const handleSubmitExam = () => {
    if (
      exam.submitAnswer.filter((answer) => answer !== undefined).length ===
      exam.answerSheet.length
    ) {
      let submitBtn = document.getElementById(`submit-btn`);
      submitBtn?.classList.add("button-disabled");

      var score: number = 0;

      for (let i = 0; i < exam.answerSheet.length; i++) {
        let correctBtn = document.getElementById(
          `q-${i}-a-${exam.answerSheet[i]}`
        );

        correctBtn?.classList.add("ion-color");
        correctBtn?.classList.add("ion-color-success");
        if (exam.submitAnswer[i] === exam.answerSheet[i]) {
          score++;
        }
      }
      setAlertMessage(`Điểm số: ${score}/${exam.answerSheet.length}`);
      setShowAlert(true);
    } else {
      setAlertMessage("Bạn chưa hoàn thành bài kiểm tra");
      setShowAlert(true);
    }
  };

  const onChangePart = (part: string) => {
    exam.setPart(part);
    let allQues = document.getElementsByClassName(`ques`);
    Array.prototype.forEach.call(allQues, function (ques) {
      if (ques) {
        ques.style.display = "none";
      }
    });

    let showQues = document.getElementsByClassName(`part-${part}`);
    Array.prototype.forEach.call(showQues, function (ques) {
      if (ques) {
        ques.style.display = "block";
      }
    });
  };

  return (
    <IonPage className="pd-0">
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/jlpt" />
          </IonButtons>
          <IonButtons slot="end">
            <IonTitle>
              {hours}:{minutes}:{seconds}
            </IonTitle>
            <IonButton
              fill="clear"
              id="submit-btn"
              mode="ios"
              color="light"
              onClick={handleSubmitExam}
            >
              Nộp bài
            </IonButton>
          </IonButtons>
          <IonTitle>{exam.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {exam.busy ? (
          <Loading />
        ) : (
          <>
            <IonAlert
              isOpen={showAlert}
              cssClass="exam-alert"
              onDidDismiss={() => setShowAlert(false)}
              header={"Thông báo"}
              message={alertMessage}
              buttons={["Xác nhận"]}
            />
            <IonSegment
              value={exam.part}
              color="primary"
              className="part-segment"
              onIonChange={(e: any) => onChangePart(e.detail.value!)}
            >
              {["4", "5"].includes(exam.level) ? (
                <>
                  <IonSegmentButton value="0">
                    <IonLabel>言語知識・読解</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="2">
                    <IonLabel>聴解</IonLabel>
                  </IonSegmentButton>
                </>
              ) : (
                <>
                  <IonSegmentButton value="0">
                    <IonLabel>言語知識</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="1">
                    <IonLabel>読解</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="2">
                    <IonLabel>聴解</IonLabel>
                  </IonSegmentButton>
                </>
              )}
            </IonSegment>

            <IonList>
              {exam.part === "2" && (
                <div className="audio-wrapper">
                  <audio className="listening-audio" controls>
                    <source src={exam.audioSrc} />
                  </audio>
                </div>
              )}

              {exam.questions.map((q, i) => {
                return (
                  <IonRadioGroup
                    key={i}
                    onIonChange={(e) => handleChangeAnswer(e.detail.value, i)}
                    className={`part-${q.part} ques`}
                  >
                    <IonListHeader>
                      <IonLabel>
                        {i + 1}. {q.question}
                      </IonLabel>
                    </IonListHeader>

                    {q.answer.map((ans: string, j: number) => {
                      return (
                        <IonItem id={`q-${i}-a-${j}`} key={j}>
                          <IonLabel>{ans}</IonLabel>
                          <IonRadio mode="md" slot="start" value={j} />
                        </IonItem>
                      );
                    })}
                  </IonRadioGroup>
                );
              })}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default JlptExam;
