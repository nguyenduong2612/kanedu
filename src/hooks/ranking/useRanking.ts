import { useEffect, useState } from "react";
import { database } from "../../config/firebaseConfig";

function useRanking() {
  const [topten, setTopten] = useState<any[]>([]);

  useEffect(() => {
    async function getTopten() {
      const ref = database.collection("users");
      const docs = await ref.orderBy("exp", "desc").limit(10).get();
      if (docs.empty) {
        console.log("No such document!");
      } else {
        docs.forEach((doc) => {
          let user = {
            uid: doc.id,
            ...doc.data(),
          };
          setTopten((topten) => [...topten, user]);
        });
      }
    }

    getTopten();
  }, []);

  return {
    topten,
    setTopten
  };
}

export default useRanking;
