import {Dialog} from "primereact/dialog";
import {useEffect,useState,useRef} from "react";
import {filterNotificationBeyondRange, filterNotificationOnClickWithinRange} from "./components/utils/NotificationListUtil";

const AppConfigDialog = (props) => {

    const [readList, setReadList] = useState(() => { return JSON.parse(localStorage.getItem("readLS")) || [] });
    const [notification, setNotification] = useState(props.selectedNotification);
    const didMount = useRef(false);
    useEffect(() => {
        if (readList) localStorage.setItem("readLS", JSON.stringify(Array.from(readList)));
    }, [readList]);
    useEffect(() => {
        setNotification(props.selectedNotification);
    }, [props.selectedNotification, setNotification]);
    useEffect(() => {
        if ( !didMount.current ) {
            didMount.current = true;
            return didMount;
        }
        markAsReadFn();
    }, [notification]);
    const markAsReadFn = () => {
        if(!notification?.read) {
            let announcementId = notification.announcementId.toString();
            if (readList){
                let read = new Set([...readList]);
                read.add(announcementId);
                setReadList(read);
            }else{
                setReadList(announcementId);
            }
            let updatedNotifcationList = [...props.announcementList].map(notification => {
                    if (notification.announcementId.toString() === announcementId) {
                        return {...notification, read: true};
                    }
                    return notification;
                });
            let filteredAList2 = filterNotificationBeyondRange(updatedNotifcationList);
            let filteredAList3 = filterNotificationOnClickWithinRange(updatedNotifcationList,announcementId);
            let mergedList = [...filteredAList2,...filteredAList3];
            props.setAnnouncementList(mergedList);
            props.setNotificationCount(prevState => --prevState);
        }
    }
    return (
        <Dialog header={props.subject} visible={props.displayMaximizable} modal style={{ width: '50vw',height:'40vw' }}
                onHide={() => props.setDisplayMaximizable(!props.displayMaximizable)}>
            <div className="content" dangerouslySetInnerHTML={props?.notificationDialogContent}/>
        </Dialog>
    );
}
export default AppConfigDialog;
