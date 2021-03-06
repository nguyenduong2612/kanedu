import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonTextarea,
} from "@ionic/react";
import {
  add,
  checkmarkOutline,
  checkmarkSharp,
  closeOutline,
  closeSharp,
} from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { database } from "../../config/firebaseConfig";
import { Card } from "../../models";
import { toast } from "../../utils/toast";
import "./CreateLesson.scss";

interface MatchParams {
  course_id: string;
}

interface CreateCardPageProps extends RouteComponentProps<MatchParams> {}

const CreateCard: React.FC<CreateCardPageProps> = ({ match }) => {
  const blankCard = {
    id: "",
    detail: "",
    keyword: "",
    meaning: "",
    other: "",
  };
  const [titleInput, setTitleInput] = useState<string>("");
  const [cardList, setCardList] = useState<Card[]>([{ ...blankCard }]);

  const handleCardChange = (e: any, index: number, name: string) => {
    let updatedCards: any = [...cardList];
    updatedCards[index][name] = e.detail.value;
    setCardList(updatedCards);
  };

  const handleAddCard = () => {
    setCardList([...cardList, { ...blankCard }]);
  };

  const handleRemoveCard = (index: number) => {
    let updatedCards = [...cardList];
    updatedCards.splice(index, 1);
    setCardList(updatedCards);
  };

  const handleSaveCards = async () => {
    if (titleInput.trim() === "") toast("Hãy nhập tên bài học");
    else if (cardList.length === 0) toast("Hãy thêm thẻ cho bài học");
    else {
      const res = await database
        .collection("courses")
        .doc(match.params.course_id)
        .collection("lessons")
        .add({
          title: titleInput,
          created_at: Date.now(),
          numberOfCards: cardList.length,
        });

      const ref = database
        .collection("courses")
        .doc(match.params.course_id)
        .collection("lessons")
        .doc(res.id)
        .collection("cards");
      cardList.map(async (card: Card) => {
        await ref.add(card);
      });

      toast("Tạo bài học thành công");

      setTitleInput("");
      setCardList([{ ...blankCard }]);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleSaveCards}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={checkmarkOutline}
                md={checkmarkSharp}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Tạo bài học</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="max-width-700">
          <IonItem>
            <IonLabel position="floating">Tên bài học</IonLabel>
            <IonInput
              value={titleInput}
              onIonChange={(e) => setTitleInput(e.detail.value!)}
            ></IonInput>
          </IonItem>
        </IonList>

        <IonList className="max-width-700">
          {cardList.map((val: any, index: number) => {
            return (
              <IonItem key={index} lines="none">
                <IonCard style={{ width: "100%" }}>
                  <IonCardContent>
                    <IonButton
                      className="remove-btn"
                      fill="clear"
                      onClick={(e) => handleRemoveCard(index)}
                    >
                      <IonIcon
                        color="dark"
                        slot="icon-only"
                        ios={closeOutline}
                        md={closeSharp}
                      />
                    </IonButton>
                    <IonItem>
                      <IonLabel position="floating">Từ khóa</IonLabel>
                      <IonInput
                        name="keyword"
                        value={cardList[index].keyword}
                        onIonChange={(e) =>
                          handleCardChange(e, index, "keyword")
                        }
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Giải nghĩa</IonLabel>
                      <IonInput
                        name="meaning"
                        value={cardList[index].meaning}
                        onIonChange={(e) =>
                          handleCardChange(e, index, "meaning")
                        }
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="floating">Chi tiết</IonLabel>
                      <IonTextarea
                        name="detail"
                        value={cardList[index].detail}
                        onIonChange={(e) =>
                          handleCardChange(e, index, "detail")
                        }
                      />
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              </IonItem>
            );
          })}
          <IonItem lines="none" style={{ marginTop: 35 }}></IonItem>

          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={handleAddCard}>
              <IonIcon icon={add} size="large" />
            </IonFabButton>
          </IonFab>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateCard;
