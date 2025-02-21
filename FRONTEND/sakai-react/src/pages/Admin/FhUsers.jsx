import React, {useState, useEffect, useRef} from 'react'
import { useHistory, useParams } from "react-router";
import FhUserService from "../../../service/Inventory/Admin/FhUserService";
import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import {Dropdown} from "primereact/dropdown";
import {TabPanel, TabView} from "primereact/primereact.all.esm";
import { classNames } from 'primereact/utils';
import { Form, Field } from 'react-final-form';
import {AddFhUserDialog} from "./AdminDialog";
import {OnChange} from "react-final-form-listeners";




const FhUsers = () =>
{
    const toast = useRef(null);
    const [fhUsers, setFhUsers] = useState([]);
    const [selectedFhUser, setSelectedFhUser] = useState(null);
    const [selectedFhUserAccess, setSelectedFhUserAccess] = useState(null);
    const [fhUserAccess, setFhUserAccess] = useState([]);
    const [projectList, setProjectList] = useState(null);
    const [tableStart, setTableStart] = useState(0);
    const [tableLimit, setTableLimit] = useState(10);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [dialogAddVisible, setDialogAddVisible] = useState(false);
    const [addUserAccessVisible, setAddUserAccessVisible] = useState(false);
    const [dialogEditVisible, setDialogEditVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [visible, setVisible] = useState(false);
    const [selProjectName,setSelProjectName] = useState("");
    const [selAccountStatus, setSelAccountStatus] = useState("");
    const [selectedAccess,setSelectedAccess] = useState(null);
    const [regionList, setRegionList] = useState(null);
    const [areaList, setAreaList] = useState(null);
    const[selArea, setSelArea] = useState(null);
    const[selRegion, setSelRegion] = useState(null);
    const dt = useRef(null);
    const [rowIndex, setRowIndex] = useState(null);

    const statusLbl = [
        {name: 'Active', code: 'Active'},
        {name: 'Inactive', code: 'Inactive'}
    ];
    const accessLbl = [
        {accessVal: 'ALL', accessId: 'ALL'},
        {accessVal: 'PROJECT', accessId: 'PROJECT'},
        {accessVal: 'ALL AREAS', accessId: 'ALL AREAS'},
        {accessVal: 'ALL REGIONS', accessId: 'ALL REGIONS'},
        {accessVal: 'BOTH AREA AND REGION', accessId: 'BOTH AREA AND REGION'}
    ];

    const field2rem = {
        marginBottom: "2rem"
    };

    useEffect(() => {
        queryFhUsers();
        queryFhProjects();
    }, []);

    const queryFhProjects = () => {
      FhUserService.loadUserProjects().then((res) => {
            //console.log("User list "+res.data);
            setProjectList(res.data);
      }).catch((error) => {
          toast.current.show({severity: 'error', summary: 'Error getting Projects list', detail: 'Please try again'});
      });
    };
    const queryFhUsers = () => {
        FhUserService.getAllFhUsers().then((res) => {
            //console.log(res);
            setFhUsers(res.data);

        }).catch((error) => {
           // console.log(error);
            toast.current.show({severity: 'error', summary: 'Error getting Users list', detail: 'Please try again'});
        });
    };

    const areaBodyTemplate = (rowData) => {
        //console.log(rowData);
        return (
            <>
                {rowData.rolesList.map(x => <><span>{x.area}</span><br/><br/></>)}
            </>
            )

    };
    const regionBodyTemplate = (rowData) => {
        //console.log(rowData.rolesList);
        return (
            <>
                {rowData.rolesList.map(x => <><span>{x.region}</span><br/><br/></>)}
            </>
        )
    };
    const accessBodyTemplate = (rowData) => {
        //console.log(rowData.rolesList);
        return (
            <>
                {rowData.rolesList.map(x => <><span>{x.userAccess}</span><br/><br/></>)}
            </>
        )
    };
    const permsBodyTemplate = (rowData) => {
        //console.log(rowData.rolesList);
        return (
            <>
                {rowData.rolesList.map(x => <><span>{x.permission}</span><br/><br/></>)}
            </>
        )
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const onHideDialog = () => {
        setDialogAddVisible(false);
      //  setShowMessage(false);
    };
    const toggleDialog = (toggle) => {
        setDialogAddVisible(toggle);
        setAddUserAccessVisible(toggle);
        setDialogEditVisible(toggle);
    };
    const onSearch = () => {
        setTableStart(0);
        queryFhUsers();
    };
    const onClickAdd = () => {
        setDialogAddVisible(true);
    };

    const handleFormFieldChange = (e) => {
        formData[e.target.id] = e.target.type === "file"
            ? e.target.files[0] : e.target.value;
    };

    const submitForm = (data) => {
            FhUserService.saveNewFhUser(data)
                .then((res) => {
                    if (res.data.success) {
                        toast.current.show({severity: 'success', summary: res.data.message});
                        queryFhUsers();
                        setDialogAddVisible(true);
                    } else {
                        toast.current.show({severity: 'error', summary: res.data.message, detail: 'Please try again'});
                    }
                    //return response.data;
                }).catch((error) => {
                   // console.log(error);
                    toast.current.show({severity: 'error', summary: 'Error adding Fh User', detail: 'Please try again'});
                });
    };
    const submitFormEdit = (fhId, data) => {
        FhUserService.updateUserDataDetails(fhId,data)
            .then((res) => {
                if (res.data.success) {
                    toast.current.show({severity: 'success', summary: res.data.message});
                    queryFhUsers();
                    setDialogEditVisible(false);
                } else {
                    toast.current.show({severity: 'error', summary: res.data.message, detail: 'Please try again'});
                }
                //return response.data;
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error updating Fh User', detail: 'Please try again'});
        });
    };
    const submitFormAccess = () => {
        let form = new FormData();
        form.append("fhId", selectedFhUser.fhId);
        form.append("permission", (formData["addPermission"] === undefined || formData["addPermission"] === null) ? "ADMIN": formData["addPermission"] );
        form.append("region", (selRegion === undefined || selRegion === null) ? "" : selRegion );
        form.append("area", (selArea === undefined || selArea === null) ? "" : selArea );
        form.append("userAccess", selectedAccess);
        FhUserService.insertUserAccess(selectedFhUser.fhId,form)
            .then((res) => {
                    if (res.data.success) {
                        toast.current.show({severity: 'success', summary: res.data.message});
                        queryFhUsers();
                        let newUserAccess = res.data;
                        let oldUserAccess = [...selectedFhUserAccess, {rolesId: newUserAccess.id, fhid: newUserAccess.fhid,
                            region: newUserAccess.region, area: newUserAccess.area, userAccess:newUserAccess.access,
                            permission: newUserAccess.permission}];
                        setSelectedFhUserAccess(oldUserAccess);
                        dt.current.reset();
                        setAddUserAccessVisible(false);
                    } else {
                        toast.current.show({severity: 'error', summary: res.data.message, detail: 'Please try again'});
                    }
                },
                (error) => {
                    toast.current.show({severity: 'error', summary: 'Error adding Fh User', detail: 'Please try again'});
                }
            );

    };
    const accessDialogFooter = () => {
        return (
            <div>
                <Button label="Cancel" onClick={() => setAddUserAccessVisible(false)} className="p-button-text" />
                <Button label="Submit" onClick={() => submitFormAccess()} autoFocus />
            </div>
        );
    };

    const acceptDelete = (id) => {
        // console.log(id);
        if (id) {
            FhUserService.dumpFhUser(id)
                .then((res) => {
                        queryFhUsers();
                        toast.current.show({ severity: res.data.success ? 'success' : 'error', summary: res.data.message, detail: 'Deleted Fh User'});
                    }).catch((error) => {
                        toast.current.show({ severity: 'error', summary: 'Error deleting Fh User', detail: 'Please try again'});
                    });
        } else {
            toast.current.show({ severity: 'error', summary: 'No id selected'});
        }
    };

    const deleteUserAccess = () => {
        if (rowIndex.rolesId) {
            let fhId = rowIndex.fhId;
            FhUserService.deleteUserAccess(rowIndex.rolesId)
                .then((res) => {
                        queryFhUsers();
                        dt.current.reset();
                        setSelectedFhUserAccess((fhUsers.find(user => user.fhId === fhId).rolesList).filter(access => access.rolesId != rowIndex.rolesId));
                        toast.current.show({ severity: 'success', summary: res.data.message, detail: 'User Access deleted'});
                    },
                    (error) => {
                        toast.current.show({ severity: 'error', summary: 'Error deleting User Access', detail: 'Please try again'});
                    }
                );
        } else {
            toast.current.show({ severity: 'error', summary: 'No id selected'});
        }
    };

    const rejectDelete = () => {
        //toast.current.show({severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000});

    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Add" icon="pi pi-plus" className="p-button-success mr-2" onClick={onClickAdd} />
           </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
           <>
                <div>
                    <div className="p-inputgroup">
                        <InputText placeholder="FH ID/Name" onChange={handleSearchChange}/>
                        <Button icon="pi pi-search" className="p-button-warning" onClick={onSearch}/>
                    </div>
                </div>
          </>
        );
    };

    const showEditDialog= (rowData) => {
        let projList = projectList.find(proj =>  proj.project === rowData.projName);
        setRegionList(projList.region || "");
        setAreaList(projList.area || "");
        setSelectedFhUser(rowData);
        setSelectedFhUserAccess(rowData.rolesList);
        setSelProjectName(rowData.projName);
        setSelAccountStatus(rowData.status);
        setDialogEditVisible(true);
    };
    const actionColumnTemplate = (rowData) => {

        return (
            <div style={{width: 'auto', minWidth: '10rem',padding:'5px',textAlign:'center'}}>
                <Button type="button" icon="pi pi-user-edit" className="p-button-rounded p-button-text"
    title="Edit" onClick={() => showEditDialog(rowData)}/>

                <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Do you want to delete this record?"
                               header="Delete Confirmation" icon="pi pi-info-circle" acceptClassName="p-button-danger"
                               accept={() => acceptDelete(rowData.fhId)} reject={rejectDelete} />
                <Button onClick={() => setVisible(true)}
                        icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />
            </div>
        );
    };

    const editActionColumnTemplate = (rowData,props) => {
        return (
            <div style={{width: 'auto', minWidth: '10rem',padding:'5px',textAlign:'center'}}>
                <Button type="button" icon="pi pi-cog" className="p-button-rounded p-button-text"
                        title="Set Access" onClick={() => showEditDialog(rowData)}/>

                <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Do you want to delete this record?"
                               header="Delete Confirmation" icon="pi pi-info-circle" acceptClassName="p-button-danger"
                               accept={() => deleteUserAccess()} reject={rejectDelete} />
                <Button onClick={(e) => {onRowClick(rowData); setVisible(true);}}
                        icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />

            </div>
        );
    };
    const editRightToolbarTemplate = () => {
        return (
            <>
                <Button type="button" icon="pi pi-plus-circle"
                       label="Add" title="Add Access"  onClick={() => setAddUserAccessVisible(true)}/>
            </>
        );
    };


    const passwordHeader = <h6>Type a password</h6>;
    const passwordFooter = (
      <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>At least one special characters</li>
                <li>Minimum 12 characters</li>
            </ul>
        </>
    );

    const dropdownEditor = (options) => {
        return (
            <Dropdown value={options.value} options={accessLbl} optionLabel="accessVal" optionValue="accessId"
                      onChange={(e) => options.editorCallback(e.value)} style={{ width: '100%' }} placeholder="Select Access"
            />
        );
    };
    const dropdownAreaEditor = (options) => {
        return (
            <Dropdown value={options.value} options={areaList} optionLabel="area" optionValue="area"
                      onChange={(e) => options.editorCallback(e.value)}
                       />
        );
    }
    const dropdownRegionEditor = (options) => {
        return (
            <Dropdown value={options.value} options={regionList} optionLabel="region" optionValue="region"
                      onChange={(e) => options.editorCallback(e.value)}
            />
        );
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };


    const validate = (data) => {
        let errors = {};

        if (!data.fhId) {
            errors.fhId = 'FH ID is required.';
        }
        if (!data.fullName) {
            errors.fullName = 'Fullname is required.';
        }
        if (!data.projName) {
            errors.projName = 'Project is required.';
        }
        if (!data.fhUsername){
            errors.fhUsername = 'Username is required';
        }
        if (!data.password) {
            errors.password = 'Password is required';
        }else if (!/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{12,}).*$/i.test(data.password)){
            errors.password = 'Password is too weak! Please follow the suggestions.'
        }
        if (!data.department){
            errors.department = 'Department is required';
        }
        if (!data.fhPosition){
            errors.fhPosition = 'Position is required';
        }
        if (!data.status){
            errors.status = 'Status is required';
        }
        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        //console.log("weqew "+ JSON.stringify(data));
        //console.log(formData);
        submitForm(data);
       // form.restart();

    };
    const onSubmitEdit = (data, form) => {
        setFormData(data);
        submitFormEdit(data.fhId, {...data,  projName: selProjectName, status: selAccountStatus});
        // form.restart();

    };
    const submitEditAccess= (access) => {
        FhUserService.updateUserAccess(access.rolesId,access)
            .then((res) => {
                if (res.data.success) {
                    toast.current.show({severity: 'success', summary: res.data.message});
                    dt.current.reset();
                    queryFhUsers();
                   // setDialogEditVisible(false);
                } else {
                    toast.current.show({severity: 'error', summary: res.data.message, detail: 'Please try again'});
                }
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error updating Fh User', detail: 'Please try again'});
        });
    };
    const onRowEditComplete = (e) => {
        let selFhUserAccess = [...selectedFhUserAccess];
        let { newData, index } = e;

        selFhUserAccess[index] = newData;

        setSelectedFhUserAccess(selFhUserAccess);
        submitEditAccess(selFhUserAccess[index]);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error && meta.visited);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error"><h3>{meta.error}</h3></small>;
    };

    function onRowClick(rowData) {
        setRowIndex(rowData);
    }

    return(
        <div className="grid">
            <Toast ref={toast}/>
            <div className="col-12 xl:col-12">
                <div className="card">
                   <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} scrollable scrollDirection="both"/>
                   <DataTable  dataKey="id" value={fhUsers} rows={10} responsiveLayout="scroll"
                               rowsPerPageOptions={[10,25,50,100]} paginator
                              rowGroupMode="rowspan" groupRowsBy="rolesList.fhId"
                              selection={selectedFhUser} onSelectionChange={e => setSelectedFhUser(e.value)}
                              sortMode="single" resizableColumns columnResizeMode="fit" className="datatable-responsive"
                              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users">
                        <Column field="fhId" header="FH ID" sortable />
                        <Column field="fullName" header="Display Name" sortable />
                        <Column field="projName" header="Project Name" sortable />
                        <Column field="fhUsername" header="Username" sortable />
                        <Column field="password" header="Password" sortable />
                        <Column field="department" header="Department" sortable />
                        <Column field="fhPosition" header="Position" sortable />
                        <Column field="status" header="Status" sortable />
                        <Column field="rolesList" body={permsBodyTemplate} header="Permission" sortable/>
                        <Column field="rolesList" body={areaBodyTemplate} header="Area" sortable/>
                        <Column field="rolesList" body={regionBodyTemplate} header="Region" sortable/>
                        <Column field="rolesList" body={accessBodyTemplate} header="Access" sortable/>
                        <Column style={{padding:'5px',textAlign:'center'}}
                               headerStyle={{ width: 'auto', minWidth: '10rem', padding:'10px',textAlign:'center'}}
                               bodyStyle={{ width:"auto",textAlign: 'center', overflow: 'visible' }} body={actionColumnTemplate} />
                    </DataTable>
                </div>
            </div>
            <>
            <AddFhUserDialog dialogAddVisible={dialogAddVisible} onHideDialog={onHideDialog} projectList={projectList} setFhUsers={setFhUsers}/>
            <Dialog header="User Details" visible={dialogEditVisible} style={{height: '28vw',width: '60vw' }} modal
                    onHide={() => setDialogEditVisible(false)}>
                <TabView>
                    <TabPanel header="USER">
                        <Form onSubmit={onSubmitEdit} initialValues={selectedFhUser} validate={validate}
                              render={({ handleSubmit }) => (
                                  <form onSubmit={handleSubmit} className="p-fluid" autoComplete={"off"}>
                                      <input type="hidden" value="nocomplete"/>
                                        <div className="grid">
                                            <div className="col-1 md:col-1">
                                            </div>
                                            <div className="col-5 md:col-5">
                                                <br/>
                                                <div className="p-fluid">
                                                    <Field name="fhId" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <InputText id="fhId" name="editFhId" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="fhId" className={classNames({ 'p-error': isFormFieldValid(meta) })}>FH ID*</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-5 md:col-5">
                                                <br/>
                                                <div className="p-fluid">
                                                    <Field name="department" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <InputText id="department" name="editDepartment" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="department" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Department*</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-1 md:col-1"/>
                                            <div className="col-1 md:col-1"/>
                                            <div className="col-5 md:col-5">
                                                <div className="p-fluid">
                                                    <Field name="fullName" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <InputText id="fullName" name="editDisplayName" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="fullName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Display Name</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-5 md:col-5">
                                                <div className="p-fluid">
                                                    <Field name="fhPosition" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <InputText id="fhPosition" name="editPosition" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="fhPosition" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Position</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-1 md:col-1"/>
                                            <div className="col-1 md:col-1"/>
                                            <div className="col-5 md:col-5">
                                                <div className="p-fluid">
                                                    <Field name="projName" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <Dropdown id="projName" value={selProjectName} options={projectList} onChange={(e) => setSelProjectName(e.value)}
                                                                          optionValue="project" optionLabel="project" placeholder="Select a Project" />
                                                                <label htmlFor="projName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Project</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-5 md:col-5">
                                                <div className="p-fluid">
                                                    <Field name="status" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <Dropdown id="status" value={selAccountStatus} options={statusLbl} onChange={(e) => setSelAccountStatus(e.value)}
                                                                          optionValue="code" optionLabel="name" placeholder="Select a Status" />
                                                                <label htmlFor="status" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Status</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-1 md:col-1"/>
                                            <div className="col-1 md:col-1"/>
                                            <div className="col-5 md:col-5">
                                                <div className="p-fluid">
                                                    <Field name="fhUsername" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <InputText id="fhUsername" name="editUsername" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="fhUsername" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Username</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>
                                            <div className="col-5 md:col-5">
                                                <div className="p-fluid">
                                                    <Field name="password" render={({ input, meta }) => (
                                                        <div style={field2rem}>
                                                            <span className="p-input-icon-left p-float-label">
                                                                <i className="pi pi-id-card" />
                                                                <Password name="password" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })}  inputId="new-password" id="password" autoComplete="new-password" header={passwordHeader} footer={passwordFooter} toggleMask />
                                                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password</label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )}/>
                                                </div>
                                            </div>

                                        </div>
                                      <div className="p-dialog-footer">
                                          <div>
                                              <Button aria-label="Save" type="submit" className="p-button p-component p-button-primary"><span className="p-button-icon p-c p-button-icon-left
                                               pi pi-save"/><span className="p-button-label p-c">Save</span>
                                                  <span role="presentation" className="p-ink" style={{height: "66px", width: "66px", top: "-14.5555px", left: "28.5139px"}}/>
                                              </Button>
                                              <Button aria-label="Dismiss" type="button" onClick={() => toggleDialog(false)} className="p-button p-component p-button-secondary">
                                                  <span className="p-button-icon p-c p-button-icon-left pi pi-times"/><span className="p-button-label p-c">Dismiss</span>
                                                  <span role="presentation"  className="p-ink"/>
                                              </Button>
                                          </div>
                                      </div>
                                  </form>
                              )} />
                    </TabPanel>
                    <TabPanel header="ACCESS">
                        <Toolbar className="mb-4" right={editRightToolbarTemplate} scrollable scrollDirection="both"/>
                        <DataTable editMode="row" ref={dt}
                                   dataKey="rolesId"
                                   onRowClick={onRowClick.bind(this)}
                                   onRowEditComplete={onRowEditComplete}
                                   value={selectedFhUserAccess} rows={10} responsiveLayout="scroll"
                                   rowsPerPageOptions={[10,25,50,100]} paginator
                                   sortMode="single" resizableColumns columnResizeMode="fit" className="datatable-responsive">
                            <Column field="permission" header="Permission" editor={(options) => textEditor(options)}  style={{ minWidth: '12rem' }}/>
                            <Column field="area" header="Area" editor={(options) => dropdownAreaEditor(options)}   style={{ minWidth: '12rem' }}/>
                            <Column field="region" header="Region"  editor={(options) => dropdownRegionEditor(options)}  style={{ minWidth: '12rem' }}/>
                            <Column field="userAccess" header="Access"  editor={(options) => dropdownEditor((options))} style={{ minWidth: '12rem' }}/>
                            <Column style={{padding:'5px',textAlign:'center'}}
                                    headerStyle={{ width: 'auto', minWidth: '10rem', padding:'10px',textAlign:'center'}}
                                    bodyStyle={{ width:"auto",textAlign: 'center', overflow: 'visible' }}
                                    body={editActionColumnTemplate}
                                    />
                            <Column rowEditor/>
                        </DataTable>
                        <Dialog style={{ width: '15vw' }} header="Add User Access" visible={addUserAccessVisible} onHide={() => setAddUserAccessVisible(false)} footer={accessDialogFooter}>
                            <div className="grid">
                                <div className="col-12 md:col-12">
                                    <br/><br/>
                                    <div className="p-fluid">
                                        <div style={field2rem} >
                                            <span className="p-input-icon-left p-float-label">
                                                <i className="pi pi-id-card" />
                                                <InputText id="addPermission"  value="ADMIN" onChange={handleFormFieldChange} />
                                                <label htmlFor="addPermission">Permission</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-12">
                                    <div className="p-fluid">
                                            <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown id="addArea" name="addArea" options={areaList} optionLabel="area" optionValue="area"
                                                              value={selArea || ''}
                                                              onChange={(e) => setSelArea(e.target.value)}
                                                              />
                                                    <label htmlFor="addArea">Area</label>
                                                </span>
                                            </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-12">
                                    <div className="p-fluid">
                                        <div style={field2rem} >
                                            <span className="p-float-label">
                                                  <Dropdown id="addRegion" name="addRegion" options={regionList} optionLabel="region" optionValue="region"
                                                  onChange={(e) => setSelRegion(e)}
                                                  showClear/>
                                                <label htmlFor="addRegion">Region</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-12">
                                    <div className="p-fluid">
                                        <div style={field2rem}>
                                            <span className="p-float-label">
                                                <Dropdown id="addAccess" options={accessLbl} value={selectedAccess}  onChange={(e) => setSelectedAccess(e.value)}
                                                          optionValue="accessId" optionLabel="accessVal" />
                                                <label htmlFor="addAccess">Access</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </TabPanel>
                </TabView>
            </Dialog>
            </>
        </div>

    );
};

export default FhUsers;
