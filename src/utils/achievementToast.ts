
export async function achievementToast(achievement: any, action?: string) {
  const alert = document.createElement("ion-alert");
  alert.cssClass = "achievement-popup";
  alert.header = "Chúc mừng!";
  alert.subHeader = `Mở khóa thành tựu "${achievement.name}"`;
  alert.message = `<img src="../assets/images/achievement.png" alt="achievement" /><p>Bạn nhận được ${achievement.exp} điểm kinh nghiệm</p>`;
  alert.buttons = [
    {
      text: "Tuyệt vời",
      role: "cancel",
      cssClass: "secondary",
      handler: () => {
        if (action === "reload") window.location.reload();
      },
    },
  ];

  document.body.appendChild(alert);
  return alert.present();
}
