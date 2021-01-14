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
import { database } from "../../config/firebaseConfig";
import "./JlptExam.scss";

const Loading: React.FC = () => {
  return <IonLoading message="Vui lòng đợi" duration={0} isOpen={true} />;
};

interface MatchParams {
  id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const JlptExam: React.FC<ContainerProps> = ({ match }) => {
  const [busy, setBusy] = useState<boolean>(true);

  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();
  const [seconds, setSeconds] = useState<number>();

  const [level, setLevel] = useState<string>("");
  const [part, setPart] = useState<string>("0");
  const [title, setTitle] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answerSheet, setAnswerSheet] = useState<number[]>([]);
  const [submitAnswer, setSubmitAnswer] = useState<number[]>([]);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    function hideTabbar() {
      var tabbar = document.getElementById(`appTabBar`);
      if (tabbar) tabbar.style.bottom = "-60px";
      var fabbtn = document.getElementById(`appFabBtn`);
      if (fabbtn) fabbtn.style.opacity = "0";
    }

    hideTabbar();

    return function showTabbar() {
      var tabbar = document.getElementById(`appTabBar`);
      if (tabbar) tabbar.style.bottom = "0";
      var fabbtn = document.getElementById(`appFabBtn`);
      if (fabbtn) fabbtn.style.opacity = "1";
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      let ref = database.collection("tests").doc(match.params.id);
      let doc: any = await ref.get();

      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setTitle(doc.data().title);
        setAnswerSheet(doc.data().answer_sheet);
        setLevel(doc.data().level);
        setAudioSrc(doc.data().listening_audio);
        let questions_docs = await ref.collection("questions").get();
        if (questions_docs.empty) {
          console.log("No such document!");
        } else {
          questions_docs.forEach((doc) => {
            let ques = {
              id: doc.id,
              question: doc.data().question,
              answer: doc.data().answer,
              part: doc.data().part,
            };
            setQuestions((questions) => [...questions, ques]);
          });
        }
      }

      setBusy(false);
    };

    getData();
  }, [match.params.id]);

  useEffect(() => {
    const setTimer = () => {
      if (level) {
        var timeLimit: number;
        switch (level) {
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

          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
  }, [level]);

  useEffect(() => {
    setTimeout(function () {
      onChangePart("0");
    }, 500);
  }, []);

  const handleChangeAnswer = (newValue: number, i: number) => {
    let temp = [...submitAnswer];
    temp[i] = newValue;

    setSubmitAnswer(temp);
  };

  const handleSubmitExam = () => {
    if (
      submitAnswer.filter((answer) => answer !== undefined).length ===
      answerSheet.length
    ) {
      let submitBtn = document.getElementById(`submit-btn`);
      submitBtn?.classList.add("button-disabled");

      var score: number = 0;

      for (let i = 0; i < answerSheet.length; i++) {
        let correctBtn = document.getElementById(`q-${i}-a-${answerSheet[i]}`);

        correctBtn?.classList.add("ion-color");
        correctBtn?.classList.add("ion-color-success");
        if (submitAnswer[i] === answerSheet[i]) {
          score++;
        }
      }
      setAlertMessage(`Điểm số: ${score}/${answerSheet.length}`);
      setShowAlert(true);
    } else {
      setAlertMessage("Bạn chưa hoàn thành bài kiểm tra");
      setShowAlert(true);
    }
  };

  const onChangePart = (part: string) => {
    setPart(part);
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
    <IonPage>
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
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {busy ? (
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
              scrollable
              value={part}
              color="primary"
              className="part-segment"
              onIonChange={(e: any) => onChangePart(e.detail.value!)}
            >
              {["4", "5"].includes(level) ? (
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
              {part === "2" && (
                <div className="audio-wrapper">
                  <audio className="listening-audio" controls>
                    <source src={audioSrc} />
                  </audio>
                </div>
              )}

              {questions.map((q, i) => {
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
