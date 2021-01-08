import { Plugins } from "@capacitor/core";
const { LocalNotifications } = Plugins;

class Notifications {
  public async schedule(message: string) {
    try {
      // Request/ check permissions
      await LocalNotifications.requestPermission()

      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0)
        await LocalNotifications.cancel(pending);

      const randomId = Math.floor(Math.random() * 10000) + 1;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Title",
            body: message,
            id: randomId,
            schedule: {
              at: new Date(Date.now() + 1000 * 60),
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
  }
}

export default new Notifications();
