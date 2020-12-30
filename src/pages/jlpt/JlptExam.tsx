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

  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answerSheet, setAnswerSheet] = useState<number[]>([]);
  const [submitAnswer, setSubmitAnswer] = useState<number[]>([]);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      let ref = database.collection("tests").doc(match.params.id);
      let doc: any = await ref.get();

      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setTitle(doc.data().title);
        setAnswerSheet(doc.data().answer_sheet);
        let questions_docs = await ref.collection("questions").get();
        if (questions_docs.empty) {
          console.log("No such document!");
        } else {
          questions_docs.forEach((doc) => {
            let ques = {
              id: doc.id,
              question: doc.data().question,
              answer: doc.data().answer,
            };
            setQuestions((questions) => [...questions, ques]);
          });
        }
      }

      setBusy(false);
    };

    getData();
  }, [match.params.id]);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/jlpt" />
          </IonButtons>
          <IonButtons slot="end">
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

            <IonList>
              {questions.map((q, i) => {
                return (
                  <IonRadioGroup
                    key={i}
                    onIonChange={(e) => handleChangeAnswer(e.detail.value, i)}
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
