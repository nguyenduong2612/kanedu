import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useLesson(courseId: string, lessonId: string) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);

  useEffect(() => {
    async function getAllQuestion() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
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
  }, [courseId, lessonId]);

  return {
    questions,
    setQuestions,
    numberOfQuestions,
    setNumberOfQuestions
  };
}

export default useLesson;
