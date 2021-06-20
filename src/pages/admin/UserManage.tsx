import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonLabel,
  IonItemGroup,
  IonMenuButton,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonIcon,
  IonNote,
  IonButton,
} from "@ionic/react";
import { trash } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { database, functions } from "../../config/firebaseConfig";
import { toast } from "../../utils/toast";

interface UserManagePageProps {}

const UserManage: React.FC<UserManagePageProps> = () => {
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    const loadAllUsers = async () => {
      const snap = await database.collection("users").get();

      if (!snap.empty) {
        let users = await Promise.all(
          snap.docs.map(async (user) => ({
            uid: user.id,
            ...user.data(),
          }))
        );

        setUsers(users);
      }
    };

    loadAllUsers();
  }, []);

  // console.log(users);

  const handleDeleteUser = async (uid: string, index: number) => {
    await database.collection("users").doc(uid).delete();

    var deleteUser = functions.httpsCallable("deleteUser");
    deleteUser({ uid })
      .then(() => {
        toast("Xoá người dùng thành công");
      })
      .catch(() => {
        toast("Có lỗi xảy ra");
      });
    console.log(uid);
    var temp = [...users];
    temp.splice(index, 1);
    setUsers(temp);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonMenuButton
            slot="start"
            className="menu-btn"
            color="light"
          ></IonMenuButton>
          <IonTitle>Quản lý người dùng</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList className="max-width-700">
          <IonItemGroup className="subsection-wrapper">
            {users.map((user: any, index: number) => {
              return (
                <IonItemSliding key={index}>
                  <IonItem>
                    <IonLabel>
                      <h2>{user.name}</h2>
                      <p>{user.email}</p>
                    </IonLabel>
                    {user.is_admin && (
                      <IonNote slot="end">
                        <IonButton fill="outline" color="success">
                          Quản trị
                        </IonButton>
                      </IonNote>
                    )}
                  </IonItem>

                  {!user.is_admin && (
                    <IonItemOptions side="end">
                      <IonItemOption
                        color="danger"
                        onClick={() => handleDeleteUser(user.uid, index)}
                      >
                        <IonIcon slot="icon-only" icon={trash} />
                      </IonItemOption>
                    </IonItemOptions>
                  )}
                </IonItemSliding>
              );
            })}
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserManage;
