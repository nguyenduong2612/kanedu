import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useAllLessons(courseId: string) {
  const [lessonList, setLessonList] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>();

  useEffect(() => {
    async function getAllLesson() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons");
      const docs = await ref.orderBy("created_at", "asc").get();
      if (docs.empty) {
        console.log("No such document!");
        setIsEmpty(true);
      } else {
        docs.forEach((doc) => {
          let lesson = {
            id: doc.id,
            ...doc.data(),
          };
          setLessonList((lessonList) => [...lessonList, lesson]);
        });
      }
    }

    getAllLesson();
  }, [courseId]);

  return {
    lessonList,
    isEmpty,
    setLessonList,
    setIsEmpty,
  };
}

export default useAllLessons;
