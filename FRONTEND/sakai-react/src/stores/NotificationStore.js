import create from "zustand";
import {immer} from "zustand/middleware/immer";
import {subscribeWithSelector} from "zustand/middleware";
const useNotificationStore = create(
    immer(
        subscribeWithSelector(
            (set,get) => ({
                notifications: null,
                readNotifications: null,
                unreadNotifications:null,
                notificationCount: 0,
                allRead: "unread",
                toggleAllRead: () => set((state) => state.allRead = "all"),
                setNotifications: (payload) => set((state) => {
                    state.notifications = payload;
                }),
                addNotificationToListState: (payload) => set((state)=> {
                    state.notifications.push(payload);
                    state.notifications.sort((a, b) => b['announcementId'] - a['announcementId']);
                }),
                setReadNotifications: (payload) =>  set((state) => void (state.readNotifications = payload)),
                setUnreadNotifications: (payload) =>  set((state) => void (state.unreadNotifications = payload)),
                setNotificationCount: (payload,mode) => set((state) => {
                    switch (mode){
                        case "set": state.notificationCount = payload; break;
                        case "incr": state.notificationCount += 1; break;
                        case "decr": state.notificationCount -= 1; break;
                    }
                }),
            })
        )
    )
);

export const useToggleAllRead = () => useNotificationStore((state)=> state.toggleAllRead);
export const useAllReadValue = () => useNotificationStore((state) => state.allRead);
export const useNotifications = () => useNotificationStore((state) => state.notifications);
export const useReadNotifications = () => useNotificationStore((state) => state.readNotifications);
export const useUnreadNotifications = () => useNotificationStore((state) => state.unreadNotifications);
export const useSetNotifications = () => useNotificationStore((state) => state.setNotifications);
export const useSetReadNotifications = () => useNotificationStore((state) => state.setReadNotifications);
export const useSetUnreadNotifications = () => useNotificationStore((state) => state.setUnreadNotifications);
export const useSetNotificationsCount = () => useNotificationStore((state) => state.setNotificationCount);
export const useNotificationsCount = () => useNotificationStore((state) => state.notificationCount);
export const useAddNotificationToState = () => useNotificationStore((state) => state.addNotificationToListState);
