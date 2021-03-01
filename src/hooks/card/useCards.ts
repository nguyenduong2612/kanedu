import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../config/firebaseConfig";

interface RootState {
  user: any;
}

function useCards(courseId: string, lessonId: string) {
  const [cardList, setCardList] = useState<any[]>([]);
  const [cardPreview, setCardPreview] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.user);

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
          if (!user.cardStatus) {
            var filter: any = null;
          } else {
            filter = user.cardStatus.filter(
              (card: any) => card.id === doc.id
            )[0];
          }

          let card = {
            id: doc.id,
            ...doc.data(),
            status: filter ?  filter.status : "null",
          };

          setCardList((cardList) => [...cardList, card]);
        });

        let previewCount = 0;
        docs.forEach((doc) => {
          previewCount++;
          let card = {
            id: doc.id,
            ...doc.data(),
          };
          setCardPreview((cardPreview) => [...cardPreview, card]);
          if (previewCount === 3) return;
        });
      }

      setIsLoaded(true);
    }

    getCards();
  }, [courseId, lessonId, user.uid, user.cardStatus]);

  return {
    cardList,
    setCardList,
    isLoaded,
    cardPreview,
    setCardPreview,
    setIsLoaded,
  };
}

export default useCards;
