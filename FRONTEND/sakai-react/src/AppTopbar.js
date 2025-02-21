import { Link } from 'react-router-dom';
import classNames from 'classnames';
import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import fiberlog from './assets/images/fiberhome_core.png';
import {Badge} from "primereact/badge";

import axios from 'axios';
import {Button} from "primereact/button";
import { ListBox } from 'primereact/listbox';
import { Message } from 'primereact/message';
import moment from 'moment';
import {filterNotificationBeyondRange, filterNotificationOnClickWithinRange} from "./components/utils/NotificationListUtil";

import {useAddNotificationToState, useGetNotificationList, useNotifications, useNotificationsCount, useReadNotifications, useSetNotifications, useSetNotificationsCount, useSetReadNotifications, useSetUnreadNotifications, useToggleAllRead, useUnreadNotifications} from "./stores/NotificationStore";
import {SelectButton} from "primereact/selectbutton";
import {useAuthUsername} from "./stores/AuthStore";
import { useNavigate } from "react-router-dom";

import { ProgressBar } from 'primereact/progressbar';

function getMap(notificationsList, notify, markAsReadFn, props) {
    return notificationsList.map((notification, index) =>
        <div key={notification?.announcementId} className={`notifications-item ${notification?.read ? "read" : ""}`} ref={el => notify.current[notification?.announcementId] = el}>
            <div className="close" title={notification?.read ? "Mark as unread" : "Mark as read"}
                 onClick={(e) => markAsReadFn(e, notification?.announcementId)}/>
            <div className="text" onClick={props.toggleConfigurator} data-id={notification?.announcementId}>
                <h4>{notification?.subject}</h4> {/* - Posted By*/}
                {/* <div className="timestamp">{getDayDiff(moment(notification?.publishedDate)._i)} </div>*/}
                <div className="timestamp">{moment(notification?.publishedDate).fromNow()}</div>
            </div>
        </div>
    );
}

export const AppTopbar = React.forwardRef((props,ref2) => {


    useImperativeHandle(ref2, () => ({
        markAsReadFn(e,b) {
            markAsReadFn(e, b)
        }
    }))
    const navigate = useNavigate();


    const styles = {
        markAsReadStyle: {
            textAlign: "left",
            backgroundColor: "transparent",
            margin: 0,
            border: "none",
            cursor: "pointer",
            userSelect: "none",
            //marginLeft: "30px",
            marginLeft: "65px",
            fontSize: "10px"
            //paddingLeft: "29px"
        },
        togglerNotificationStyle: {
            display:"flex",
            flex: "1",
            flexDirection: "row",
            justifyContent: "right",
            alignItems: "center",
            marginBottom:"10px",
            marginRight: "5px"
        }
    }
    const pLinkStyle = {
        textAlign: "left",
        backgroundColor: "transparent",
        margin: 0,
        border: "none",
        cursor: "pointer",
        userSelect: "none"
    }
    const toast = useRef(null);
    const [readList, setReadList] = useState(() => { return JSON.parse(localStorage.getItem("readLS")) || [] });
    const ref = useRef(null);
    const notify = useRef([]);
    const notificationList = useNotifications();
    const setNotificationList = useSetNotifications();
    const notificationListCount = useNotificationsCount();
    const setNotificationListCount = useSetNotificationsCount();
    const setReadNotificationList = useSetReadNotifications();
    const setUnreadNotificationList = useSetUnreadNotifications();
    const readNotificationList = useReadNotifications();
    const unreadNotificationList = useUnreadNotifications();

    //const username = useAuthUsername();
    const [notificationToggler,setNotificationToggler] = useState(1);
  /*  useEffect(() => {
        //props.setNotificationCount(props.announcementList.filter(notifications => !notifications.read).length);
    //},[props.announcementList,props.setAnnouncementList,props.setNotificationCount,props.notificationCount]);
        console.log(notificationList);
    },[props.setAnnouncementList,props.setNotificationCount,props.notificationCount]);
*/
    useEffect(() => {
        //console.log(readList);
        if (readList) {
            localStorage.setItem("readLS", JSON.stringify(Array.from(readList)));
        }
    }, [readList]);

    // Get the notification message
    const getContent = message => {
        if (message.indexOf('\n') >= 0) {
            let splitted = message.split('\n');
            let ret = '<ul>';
            for (let i = 0; i <= splitted.length - 1; i++) {
                if (splitted[i] !== '') {
                    ret = ret + '<li>' + splitted[i] + '</li>';
                }
            }
            ret = ret + '</ul>';
            return {
                __html: ret
            };
        }
        return {
            __html: `<ul><li>${message}</li></ul>`
        };
    };
    const toggleAllRead = useToggleAllRead();
    const markAllAsReadFn = () => {
        let read = new Set([...readList]);
        notify.current.forEach((notification,i) => {
            read.add(i.toString());
            notification.classList.add('read');
            //Change to global state update
            localStorage.setItem("readLS", JSON.stringify(read));
        });
        setReadList(read);
        //.setAnnouncementList([]);
        setNotificationList([]);
        setNotificationListCount(0,"set");
        //props.setNotificationCount(0);
        toggleAllRead();
    };
    const markAsReadFn = (event, announcementId) => {
        const focusedElement = notify.current[announcementId];
        const announceId = announcementId.toString();
        if (focusedElement.classList.contains("read") && event?.type === "click") {
            let read = new Set([...readList]);
            read.delete(announceId);
            setReadList(read);
            /*if (!event?.currentTarget.classList.contains("text")) {
                focusedElement.classList.remove('read');
                //event?.currentTarget.setAttribute("title", "Mark as read");
                //props.setNotificationCount(prevState => ++prevState)
                setNotificationListCount(null,"incr");
            }*/
        } else if(!focusedElement.classList.contains("read")){
            console.log(readList);
            setNotificationListCount(null,"decr");
            focusedElement.classList.add('read');
            if (readList){
                let read = new Set([...readList]);
                read.add(announceId);
                setReadList(read);
            }else{
                setReadList(announceId);
            }

            let readNotifications = [];
            const aList = notificationList.forEach(item=> {
                let temp = Object.assign({}, item);
                if ([...readList].includes(item.announcementId.toString())){
                    console.log(item);
                    temp.read = true;
                    readNotifications.push(item);
                }else temp.read = false;
                return temp;
            });

            setReadNotificationList(readNotifications);
            setNotificationList(aList);

            //let filteredAList2 = filterNotificationBeyondRange(...notificationList);
           // let filteredAList3 = filterNotificationOnClickWithinRange(...notificationList,announcementId);
            //let mergedList = [...filteredAList2,...filteredAList3];
        }
    }
    const toggleNotificationList = [
        {name: 'Read', value: 0},
        {name: 'All', value: 1},
        {name: 'Unread', value: 2}
    ];
    const itemTemplate = (option) => {
        return <span style={{height:"20px"}}>{option.name}</span>;
    }
    const constructNotificationList = (e) => {
       setNotificationToggler(e.value);
       if(e.value === 0){
           let getReadNotifications = [...notificationList].filter(notification => notification.read);
           setReadNotificationList(getReadNotifications);
           setNotificationListCount(0,"set");
       }
       else if (e.value === 1){
            setNotificationListCount([...notificationList].filter(notifications => !notifications.read).length,"set");
       }
       else if (e.value === 2){
           let getUnreadNotifications = [...notificationList].filter(notification => !notification.read);
           setUnreadNotificationList(getUnreadNotifications);
           setNotificationListCount(getUnreadNotifications.length,"set");
       }
    }

    const notificationTemplate = (option) => {
        return (
            <div className="grid" title="Click to view">
                <div><b>{option.subject}</b></div>
                <div><small>{option.createTimeStr}</small></div>
            </div>
        );
    }

    return (
        <>
            <div className="layout-topbar">

                
                <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                    <i className="pi pi-bars"/>
                </button>

                <Link to="/" className="layout-topbar-logo">
                    {/* Logo and title */}
                    {/* <img src={fiberlog} alt="logo"/>
                    <span>
                        <span>Title</span><br/>
                        Subtitle<br/>
                    </span> */}
                </Link>



                <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                    <i className="pi pi-ellipsis-v"/>
                </button>
            
                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive})}>
                    <li>

                        {/* benkuramax insert icon */}
                        
                            <button className="p-link layout-topbar-button"
                                onClick={e =>{
                                    navigate("/profile");
                                }}
                            >
                                <i className="pi pi-user" style={{fontSize: '2rem'}}/>
                                <span>Profile</span>
                            </button>
                        
                        

                        <Button style={pLinkStyle} onClick={props.onNotificationSubTopBarClick}>
                            <i className="pi pi-bell p-mr-4 p-text-secondary p-overlay-badge" style={{fontSize: '2rem'}}>
                                {
                                    props.taskNotifications.totalCount > 0
                                    ? <Badge severity="danger" value={props.taskNotifications.totalCount}></Badge> : null
                                }
                            </i>
                        </Button>
                        {/* Version 1 */}
                        {/* <div className="notifications2" ref={props.notificationPanel}>
                            <h2>Notifications - <span>{(readNotificationList && (notificationToggler===0)) && readNotificationList.length}
                                                        {(notificationList && (notificationToggler===1)) && notificationList.length}
                                                        {(unreadNotificationList && (notificationToggler===2)) && unreadNotificationList.length}
                                                </span>
                                <Button className="p-button-sm" style={styles.markAsReadStyle} onClick={markAllAsReadFn}>
                                    <i className="pi pi-comments p-mr-4 p-text-secondary p-overlay-badge">
                                        Mark all as read
                                    </i>
                                </Button>
                            </h2>
                            <span style={styles.togglerNotificationStyle}>
                                <SelectButton itemTemplate={itemTemplate} value={notificationToggler} options={toggleNotificationList} onChange={constructNotificationList} optionLabel="name"/>
                            </span>
                            {(notificationList && (notificationToggler===1)) && getMap(notificationList, notify, markAsReadFn, props)}
                            {(readNotificationList && (notificationToggler===0)) && getMap(readNotificationList, notify, markAsReadFn, props)}
                            {(unreadNotificationList && (notificationToggler===2)) && getMap(unreadNotificationList, notify, markAsReadFn, props)}
                        </div> */}
                        
                        {/* Version 2 */}


                     
                       


                        <div className="notifications2" ref={props.notificationPanel}>
                            {
                                props.taskNotifications.totalCount > 0
                                ? <div className="px-2 py-2">
                                    <ListBox value={null} onChange={(e) => { 
                                            props.onClickNotif(e.value);
                                            props.onNotificationSubTopBarClick(e);
                                        }} 
                                        options={props.taskNotifications.data} optionLabel="subject" 
                                        itemTemplate={notificationTemplate} className="w-full" listStyle={{ maxHeight: '240px' }} />
                                </div> : <div className='flex justify-content-center align-items-center' style={{height: '100%'}}>
                                    <Message severity="info" text="No notifications" />
                                </div>
                            }
                            {
                                props.taskNotifications.totalCount > 5
                                ? <div className="flex justify-content-center">
                                    <Button label="View All" className="p-button-text" onClick={(e) => {
                                        props.onClickViewAllNotifs();
                                        props.onNotificationSubTopBarClick(e);
                                    }}/>
                                </div> : null
                            }
                        </div>
                        <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarLOGOUT}>
                            <i className="pi pi-sign-out"/>
                            <span>Logout</span>
                        </button>
                        <div className="text-xs" style={{fontFamily: "Arial, Helvetica, sans-serif", display:"none"}}>
                            <span className="text-600">logout countdown idle: </span>
                            {props.remaining}
                        </div>
                        
                        <div className={` ${props.loadingProgress} `}>
                            <span><ProgressBar  mode="indeterminate" style={{ height: '6px' }}></ProgressBar></span>
                        </div>
                         
                    </li>
                </ul>
            </div>
        </>
    );
})
