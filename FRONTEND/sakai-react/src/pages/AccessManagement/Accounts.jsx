import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import BaseService from '../../service/BaseService';
import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { Image } from "primereact/image";
import { InputText } from 'primereact/inputtext';

import {Dropdown} from 'primereact/dropdown';
import { Tree } from 'primereact/tree';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toast } from 'primereact/toast';

import { SelectButton } from 'primereact/selectbutton';
import '../../assets/css/PageCss.css';
import {createCustomAreaParamMapPagination, remapSelectedAreaFilter} from "../../components/utils/OrganizationLedgerDropdown";
import {UseLedgerOrgAreaTree, useLedgerOrgTree} from "../../stores/OrganizationStore";
import {useUserDetails, setUserDetails} from "../../stores/userStore";
import {useUserOrganizationId} from "../../stores/AuthStore";

import UserTemplate from "../fragments/PopulateUserTemplate";
import {Tag} from "primereact/tag";
import { Fieldset } from 'primereact/fieldset';
import { Chips } from "primereact/chips";
import AccountService from "../../service/AccessManagement/AccountService";


const Accounts = (props) => {
/** DECLARATION */
    const [accountList, setAccountList] = useState(null);
    const [rolesList, setRolesList] = useState(null);
    const [orgTree, setOrgTree] = useState(null);
    const [organizationList, setOrganizationList] = useState(null);

    const [account, setAccount] = useState({});
    const [loading1, setLoading1] = useState(true);
    const [filters1, setFilters1] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);

    const [disabledForm, setDisabeldForm] = useState(true);
    const [dialogRole, setDialogRole] = useState(false);
    const [dialogOrg, setDialogOrg] = useState(false);
    const [selectedNat, setSelectedNat] = useState({});

    const [selectedGen, setSelectedGen] = useState({});
    const [selectedStat, setSelectedStat] = useState({});
    const [selectedType, setSelectedType] = useState('');
    const [selRole, setSelRole] = useState(null);

    const [isRoleUpdate, setIsRoleUpdate] = useState(false);
    const [isOrgUpdate, setIsOrgUpdate] = useState(false);
    const [actionType, setActionType] = useState("none");
    const [selectedSourceMenu, selectedSourceMenuSet] = useState('');

    const [dialogSourceMenu, dialogSourceMenuSet] = useState(false);
    const [displayPasswordChange, displayPasswordChangeSet] = useState(false);
    const [newPassword, newPasswordSet] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [roleOrgSel, roleOrgSelSet] = useState([]);
    const [isBtnAddRelOrg, isBtnAddRelOrgSet] = useState('hidden');
    const userInfo = useUserDetails();
    const setUserDetailsProx = setUserDetails();

    const userOrganizationId = useUserOrganizationId();
    const projectList = useLedgerOrgTree();
    const getNewAreaList = UseLedgerOrgAreaTree();
    const [getProjectList, setProjectList] = useState([]);

    const [getAreaList, setAreaList] = useState([]);
    const [querySelectedProject, setQueryProject] = useState(null);
    const [newSelectedProject, newSelectedProjectSet] = useState(null);
    const [querySelectedArea, setQueryArea] = useState(null);

    const [filterOrgArea, setFilterOrgArea] = useState(null);
    const [queryProjectForArea, setQueryProjectForArea] = useState(null);
    const toast = useRef(null);
    const fileUpld = useRef();

    const [signature, setSignature] = useState(null);
    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: false,
        className: 'custom-choose-btn p-button-rounded p-button-outlined custom-w-max', label: 'Upload Signature'};
    const [uploadUserExcel, uploadUserExcelSet] = useState(false);


    const [getSelectedFile, setSelectedFile] = useState(false);
    const [uploadResults, setUploadResults] = useState(null);

    const [removeItemList, removeItemListSet] = useState([]);

    const [userRegionAffiliate, userRegionAffiliateSet] = useState([]);

    const [buttonPermission, buttonPermissionSet] = useState({});

    const [removeRoleOrgPanel, removeRoleOrgPanelSet] = useState(true);

/** INITIALIZATION */
    const nationality = [
        {name: 'FILIPINO', id:'2'},
        {name: 'CHINESE', id:'1'}
    ];

    const gender = [
        {name: 'MALE', id:'1'},
        {name: 'FEMALE', id:'0'}
    ];

    const type = [
        'USER',
        'KEEPER'
    ];

    const status = [
        {name:'PROBATION', id:'0'},
        {name:'REGULAR', id:'1'},
        {name:'RESIGN', id: '2'}
    ];

    const sourceMenuOptions = ['ROLE', 'USER'];

    const [roleOrgCont, roleOrgContSet] = useState([]);

    const [isFirstLoad, isFirstLoadSet] = useState(true);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const btnStyle = {
        hideButton : {
            display: 'none',
            alignItems: 'center'
        },
        showButton : {
            display: 'inline-flex',
            alignItems: 'center'
        }
    }

    const uploadOptions = {label: 'Upload File', style: getSelectedFile === true ? btnStyle.showButton : btnStyle.hideButton};

    const cssCenter = {
        //height: '100vh', /* Magic here */
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const sleep = (ms) => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    /** ON LOADING */
    useEffect(() => {



        setLoading1(true);
        // --------------------
        onLoading();
        setProjectList(projectList);
        getWidgetPermission();

        //setProjectList(projectList.filter(x2 => x2.key == userOrganizationId));
        // --------------------
        //initFilters1();
    }, []);

    useEffect(() => {
        //debugger;
        if(roleOrgCont.length > 0) {

            if(actionType == 'edit'){
                if(isFirstLoad){
                    isFirstLoadSet(false);
                    roleOrgSelSet(account.role_id+':'+account.orgid);
                    setAccount({... account, roleOrgMain: account.role_id+':'+account.orgid, roleOrgList: roleOrgCont, UPDATED_BY: userInfo.ACCOUNT_ID});

                }else {
                    roleOrgSelSet(roleOrgCont[roleOrgCont.length - 1].value);
                    setAccount({... account, roleOrgMain: roleOrgCont[roleOrgCont.length - 1].value, roleOrgList: roleOrgCont, UPDATED_BY: userInfo.ACCOUNT_ID});
                }
            } else {
                roleOrgSelSet(roleOrgCont[roleOrgCont.length - 1].value);
                setAccount({... account, roleOrgMain: roleOrgCont[roleOrgCont.length - 1].value, roleOrgList: roleOrgCont, UPDATED_BY: userInfo.ACCOUNT_ID});
            }

            console.log(roleOrgCont);

        }



    }, [roleOrgCont])

    /** FUNCTIONS */
    const onLoading = () => {
        //#region coding area sample

        const objectV = {name:'showAllAccounts', conditions: null , action: null , object: userInfo};


            //console.log(userRegionAffiliate);
            BaseService.HttpPost("/system/account/showAllAccountsByOrg", objectV).then(
                (response) => {
                    setAccountList(response.data["queryAccounts"]);
                    setRolesList(response.data["queryRoles"]);
                    setOrgTree(response.data["queryOrgTree"]);
                    setOrganizationList(response.data["queryOrganization"]);

                    setLoading1(false);
                },
                (error) => {
                    const _content =
                        (error.response && error.response.data) || error.message || error.toString();
                       // console.log('error'); console.log(_content);
                }
            );





        //#endregion
    }

    const GetSelectedCustomer = (id) => {
        const single = accountList.filter(x => id == x.ACCOUNT_ID);
        console.log(single[0]);
        setAccount(single[0]);

        var natId = single[0].NATIONALITY;

        if(natId !== ''){
            var sel = nationality.filter(y => y.id == natId);
            setSelectedNat(sel[0]);

        } else {
            setSelectedNat(nationality[0]);

        }

        var sexId = single[0].SEX;
        var selGen = gender.filter(z => z.id == sexId);
        setSelectedGen(selGen[0]);

        var statusId = single[0].STATUS_;
        var selStatus = status.filter(aa => aa.id == statusId);
        setSelectedStat(selStatus[0]);

        var typeName = single[0].TYPE;
        var selTyp = type.filter(t => t == typeName);
        setSelectedType(selTyp[0]);

    }

    const getWidgetPermission = async() => {
        //alert(JSON.stringify(userInfo));
        var userid = userInfo.ACCOUNT_ID;
        let objReq = {userid:userid, companyId: userInfo.COMPANY_ID, resourceid:"45", roleid: userInfo.ROLE_ID, sourcemenu: userInfo.SOURCE_MENU};
        await AccountService.getWidgetPermission(objReq).then((res)=>{
            buttonPermissionSet(res.data);
        }).catch((err)=>{

        });
    }

    const accountsUpdate = () => {

        //debugger;

        if(roleOrgCont.length == 0){
            toast.current.show({severity:'error', summary: 'Account Page', detail:'Role and Organization not selected', life: 3000});
        return null;
        }

        const condition = [];
        if(isRoleUpdate) condition.push("roleUpdate");
        if(isOrgUpdate) condition.push("orgUpdate");

        var files = fileUpld.current.files;

        const formData = new FormData();
        formData.append("name", "accountUpdate");
        formData.append("conditions", condition);
        formData.append("action", actionType);
        formData.append("object", JSON.stringify(account));
        formData.append("signature", files ? files[0] : null);
        formData.append("userId", userInfo.ACCOUNT_ID);
        formData.append("userFullName", userInfo.FULL_NAME);
        BaseService.HttpPostForm("/system/account/accountsUpdate", formData).then(
            (response) => {
                if(response.data.feedback === '1'){
                    toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                    setDisplayBasic(false);
                    setIsRoleUpdate(false);
                    setIsOrgUpdate(false);
                    isFirstLoadSet(true);
                    onLoading();
                } else {
                    toast.current.show({severity:'error', summary: 'Account Page', detail:'Asterisk fields is required', life: 5000});
                }
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                    //console.log('error'); console.log(_content);
            }
        );
    }

    const accountActivation = (id) => {

        const single = accountList.filter(x => id == x.ACCOUNT_ID);

        const objectV = {name:'accountActivation', conditions: null , action: null , object: single[0], userId: userInfo.ACCOUNT_ID, userFullName: userInfo.FULL_NAME};

        BaseService.HttpPost("/system/account/accountActivation", objectV).then(
            (response) => {
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                onLoading();
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                    //console.log('error'); console.log(_content);
            }
        );
    }

    const SwitchSourceMenuSave = () => {

        const objectV = {name:'SwitchSourceMenuSave', str: selectedSourceMenu, object: account, userId: userInfo.ACCOUNT_ID, userFullName: userInfo.FULL_NAME };

        BaseService.HttpPost("/system/account/SwitchSourceMenuSave", objectV).then(
            (response) => {
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                onLoading();
                dialogSourceMenuSet(false);
                //
                let newData_ = {SOURCE_MENU: selectedSourceMenu};
                let newUserTemplate_ = UserTemplate(userInfo, newData_);
                setUserDetailsProx(newUserTemplate_);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                toast.current.show({ severity: 'error', summary: 'Rental Page', detail: _content, life: 3000 });
            }
        );
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onChangeSelectedProject = (event) => {
        let filter = [];
        filter.push(event.target.value.key);
        if(filter){
            let projectSelectDetails = [];
            getProjectList.map(x1 =>{
                    filter.map(y =>{
                            let fil = x1.children.filter(x2 => x2.key === y );
                            if(fil.length > 0){
                                projectSelectDetails.push(fil[0]);
                            }
                        }
                    );
                }
            );

            let areaList = getNewAreaList.filter(x => filter.includes(x.key.split('.')[0]) );
            setAreaList(areaList);
            setQueryProjectForArea(filter);
            setQueryProject(event.target.value);

            newSelectedProjectSet(projectSelectDetails);

            if(querySelectedArea) {
                let resetFilteredArea = remapSelectedAreaFilter(querySelectedArea,areaList);
                setQueryArea(resetFilteredArea);
            }
            if(filterOrgArea){
                let resetFilteredArea = createCustomAreaParamMapPagination(null,areaList,filter);
                setFilterOrgArea(resetFilteredArea);
            }

        }else{
            setQueryProject(null);
            setAreaList(null);
            setFilterOrgArea(null);
            setQueryArea([]);
        }
    }

    const onChangeSelectedArea = (event) => {
        let keys = Object.keys(event.target.value);
        let customAreaParamMap = createCustomAreaParamMapPagination(keys,getAreaList,queryProjectForArea);
        setFilterOrgArea(customAreaParamMap);
        setQueryArea(event.target.value);
    }

    const onSelectSignature = () => {
        setSignature({image: fileUpld.current.files[0].objectURL});
    }

    const onDeleteSignature = () => {
        fileUpld.current.clear();
        setSignature(null);
        setAccount({...account, SIGNATURE: null});
    }

    const onShowAccountDetailsDialog = () => {
        if (account.SIGNATURE && (actionType === "view" || actionType === "edit")) {
            BaseService.HttpGetBlob("/system/account/viewSignature?signaturePath=" + account.SIGNATURE)
                .then((res) => {
                    let objUrl = {image: URL.createObjectURL(res.data)};
                    setSignature(objUrl);
                },
                (error) => {
                    toast.current.show({severity:'error', summary: 'Error loading signature', detail:'Unable to retrieve signature', life: 3000});
                }
            );
        } else {
            fileUpld?.current?.clear();
            setSignature(null);
        }
    }

    /** TEMPLATES */
    const stateBodyTemplate = (param) => {
        return  <span className={`customer-badge status-${param.STATE == '1' ? 'qualified' : 'unqualified'}`}>
        {param.STATE == '1' ? 'ACTIVE' : 'INACTIVE'}
        </span>;
    }

    const genderBodyTemplate = (param) => {
        return  <span className={`customer-badge status-${param.SEX == '1' ? 'new' : 'unqualified'}`}>
        {param.SEX == '1' ? 'MALE' : 'FEMALE'}
        </span>;
    }

    const actionBodyTemplate = (row) => {
        return (
        <div>
            <span>
            <Button data-id={row.ACCOUNT_ID} icon="pi pi-book" className="p-button-outlined p-button-success mr-2 mb-2"
            tooltip="View"
            onClick={(e) => {
                setDisplayBasic(true);
                const id = e.target.dataset.id;
                GetSelectedCustomer(id);
                setDisabeldForm(true);
                setActionType("view");
                }} />
            <Button data-id={row.ACCOUNT_ID} icon="pi pi-user-edit" className="p-button-outlined p-button-warning mr-2 mb-2"
            tooltip="Edit"
            onClick={(e) => {
                setDisplayBasic(true);
                const id = e.target.dataset.id;
                GetSelectedCustomer(id);
                setDisabeldForm(false);
                setActionType("edit");
                }}
            />

            <Button icon="pi pi-user-minus" data-id={row.ACCOUNT_ID}
                    className={`p-button-outlined p-button-${row.STATE == '1' ? 'danger' : 'info'} mr-2 mb-2`}
                    tooltip={row.STATE === '1' ? 'disable' : 'enable'}
                    onClick={
                        e =>{
                            const id = e.target.dataset.id;
                            accountActivation(id);
                        }
                    }
            />
            <Button icon="fa fa-exchange" data-id={row.ACCOUNT_ID}
                    className="p-button-outlined p-button-warning mr-2 mb-2"
                    tooltip="Switch Resource Menu"
                    onClick={
                        e =>{
                         dialogSourceMenuSet(true);

                        const id = e.target.dataset.id;
                        const single = accountList.filter(x => id == x.ACCOUNT_ID);
                        setAccount(single[0]);

                        selectedSourceMenuSet(single[0].SOURCE_MENU);
                        }
                    }
            />
            <Button icon="fa fa-lock"
                    className="p-button-outlined p-button-help mr-2 mb-2"
                    tooltip="Change Password"
                    onClick={
                        e =>{
                            displayPasswordChangeSet(true);
                            const single = accountList.filter(x => row.ACCOUNT_ID == x.ACCOUNT_ID);
                            setAccount(single[0]);
                        }
                    }
            />
            </span>
        </div>
        )
        ;
    }


    const basicDialogFooter =
    (
            <div>
                <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                    disabled={disabledForm}
                   onClick={() => {
                       accountsUpdate();
                    }

                }
                />

                <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                    onClick={() => setDisplayBasic(false)}
                />
            </div>
    );

    const sourceMenuFooter = (
        <>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                onClick={() => {
                    //alert(JSON.stringify(selectedSourceMenu));
                    SwitchSourceMenuSave();
                }}
            />

            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                onClick={() => dialogSourceMenuSet(false)}
            />
        </>
    );

    const changePasswordFooter = (
        <>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                onClick={() => {
                    if (newPassword.password !== newPassword.confirmPassword) {
                        toast.current.show({ severity: 'error', summary: 'System Information', detail: "Password Mismatch", life: 4000 });
                        return false;
                    }

                    let objectV = {
                        account_id: account.ACCOUNT_ID,
                        password: newPassword.password,
                        userId: userInfo.ACCOUNT_ID,
                        userFullName: userInfo.FULL_NAME,
                        pageName: "User Management" // Add parameter indicating the page name
                    };

                    BaseService.HttpPost("/system/account/editUserPassword", objectV).then(
                        (res) => {
                            if (res.data.status === 200) {
                                toast.current.show({ severity: 'success', summary: 'System Information', detail: "Change password successful.", life: 4000 });
                                displayPasswordChangeSet(false);
                                newPasswordSet({});
                            } else {
                                toast.current.show({ severity: 'error', summary: 'System Information', detail: res.data.errMsg });
                            }
                        },
                        (error) => {
                            // Handle error
                        }
                    );
                }}
            />
            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                onClick={() => displayPasswordChangeSet(false)}
            />
        </>
    );

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Account Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const onUploadHandler = async(event) => {

        for(const element of event.files) {
            let formData = new FormData();
            formData.append("excel[]", element)
            formData.append("username", 'username');
            formData.append("userId", userInfo.ACCOUNT_ID);
            formData.append("userFullName", userInfo.FULL_NAME);
            //
            await BaseService.HttpPostForm("/system/account/uploadNewUserFromExcel", formData).then(
                (res) => {
                    setUploadResults(res.data.data);
                    setSelectedFile(false);
                },
                (error) => {

                }
            );
            //
        }

    }

    const formatRemarksColumn = (rowData) => {
        return (!rowData.remarks ? <div></div>
            : rowData.remarks.split('\n').map(str => <p>{str}</p>));
    }

    const formatStatusColumn = (rowData) => {
        return (!rowData.status ? <div></div>
            : <div><Tag className="mr-2" severity={rowData.status === "Uploaded" || rowData.status === "Success" ? "success" : "danger"}  value={rowData.status}></Tag></div>);
    }


    const customChip = (item) => {
        let strNew = item.split('===');
        return (
            <div>
                <span>
                    {strNew[0]}
                </span>
            </div>
        );
    };

    //#region Main JSX

    return(
        <div className="grid table-demo">
        <Toast ref={toast} position="bottom-right" />

            <div className="col-12">
                <div className="card">
                    <h5>Accounts table list</h5>

                    <div className="template" style={{display: 'flex'}}>
                        <Button className={`slack p-0 ${buttonPermission["w014x45"]?.display || 'hidden'}`} aria-label="Slack"
                        onClick={e=>{
                            setDisplayBasic(true);
                            setDisabeldForm(false);
                            setAccount({
                                CREATED_BY: userInfo.ACCOUNT_ID,
                                SEX: '1',
                                NATIONALITY: '2',
                                STATUS_: '1',
                                CREATED_BY_ID: userInfo.ACCOUNT_ID,
                                CREATED_BY_NAME: userInfo.FULL_NAME,
                            });
                            setSelectedNat(nationality[0]);
                            setSelectedGen(gender[0]);
                            setSelectedStat(status[0]);

                            setActionType("add");
                            }
                        }
                        >
                            <i className="pi pi-user-plus px-2"/>
                            <span className="px-3">Add User</span>
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button className={`vimeo p-0 ${buttonPermission["w015x45"]?.display || 'hidden'}`} aria-label="Vimeo"
                            onClick={()=>{
                                uploadUserExcelSet(true);
                            }}
                        >
                            <i className="pi pi-file px-2"></i>
                            <span className="px-3">Import Excel with User</span>
                        </Button>

                    </div>
                    <br/>
                    <DataTable value={accountList} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters}  loading={loading1} responsiveLayout="scroll"
                          emptyMessage="No customers found."
                          header={header} globalFilterFields={['FULL_NAME','ACCOUNT_NAME','role']}
                          >
                        <Column  header="ACTION" body={actionBodyTemplate} style={{minWidth: '20rem'}}/>

                        <Column field="SOURCE_MENU" header="Source Menu"  style={{ minWidth: '10rem' }} />

                        <Column field="ACCOUNT_ID" header="Account ID"  style={{ minWidth: '8rem' }} />
                        <Column field="ACCOUNT_NAME" header="Account"  style={{ minWidth: '12rem' }} />
                        <Column field="FULL_NAME" header="Name"  style={{ minWidth: '12rem' }} />
                        <Column field="role" header="Role"  style={{ minWidth: '12rem' }} />
                        <Column field="MOBILE_PHONE_A" header="Contact #"  style={{ minWidth: '12rem' }} />

                        <Column field="SEX" header="Gender"  style={{ minWidth: '12rem' }} body={genderBodyTemplate} />
                        <Column field="STATE" header="State"  style={{ minWidth: '12rem' }} body={stateBodyTemplate} />
                        <Column field="CREATE_DATE_F" header="Create Date"  style={{ minWidth: '12rem' }} />

                    </DataTable>
                </div>
            </div>

            {/** DIALOG SECTION */}
            <Dialog header="Account Details" visible={displayBasic} className="account-deets" modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}
                onShow={() => {
                    onShowAccountDetailsDialog();
                    roleOrgContSet([]);
                    removeItemListSet([]);
                    
                    //debugger;
                    if(actionType == 'edit'){
                        let userId_ = account.ACCOUNT_ID;
                        console.log('UserId:', userId_);
                        console.log('Account:', account);

                        BaseService.HttpPost("/system/account/getRoleOrgListByUserid", { userid:userId_ }).then(
                            (response) => {

                                let roleOrgList_ = response.data;

                                roleOrgList_.map(x => {
//debugger;
                                    //removeItemList.push(x.name);
                                    //removeItemListSet([... removeItemList,  x.name]);
                                    removeItemListSet( xo => [... xo, x.name + '===' + x.value]);
                                   
                                });
                                roleOrgContSet(response.data);
                            },
                            (error) => {

                            }
                        );
                    }
                }}
            >
                <br/>
                <div style={{ backgroundColor: "#fafafa", padding: '25px', borderRadius: '10px' }}>
                    <div className="grid">
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.FULL_NAME || ''} disabled={disabledForm} style={{ width: '100%' }}
                                onChange={e => setAccount({ ...account, FULL_NAME: e.target.value })} />
                                <label htmlFor="inputtext">Fullname <span style={{color:'red'}}>*</span></label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.CREATE_DATE_F || ''}  disabled style={{ width: '100%' }}
                                />
                                <label htmlFor="inputtext">Create Date:</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.ACCOUNT_NAME || ''} disabled={actionType == "add"? false : true} style={{ width: '100%' }}
                                onChange={e => setAccount({ ...account, ACCOUNT_NAME: e.target.value })} />
                                <label htmlFor="inputtext">Account Name <span style={{color:'red'}}>*</span></label>
                            </span>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.MOBILE_PHONE_A || ''} disabled={disabledForm} style={{ width: '100%' }}
                                onChange={e => setAccount({ ...account, MOBILE_PHONE_A: e.target.value })} />
                                <label htmlFor="inputtext">Phone:</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <Dropdown id="dropdown" options={nationality} value={selectedNat} style={{ width: '100%' }} disabled={disabledForm}
                                onChange={e => {
                                    setSelectedNat(e.value);
                                    var val = e.value.id;
                                    setAccount({ ...account, NATIONALITY: val });
                                }}
                                optionLabel="name"/>
                                <label htmlFor="dropdown">Nationality</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                            <Dropdown id="dropdown" options={gender} value={selectedGen} style={{ width: '100%' }} disabled={disabledForm}
                                onChange={e => {
                                    setSelectedGen(e.value);
                                    var val = e.value.id;
                                    setAccount({ ...account, SEX: val });
                                }}
                                optionLabel="name"/>
                                <label htmlFor="dropdown">GENDER</label>
                            </span>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText
                                    style={{ width: '100%' }}
                                    type="text" id="inputtext" value={account.HOME_ADDRESS || ''} disabled={disabledForm}
                                    onChange={e => setAccount({ ...account, HOME_ADDRESS: e.target.value })} />
                                <label htmlFor="inputtext">Address :</label>
                            </span>
                        </div>

                    </div>

                    <div className="grid">
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.FIBERHOMEID || ''} disabled={disabledForm} style={{ width: '100%' }}
                                onChange={e => setAccount({ ...account, FIBERHOMEID: e.target.value })} />
                                <label htmlFor="inputtext">FIBERHOMEID :</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.EMAIL1 || ''} disabled={disabledForm} style={{ width: '100%' }}
                                onChange={e => setAccount({ ...account, EMAIL1: e.target.value })}  />
                                <label htmlFor="inputtext">Email :</label>
                            </span>
                        </div>
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                            <Dropdown id="dropdown" options={status} value={selectedStat} style={{ width: '100%' }} disabled={disabledForm}
                                onChange={e => {
                                    setSelectedStat(e.value);
                                    var val = e.value.id;
                                    setAccount({ ...account, STATUS_: val });
                                }}
                                optionLabel="name"/>
                                <label htmlFor="dropdown">STATUS</label>
                            </span>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <Dropdown id="dropdown" options={type} value={selectedType} style={{ width: '100%' }} disabled={disabledForm}
                                    onChange={e => {
                                        setSelectedType(e.value);
                                        setAccount({ ...account, TYPE: e.value });
                                    }}
                                />
                                <label htmlFor="dropdown">TYPE</label>
                            </span>

                        </div>

                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <InputText type="text" id="inputtext" value={account.POSITION || ''}  style={{ width: '100%' }} disabled={disabledForm}
                                    onChange={e => {
                                        setAccount({ ...account, POSITION: e.target.value });
                                    }}
                                  />
                                <label htmlFor="inputtext">Position :</label>
                            </span>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="field col-12 md:col-4">


                            <div className="p-inputgroup">
                                <span className="p-float-label">
                                    <InputText type="text" id="inputtext" value={account.role || ''} disabled style={{ width: '100%' }} />
                                    <label htmlFor="dropdown">Role <span style={{color:'red'}}>*</span></label>
                                </span>
                                <Button icon="pi pi-search" className="p-button-info"
                                    onClick={() => {
                                        setDialogRole(true);
                                        const selRol = rolesList.filter(x=> x.ROLE_ID == account.role_id);
                                        setSelRole(selRol[0]);
                                        }
                                    }

                                    disabled={disabledForm} />

                            </div>
                        </div>

                        <div className="field col-12 md:col-4">

                            <div className="p-inputgroup">
                                <span className="p-float-label">
                                    <InputText type="text" id="inputtext" value={account.organization || ''} disabled style={{ width: '100%' }} />
                                    <label htmlFor="dropdown">Organization <span style={{color:'red'}}>*</span></label>
                                </span>
                                <Button icon="pi pi-search" className="p-button-info"
                                    onClick={() => setDialogOrg(true)} disabled={disabledForm} />

                            </div>

                        </div>

                        <div className="field col-12 md:col-4">
                            <Button label="Add Role - Organization Relation" className={`btn btn-primary ${isBtnAddRelOrg}`}
                                onClick={e =>{

                                    roleOrgContSet([... roleOrgCont, {name:account.role +'-'+ account.organization, value:account.role_id+':'+account.orgid}]);
                                    //removeItemListSet(xo => [...xo, account.role +'-'+ account.organization]);
                                    removeItemListSet(xo => [...xo, account.role +'-'+ account.organization + '===' + account.role_id+':'+account.orgid]);
                                }}
                            />
                        </div>
                        <div className="grid col-12 md:col-12">
                            <div className="col-12">
                            <SelectButton value={roleOrgSel} onChange={e => {
                                //debugger;
                                roleOrgSelSet(e.value);

                                console.log(organizationList);

                                let orgId = e.value.split(":")[1];

                                let orgFil = organizationList.filter(xx => xx.ORGANIZATION_ID.toString() === orgId);

                                let orgtypeStr = orgFil[0].type_;

                                let orgpathStr = orgFil[0].path_;

                                setAccount({... account, roleOrgMain: e.value, orgtype: orgtypeStr, orgpath: orgpathStr});

                                //console.log(account);
                            }} optionLabel="name" options={roleOrgCont} selected={1} />
                            </div>
                        </div>

                        <div className="grid col-12 md:col-12">
                            <Fieldset legend="remove role- org" toggleable collapsed={removeRoleOrgPanel}>
                                <p className="m-0">
                                <Chips value={removeItemList}  style={{width: '100%'}} onChange={e => {
                                    //debugger;
                                    if(removeItemList.length > 1){
                                        removeItemListSet(e.value)
                                    }

                                }}

                                itemTemplate={customChip}

                                onRemove={e => {
                                    //alert(JSON.stringify(e.value));
                                }}
                                />
                                <Button label="Apply Changes" icon="pi pi-delete" size="small" className="mt-3"
                                onClick={e => {
                                    removeRoleOrgPanelSet(true);
                                    //debugger;
                                    let newArrList_ = [];
                                    removeItemList.map(xo => {
                                        //let filterRolOrg_ = roleOrgCont.filter(xx => xx.name == xo);
                                        let filterRolOrg_ = roleOrgCont.filter(xx => xx.name+'==='+xx.value == xo);
                                        newArrList_.push(filterRolOrg_[0]);
                                    });
                                    roleOrgContSet(newArrList_);
                                    
                                    //console.log(roleOrgCont);
                                    
                                }}
                                />
                                &nbsp;&nbsp;&nbsp;
                                <Button label="Reset" icon="pi pi-refresh" size="small" className="mt-3 p-button-secondary"
                                    onClick={ e => {
                                        //removeItemListSet();

                                        removeItemListSet([]);
                                        roleOrgCont.map(xo => {
                                            removeItemListSet(xx => [...xx, xo.name+'==='+xo.value ]);
                                        });

                                        //alert(JSON.stringify(roleOrgCont));
                                    }}
                                />

                                </p>

                            </Fieldset>
                        </div>


                        <div className="field col-12 md:col-4">
                            <span className="p-float-label">
                                <label htmlFor="dropdown">Signature</label>
                            </span>
                            <div className="mt-4">
                                {
                                    actionType === "add" || actionType === "edit"
                                    ? <FileUpload mode="basic" name="signature" accept="image/*" maxFileSize={1000000}
                                        customUpload uploadHandler={null} onSelect={onSelectSignature}
                                        ref={fileUpld} chooseOptions={chooseOptions}/> : null
                                }
                                {
                                    signature
                                    ? <div>
                                        <div className="flex flex-wrap justify-content-center">
                                            <Image src={signature.image} className="mt-3" width="250" height="150"/>
                                        </div>
                                        <div className="flex flex-wrap justify-content-center">
                                        {
                                            actionType === "add" || actionType === "edit"
                                            ? <Button label="Remove" className="p-button p-component p-button-text p-button-danger"
                                                onClick={onDeleteSignature} />  : null
                                        }
                                        </div>
                                    </div> : null
                                }
                            </div>
                        </div>




                        {/*<div className="field col-12 md:col-4">
                                    <span className="p-float-label">
                                        <Dropdown value={querySelectedProject} onChange={(e) => onChangeSelectedProject(e)} options={getProjectList}
                                                  optionLabel="label" optionGroupLabel="label" optionGroupChildren="children"
                                                  placeholder="" className="w-full" />
                                         <label htmlFor="project">Project</label>
                                    </span>
                        </div>
                        <div className="field col-12 md:col-4">
                                    <span className="p-float-label">
                                         <Dropdown value={querySelectedArea} onChange={(e) => onChangeSelectedArea(e)} options={getAreaList}
                                                   optionValue="label"  optionGroupLabel="label" optionGroupChildren="children"
                                                   placeholder="" className="w-full" />
                                          <label htmlFor="area">Area</label>
                                    </span>
                        </div>*/}

                    </div>
                </div>
            </Dialog>

            <Dialog header="Role Selection" visible={dialogRole} className="role-selection" modal  onHide={() => setDialogRole(false)}>
            <DataTable value={rolesList}  selectionMode="single"

                        selection={selRole}

                        onSelectionChange={e => {
                            setSelRole(e.value);
                            setDialogRole(false);

                            setAccount({ ...account, role: e.value.NAME_, role_id:  e.value.ROLE_ID });
                            setIsRoleUpdate(true);
                            }
                        }>

                        <Column selectionMode="single" headerStyle={{width: '3em'}}/>
                        <Column field="NAME_" header="Role"   />
                        <Column field="CODE" header="Code"   />

            </DataTable>

            </Dialog>

            <Dialog header="Organization Selection" visible={dialogOrg} className="role-selection" modal  onHide={() => setDialogOrg(false)}>
                <ScrollPanel style={{ width: '100%', height: '550px' }}>
                    <Tree value={orgTree} onSelect={e =>{
                            setDialogOrg(false);
                            const re = organizationList.filter(x=> x.ORGANIZATION_ID == e.node.key );
                            //alert(JSON.stringify(re));
                            setAccount({ ...account, organization: re[0].FULL_NAME, orgid:  re[0].ORGANIZATION_ID, orgtype: re[0].type_, orgpath: re[0].path_ });
                            setIsOrgUpdate(true);
                            isBtnAddRelOrgSet('flex');
                        }
                    }  selectionMode="single"/>
                </ScrollPanel>
            </Dialog>

            <Dialog header="Source Menu change" visible={dialogSourceMenu} style={{ width: '20vw' }} modal
                footer={sourceMenuFooter}  onHide={() => dialogSourceMenuSet(false)} >
                <br/>
                <div style={{background:'#eaeaea', padding:'15px'}}>
                    <div style={cssCenter}>
                        <p><b>{account.ACCOUNT_NAME}</b></p>
                        <br></br>
                    </div>
                    <div style={cssCenter}>
                        <SelectButton value={selectedSourceMenu} options={sourceMenuOptions} onChange={(e) => selectedSourceMenuSet(e.value)}
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Upload User Data from Excel" draggable={false} resizable={false} className="account-list" visible={uploadUserExcel} modal={true}
            onHide={() => {
                uploadUserExcelSet(false);
                setUploadResults(null);
                onLoading();
            }}
            >
                    <FileUpload mode="advanced"
                                maxFileSize={30000000}
                                chooseOptions={{ label: 'Select File', icon: 'pi pi-file-excel', className: 'p-button-success' }}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                uploadOptions={uploadOptions}
                                onSelect={() => setSelectedFile(true)}
                                onRemove={() => setSelectedFile(false)}
                                onClear={() => setSelectedFile(false)}
                                customUpload uploadHandler={onUploadHandler}
                    />


                    <DataTable value={uploadResults} >
                        <Column field="file" header="File"/>
                        <Column header="Status" body={formatStatusColumn}/>
                        <Column header="Remarks" body={formatRemarksColumn}/>
                        <Column field="insertCount" header="Insert Count"/>
                        <Column field="duplicateCount" header="Duplicate Count"/>

                    </DataTable>
                </Dialog>

{
    //#region dialog Change Password
}

            <Dialog header="User password change" visible={displayPasswordChange} style={{ width: '20vw' }} modal
                footer={changePasswordFooter}  onHide={() => displayPasswordChangeSet(false)} >
                <br/>
                <div style={{background:'#eaeaea', padding:'15px'}}>

                    <div style={cssCenter}>
                        <p><b>{account.ACCOUNT_NAME}</b></p>
                        <br></br>
                    </div>

                    <span className="p-float-label">
                        <InputText type="text" id="inputtext" value={newPassword.password || ''} style={{ width: '100%' }}
                            onChange={e=>{
                                newPasswordSet({...newPassword, password: e.target.value});
                            }}
                        />
                        <label htmlFor="password">New password <span style={{color:'red'}}>*</span></label>
                    </span>
                    <br/>
                    <span className="p-float-label">
                        <InputText type="text" id="inputtext" value={newPassword.confirmPassword || ''} style={{ width: '100%' }}
                            onChange={e=>{
                                newPasswordSet({...newPassword, confirmPassword: e.target.value});
                            }}
                        />
                        <label htmlFor="password">Confirm password <span style={{color:'red'}}>*</span></label>
                    </span>
                </div>
            </Dialog>
{
    //#endregion
}

        </div>
    );
//#endregion
}
/* eslint eqeqeq: 0 */
const comparisonFn = function (prevProps, nextProps) {

    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Accounts, comparisonFn);
