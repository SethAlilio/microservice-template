import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {Button} from "primereact/button";
import { Toast } from 'primereact/toast';
import {Accordion, AccordionTab} from "primereact/accordion";
import {Ripple} from "primereact/ripple";
import moment from "moment";
import AppConfigDialog from "./AppConfigDialog";
import {getTodaysNotification, getYesterdaysNotification, otherOrMoreNotifications} from "./components/utils/NotificationListUtil";
import {useAllReadValue, useNotifications} from "./stores/NotificationStore";


export const AppConfig = (props) => {

    const [active, setActive] = useState(false);
    const [scale, setScale] = useState(14);
    const [scales] = useState([12,13,14,15,16]);
    const [theme, setTheme] = useState('lara-light-indigo');
    const config = useRef(null);

    const toast = useRef(null);
    let outsideClickListener = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [todayActiveIndex, setTodayActiveIndex] = useState(null);
    const [yesterdayActiveIndex, setYesterdayActiveIndex] = useState(null);
    const [moreThanDaysActiveIndex, setMoreThanDaysActiveIndex] = useState(null);
    const [todaysNotification, setTodaysNotification] = useState(null);
    const [yesterdaysNotification, setYesterdaysNotification] = useState(null);
    const [moreNotification, setMoreNotification] = useState(null);
    const [displayMaximizable, setDisplayMaximizable] = useState(false);
    const [notificationDialogContent, setNotificationDialogContent] = useState("");
    const [headerSubject, setHeaderSubject]=useState("");
    const [selectedNotification,setSelectedNotification] = useState(null);
    const notificationList = useNotifications();

    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
            outsideClickListener.current = null;
        }
    }, []);

    const hideConfigurator = useCallback((event) => {
        props.setActive(false);
        unbindOutsideClickListener();
        event.preventDefault();
    }, [unbindOutsideClickListener]);

    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event) => {
                if (props.active && isOutsideClicked(event)) {
                    hideConfigurator(event);
                }
            };
            document.addEventListener('click', outsideClickListener.current);
        }
    }, [active, hideConfigurator]);

    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        }
        else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener]);

    const isOutsideClicked = (event) => {
        return !(config.current.isSameNode(event.target) || config.current.contains(event.target));
    }

    const decrementScale = () => {
        setScale((prevState) => --prevState);
    }

    const incrementScale = () => {
        setScale((prevState) => ++prevState);
    }

    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px';
        setActiveIndex([0]);
    }, [scale])



    const configClassName = classNames('layout-config', {
        'layout-config-active': props.active
    })

    const replaceLink = useCallback((linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        }
        else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    },[])

    useEffect(() => {
        let themeElement = document.getElementById('theme-link');
        const themeHref = 'assets/themes/' + theme + '/theme.css';
        replaceLink(themeElement, themeHref);

    },[theme,replaceLink]);
    const pButtonMax = {margin: "0", cursor: "pointer", userSelect: "none", alignItems: "center", verticalAlign: "bottom",
        textAlign: "center", overflow: "hidden", position: "relative",float:"right"};
    const allRead = useAllReadValue();
    useEffect(() => {
        if(allRead === "all"){
            setTodaysNotification(null);
            setYesterdaysNotification(null);
            setMoreNotification(null);
        }else{
            //console.log(notificationList);
            if (notificationList && notificationList.length !== 0){
                const todays = getTodaysNotification([...notificationList]);
                setTodaysNotification(todays);
                const yesterdays = getYesterdaysNotification([...notificationList]);
                setYesterdaysNotification(yesterdays);
                const moreNotifications = otherOrMoreNotifications([...notificationList]);
                setMoreNotification(moreNotifications);
            }
        }
    },[]);

    useEffect(() => {
        if(props.activeIndex) {
            let index = todaysNotification.findIndex(obj => (obj.announcementId).toString() === props.activeIndex.toString());
            setActiveIndex([0]);
            setTodayActiveIndex([index]);
            if (index === -1){
                index = yesterdaysNotification.findIndex(obj => (obj.announcementId).toString() === props.activeIndex.toString());
                setActiveIndex([1]);
                setYesterdayActiveIndex([index]);
            }
            if (index === -1){
                index = moreNotification.findIndex(obj => (obj.announcementId).toString() === props.activeIndex.toString());
                setActiveIndex([2]);
                setMoreThanDaysActiveIndex([index]);
            }
        }
    },[props.activeIndex]);

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
    }

    const changeTheme = (e, theme, scheme) => {
        props.onColorModeChange(scheme);
        setTheme(theme);
    }
    const onClick = (itemIndex) => {
        let _activeIndex = activeIndex ? [...activeIndex] : [];

        if (_activeIndex.length === 0) {
            _activeIndex.push(itemIndex);
        }
        else {
            const index = _activeIndex.indexOf(itemIndex);
            if (index === -1) {
                _activeIndex.push(itemIndex);
            }
            else {
                _activeIndex.splice(index, 1);
            }
        }

        setActiveIndex(_activeIndex);
    }
    const panelTemplate = (options) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        const className = `${options.className} p-jc-start`;
        const titleClassName = `${options.titleClassName} p-pl-1`;
        const notificationSubject = options.props?.subject;
        return (
            <div className={className} style={{marginBottom: "0.5rem"}}>
                <button className={options.togglerClassName} onClick={options.onTogglerClick}>
                    <span className={toggleIcon}></span>
                    <Ripple />
                    <span className={titleClassName}>
                        {notificationSubject}
                    </span>
                </button>
            </div>
        )
    }
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

    const displayMaximizeNotification = (notification,subject,content) => {
     setSelectedNotification(notification);
     setDisplayMaximizable(prevState => !prevState);
     setNotificationDialogContent(content);
     setHeaderSubject(subject);
    };

    return (
        <>
            {selectedNotification && <AppConfigDialog subject={headerSubject} displayMaximizable={displayMaximizable} setDisplayMaximizable={setDisplayMaximizable}
                         notificationDialogContent={notificationDialogContent} selectedNotification={selectedNotification}
                         setNotificationCount={props.setNotificationCount} announcementList={props.announcementList}
                         setAnnouncementList={props.setAnnouncementList}/>}
            <div ref={config} className={configClassName} id={"layout-config"}>
            <Toast ref={toast} position="bottom-right" />

                <button className="layout-config-button p-link" id="layout-config-button" onClick={props.toggleConfigurator}>
                    <i className="pi pi-cog"></i>
                </button>
                <Button className="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" onClick={hideConfigurator}/>

                <div className="layout-config-content">
                   <h5 className="mt-0">Component Scale</h5>
                    <div className="config-scale">
                        <Button icon="pi pi-minus" onClick={decrementScale} className="p-button-text" disabled={scale === scales[0]} />
                        {
                            scales.map((item) => {
                                return <i className={classNames('pi pi-circle-on', {'scale-active': item === scale})} key={item}/>
                            })
                        }
                        <Button icon="pi pi-plus" onClick={incrementScale} className="p-button-text" disabled={scale === scales[scales.length - 1]} />
                    </div>

                    <h5 className="mt-0">Announcements</h5>
                    <Accordion style={{padding: "-100px"}} activeIndex={activeIndex}
                               onTabChange={(e) => setActiveIndex(e.index)} multiple>
                        <AccordionTab header="Today">
                            <Accordion activeIndex={todayActiveIndex}
                                       onTabChange={(e) => setTodayActiveIndex(e.index)} multiple>
                            {todaysNotification ?  todaysNotification.map((notification,index) =>
                            <AccordionTab id={index} key={notification?.announcementId} header={notification?.subject}
                                   subject={notification?.subject}>
                                <button style={pButtonMax} className="p-dialog-header-iconMax p-link"
                                        onClick={() => displayMaximizeNotification(notification,notification?.subject,getContent(notification?.content))}>
                                    <span className="pi pi-window-maximize"></span>
                                </button>
                                <div className="content" dangerouslySetInnerHTML={getContent(notification?.content)}/>
                            </AccordionTab>
                            ): <div className="content">No Announcements Yesterday</div>}
                            </Accordion>
                        </AccordionTab>
                       <AccordionTab header="Yesterday">
                           <Accordion activeIndex={yesterdayActiveIndex}
                                      onTabChange={(e) => setYesterdayActiveIndex(e.index)} multiple>
                           {yesterdaysNotification ? yesterdaysNotification.map((notification,index) =>
                            <AccordionTab id={notification?.announcementId} key={notification?.announcementId} header={notification?.subject} toggleable subject={notification?.subject}>
                                <button style={pButtonMax} className="p-dialog-header-iconMax p-link"
                                        onClick={() => displayMaximizeNotification(notification,notification?.subject,getContent(notification?.content))}>
                                    <span className="pi pi-window-maximize"></span>
                                </button>
                                <div className="content" dangerouslySetInnerHTML={getContent(notification?.content)}/>
                            </AccordionTab>
                           ): <div className="content" dangerouslySetInnerHTML={getContent("No Announcements Yesterday")}/>}
                           </Accordion>
                        </AccordionTab>
                       <AccordionTab header="Last 2+ days...">
                           <Accordion activeIndex={moreThanDaysActiveIndex}
                                      onTabChange={(e) => setMoreThanDaysActiveIndex(e.index)} multiple>
                           {moreNotification ?  moreNotification.map((notification,index) =>
                               <AccordionTab id={notification?.announcementId} key={notification?.announcementId}  header={notification?.subject} subject={notification?.subject}>
                                   <button style={pButtonMax} className="p-dialog-header-iconMax p-link"
                                           onClick={() => displayMaximizeNotification(notification,notification?.subject,getContent(notification?.content))}>
                                       <span className="pi pi-window-maximize"></span>
                                   </button>
                                   <div className="content" dangerouslySetInnerHTML={getContent(notification?.content)}/>
                               </AccordionTab>
                           ): null}
                           </Accordion>
                       </AccordionTab>
                    </Accordion>

                </div>
            </div>
        </>
    );
}
