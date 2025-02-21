import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import BaseService from '../../../../service/BaseService';
import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import {Dropdown} from 'primereact/dropdown';
import { Tree } from 'primereact/tree';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toast } from 'primereact/toast';

import { SelectButton } from 'primereact/selectbutton';
import '../../../../assets/css/PageCss.css';

import {FuncAccount} from './Functions';
import {TempAccount} from './Templates';


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

    const toast = useRef(null);
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

    const cssCenter = {
        //height: '100vh', /* Magic here */
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
/** ON LOADING */
    useEffect(() => {
        setLoading1(true);
        // --------------------
        //onLoading();
        FuncAccount.onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
        // --------------------
        //initFilters1();
    }, []);

    useEffect(() => {
        if(roleOrgCont.length > 0) {

            if(actionType == 'edit'){
                if(isFirstLoad){
                    isFirstLoadSet(false);
                    roleOrgSelSet(account.role_id+':'+account.orgid);
                    setAccount({... account, roleOrgMain: account.role_id+':'+account.orgid, roleOrgList: roleOrgCont});

                }else {
                    roleOrgSelSet(roleOrgCont[roleOrgCont.length - 1].value);
                    setAccount({... account, roleOrgMain: roleOrgCont[roleOrgCont.length - 1].value, roleOrgList: roleOrgCont});
                }
            } else {
                roleOrgSelSet(roleOrgCont[roleOrgCont.length - 1].value);
                setAccount({... account, roleOrgMain: roleOrgCont[roleOrgCont.length - 1].value, roleOrgList: roleOrgCont});
            }

        }

    }, [roleOrgCont])

    /** FUNCTIONS */
    /*const onLoading = () => {
        //#region coding area sample
        BaseService.HttpGet("/system/menu/showAllAccounts").then(
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
    }*/

   /* const GetSelectedCustomer = (id) => {

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

    } */

    /*const accountsUpdate = () => {

        if(roleOrgCont.length == 0){
            toast.current.show({severity:'error', summary: 'Account Page', detail:'Role and Organization not selected', life: 3000});
        return null;
        }

        const condition = [];
        if(isRoleUpdate) condition.push("roleUpdate");
        if(isOrgUpdate) condition.push("orgUpdate");



        const objectV = {name:'accountUpdate', conditions: condition , action: actionType ,object: account };

        BaseService.HttpPost("/system/menu/accountsUpdate", objectV).then(
            (response) => {
                if(response.data.feedback === '1'){
                    toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                    setDisplayBasic(false);
                    setIsRoleUpdate(false);
                    setIsOrgUpdate(false);
                    isFirstLoadSet(true);
                    //onLoading();
                    FuncAccount.onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
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
    }*/

    /*const accountActivation = (id) => {

        const single = accountList.filter(x => id == x.ACCOUNT_ID);

        const objectV = {name:'accountActivation', conditions: null , action: null , object: single[0]};

        BaseService.HttpPost("/system/menu/accountActivation", objectV).then(
            (response) => {
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                //onLoading();
                FuncAccount.onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                    //console.log('error'); console.log(_content);
            }
        );
    }*/

    /* const SwitchSourceMenuSave = () => {
        const objectV = {name:'SwitchSourceMenuSave', str: selectedSourceMenu, object: account };
        BaseService.HttpPost("/system/menu/SwitchSourceMenuSave", objectV).then(
            (response) => {
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                //onLoading();
                FuncAccount.onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
                dialogSourceMenuSet(false);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                toast.current.show({ severity: 'error', summary: 'Remtal Page', detail: _content, life: 3000 });
            }
        );
    } */

    /*const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };*/

/** TEMPLATES */
    /*const stateBodyTemplate = (param) => {
        return  <span className={`customer-badge status-${param.STATE == '1' ? 'qualified' : 'unqualified'}`}>
        {param.STATE == '1' ? 'ACTIVE' : 'INACTIVE'}
        </span>;
    }*/

    /*const genderBodyTemplate = (param) => {
        return  <span className={`customer-badge status-${param.SEX == '1' ? 'new' : 'unqualified'}`}>
        {param.SEX == '1' ? 'MALE' : 'FEMALE'}
        </span>;
    }*/

    const actionBodyTemplate = (row) => {
        return (
        <div>
            <span>
            <Button data-id={row.ACCOUNT_ID} icon="pi pi-book" className="p-button-outlined p-button-success mr-2 mb-2"
            tooltip="View"
            onClick={(e) => {
                setDisplayBasic(true);
                const id = e.target.dataset.id;
                //GetSelectedCustomer(id);
                FuncAccount.getSelectedCustomer(id, accountList, setAccount, setSelectedNat, setSelectedGen, setSelectedStat, setSelectedType,
                    nationality, gender, status, type);
                setDisabeldForm(true);
                setActionType("view");
                }} />
            <Button data-id={row.ACCOUNT_ID} icon="pi pi-user-edit" className="p-button-outlined p-button-warning mr-2 mb-2"
            tooltip="Edit"
            onClick={(e) => {
                setDisplayBasic(true);
                const id = e.target.dataset.id;
                //GetSelectedCustomer(id);
                FuncAccount.getSelectedCustomer(id, accountList, setAccount, setSelectedNat, setSelectedGen, setSelectedStat, setSelectedType,
                    nationality, gender, status, type);
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
                            //accountActivation(id);
                            FuncAccount.accountActivation(id,
                                accountList, toast,
                                setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1
                            );
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
                       //accountsUpdate();
                       FuncAccount.accountsUpdate(
                        setDisplayBasic, setIsRoleUpdate, setIsOrgUpdate, isFirstLoadSet,
                        setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1,
                        roleOrgCont, toast, isRoleUpdate, isOrgUpdate, actionType, account
                       );
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
                    //SwitchSourceMenuSave();
                    FuncAccount.switchSourceMenuSave(toast,
                        selectedSourceMenu, account,
                        setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1,
                        dialogSourceMenuSet
                        );
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
                    //
                    if(newPassword.password !== newPassword.confirmPassword ){
                        toast.current.show({severity:'error', summary: 'System Information', detail:"Password Mismatch", life: 4000});
                        return false;
                    }
                    //
                    let objectV = {account_id: account.ACCOUNT_ID, password: newPassword.password }
                    BaseService.HttpPost("/system/menu/editUserPassword", objectV).then(
                        (res) => {
                            if(res.data.status === 200){
                                toast.current.show({severity:'success', summary: 'System Information', detail:"Change password successful.", life: 4000});
                                displayPasswordChangeSet(false);
                                newPasswordSet({});
                            }else{
                                toast.current.show({severity:'error', summary: 'System Information', detail: res.data.errMsg });
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} /*onChange={onGlobalFilterChange}*/

                    onChange={(e)=>{
                        FuncAccount.onGlobalFilterChange(e,
                            filters, setFilters, setGlobalFilterValue
                            );
                    }}

                    placeholder="Account Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    //#region Main JSX

    return(

        <div className="grid table-demo">
        <Toast ref={toast} position="bottom-right" />

            <div className="col-12">
                <div className="card">
                    <h5>Accounts table list</h5>

                    <div className="template">
                        <Button className="slack p-0" aria-label="Slack"
                        onClick={e=>{
                            setDisplayBasic(true);
                            setDisabeldForm(false);
                            setAccount({SEX:'1', NATIONALITY:'2', STATUS_:'1'});

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

                    </div>
                    <br/>
                    <DataTable value={accountList} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters}  loading={loading1} responsiveLayout="scroll"
                          emptyMessage="No customers found."
                          header={header} globalFilterFields={['ACCOUNT_NAME']}
                          >
                        <Column  header="ACTION" body={actionBodyTemplate} style={{minWidth: '20rem'}}/>

                        <Column field="SOURCE_MENU" header="Source Menu"  style={{ minWidth: '10rem' }} />

                        <Column field="ACCOUNT_NAME" header="Account"  style={{ minWidth: '12rem' }} />
                        <Column field="FULL_NAME" header="Name"  style={{ minWidth: '12rem' }} />
                        <Column field="role" header="Role"  style={{ minWidth: '12rem' }} />
                        <Column field="MOBILE_PHONE_A" header="Contact #"  style={{ minWidth: '12rem' }} />

                        <Column field="SEX" header="Gender"  style={{ minWidth: '12rem' }} /*body={genderBodyTemplate}*/ body={TempAccount.genderBodyTemplate} />
                        <Column field="STATE" header="State"  style={{ minWidth: '12rem' }} /*body={stateBodyTemplate}*/ body={TempAccount.stateBodyTemplate} />
                        <Column field="CREATE_DATE_F" header="Create Date"  style={{ minWidth: '12rem' }} />

                    </DataTable>
                </div>
            </div>

            {/** DIALOG SECTION */}

            <Dialog header="Account Details" visible={displayBasic} style={{ width: '70vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}
                onShow={() => {
                    roleOrgContSet([]);
                    if(actionType == 'edit'){
                        let userId_ = account.ACCOUNT_ID;

                        BaseService.HttpPost("/system/menu/getRoleOrgListByUserid", { userid:userId_ }).then(
                            (response) => {
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
                                        setAccount({ ...account, TYPE_: e.value });
                                    }}
                                />
                                <label htmlFor="dropdown">TYPE</label>
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

                                }}
                            />
                        </div>

                    </div>
                    <div className="grid">
                        <div className="col-12">
                        <SelectButton value={roleOrgSel} onChange={e => {
                            roleOrgSelSet(e.value);
                            setAccount({... account, roleOrgMain: e.value});
                        }} optionLabel="name" options={roleOrgCont} selected={1} />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog header="Role Selection" visible={dialogRole} style={{ width: '50vw' }} modal  onHide={() => setDialogRole(false)}>
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

            <Dialog header="Organization Selection" visible={dialogOrg} style={{ width: '50vw' }} modal  onHide={() => setDialogOrg(false)}>
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
