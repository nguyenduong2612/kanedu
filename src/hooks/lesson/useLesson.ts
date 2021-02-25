import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useLesson(courseId: string, lessonId: string) {
  const [title, setTitle] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
        setTitle(lesson.data().title);
        setNumberOfCards(lesson.data().numberOfCards);
      }

      setIsLoaded(true);
    }

    getInfo();
  }, [courseId, lessonId]);

  return {
    title,
    numberOfCards,
    isLoaded,
    setTitle,
    setNumberOfCards,
    setIsLoaded
  };
}

export default useLesson;
