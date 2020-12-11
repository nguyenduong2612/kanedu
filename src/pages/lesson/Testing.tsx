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
} from "@ionic/react";
import { checkmarkOutline, checkmarkSharp, closeOutline, closeSharp } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { database } from "../../config/firebaseConfig";
import "./Testing.scss";

interface ContainerProps {}
interface MatchParams {
  course_id: string;
  lesson_id: string;
}

interface ContainerProps extends RouteComponentProps<MatchParams> {}

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  loop: false,
};

const Testing: React.FC<ContainerProps> = ({ match }) => {
  const slidesRef = useRef<HTMLIonSlidesElement>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
  const [correctAnsCounter, setCorrectAnsCounter] = useState<number>(0);
  const [wrongAnsCounter, setWrongAnsCounter] = useState<number>(0);
  const [answeredCounter, setAnsweredCounter] = useState<number>(0);

  useEffect(() => {
    async function getAllQuestion() {
      const ref = database
        .collection("courses")
        .doc(match.params.course_id)
        .collection("lessons")
        .doc(match.params.lesson_id)
        .collection("test");
      const docs = await ref.get();
      setNumberOfQuestions(docs.size);

      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setQuestions((questions) => [...questions, doc.data()]);
        });
      }
    }

    getAllQuestion();
  }, [match.params.course_id, match.params.lesson_id]);

  const handleClickAnswer = (
    questionId: string,
    answerId: string,
    slideIndex: number
  ) => {
    if (questionId === answerId) {
      console.log("Correct!");
      setAnsweredCounter(answeredCounter + 1);
      setCorrectAnsCounter(correctAnsCounter + 1);

      let correctBtn = document.getElementById(`${slideIndex}+${answerId}`);
      let answerBtns = document.getElementsByClassName(
        `${slideIndex}-answer-btn`
      );
      correctBtn?.classList.add("ion-color");
      correctBtn?.classList.add("ion-color-success");

      Array.prototype.forEach.call(answerBtns, function (answerBtn) {
        answerBtn?.classList.add("disabled");
      });
    } else {
      console.log("Wrong!");
      setAnsweredCounter(answeredCounter + 1);
      setWrongAnsCounter(wrongAnsCounter + 1);

      let wrongBtn = document.getElementById(`${slideIndex}+${answerId}`);
      let correctBtn = document.getElementById(`${slideIndex}+${questionId}`);
      let answerBtns = document.getElementsByClassName(
        `${slideIndex}-answer-btn`
      );
      wrongBtn?.classList.add("ion-color");
      wrongBtn?.classList.add("ion-color-danger");

      correctBtn?.classList.add("ion-color");
      correctBtn?.classList.add("ion-color-success");

      Array.prototype.forEach.call(answerBtns, function (answerBtn) {
        answerBtn?.classList.add("disabled");
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonTitle>
            {answeredCounter} / {numberOfQuestions}
          </IonTitle>
          <div className="test-result" slot="end">
            <IonRow>
              <IonCol>
                <IonIcon
                  color="dark"
                  ios={checkmarkOutline}
                  md={checkmarkSharp}
                  style={{ paddingRight: 5 }}
                />
                {correctAnsCounter}
              </IonCol>
              
              <IonCol>
                <IonIcon
                  color="dark"
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
        <>
          {questions.length > 0 && (
            <IonSlides
              ref={slidesRef}
              options={slideOpts}
              style={{ height: "100%" }}
            >
              {questions.map((item: any, slideIndex: number) => {
                return (
                  <IonSlide key={slideIndex}>
                    <IonContent>
                      <div className="main-wrapper">
                        <div className="question-wrapper">
                          <h2>
                            {item.question.text}
                          </h2>
                        </div>

                        <div className="answers-wrapper">
                          {item
                            .answers.map((answer: any, answerIndex: number) => {
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
                                  {answer.text}
                                </IonButton>
                              );
                            })}
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
