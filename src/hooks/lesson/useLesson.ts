import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useLesson(courseId: string, lessonId: string) {
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>();

  useEffect(() => {
    async function getInfo() {
      const course_ref = database.collection("courses").doc(courseId);
      const course_doc: any = await course_ref.get();
      if (!course_doc.exists) {
        console.log("No such document!");
      } else {
        setAuthor(course_doc.data().author);
        const lesson_ref = course_ref.collection("lessons").doc(lessonId);
        const lesson_doc: any = await lesson_ref.get();
        if (!lesson_doc.exists) {
          console.log("No such document!");
        } else {
          setName(lesson_doc.data().title);
          lesson_ref
            .collection("cards")
            .get()
            .then((snap) => {
              setNumberOfCards(snap.size);
            });
        }
      }
    }

    getInfo();
  }, [courseId, lessonId]);

  return {
    name,
    author,
    numberOfCards,
    setName,
    setAuthor,
    setNumberOfCards,
  };
}

export default useLesson;
