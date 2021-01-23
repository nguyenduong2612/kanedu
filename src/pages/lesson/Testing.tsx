import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonSlides,
  IonSlide,
  IonButton,
  IonRow,
  IonIcon,
  IonCol,
  IonAlert,
} from "@ionic/react";
import {
  checkmarkOutline,
  checkmarkSharp,
  closeOutline,
  closeSharp,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import useAllQuestion from "../../hooks/lesson/useAllQuestion";
import useTabbar from "../../hooks/useTabbar";
import "./Testing.scss";

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  loop: false,
};
interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface TestingPageProps extends RouteComponentProps<MatchParams> {}

const Testing: React.FC<TestingPageProps> = ({ match }) => {
  const slidesRef = useRef<HTMLIonSlidesElement>(null);

  const [correctAnsCounter, setCorrectAnsCounter] = useState<number>(0);
  const [wrongAnsCounter, setWrongAnsCounter] = useState<number>(0);
  const [answeredCounter, setAnsweredCounter] = useState<number>(0);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  useTabbar();

  const courseId = match.params.course_id;
  const lessonId = match.params.lesson_id;
  const allQues = useAllQuestion(courseId, lessonId);

  useEffect(() => {
    if (
      answeredCounter === allQues.numberOfQuestions &&
      answeredCounter !== 0
    ) {
      setShowAlert(true);
    }
  }, [answeredCounter, allQues.numberOfQuestions]);

  const handleClickAnswer = (
    questionId: string,
    answerId: string,
    slideIndex: number
  ) => {
    setAnsweredCounter(answeredCounter + 1);
    let answerBtns = document.getElementsByClassName(
      `${slideIndex}-answer-btn`
    );
    Array.prototype.forEach.call(answerBtns, function (answerBtn) {
      answerBtn?.classList.add("disabled");
    });

    if (questionId === answerId) {
      console.log("Correct!");
      setCorrectAnsCounter(correctAnsCounter + 1);

      let correctBtn = document.getElementById(`${slideIndex}+${answerId}`);

      correctBtn?.classList.add("ion-color");
      correctBtn?.classList.add("ion-color-success");
    } else {
      console.log("Wrong!");
      setWrongAnsCounter(wrongAnsCounter + 1);

      let wrongBtn = document.getElementById(`${slideIndex}+${answerId}`);
      let correctBtn = document.getElementById(`${slideIndex}+${questionId}`);

      wrongBtn?.classList.add("ion-color");
      wrongBtn?.classList.add("ion-color-danger");

      correctBtn?.classList.add("ion-color");
      correctBtn?.classList.add("ion-color-success");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonTitle>
            {answeredCounter} / {allQues.numberOfQuestions}
          </IonTitle>
          <div className="test-result" slot="end">
            <IonRow>
              <IonCol>
                <IonIcon
                  color="light"
                  ios={checkmarkOutline}
                  md={checkmarkSharp}
                  style={{ paddingRight: 5 }}
                />
                {correctAnsCounter}
              </IonCol>

              <IonCol>
                <IonIcon
                  color="light"
                  ios={closeOutline}
                  md={closeSharp}
                  style={{ paddingRight: 5 }}
                />
                {wrongAnsCounter}
              </IonCol>
            </IonRow>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonAlert
          isOpen={showAlert}
          cssClass="test-alert"
          onDidDismiss={() => setShowAlert(false)}
          header={"Thông báo"}
          message={`Điểm số: ${correctAnsCounter}/${allQues.numberOfQuestions}`}
          buttons={["Xác nhận"]}
        />
        <>
          {allQues.questions.length > 0 && (
            <IonSlides
              ref={slidesRef}
              options={slideOpts}
              style={{ height: "100%" }}
            >
              {allQues.questions.map((item: any, slideIndex: number) => {
                return (
                  <IonSlide key={slideIndex}>
                    <IonContent>
                      <div className="main-wrapper">
                        <div className="question-wrapper">
                          <h2>{item.question.text}</h2>
                        </div>

                        <div className="answers-wrapper">
                          {item.answers.map(
                            (answer: any, answerIndex: number) => {
                              return (
                                <IonButton
                                  key={answerIndex}
                                  id={`${slideIndex}+${answer.id}`}
                                  className={`${slideIndex}-answer-btn answer-btn`}
                                  onClick={() =>
                                    handleClickAnswer(
                                      item.question.id,
                                      answer.id,
                                      slideIndex
                                    )
                                  }
                                  expand="block"
                                  fill="outline"
                                  mode="md"
                                >
                                  <b>{answer.text}</b>
                                </IonButton>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </IonContent>
                  </IonSlide>
                );
              })}
            </IonSlides>
          )}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Testing;
