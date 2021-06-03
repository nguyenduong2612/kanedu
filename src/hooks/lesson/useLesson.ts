import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";

interface RootState {
  user: any;
}

function useLesson(courseId: string, lessonId: string) {
  const [title, setTitle] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>();
  const [progress, setProgress] = useState<number>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function getInfo() {
      const lessonRef = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId);
      const lesson: any = await lessonRef.get();
      if (lesson.exists) {
        setTitle(lesson.data().title);
        setNumberOfCards(lesson.data().numberOfCards);

        let rememberedCardCount: number = user.cardStatus.filter(
          (card: any) =>
            card.lessonId === lessonId && card.status === "remembered"
        ).length;
        setProgress(rememberedCardCount / lesson.data().numberOfCards);
      }

      setIsLoaded(true);
    }

    getInfo();
  }, [courseId, lessonId, user.cardStatus]);

  return {
    title,
    numberOfCards,
    progress,
    isLoaded,
    setTitle,
    setNumberOfCards,
    setIsLoaded,
  };
}

export default useLesson;
