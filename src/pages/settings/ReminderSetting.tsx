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
  IonItemDivider,
  IonToggle,
  IonDatetime,
  IonIcon,
} from "@ionic/react";
import { checkmarkOutline, checkmarkSharp } from "ionicons/icons";
import React, { useState } from "react";
import { Plugins } from "@capacitor/core";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../utils/toast";
import { setReminder } from "../../redux/user/user.actions";
const { LocalNotifications } = Plugins;

interface ReminderSettingPageProps {}

interface RootState {
  user: any;
}

const ReminderSetting: React.FC<ReminderSettingPageProps> = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isTurnOn, setIsTurnOn] = useState<boolean>(
    user.reminder ? user.reminder.isTurnOn : false
  );
  const [remindAt, setRemindAt] = useState<string>(
    user.reminder ? user.reminder.time : "00:00"
  );

  const dispatch = useDispatch();

  const handleSaveReminderSetting = () => {
    console.log(remindAt);
    if (isTurnOn) {
      setLocalNotification();
    } else {
      cancelLocalNotification();
    }
    let reminder = {
      isTurnOn,
      time: remindAt,
    };
    dispatch(setReminder(user.uid, reminder));
    window.history.back();

    toast("Đã thiết lập nhắc nhở");
  };

  const setLocalNotification = async () => {
    try {
      // Request/ check permissions
      await LocalNotifications.requestPermission();

      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0)
        await LocalNotifications.cancel(pending);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Nhắc nhở",
            body: "Đã đến giờ học bài !",
            id: new Date().getTime(),
            schedule: {
              at: new Date(
                `${new Date().toISOString().slice(0, 10)} ${remindAt}`
              ),
              repeats: true,
              every: "day",
            },
            actionTypeId: "",
            extra: null,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cancelLocalNotification = async () => {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0)
      await LocalNotifications.cancel(pending);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonButtons slot="start">
            <IonBackButton color="light" text="" defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleSaveReminderSetting}>
              <IonIcon
                color="light"
                slot="icon-only"
                ios={checkmarkOutline}
                md={checkmarkSharp}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Thông báo nhắc nhở</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItemGroup>
            {/* <IonItem>
            <IonLabel>Local Notifications</IonLabel>
            <IonButton onClick={setLocalNoti} />
          </IonItem> */}

            <IonItem lines="none">
              <IonLabel>Nhắc nhở hàng ngày</IonLabel>
              <IonToggle
                checked={isTurnOn}
                onIonChange={(e) => setIsTurnOn(e.detail.checked)}
              />
            </IonItem>
            <IonItemDivider mode="md" />

            <IonItem lines="none">
              <IonLabel>Thời gian nhắc nhở</IonLabel>
              <IonDatetime
                displayFormat="h:mm a"
                value={remindAt}
                onIonChange={(e) => setRemindAt(e.detail.value!)}
              ></IonDatetime>
            </IonItem>
            <IonItemDivider mode="md" />
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ReminderSetting;
