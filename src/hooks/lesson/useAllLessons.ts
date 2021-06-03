import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";
import { Lesson } from "../../models";

function useAllLessons(courseId: string) {
  const [lessonList, setLessonList] = useState<Lesson[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function getAllLesson() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons");
      const docs = await ref.orderBy("created_at", "asc").get();
      if (docs.empty) {
        setIsEmpty(true);
      } else {
        docs.forEach((doc) => {
          let lesson: Lesson = {
            id: doc.id,
            numberOfCards: doc.data().numberOfCards,
            title: doc.data().title,
            created_at: doc.data().created_at,
          };

          setLessonList((lessonList) => [...lessonList, lesson]);
        });
      }

      setIsLoaded(true);
    }

    getAllLesson();

    return () => {
      setIsEmpty(false);
      setLessonList([]);
    };
  }, [courseId]);

  return {
    lessonList,
    isEmpty,
    isLoaded,
    setLessonList,
    setIsEmpty,
    setIsLoaded,
  };
}

export default useAllLessons;
