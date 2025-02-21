import React, {useEffect, useState, useRef} from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import {Ripple} from "primereact/ripple";
import { Badge } from 'primereact/badge';
import {Accordion, AccordionTab} from "primereact/accordion";
import {useAuthState, useAuthStateRoles, useAuthUsername} from "./stores/AuthStore";
//import { useUserDetails } from './stores/userStore';
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router";
//import {useGetTask, useSetTask, useTaskState} from "./stores/TaskStore";

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useUserDetails , setUserDetails} from "./stores/userStore";

import BaseService from './service/BaseService';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';


const AppSubmenu = (props) => {

    const [activeIndex, setActiveIndex] = useState(null)
    const [getStatus, setStatus] = useState(false)
    const [getActiveIndex2, setActiveIndex2] = useState(null);
    const taskList = null; //useTaskState();
    //const setTaskList = useSetTask();
    //const getTask = useGetTask();
    const username = useAuthUsername();



    const onClickAccordion = (itemIndex) => {
        let _activeIndex = getActiveIndex2 ? [...getActiveIndex2] : [];
        if(_activeIndex.length === 0){
            _activeIndex.push(itemIndex);
        }else{
            const index = _activeIndex.indexOf(itemIndex);
            if(index === -1){
                _activeIndex.push(itemIndex);
            }else{
                _activeIndex.splice(index, 1);
            }
        }
        setActiveIndex2(_activeIndex);
    }

    const onMenuItemClick = (event, item, index) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        if (index === activeIndex)
            setActiveIndex(null);
        else
            setActiveIndex(index);

        if (props.onMenuItemClick) {
            props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    const onKeyDown = (event) => {
        if (event.code === 'Enter' || event.code === 'Space'){
            event.preventDefault();
            event.target.click();
        }
    }

    const renderLinkContent = (item) => {
        let submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
        let badge = item.badge && <Badge value={item.badge} />

        return (
            <React.Fragment>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {submenuIcon}
                {badge}
                <Ripple/>
            </React.Fragment>
        );
    }

    const renderLink = (item, i) => {
        let content = renderLinkContent(item);

        if (item.to) {
            return (
                <NavLink aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" className="p-ripple" activeclassname="router-link-active router-link-exact-active" to={item.to} onClick={(e) => onMenuItemClick(e, item, i)} target={item.target}>

                    {content}
                </NavLink>
            )
        }
        else {
            return (
                <a tabIndex="0" aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" href={item.url} className="p-ripple" onClick={(e) => onMenuItemClick(e, item, i)} target={item.target}>
                    {content}
                </a>
            );
        }
    }

    const sortJsonOBject = (attrib, module, jsonObject) => {
        if(attrib === module){
            if(getStatus === false){
                setStatus(true)
                jsonObject.sort((a, b) => a.label > b.label ? 1 : -1)
            }else{
                setStatus( false)
                jsonObject.sort((a, b) => a.label > b.label ? -1 : 1)
            }
        }
    }

    const styles = {
        dropDown : {
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '5px',
            paddingRight: '5px',
            marginTop: '10px',
            width: '98%'
        },
        button : {
            marginTop: '10px',
            width: '98%'
        }

    }
    //getTask to invoke API call and update tasks values
    //Get submenu if logged in user has existing/pending/initiated forms
    useEffect(() => {
        //getTask(username);


    },[]);

    let items = props.items && props.items.map((item, i) => {
        let active = activeIndex === i;
        let styleClass = classNames(item.badgeStyleClass, {'layout-menuitem-category': props.root, 'active-menuitem': active && !item.to });
        // {console.log(item)}
        //console.log(item);
        //console.log(props);
        if(item.label === 'View Application'){
            /* taskList from API Zustand store if api is empty
             return null to hide the View Application else display forms */
            if(!taskList){
                return null;
            }
            item.items = taskList;
        }
        if(props.root) {
            return (
                <li className={styleClass} key={i} role="none">
                    {props.root === true &&
                        <React.Fragment>
                            <Accordion activeIndex={1}>
                                <AccordionTab header={item.label}>
                                    <AppSubmenu data-item={item.label}
                                                items={item.items}
                                                onMenuItemClick={props.onMenuItemClick} />
                                </AccordionTab>
                            </Accordion>
                        </React.Fragment>}
                </li>
                // <React.Fragment>
                //     <Accordion activeIndex={1} key={i}>
                //
                //             <AccordionTab header={item.label}>
                //                 <AppSubmenu data-item={item.label}
                //                             items={item.items}
                //                             onMenuItemClick={props.onMenuItemClick} />
                //             </AccordionTab>
                //
                //
                //     </Accordion>
                // </React.Fragment>
                //     <li className={styleClass} key={i} role="none">
                //     {props.root === true && <React.Fragment>
                //             {/*<div className="layout-menuitem-root-text" aria-label={item.label}>{item.label}</div>*/}
                //             <button data-title={item.label}
                //                     onClick={(e) =>
                //                 sortJsonOBject(e.target.getAttribute("data-title"), item.label.toString(), item.items)}
                //                     style={{width:'100%', textAlign:'left'}} className="layout-menuitem-root-text" aria-label={item.label}>{item.label}</button>
                //             <AppSubmenu data-item={item.label}
                //                         items={item.items}
                //                         onMenuItemClick={props.onMenuItemClick} />
                // </React.Fragment>}
                // </li>
            );
        }
        else {
            return (
                <li className={styleClass} key={i} role="none">
                    {renderLink(item, i)}
                    <CSSTransition classNames="layout-submenu-wrapper" timeout={{ enter: 1000, exit: 450 }} in={active} unmountOnExit>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </CSSTransition>
                </li>
            );
        }
    });

    return items ? <ul className={props.className} role="menu">{items}</ul> : null;
}

export const AppMenu = (props) => {
    const [currentUser, setCurrentUser] = useState("user");
    const [role, setRole] = useState("");
    const [selRolOrg, selRolOrgSet] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies();
    //const user = useAuthState();
    const _userRoles = useAuthStateRoles();
    const username = useAuthUsername();
    const navigation = useNavigate();
    const userInfo = useUserDetails();
    const setUserDetailsProx = setUserDetails();

    const [userFoin, userFoinSet] = useState(useUserDetails());

    const [displayPasswordChange, displayPasswordChangeSet] = useState(false);
    const [newPassword, newPasswordSet] = useState({});
    const [roleOrgNames, roleOrgNamesSet] = useState([]);
    const [selNewRoleOrg, selNewRoleOrgSet] = useState(null);

    const cssCenter = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const op = useRef(null);
    const toast = useRef(null);

    useEffect(() => {

        //const user = JSON.parse(localStorage.getItem("user"));
        if(!_userRoles){
            removeCookie('logged_in',{path:'/'});
            //removeCookie('logged_in',{path:'/insys/'});
            navigation("/login");
        }else{
            setCurrentUser(userInfo.FULL_NAME);
            setRole(_userRoles[0].substring(5, _userRoles[0].length));
        }

        let roleOrgNames_ = userInfo?.rolorgnames.split(",");
        let roleOrgIds_ = userInfo?.rolorgids.split(",");
        //roleOrgNamesSet([{...roleOrgNames, name:'123'}]);
        let count_ = 0;
        let roleOrgNamesTTT = [];
        roleOrgNames_.map(xx => {
            let obj_ = {name: xx, value: roleOrgIds_[count_]};
            roleOrgNamesTTT.push(obj_);
            count_ +=1;
        });
        roleOrgNamesSet(roleOrgNamesTTT);

        let roleOrgSel_ = userInfo?.ROLE_ID + ':' + userInfo?.ORGANIZATION_ID;
        let count = 0;

        roleOrgIds_.map(xo => {
            if(xo === roleOrgSel_){
                selRolOrgSet(roleOrgNames_[count]);
            }
            count += 1;
        });

    }, []);

    useEffect(()=>{
        //
        const arrayRes = selRolOrg.split(':');
        props.onReloadMenu(arrayRes[0], userInfo?.ACCOUNT_NAME, userInfo?.COMPANY_ID);
        //
    }, [selRolOrg]);

    const OnChangeRoleOrg = (e) => {
        selRolOrgSet(e.value.name);

        let objectV = {newRoleOrg: e.value.value, userid: userInfo.ACCOUNT_ID};

        BaseService.HttpPost("/system/menu/onChangeNewRoleOrg", objectV).then(
            (res) => {
                if(res.data.status === 200){
                    let newTemplate = populateData(res);
                    setUserDetailsProx(newTemplate);
                    toast.current.show({severity:'success', summary: 'System Information', detail:"Change Role and Organization successful.", life: 4000});
                    window.location.reload(false);
                }
            },
            (error) => {

            }
        );

    }
    
    const populateData = (res) =>{

        let newTemplate = {
            ACCOUNT_ID: userFoin.ACCOUNT_ID,
            ACCOUNT_NAME: userFoin.ACCOUNT_NAME,
            FULL_NAME: userFoin.FULL_NAME,
            HOME_ADDRESS: userFoin.HOME_ADDRESS,
            MOBILE_PHONE_A: userFoin.MOBILE_PHONE_A,
            EMAIL1: userFoin.EMAIL1,

            ROLE_ID: res.data.roleid,
            ROLE_NAME: userFoin.ROLE_NAME,
            COMPANY_ID: res.data.companyId,
            ORGANIZATION_ID: res.data.orgid,
            ORG_NAME: userFoin.ORG_NAME,
            ORG_TYPE: res.data.orgtype,
            PROJECT_ID: res.data.projectid,
            AREA_ID: res.data.areaid,
            REGION_ID: res.data.regionid,
            FIBERHOMEID: userFoin.FIBERHOMEID ,
            SOURCE_MENU: userFoin.SOURCE_MENU ,
            TYPE: userFoin.TYPE ,
            rolorgids: userFoin.rolorgids ,
            rolorgnames: userFoin.rolorgnames
        };

        return newTemplate;
    }


    const changePasswordFooter = (
        <>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                onClick={() => {
                    if (newPassword.password !== newPassword.confirmPassword) {
                        toast.current.show({ severity: 'error', summary: 'System Information', detail: "Password Mismatch", life: 4000 });
                        return false;
                    }

                    let objectV = {
                        account_id: userInfo.ACCOUNT_ID,
                        password: newPassword.password,
                        userId: userInfo.ACCOUNT_ID,
                        userFullName: userInfo.FULL_NAME,
                        pageName: "Welcome Page" 
                    };

                    BaseService.HttpPost("/system/account/editUserPassword", objectV).then(
                        (res) => {
                            if (res.data.status === 200) {
                                toast.current.show({ severity: 'success', summary: 'System Information', detail: "Change password successful.", life: 4000 });
                                displayPasswordChangeSet(false);
                                newPasswordSet({});
                            }
                        },
                        (error) => {
                        }
                    );
                }}
            />
            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                    onClick={() => displayPasswordChangeSet(false)}
            />
        </>
    );

    return (

        <div className="layout-menu-container">
            <Toast ref={toast} />
            <div className="user-info-block">
                <div className="user-info-name mb-1">{currentUser}</div>

                <a href="#" className="user-info-role"  onClick={(e) => {
                    op.current.toggle(e);

                    //alert(JSON.stringify(userFoin));
                }
                    } >
                    <div className='text-blue-300'>
                    {selRolOrg.split(':')[0]}
                    </div>
                    
                    {selRolOrg.split(':')[1]}
                    </a>


                <div className="user-info-block mt-1">
                    <a href="#" onClick={()=>{
                        displayPasswordChangeSet(true);
                        setUserDetails({
                            CREATED_BY_ID: userInfo.ACCOUNT_ID,
                            CREATED_BY_NAME: userInfo.FULL_NAME});
                    }}>change password</a>
                </div>
            </div>
            <AppSubmenu items={props.model} className="layout-menu"  onMenuItemClick={props.onMenuItemClick} root={true} role="menu" />

            <Dialog header="User password change" visible={displayPasswordChange} style={{ width: '20vw' }} modal
                    footer={changePasswordFooter}  onHide={() => displayPasswordChangeSet(false)} >
                <br/>
                <div style={{background:'#eaeaea', padding:'15px'}}>

                    <div style={cssCenter}>
                        <p><b>{ userInfo?.ACCOUNT_NAME }</b></p>
                        <br></br>
                    </div>

                    <div style={cssCenter}>
                    <span className="p-float-label">
                        <Password value={newPassword.password || ''} feedback={false} toggleMask
                            onChange={(e) => newPasswordSet({...newPassword, password: e.target.value})} />
                            
                        {/* <InputText type="text" id="inputtext" value={newPassword.password || ''} style={{ width: '100%' }}
                            onChange={e=>{
                                newPasswordSet({...newPassword, password: e.target.value});
                            }}
                        /> */}
                        <label htmlFor="password">New password <span style={{color:'red'}}>*</span></label>
                    </span>
                    </div>
                    <br/>
                    <div style={cssCenter}>
                    <span className="p-float-label">
                        <Password value={newPassword.confirmPassword || ''} feedback={false} toggleMask style={{ width: '100%' }}
                            onChange={(e) => newPasswordSet({...newPassword, confirmPassword: e.target.value})} />
                        {/* <InputText type="text" id="inputtext" value={newPassword.confirmPassword || ''} style={{ width: '100%' }}
                            onChange={e=>{
                                newPasswordSet({...newPassword, confirmPassword: e.target.value});
                            }}
                        /> */}
                        <label htmlFor="password">Confirm password <span style={{color:'red'}}>*</span></label>
                    </span>
                    </div>
                </div>
            </Dialog>

            <OverlayPanel ref={op} showCloseIcon>
                <DataTable value={roleOrgNames} selectionMode="single" selection={selNewRoleOrg} stripedRows
                    onSelectionChange={(e) => {
                        selNewRoleOrgSet(e.value);
                        confirmDialog({
                            message: <div style={{marginLeft:'0rem', marginTop:'20px', fontSize:'15px'}}>Are you sure you want to proceed?</div>,
                            header: 'Confirmation',
                            /*icon: 'pi pi-exclamation-triangle',*/
                            accept: () => {
                                OnChangeRoleOrg(e);
                            },
                            reject: () =>{}
                        });
                    }}
                >
                    <Column field="name" header="Role-Org"  style={{minWidth: '12rem'}} />

                </DataTable>
            </OverlayPanel>

        </div>
    );
}

