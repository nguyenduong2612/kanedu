import {
  IonSkeletonText,
} from "@ionic/react";
import React from "react";

const Skeleton: React.FC = () => {
  return (
    <div className="ion-padding">
      <IonSkeletonText animated style={{ width: "75%", margin: "10px 0" }} />
      <IonSkeletonText animated style={{ width: "50%", margin: "10px 0" }} />
      <IonSkeletonText animated style={{ width: "25%", margin: "10px 0" }} />
    </div>
  );
};

export default Skeleton;
