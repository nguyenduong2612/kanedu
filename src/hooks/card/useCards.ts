import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useCards(courseId: string, lessonId: string) {
  const [cardList, setCardList] = useState<any[]>([]);
  const [cardPreview, setCardPreview] = useState<any[]>([]);

  useEffect(() => {
    async function getCards() {
      const ref = database
        .collection("courses")
        .doc(courseId)
        .collection("lessons")
        .doc(lessonId)
        .collection("cards");
      const docs = await ref.get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          setCardList((cardList) => [...cardList, doc]);
        });

        let previewCount = 0
        docs.forEach((doc) => {
          previewCount++
          setCardPreview((cardPreview) => [...cardPreview, doc]);
          if (previewCount === 3) return
        });

      }
    }

    getCards();
  }, [courseId, lessonId]);

  return {
    cardList,
    setCardList,
    cardPreview,
    setCardPreview
  };
}

export default useCards;
