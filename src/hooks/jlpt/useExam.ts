import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import { Question } from "../../models";

function useExam(examId: string) {
  const [busy, setBusy] = useState<boolean>(true);

  const [level, setLevel] = useState<string>("");
  const [part, setPart] = useState<string>("0");
  const [title, setTitle] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerSheet, setAnswerSheet] = useState<number[]>([]);
  const [submitAnswer, setSubmitAnswer] = useState<number[]>([]);

  useEffect(() => {
    const getData = async () => {
      let ref = database.collection("tests").doc(examId);
      let doc: any = await ref.get();

      if (doc.exists) {
        setTitle(doc.data().title);
        setAnswerSheet(doc.data().answer_sheet);
        setLevel(doc.data().level);
        setAudioSrc(doc.data().listening_audio);
        let questions_docs = await ref
          .collection("questions")
          .orderBy("id", "asc")
          .get();
        if (!questions_docs.empty) {
          questions_docs.forEach((doc) => {
            let ques: Question = {
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
  }, [examId]);

  return {
    busy,
    setBusy,
    level,
    setLevel,
    part,
    setPart,
    title,
    setTitle,
    audioSrc,
    setAudioSrc,
    questions,
    setQuestions,
    answerSheet,
    setAnswerSheet,
    submitAnswer,
    setSubmitAnswer,
  };
}

export default useExam;
