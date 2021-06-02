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
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import Spinner from "../../components/utils/Spinner";
import { database } from "../../config/firebaseConfig";
import { addAchievement } from "../../helpers/achievementHelper";
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

interface RootState {
  user: any;
}

interface TestingPageProps extends RouteComponentProps<MatchParams> {}

const Testing: React.FC<TestingPageProps> = ({ match }) => {
  const slidesRef = useRef<HTMLIonSlidesElement>(null);
  const { user } = useSelector((state: RootState) => state.user);

  const [questions, setQuestions] = useState<any[]>([]);
  const [correctAnsCounter, setCorrectAnsCounter] = useState<number>(0);
  const [wrongAnsCounter, setWrongAnsCounter] = useState<number>(0);
  const [answeredCounter, setAnsweredCounter] = useState<number>(0);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useTabbar();

  const courseId = match.params.course_id;
  const lessonId = match.params.lesson_id;

  useEffect(() => {
    if (answeredCounter === questions.length && answeredCounter !== 0) {
      setShowAlert(true);
    }
  }, [answeredCounter, questions]);

  useEffect(() => {
    if (correctAnsCounter === questions.length && questions.length !== 0)  {
      addAchievement(user, "1qibqGgQ4nppkFDH6nEe");
    }
  }, [correctAnsCounter, user, questions]);

  useEffect(() => {
    const createTest = async () => {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .collection("cards");
      const cards = await ref.get();
      const answerBank: object[] = [];
      const allQuestion: object[] = [];

      /* Create answer bank */
      cards.forEach((doc: any) => {
        let newAnswer = { id: doc.id, text: doc.data().meaning };
        answerBank.push(newAnswer);
      });

      /* Create question with 1 correct and 3 random answers */
      cards.forEach(async (doc: any) => {
        let tempAnswerBank = [...answerBank];

        let question = { id: doc.id, text: doc.data().keyword };
        let correctIndex = tempAnswerBank.findIndex(
          (answer: any) => answer.id === question.id
        );
        let correctAnswer = tempAnswerBank[correctIndex];

        const answers: object[] = [];

        answers.push(correctAnswer);
        tempAnswerBank.splice(correctIndex, 1);

        for (let i = 0; i < 3; i++) {
          let randomIndex: number = Math.floor(
            Math.random() * tempAnswerBank.length
          );
          let randomAnswer: object = tempAnswerBank[randomIndex];
          answers.push(randomAnswer);
          tempAnswerBank.splice(randomIndex, 1);
        }

        answers.sort(() => Math.random() - 0.5); // Shuffle

        /* Push to array */
        allQuestion.push({ question: question, answers: answers });
      });

      allQuestion.sort(() => Math.random() - 0.5); // Shuffle
      setQuestions(allQuestion);

      setIsLoaded(true);
    };

    createTest();
  }, [courseId, lessonId]);

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
            {answeredCounter} / {questions.length}
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
      <IonContent fullscreen className="bg-white">
        <IonAlert
          isOpen={showAlert}
          cssClass="test-alert"
          onDidDismiss={() => setShowAlert(false)}
          header={"Thông báo"}
          message={`Điểm số: ${correctAnsCounter}/${questions.length}`}
          buttons={["Xác nhận"]}
        />
        <>
          {isLoaded ? (
            questions.length > 0 && (
              <IonSlides
                ref={slidesRef}
                options={slideOpts}
                style={{ height: "100%" }}
                className="max-width-700"
              >
                {questions.map((item: any, slideIndex: number) => {
                  return (
                    <IonSlide key={slideIndex}>
                      <IonContent className="bg-white">
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
            )
          ) : (
            <Spinner />
          )}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Testing;
