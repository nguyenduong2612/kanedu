import { IonSpinner } from "@ionic/react";
import React from "react";
import "./Spinner.scss";

const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <IonSpinner name="lines" color="primary"></IonSpinner>
      <p>Đang tải</p>
    </div>
  );
};

export default Spinner;
