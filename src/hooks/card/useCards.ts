import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useCards(courseId: string, lessonId: string) {
  const [cardList, setCardList] = useState<any[]>([]);
  const [cardPreview, setCardPreview] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
          let card = {
            id: doc.id,
            ...doc.data()
          }
          setCardList((cardList) => [...cardList, card]);
        });

        let previewCount = 0;
        docs.forEach((doc) => {
          previewCount++;
          let card = {
            id: doc.id,
            ...doc.data()
          }
          setCardPreview((cardPreview) => [...cardPreview, card]);
          if (previewCount === 3) return;
        });
      }

      setIsLoaded(true);
    }

    getCards();
  }, [courseId, lessonId]);

  return {
    cardList,
    setCardList,
    isLoaded,
    cardPreview,
    setCardPreview,
    setIsLoaded
  };
}

export default useCards;
