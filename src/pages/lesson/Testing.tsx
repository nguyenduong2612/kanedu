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
} from "@ionic/react";
import React, { useEffect, useState } from "react";
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
  initialSlide: 1,
  speed: 400,
  loop: false,
};

const Testing: React.FC<ContainerProps> = ({ match }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  //const [score, setScore] = useState<number>(0);

  useEffect(() => {
    async function getAllQuestion() {
      const ref = database
        .collection("courses")
        .doc(match.params.course_id)
        .collection("lessons")
        .doc(match.params.lesson_id)
        .collection("test");
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setQuestions((questions) => [...questions, doc]);
        });
      }
    }

    getAllQuestion();
  }, [match]);

  const handleClickAnswer = (questionId: string, answerId: string) => {
    if (questionId === answerId) {
      console.log("Correct!")
    } else {
      console.log("Wrong!")
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/" />
          </IonButtons>
          <IonTitle>Làm bài kiểm tra</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <>
          {questions.length > 0 && (
            <IonSlides options={slideOpts} style={{ height: "100%" }}>
              {questions.map((item: any, index: number) => {
                return (
                  <IonSlide key={index}>
                    <IonContent>
                      <div className="main-wrapper">
                        <div className="question-wrapper">
                          <IonButton expand="block" fill="outline">
                            Question: {item.data().question.text}
                          </IonButton>
                        </div>
                        <div className="answers-wrapper">
                          <IonButton
                            className="answer-btn"
                            onClick={() =>
                              handleClickAnswer(
                                item.data().question.id,
                                item.data().answers[0].id
                              )
                            }
                            expand="block"
                            fill="outline"
                          >
                            {item.data().answers[0].text}
                          </IonButton>
                          <IonButton
                            className="answer-btn"
                            onClick={() =>
                              handleClickAnswer(
                                item.data().question.id,
                                item.data().answers[1].id
                              )
                            }
                            expand="block"
                            fill="outline"
                          >
                            {item.data().answers[1].text}
                          </IonButton>
                          <IonButton
                            className="answer-btn"
                            onClick={() =>
                              handleClickAnswer(
                                item.data().question.id,
                                item.data().answers[2].id
                              )
                            }
                            expand="block"
                            fill="outline"
                          >
                            {item.data().answers[2].text}
                          </IonButton>
                          <IonButton
                            className="answer-btn"
                            onClick={() =>
                              handleClickAnswer(
                                item.data().question.id,
                                item.data().answers[3].id
                              )
                            }
                            expand="block"
                            fill="outline"
                          >
                            {item.data().answers[3].text}
                          </IonButton>
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
