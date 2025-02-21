import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import {useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from '../AppTopbar';
import { AppFooter } from '../AppFooter';
import { AppMenu } from '../AppMenu';
import { AppConfig } from '../AppConfig';

import { ScrollPanel } from 'primereact/scrollpanel';


import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '../assets/demo/flags/flags.css';
import '../assets/demo/Demos.scss';
import '../assets/layout/layout.scss';
import '../assets/css/stylejs.css';
import '../App.scss';

import {useNavigate} from "react-router";

import BaseService from '../service/BaseService';

import LoadRoutes from '../pages/fragments/LoadRoutes'
//#f1c40f
import { useIdleTimer } from 'react-idle-timer';
import {useAuthStateRoles, useAuthUsername} from "../stores/AuthStore";
import { useCookies } from "react-cookie";
import {useAddNotificationToState, useNotifications, useSetNotifications, useSetNotificationsCount} from "../stores/NotificationStore";

import { useUserDetails } from "../../src/stores/userStore";
//import UploadTELedgerService, {exportTELedgerDataCancelToken} from "../service/Inventory/TELedgerService/UploadTELedgerService";
//import  TrialStore  from "../../src/stores/TrialStore"

const Home = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const [openNotifications, setOpenNotifications] = useState(false);
    const [taskNotifications, setTaskNotifications] = useState([]);

    const [cookies, setCookie, removeCookie] = useCookies();

    //const [reloadHomepage, setReloadHomepage] = useState(true);
    const navigation = useNavigate();
    const [menu, setMenu] = useState(null);
    const toast = useRef();
    const topBarRef = useRef();
    const notificationPanel = useRef(null);
    const [announcementList, setAnnouncementList] = useState([]);
    const [readList, setReadList] = useState(() => { return JSON.parse(localStorage.getItem("readLS")) || [] });

    const [notificationCount, setNotificationCount] = useState(0);
    //const [taskList, setTaskList] = useState([]);
    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    //const timeout = 1000 * 3; // milliseconds
    const timeout = 60000 * 2; // minutes
    const [remaining, setRemaining] = useState(timeout);

    const [isIdle, setIsIdle] = useState(false);
    const handleOnActive = () => setIsIdle(false);
    const handleOnIdle = () => setIsIdle(true);

    const userInfo = useUserDetails();

    const [loadingProgress, loadingProgressSet] = useState('hidden');

    //const setupTrial = TrialStore((state) => state.setLabel );

    const {
        reset,
        pause,
        resume,
        getRemainingTime,
        getLastActiveTime,
        getElapsedTime
      } = useIdleTimer({
        timeout,
        onActive: handleOnActive,
        onIdle: handleOnIdle
      });
      const _userRoles = useAuthStateRoles();
      const username = useAuthUsername();
      const setNotificationList = useSetNotifications();
      const setNotificationListCount = useSetNotificationsCount();
      const addNotificationToState = useAddNotificationToState();
      const notificationList = useNotifications();

      const [landingPageStat, landingPageStatSet] = useState('');

      useEffect(() => {// MENU MANAGER
        //const user = AuthService.getCurrentUser();

        //alert(JSON.stringify(user));
        //let UserName_ = username;
        //let RoleUser_ = _userRoles[0].substring(5);

         let RoleUser_ = userInfo?.ROLE_NAME;
         let UserName_ = userInfo?.ACCOUNT_NAME;
         let CompanyId = userInfo?.COMPANY_ID;

          if(!(RoleUser_ && UserName_)){
              removeCookie('logged_in',{path:'/'});
              //removeCookie('logged_in',{path:'/insys/'});
              navigation("/login");
          }

        //BaseService.HttpGet("/system/menu/showMenuResources?role="+_userRoles+"&username="+username).then(
        BaseService.HttpGet("/system/menu/showMenuResources?role="+RoleUser_+"&username="+UserName_+
            "&companyId="+CompanyId).then(
            (response) => {

                    setMenu(response.data['menu']);
                    landingPageStatSet(response.data['landingpage']);

            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                    console.log(_content);
            }
        );

        //console.log(userInfo);

    }, []);

      //TASK LIST
    /*useEffect(() => {
        console.log("repeat");
        TeTaskService.getTeTaskOfUser(username).then((response) => {
            //console.log(response);
            setTaskList(response.data);
        }).catch((error) => {
            console.log("Error getting tasks list: "+error);
        });
    },[]);*/

    useEffect(() => {

        //setupTrial('123');

        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);


    //NOTIFICATIONS
    useEffect(() => {
        //V1 - Commented 2023-08-10 - Error 404
        /* let url = window.location.protocol.concat("//").concat(window.location.hostname).concat(":8090").concat("/announcements/subscribe");
        const sse = new EventSource(url);
        sse.addEventListener("notification-list-event", async(event) => {
            let data = JSON.parse(event.data);
            await RedisService.getAllValuesByKey("notifications:"+username)
                .then((response) => data = [...data, ...response.data]);
                //.catch((error) =>console.error(error));
            data.sort((a, b) => b['announcementId'] - a['announcementId']);
            let aList = data.map(item=> {
                let temp = Object.assign({}, item);
                if (readList.includes(item.announcementId.toString())){
                    temp.read = true;
                    //topBarRef.current.markAsReadFn(null,item.announcementId.toString())
                }else temp.read = false;
                return temp;
            });
            let filteredAList2 = filterNotificationBeyondRange([...aList]);
            //console.log(filteredAList2);
            //let filteredAList3 = filterNotificationWithinRange([...aList]);
           // let mergedList = [...filteredAList2,...filteredAList3];
            setNotificationList(filteredAList2);
            //setAnnouncementList(mergedList);
            setNotificationListCount(filteredAList2.filter(notifications => !notifications.read).length,"set");
            //setNotificationCount(mergedList.filter(notifications => !notifications.read).length);
        });
        sse.onerror = () => {
            sse.close();
        };
        return () => {
            sse.close();
        }; */
    //},[setAnnouncementList]);

        //V2
        /* AnnouncementService.getTaskNotifications(userInfo.ACCOUNT_ID)
            .then((res) => {
                setTaskNotifications(res.data);
            })
            .catch((error) => {

            }); */

    },[]);

    useEffect(() => {
        /* let url = window.location.protocol.concat("//").concat(window.location.hostname).concat(":8090").concat("/announcements/notifications/");
        const notificationSSE = new EventSource(url+username);
        notificationSSE.addEventListener("notification", (event) => {
            const data = JSON.parse(event.data);
            addNotificationToState(data);
            //console.log(data);
            setNotificationListCount(null,"incr");
        });
        notificationSSE.onerror = () => {
            notificationSSE.close();
        };
        return () => {
            notificationSSE.close();
        }; */
    },[]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onReloadMenu = (role, username, companyId) => {
        BaseService.HttpGet("/system/menu/showMenuResources?role="+role+"&username="+username+
            "&companyId="+companyId).then(
            (response) => {
                //setMenu(response.data);

                    setMenu(response.data['menu']);
                    landingPageStatSet(response.data['landingpage']);
                    //console.log(response.data['landingpage']);

            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                    console.log(_content);
            }
        );
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }


    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

// benkuramax section


    const onMobileSubTopbarLOGOUT = (event) => {
        event.preventDefault();
        localStorage.removeItem("user");
        removeCookie('logged_in',{path:'/'});
        sessionStorage.clear();
        //removeCookie('logged_in',{path:'/insys/'});
        navigation("/login");
    }

   const onNotificationSubTopBarClick = (event) => {
        event.preventDefault();
        setOpenNotifications(!openNotifications);
        if(!openNotifications){
            notificationPanel.current.style.opacity = "1";
            notificationPanel.current.style.height = "22rem";
            notificationPanel.current.style.display = "block";
        }else{
            notificationPanel.current.style.opacity = "0";
            notificationPanel.current.style.height = "0px";
            notificationPanel.current.style.display = "none";
        }
    }
    const [active, setActive] = useState(false);
    const[todayActiveIndex, setTodayActiveIndex] = useState(null);
    const toggleConfigurator = (event) => {
        setActive(prevState => !prevState);
        const announcementId = event.currentTarget.getAttribute("data-id");
        if (announcementId)
            topBarRef.current.markAsReadFn(event, parseInt(announcementId));
        setTodayActiveIndex(announcementId);
    }

    const filterNotificationDisplay = (val) => {
        setAnnouncementList(val);
    };

    const filterNotificationDisplayCount = (val) => {
        setNotificationCount(val);
    };

    const onClickNotif = (notif) => {
        navigation(`/teTaskList?taskId=${notif.id}&defId=${notif.defId}`);
    }

    const onClickViewAllNotifs = () => {
        navigation("/teTaskList");
    }

    const onTaskListChange = (taskList) => {
        setTaskNotifications({...taskNotifications,
            data: taskList.data.length > 5 ? taskList.data.slice(0, 5) : taskList.data,
            totalCount: taskList.totalCount
        })
    }

    const samplePost = (value) => {
        alert(value);
    }
// TE-LEDGER EXPORT FUNCTION
    const exportFunctionUniversal = (dataListVar) => {
        //debugger;
        toast.current.show({severity:'info', summary: 'System Info', detail:"Populating data into excel.", life: 1500});
        //loadingProgressSet('block');
        if(exportTELedgerDataCancelToken){
            exportTELedgerDataCancelToken.cancel("Request Cancel")
        }
        UploadTELedgerService.exportTELedgerDetails(dataListVar).then((res) => {
            //debugger;
            loadingProgressSet('hidden');
            // create file link in browser's memory
            const href = URL.createObjectURL(res.data);
            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'Tools and Equipment Ledger Records.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);

            sleep(1500).then(() => {
                toast.current.show({severity:'success', summary: 'System Info', detail:"The data export was successful.", life: 1500});
            })
        })
    }

    const sleep = (ms) => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    return (

            <div className={wrapperClass} onClick={onWrapperClick}>
                <Toast ref={toast} position="top-left" />

                <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

                <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                    mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
                    onMobileSubTopbarLOGOUT={onMobileSubTopbarLOGOUT}
                    onNotificationSubTopBarClick={onNotificationSubTopBarClick}
                    openNotifications={openNotifications} toggleConfigurator={toggleConfigurator}
                    notificationPanel={notificationPanel} ref={topBarRef}
                    remaining={remaining} taskNotifications={taskNotifications}
                    onClickViewAllNotifs={onClickViewAllNotifs} onClickNotif={onClickNotif}
                    loadingProgress={loadingProgress}
                    />
                <div className="layout-sidebar" onClick={onSidebarClick}>
                <ScrollPanel style={{ height:'calc(100% - 80px)' }}>
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} onReloadMenu={onReloadMenu} />
                </ScrollPanel>
                </div>

                <div className="layout-main-container">
                    <div className="layout-main">
                         <LoadRoutes colorMode={layoutColorMode} location={location} landingPage={landingPageStat} taskListListener={onTaskListChange} samplePost={samplePost}
                            exportFunctionUniversal={exportFunctionUniversal} loadingProgressSet={loadingProgressSet}
                         />
                    </div>

                    <AppFooter layoutColorMode={layoutColorMode} />
                </div>

                <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                    layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange}
                toggleConfigurator={toggleConfigurator} setActive={setActive} active={active} announcementList={announcementList}
                activeIndex={todayActiveIndex} setNotificationCount={setNotificationCount} setAnnouncementList={setAnnouncementList}/>

                <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                    <div className="layout-mask p-component-overlay"/>
                </CSSTransition>

            </div>

    );
}

export default Home;
