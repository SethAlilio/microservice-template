import React, { useState, useEffect, useRef } from 'react';
import BaseService from '../../service/BaseService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

import {Dropdown} from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { SelectButton } from 'primereact/selectbutton';

import { Divider } from 'primereact/divider';
import {useUserDetails} from "../../stores/userStore";


const Roles = () => {
    /** DECLARATION ========================================================================================================*/
    const [rolesList, setRolesList] = useState([]);
    const [resourcesList, setResourcesList] = useState([]);
    const [roleResourceList, setRoleResourcesList] = useState(null);
    const [accountList, setAccountList] = useState([])

    const [loading1, setLoading1] = useState(true);
    const [filters1, setFilters1] = useState(null);
    const [resourceFilter, resourceFilterSet] = useState(null);
    const [userFilter, userFilterSet] = useState(null);

    const [acctFilters, setAcctFilters] = useState(null);

    const [selectedKeys3, setSelectedKeys3] = useState(null);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(0);

    const [displayBasic, setDisplayBasic] = useState(false);
    const [userDisplay, setUserDisplay] = useState(false);
    const toast = useRef(null);
    const cm = useRef(null);
    const [displayRole, setDisplayRole] = useState(false);
    const [dialogAcct, setDialogAcct] = useState(false);

  //  const [selParentResource, setSelParentResource] = useState(null);
    const [roleModel, setRoleModel] = useState({});
    const [actionType, setActionType] = useState('none');
    const [acctListFilt, setAcctListFilt] = useState([]);
    const [dialogResc, setDialogResc] = useState(false);
    const [resourcesOrig, setResourcesOrig] = useState([]);

    const [ddlResource, setDdlResource] = useState([]);
    const [selDdlResc, setSelDdlResc] = useState({});
    const [resourcesModel, setResourcesModel] = useState({});
    const [assignResourceBy, assignResourceBySet] = useState('');
    const [selectedAccountId, selectedAccountIdSet] = useState(0);

    const [buttonLoading, buttonLoadingSet] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [widgePermUser, widgePermUserSet] = useState([]);
    const [widgePermRole, widgePermRoleSet] = useState([]);

    const [btnPermSetup, btnPermSetupSet] = useState(false);
    const [btnItems, btnItemsSet] = useState([]);

    // const btnItems = [
    //     {name:'Import Excel', value:'w001'},
    //     {name:'Inbound', value:'w002'},
    //     {name:'Issue', value:'w003'},
    //     {name:'Transfer P2P', value:'w004'},
    //     {name:'Transfer WP', value:'w005'},
    //     {name:'Return', value:'w006'},
    //     {name:'Retire', value:'w007'},
    //     {name:'Audit', value:'w008'},
    //     {name:'Q/A', value:'w009'},
    //     {name:'IR', value:'w010'},
    //     {name:'Method of Export', value:'w011'},
    //     {name:'Edit TeLedger', value:'w012'},
    // ];

    const [btnPermSelection, btnPermSelectionSet] = useState(null);

    const [userPermCurSel, userPermCurSelSet] = useState();

    const userInfo = useUserDetails();


/** INITIALIZATION  ========================================================================================================*/


const initFilters1 = () => {
    setFilters1({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'NAME_': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'CODE': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'DESCRIPTION': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        'STATE': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });
}

const initResourceFilter = () => {
    resourceFilterSet(
        {
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'NAME_': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'CODE_': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'VALUE_': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'STATUS_': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        }
    );
}

const initUserFilter = () => {
    userFilterSet(
        {
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'ACCOUNT_NAME': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'FULL_NAME': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'MOBILE_PHONE_A': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
        }
    );
}

const initAccFilters = () => {
    setAcctFilters({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'FULL_NAME': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'ACCOUNT_NAME': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'role': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'organization': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    });
}

const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
};
/** ON LOADING ========================================================================================================*/
useEffect(() => {
    setLoading1(true);

    onLoading();

    initFilters1();
    initResourceFilter();
    initUserFilter();

    initAccFilters();
}, []);
    /** FUNCTIONS ========================================================================================================*/
const SaveAssignUser = () => {
    buttonLoadingSet(true);
    const objectV = {str:selectedAccountId, companyId: userInfo.COMPANY_ID, object: selectedKeys3};

    //alert(JSON.stringify(selectedKeys3));
    BaseService.HttpPost("/system/role/saveAssignUser", objectV).then(
        (response) => {
            buttonLoadingSet(false);
            setDisplayBasic(false);
            toast.current.show({severity:'success', summary: 'Role Page', detail:'Save Success', life: 3000});
            onLoading();
        },
        (error) => {
            buttonLoadingSet(false);
            const _content =
                (error.data && error.data.error) || (error.response && error.response.data) || error.message || error.toString();
            toast.current.show({ severity: 'error', summary: 'Error saving', detail: _content, life: 3000 });
        }
    );
}

const SaveNewResources = () =>{
    const objectV = {name:"SaveNewResources", object: resourcesModel};
    //  --------------------
        BaseService.HttpPost("/system/role/saveNewResources", objectV).then(
        (response) => {
            if(response.data.feedback === '1'){
                onLoading();
                toast.current.show({severity:'success', summary: 'Role Page', detail:'Save Success', life: 3000});
                setDialogResc(false);
            }else{
                toast.current.show({severity:'error', summary: 'Role Page', detail:'Asterisk fields is required', life: 5000});
            }
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                //console.log('error'); console.log(_content);
        }
    );
}
//
const removeUser = (accountID)=> {
    const objectV = {name:"removeUser", str: accountID};
    //  --------------------
        BaseService.HttpPost("/system/role/removeUser", objectV).then(
        (response) => {
            toast.current.show({severity:'success', summary: 'Role Page', detail:'Remove Success', life: 3000});
            setSelectedAccounts(
                selectedAccounts.filter(x=> x.ACCOUNT_ID != accountID)
            );
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
               // console.log('error'); console.log(_content);
        }
    );
}

const actionRole = () => {

    const objectV = {name:"actionRole", action: actionType, object: roleModel, CREATED_BY_ID: userInfo.ACCOUNT_ID, CREATED_BY_NAME: userInfo.FULL_NAME};
    //  --------------------
        BaseService.HttpPost("/system/role/actionRole", objectV).then(
        (response) => {
            if(response.data.feedback === '1'){
                onLoading();
                toast.current.show({severity:'success', summary: 'Role Page', detail:'Save Success', life: 3000});
                setDisplayRole(false);
            }else{
                toast.current.show({severity:'error', summary: 'Role Page', detail:'Asterisk fields is required', life: 5000});
            }
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
               // console.log('error'); console.log(_content);
        }
    );
}

const onLoading = () => {
// --------------------
BaseService.HttpGet(`/system/role/showAllRoles?companyId=${userInfo.COMPANY_ID}`).then(
    (response) => {
        setRolesList(response.data["queryRoles"]);
        setResourcesList(response.data["treeResources"]);
        setRoleResourcesList(response.data["queryRoleResources"]);
        setAccountList(response.data["queryAccounts"]);
        setResourcesOrig(response.data["queryResources"]);
        widgePermUserSet(response.data["queryWidgeUser"]);
        widgePermRoleSet(response.data["queryWidgeRole"]);

        btnItemsSet(response.data["queryWidgeLegend"]);

        setLoading1(false);

        //console.log(response.data["queryWidge"]);
    },
    (error) => {
        const _content =
            (error.response && error.response.data) || error.message || error.toString();
            //console.log('error'); console.log(_content);
    }
);
// --------------------
}

const SaveAssignRoles = () => {
    buttonLoadingSet(true);
     const objectV = {str:selectedRoleId, companyId: userInfo.COMPANY_ID, object: selectedKeys3};
    //  --------------------
        BaseService.HttpPost("/system/role/saveAssignRoles", objectV).then(
            (response) => {
                buttonLoadingSet(false);
                setDisplayBasic(false);
                toast.current.show({severity:'success', summary: 'Role Page', detail:'Save Success', life: 3000});
                onLoading();
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                console.log('error'); console.log(_content);
            }
        );
        // --------------------

}

const roleActivation = (id) => {

    const filtered = rolesList.filter(x=> x.ROLE_ID == id);

    const objectV = {name:'roleActivation',  object: filtered[0], userId: userInfo.ACCOUNT_ID, userFullName: userInfo.FULL_NAME};

    // --------------------
    BaseService.HttpPost("/system/role/roleActivation", objectV).then(
        (response) => {
            toast.current.show({severity:'success', summary: 'Role Page', detail:'Update Success', life: 3000});
            onLoading();
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                console.log('error'); console.log(_content);
        }
    );
    // --------------------

    //alert(JSON.stringify(objectV));

}

const SaveSelUsers = () =>{

    const objectV = {name:'saveSelUsers', str: selectedRoleId, object: selectedAccounts };

    // --------------------
    BaseService.HttpPost("/system/role/saveSelUsers", objectV).then(
        (response) => {
            toast.current.show({severity:'success', summary: 'Role Page', detail:'Assign User Success', life: 3000});
            setUserDisplay(false);
            onLoading();
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                //console.log('error'); console.log(_content);
        }
    );
    // --------------------

}

const onRowEditComplete = (e) => {
    let _resourcesOrig = [...resourcesOrig];
    let { newData, index } = e;

    _resourcesOrig[index] = newData;

    setResourcesOrig(_resourcesOrig);

    onRowUpdate(newData);
}

const onRowUpdate = (row) =>{

    const objectW = {name:'updateResourceByRow', object: row};

    BaseService.HttpPost("/system/role/updateResourceByRow", objectW).then(
        (response) => {
            toast.current.show({severity:'success', summary: 'Resource Page', detail:'Update row Success', life: 3000});
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                toast.current.show({severity:'error', summary: 'Equiptment Page', detail: _content , life: 3000});

        }
    );
}

const rejectFunc = () => {}
    /** TEMPLATES ========================================================================================================*/
    const basicDialogFooter =
    (
            <div>
                {
                    assignResourceBy === 'ROLE' ?
                        <>
                            <Button type="button" label="Save To Role" icon="pi pi-save" className="p-button-primary"
                                loading={buttonLoading}
                                onClick={() => SaveAssignRoles()}
                            />
                        </>
                        : <>
                            <Button type="button" label="Save To User" icon="pi pi-save" className="p-button-primary"
                            loading={buttonLoading}
                                onClick={() => SaveAssignUser()}
                            />
                        </>
                }


                <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                    onClick={() => setDisplayBasic(false)}
                />
            </div>
    );

    const basicDialogFooter2 =
    (
            <div>

                <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                   onClick={() => SaveSelUsers()}
                />

                <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                    onClick={() => setUserDisplay(false)}
                />
            </div>
    );

    const dialogRoleFooter = (
        <div>

            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                  onClick={ e=> {
                      actionRole();
                  }}
                />

            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                    onClick={() => setDisplayRole(false)}
                />
        </div>
    );

    const actionBodyTemplate = (row) => {

        return (
        <div>
            <span>
            <Button data-id={row.ROLE_ID} icon="pi pi-user-plus" className="p-button-outlined p-button-success mr-2 mb-2"
                tooltip="Assign Resources"
                onClick={(e) => {
                    setDisplayBasic(true);
                    assignResourceBySet('ROLE');

                    const id = e.target.dataset.id;
                    setSelectedRoleId(id);
                    const single = roleResourceList.filter(x => id == x.ROLE_ID);
                    var obj = {};

                    // eslint-disable-next-line
                    single.map(y => {
                        obj[y.RESOURCES_ID] = {checked:true, partialChecked:false};
                    });

                    setSelectedKeys3(obj);
                }}  />

            <Button data-id={row.ROLE_ID} icon="pi pi-users" className="p-button-outlined p-button-warning mr-2 mb-2"
                tooltip="Assign Users"
                onClick={(e) => {
                    setUserDisplay(true);

                    const id = e.target.dataset.id;
                    setSelectedAccounts(accountList.filter(y => id == y.role_id));
                    setSelectedRoleId(id);
                }}

            />

            <Button data-id={row.ROLE_ID} icon="pi pi-sort-alt"
                className={`p-button-outlined p-button-${row.STATE == '1' ? 'danger' : 'info'} mr-2 mb-2`}
                tooltip={row.STATE === '1' ? 'disable' : 'enable'}
                onClick={
                    e =>{
                        const id = e.target.dataset.id;
                        roleActivation(id);

                    }
                }
                />

                <Button
                    icon="pi pi-pencil"
                    className="p-button-outlined p-button-warning mr-2 mb-2"
                    tooltip="Role Update"
                    onClick={e => {
                        setDisplayRole(true);
                        const single = rolesList.find(x => x.ROLE_ID === row.ROLE_ID);
                        setRoleModel({
                            ...single, 
                            CREATED_BY_ID: userInfo.ACCOUNT_ID,
                            CREATED_BY_NAME: userInfo.FULL_NAME
                        });
                        setActionType("edit");
                    }}
                />


            <Button icon="fa fa-pencil-square-o" className="p-button-outlined p-button-success mr-2 mb-2" tooltip="Edit Permission"
                        onClick={e=>{
                            //
                            btnPermSelectionSet([]);

                            let userPermCurSel_ = widgePermRole.filter(x => x.roleid == row.ROLE_ID);

                            if(userPermCurSel_.length > 0){
                                userPermCurSel_.map(xo =>{
                                    xo.objectArr.map(xx => {
                                        let display_ = xx.display;
                                        if(display_ != 'hidden'){
                                            btnPermSelectionSet(ox => [...ox, xx.widget_code]);
                                        }

                                    });
                                });
                            }
                            //
                            userPermCurSelSet({roleid:row.ROLE_ID, resourceid:'45'});
                            //
                            btnPermSetupSet(true);
                            //
                            setActionType('permRole');
                        }}
                    />
            </span>
        </div>
        )
        ;
    }

    const stateLegend = (row) => {
        return <span className={`customer-badge status-${row.STATE == '1' ? 'qualified' : 'unqualified'}`}>
        {row.STATE == '1' ? 'ACTIVE' : 'INACTIVE'}
        </span>;
    }

    const actionAcctTemplate = (row)=> {
        return(
            <div>
                <span>
                <Button data-id={row.ACCOUNT_ID} icon="pi pi-tags" className="p-button-outlined p-button-success mr-2 mb-2"
                    label="select"
                    onClick={e=>{
                        setDialogAcct(false);
                        //alert(row.ACCOUNT_ID);
                        const selAccount = acctListFilt.filter(x=> x.ACCOUNT_ID == row.ACCOUNT_ID);

                        const sel2Account = {...selAccount[0], isNew: 'true'}

                        //alert(JSON.stringify(sel2Account));
                        setSelectedAccounts([...selectedAccounts, sel2Account ]);
                    }}
                     />
                </span>
            </div>
        );
    }

    const actionAcctOriginTemplate = (row) => {
        return(
            <div>
                <span>
                <Button data-id={row.ACCOUNT_ID} icon="pi pi-times" className="p-button-outlined p-button-danger mr-2 mb-2"
                    tooltip="Remove"
                    onClick={e=>{
                        removeUser(row.ACCOUNT_ID);


                    }}
                     />
                </span>
            </div>
        );
    }

    const dialRescFooter = (
        <div>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                onClick={() => SaveNewResources()}
            />

            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                onClick={() => setDialogResc(false)}
            />
        </div>
    );

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const genderBodyTemplate = (param) => {
        return  <span className={`customer-badge status-${param.SEX == '1' ? 'new' : 'unqualified'}`}>
        {param.SEX == '1' ? 'MALE' : 'FEMALE'}
        </span>;
    }

    const stateBodyTemplate = (param) => {
        return  <span className={`customer-badge status-${param.STATE == '1' ? 'qualified' : 'unqualified'}`}>
        {param.STATE == '1' ? 'ACTIVE' : 'INACTIVE'}
        </span>;
    }


    const actionAccountTemplate = (row) => {

        return (
            <div>
                <span>
                    <Button data-id={row.ACCOUNT_ID} icon="fa fa-plus-square" className="p-button-outlined p-button-success mr-2 mb-2"
                        tooltip="Assign Resources"
                        onClick={(e) => {

                            setDisplayBasic(true);
                            assignResourceBySet('USER');

                            const id = e.target.dataset.id;
                            selectedAccountIdSet(id);
                            const single = roleResourceList.filter(x => x.USE_YPTE == 2 && x.USER_ID == id);
                            var obj = {};

                            // eslint-disable-next-line
                            single.map(y => {
                                obj[y.RESOURCES_ID] = { checked: true, partialChecked: false };
                            });

                            setSelectedKeys3(obj);

                            // let filterWidg_ = widgePerm.filter(x => x.userid == '113');
                            // alert(JSON.stringify(filterWidg_));

                        }} />

                    <Button icon="fa fa-pencil-square-o" className="p-button-outlined p-button-success mr-2 mb-2" tooltip="Edit Permission"
                        onClick={e=>{
                            //
                            btnPermSelectionSet([]);
                            let userPermCurSel_ = widgePermUser.filter(x => x.userid == row.ACCOUNT_ID);

                            if(userPermCurSel_.length > 0){
                                userPermCurSel_.map(xo =>{
                                    xo.objectArr.map(xx => {
                                        let display_ = xx.display;
                                        if(display_ != 'hidden'){
                                            btnPermSelectionSet(ox => [...ox, xx.widget_code]);
                                        }

                                    });
                                });
                            }
                            //
                            userPermCurSelSet({userid:row.ACCOUNT_ID, resourceid:'45'});
                            //
                            btnPermSetupSet(true);
                            //
                            setActionType('permUser');
                        }}
                    />

                </span>
            </div>
            )
            ;
    }

    const footerBtnPerm = (
        <>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-success"
                onClick={e=>{

                    //alert(JSON.stringify(userPermCurSel));

                    let objectV = {};

                    if(actionType == 'permUser'){
                        objectV = { userid:userPermCurSel.userid, companyId: userInfo.COMPANY_ID, resourceid:userPermCurSel.resourceid, widgelist: btnPermSelection, type: actionType };
                    } else {
                        objectV = { roleid:userPermCurSel.roleid, companyId: userInfo.COMPANY_ID, resourceid:userPermCurSel.resourceid, widgelist: btnPermSelection, type: actionType };
                    }

                    BaseService.HttpPost("/system/role/btnPermissionManager", objectV).then(
                        (response) => {
                            toast.current.show({severity:'success', summary: 'Button Permission', detail:'Update Success', life: 3000});
                            btnPermSetupSet(false);
                            onLoading();
                        },
                        (error) => {
                            toast.current.show({severity:'error', summary: 'Error', detail:'Update Success', life: 3000});
                        }
                    );
                }}
            />
            <Button type="button" label="Exit" icon="pi pi-times" className="p-button-secondary"
                onClick={e=>{
                    btnPermSetupSet(false);
                }}
            />

        </>
    );

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder=" Role Search" />
                </span>
            </div>
        );
    };
    const renderHeaderUser = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder=" User Account Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();
    const headerUser = renderHeaderUser();



    /**MAIN BODY ========================================================================================================*/
    return (
        <div className="grid">
            <Toast ref={toast} position="bottom-right" />

            <div className="col-12">
                <div className="card">

                    <TabView>
                        <TabPanel header="Roles Page">


                    <div className="template">
                        <Button className="youtube p-0" aria-label="Youtube"
                            onClick={e=>{
                                setDisplayRole(true);
                                //loadParentResourceList();
                                setRoleModel({CREATED_BY_ID: userInfo.ACCOUNT_ID,
                                    CREATED_BY_NAME: userInfo.FULL_NAME,});
                                setActionType("add");
                                
                                    
                            
                            }}
                        >
                            <i className="pi pi-user-plus px-2"></i>
                            <span className="px-3">Add Role</span>
                        </Button>


                    </div>
                    <br></br>
                    <DataTable value={rolesList} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={filters} filterDisplay="menu" loading={loading1}  responsiveLayout="scroll" sortMode="multiple"
                               emptyMessage="No customers found."
                                rowsPerPageOptions={[10,20,50]}
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               editMode="row"
                               header={header} globalFilterFields={['NAME_']}
                          >

                        <Column  header="ACTION" body={actionBodyTemplate} style={{ minWidth: '17rem' }}></Column>
                        <Column field="ROLE_ID" header="Role ID" style={{ minWidth: '5rem' }} />
                        <Column field="NAME_" header="Role Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        {/* <Column field="CODE" header="Code" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} /> */}
                        <Column field="DESCRIPTION" header="Description" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column field="STATE" header="State" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} body={stateLegend} />
                        <Column field="CREATE_DATE_F" header="Create date"  style={{ minWidth: '12rem' }} />


                    </DataTable>

                    </TabPanel>

                        <TabPanel header="Resources Page">

                    <div className="template">

                        <Button className="vimeo p-0" aria-label="Vimeo"
                            onClick={e=>{
                               setDialogResc(true);

                               const rescType1 = resourcesOrig.filter(x=> x.TYPE_ == '1');

                                var parent = {};
                                setDdlResource(
                                    rescType1.map(item => {
                                        return {...parent, name: item.NAME_, id: item.RESOURCES_ID}
                                    })
                                );


                                setResourcesModel({});
                                setSelDdlResc({});

                            }}
                        >
                            <i className="pi pi-link px-2"></i>
                            <span className="px-3">Add Resources</span>
                        </Button>

                    </div>
                    <br/>
                    <DataTable value={resourcesOrig}  className="p-datatable-gridlines"
                          dataKey="id"  responsiveLayout="scroll" sortMode="multiple"
                          emptyMessage="No customers found."
                          paginator rowsPerPageOptions={[8,20,50]} showGridlines rows={8}
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                          editMode="row" onRowEditComplete={onRowEditComplete}
                        filters={resourceFilter}
                         >

                         <Column rowEditor headerStyle={{ width: '10%', minWidth: '4rem' }} bodyStyle={{ textAlign: 'center' }}></Column>

                        <Column field="NAME_" header="Name" filter  style={{ minWidth: '12rem' }} editor={(options) => textEditor(options)} />
                        <Column field="CODE_" header="Code" filter style={{ minWidth: '12rem' }} />
                        <Column field="TYPE_" header="Type"  style={{ minWidth: '12rem' }} />
                        <Column field="VALUE_" header="Link" filter style={{ minWidth: '12rem' }} editor={(options) => textEditor(options)} />
                        <Column field="CREATE_DATE_F" header="Create date"  style={{ minWidth: '12rem' }} />
                        <Column field="ICON_URL" header="Icon code"  style={{ minWidth: '12rem' }} editor={(options) => textEditor(options)} />
                        <Column field="STATUS_" header="Status" filter style={{ minWidth: '12rem' }} editor={(options) => textEditor(options)} />

                    </DataTable>


                    </TabPanel>

                        <TabPanel header="User Page">
                            <DataTable value={accountList} className="p-datatable-gridlines"
                                dataKey="id" responsiveLayout="scroll"
                                emptyMessage="No customers found."
                                paginator rowsPerPageOptions={[8, 20, 50]} showGridlines rows={8}
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                filters={filters} header={headerUser} globalFilterFields={['ACCOUNT_NAME']}
                            >

                                <Column  header="ACTION" body={actionAccountTemplate} style={{ minWidth: '4rem' }}/>

                                <Column field="ACCOUNT_NAME" header="Account" filter style={{ minWidth: '12rem' }} />
                                <Column field="FULL_NAME" header="Name" filter style={{ minWidth: '12rem' }} />
                                <Column field="MOBILE_PHONE_A" header="Contact#" filter style={{ minWidth: '12rem' }} />
                                <Column field="SEX" header="Gender" style={{ minWidth: '12rem' }} body={genderBodyTemplate} />
                                <Column field="STATE" header="State" style={{ minWidth: '12rem' }} body={stateBodyTemplate} />
                                <Column field="CREATE_DATE_F" header="Create Date" style={{ minWidth: '12rem' }} />


                            </DataTable>
                        </TabPanel>

                </TabView>
{/** DIALOG SECTION */}

                    <Dialog header="Resources list" visible={displayBasic} className="resources-dialog" modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>

                    <br></br><br></br>
                        <Tree value={resourcesList} selectionMode="checkbox" selectionKeys={selectedKeys3}
                            onSelectionChange={e => {
                                setSelectedKeys3(e.value);
                            }} />
                    </Dialog>

                    <Dialog header="User List" visible={userDisplay} style={{ width: '70vw' }} onHide={() => setUserDisplay(false)} modal footer={basicDialogFooter2}>
                    <Button label="Add User" icon="pi pi-user-plus" className="p-button-sm"
                        onClick={e=>{
                            setDialogAcct(true);
                            const questionssData = accountList.filter(each => !selectedAccounts.includes(each) );
                            setAcctListFilt(questionssData);
                        }}
                    />
                    <br></br><br></br>
                    <DataTable value={selectedAccounts} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id" filters={acctFilters} filterDisplay="menu"  responsiveLayout="scroll"
                          emptyMessage="No Account found."
                          >
                        <Column  header="ACTION" body={actionAcctOriginTemplate} style={{ minWidth: '5rem' }}></Column>

                        <Column field="FULL_NAME" header="Full Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column field="ACCOUNT_NAME" header="Account" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column field="role" header="Role" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column field="organization" header="Organization" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />

                    </DataTable>
                    </Dialog>

                    <Dialog header="Roles module" visible={displayRole} className="resources-dialog" modal footer={dialogRoleFooter} onHide={() => setDisplayRole(false)}>
                        <div className="card p-fluid">
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Name &nbsp;
                            <span style={{ color: 'red' }}>*</span> </label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={roleModel.NAME_ || ''}
                                    onChange={e => setRoleModel({ ...roleModel, NAME_: e.target.value.toUpperCase() })} />
                                </div>
                            </div>

                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Description &nbsp;
                            </label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={roleModel.DESCRIPTION || ''}
                                    onChange={e => setRoleModel({ ...roleModel, DESCRIPTION: e.target.value.toUpperCase() })}/>
                                </div>
                            </div>

                        </div>

                    </Dialog>

                    <Dialog header="User module" visible={dialogAcct} style={{ width: '60vw' }} modal onHide={()=> setDialogAcct(false)} >

                        <DataTable value={acctListFilt} paginator className="p-datatable-gridlines" showGridlines rows={10}
                            dataKey="id" filters={acctFilters} filterDisplay="menu"  responsiveLayout="scroll"
                            emptyMessage="No Account found."
                            >

                            <Column  header="ACTION" body={actionAcctTemplate} style={{ minWidth: '10rem' }}></Column>

                            <Column field="FULL_NAME" header="Full Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                            <Column field="ACCOUNT_NAME" header="Account" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                            <Column field="role" header="Role" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                            <Column field="organization" header="Organization" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />

                        </DataTable>
                    </Dialog>

                    <Dialog header="Resource module" visible={dialogResc} className="resmodule-dialog" modal onHide={()=> setDialogResc(false)} footer={dialRescFooter}>
                        <div className="card p-fluid">
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Name &nbsp;
                            <span style={{ color: 'red' }}>*</span> </label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text"  onChange={e => setResourcesModel({ ...resourcesModel, NAME_: e.target.value })}
                                    value={resourcesModel.NAME_ || ''}
                                   />
                                </div>
                            </div>

                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Link &nbsp;
                            <span style={{ color: 'red' }}>*</span> </label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text"  onChange={e => setResourcesModel({ ...resourcesModel, LINK: e.target.value })}
                                    value={resourcesModel.LINK || ''}
                                   />
                                </div>
                            </div>

                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Icon menu &nbsp;
                            <span style={{ color: 'red' }}>*</span> </label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text"  onChange={e => setResourcesModel({ ...resourcesModel, ICON_URL: e.target.value })}
                                    value={resourcesModel.ICON_URL || ''}
                                   />
                                </div>
                            </div>

                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Parent

                                </label>
                                <div className="col-12 md:col-9">
                                    <Dropdown id="dropdown"  style={{ width: '100%' }} options={ddlResource} value={selDdlResc}
                                        onChange={e => {
                                            setSelDdlResc(e.value);
                                            var val = e.value.id;
                                            setResourcesModel({ ...resourcesModel, PARENTID: val });
                                        }}
                                        optionLabel="name">
                                    </Dropdown>
                                </div>
                            </div>

                        </div>
                    </Dialog>

                    <Dialog header="Button Permission Setup" visible={btnPermSetup} className="button-permission" modal
                         onHide={() => btnPermSetupSet(false)}
                         footer={footerBtnPerm}
                         >
                        <br></br>

                        <h4> <b>Tools and Equipment Ledger Button's list</b></h4>
                        <br></br>
                        <div className="grid">
                            <div className="col-12">
                                <div className="flex align-items-center justify-content-center">
                                    <SelectButton
                                    onContextMenu={(e) => cm.current.show(e)}
                                    value={btnPermSelection} onChange={e=>{
                                        btnPermSelectionSet(e.value);
                                    }} optionLabel="name" options={btnItems} multiple

                                    />
                                </div>
                            </div>
                   
                            <Divider type="solid" />

                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
/* eslint eqeqeq: 0 */
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Roles, comparisonFn);