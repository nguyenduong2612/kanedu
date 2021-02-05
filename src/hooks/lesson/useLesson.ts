import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useLesson(courseId: string, lessonId: string) {
  const [title, setTitle] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>();

  useEffect(() => {
    async function getInfo() {
      const lessonRef = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId);
      const lesson: any = await lessonRef.get();
      if (!lesson.exists) {
        console.log("No such document!");
      } else {
        setTitle(lesson.data().title)
        setNumberOfCards(lesson.data().numberOfCards);
      }
    }

    getInfo();
  }, [courseId, lessonId]);

  return {
    title,
    numberOfCards,
    setTitle,
    setNumberOfCards,
  };
}

export default useLesson;
