import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function enableWeeklyReminder(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;
  if (status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== "granted") return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // Weekly Sunday 10am local nudge
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Keeping Tab",
      body: "Open your book — a little cash in an envelope adds up.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1,
      hour: 10,
      minute: 0,
    },
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Savings reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return true;
}

export async function disableReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
