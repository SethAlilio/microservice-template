import moment from "moment";
const filteredDays = moment().subtract(8, 'days').format("YYYY-MM-DD");
const filteredDays2Weeks = moment().subtract(14, 'days').format("YYYY-MM-DD");
const today = moment().format("YYYY-MM-DD");
const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");

export const filterNotificationBeyondRange = (notificationList) => {
    return notificationList.filter(notification => ((moment(moment(notification.publishedDate).format("YYYY-MM-DD")).isAfter(filteredDays2Weeks))
    ));
};
export const filterNotificationWithinRange = (notificationList) => {
    return notificationList.filter(notification=> (moment(moment(notification.publishedDate).format("YYYY-MM-DD")).isSameOrBefore(filteredDays2Weeks))
    && !notification.read
    );
};
export const filterNotificationOnClickWithinRange = (notificationList,announcementId) => {
    console.log(notificationList);
    return notificationList.filter(notification=> ((moment(moment(notification.publishedDate).format("YYYY-MM-DD")).isAfter(filteredDays2Weeks))
    ) && notification.announcementId !== announcementId);
};

export const getTodaysNotification = (notificationList) => {
    return notificationList.reduce((notifications,options)=> {
        let publishedDate = moment(options.publishedDate).format("YYYY-MM-DD");
        if(today === publishedDate) notifications.push(options);
        return notifications;
    },[]);
};

export const getYesterdaysNotification = (notificationList) => {
  return notificationList.reduce((notifications,options)=> {
      let publishedDate = moment(options.publishedDate).format("YYYY-MM-DD");
      if (yesterday===publishedDate)notifications.push(options);
      return notifications;
  },[]);
};

export const otherOrMoreNotifications = (notificationList) => {
  return notificationList.reduce((notifications,options)=> {
        let publishedDate = moment(options.publishedDate).format("YYYY-MM-DD");
        if (moment(yesterday).isAfter(publishedDate)) notifications.push(options);
        return notifications;
    },[]);
};

