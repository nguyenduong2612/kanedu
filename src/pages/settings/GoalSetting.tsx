import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonBackButton,
  IonButtons,
  IonList,
  IonLabel,
  IonButton,
  IonItemGroup,
  IonIcon,
  IonRange,
} from "@ionic/react";
import { checkmarkOutline, checkmarkSharp } from "ionicons/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../utils/toast";
import { setDailyGoal } from "../../redux/user/user.actions";

interface ReminderSettingPageProps {}

interface RootState {
  user: any;
}

const GoalSetting: React.FC<ReminderSettingPageProps> = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [goal, setGoal] = useState<number>(user.goal ? user.goal : 0);

  const dispatch = useDispatch();

  const handleSaveGoalSetting = () => {
    dispatch(setDailyGoal(user.uid, goal));
    window.history.back();

    toast("Đã thiết lập mục tiêu");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleSaveGoalSetting}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={checkmarkOutline}
                md={checkmarkSharp}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Thiết lập mục tiêu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="max-width-700">
          <IonItemGroup>
            <IonItem lines="none">
              <IonLabel>Mục tiêu<br />hằng ngày</IonLabel>
              <IonRange
                pin={true}
                value={goal}
                onIonChange={(e) => setGoal(e.detail.value as number)}
                min={0}
                max={50}
                step={1}
                color="primary"
              />
              {goal} từ
            </IonItem>

          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default GoalSetting;
