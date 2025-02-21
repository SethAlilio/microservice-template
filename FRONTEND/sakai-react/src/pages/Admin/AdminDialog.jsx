import React, {useEffect, useRef, useState} from "react";
import {Field, Form} from "react-final-form";
import {Dropdown} from "primereact/dropdown";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {OnChange} from "react-final-form-listeners";
import {Password} from "primereact/password";
import FhUserService from "../../../service/Inventory/Admin/FhUserService";
import {Divider} from "primereact/divider";
import {Toast} from "primereact/toast";
import ProjectService from "../../../service/Inventory/Admin/ProjectService";
import {TabPanel, TabView} from "primereact/tabview";
import AuthService from "../../../service/AuthService";
import {useOrgTree} from "../../../stores/OrganizationStore";

const field2rem = {
    marginBottom: "2rem"
};
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

const isFormFieldValid = (meta) => !!(meta.touched && meta.error && meta.visited);
const getFormErrorMessage = (meta) => {
    return isFormFieldValid(meta) && <small className="p-error"><h3>{meta.error}</h3></small>;
};



function AddFhUserDialog({dialogAddVisible,onHideDialog,projectList, setFhUsers}) {

    const toast = useRef(null);
   // const [fhUsers, setFhUsers] = useState([]);
    const [selectedFhUser, setSelectedFhUser] = useState(null);
    const [selectedFhUserAccess, setSelectedFhUserAccess] = useState(null);
    const [fhUserAccess, setFhUserAccess] = useState([]);
    const [addUserAccessVisible, setAddUserAccessVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selAccountStatus, setSelAccountStatus] = useState("");
    const [selectedAccess,setSelectedAccess] = useState(null);
    const [showMessage, setShowMessage] = useState(null);
    const [areaList,setAreaList] = useState(null);
    const [regionList, setRegionList] = useState(null);
    const getProjectList = useOrgTree();

    const submitForm = (data) => {
        FhUserService.saveNewFhUser(data)
            .then((res) => {
                if (res.data.success) {
                    toast.current.show({severity: 'success', summary: res.data.message});
                    FhUserService.getAllFhUsers().then((res) => {
                        setFhUsers(res.data);

                    }).catch((error) => {
                        toast.current.show({severity: 'error', summary: 'Error getting Users list', detail: 'Please try again'});
                    });
                } else {
                    toast.current.show({severity: 'error', summary: res.data.message, detail: 'Please try again'});
                }
                onHideDialog(true);
                //return response.data;
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error adding Fh User', detail: 'Please try again'});
        });

    };

    const onSubmit = (data, form) => {
        data.projName = typeof(data.projName) !== 'undefined'? data.projName.project: data.project;
        data.region = typeof(data.region) !== 'undefined'? data.region:null;
        data.area = typeof(data.area) !== 'undefined'?  data.area:null;
        submitForm(data);
        form.reset();
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

    return (
      <>
          <Toast ref={toast}/>
          <div className="form-demo">
              <Dialog style={{ width: '30vw' }} header="Add FH User" visible={dialogAddVisible} onHide={onHideDialog} >
                  <Form onSubmit={onSubmit} initialValues={{ fhId: '', fullName: '',fhUsername:'',password: '',department:''
                      , fhPosition:'',userAccess: '',projName:'',status: ''}} validate={validate}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid" autoComplete={"off"}>
                                <input type="hidden" value="nocomplete"/>
                                <div className="grid">
                                    <div className="col-6 md:col-6">
                                        <br/><br/>
                                        <div className="p-fluid">
                                            <Field name="fhId" render={({ input, meta }) => (
                                                <div style={field2rem} >
                                                <span className="p-input-icon-left p-float-label">
                                                    <i className="pi pi-id-card" />
                                                    <InputText id="fhId" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="fhId" className={classNames({ 'p-error': isFormFieldValid(meta) })}>FH ID*</label>
                                                </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <br/><br/>
                                        <div className="p-fluid">
                                            <Field name="fullName" render={({ input, meta }) => (
                                                <div style={field2rem} >
                                                <span className="p-float-label">
                                                    <InputText id="fullName" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="fullName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Fullname*</label>
                                                </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-12">
                                        <div className="p-fluid">
                                            <Field name="projName" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                            <span className="p-float-label">
                                                <Dropdown id="projName" {...input} options={projectList} className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                         optionLabel="project"/>
                                                 <OnChange name="projName">
                                                      {(value) => {
                                                          setRegionList(value.region);
                                                          setAreaList(value.area);
                                                      }}
                                                 </OnChange>
                                                 <label htmlFor="projName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Project Name*</label>
                                            </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="fhUsername" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                            <span className="p-float-label">
                                                <InputText id="fhUsername" {...input} autoComplete={"off"} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                <label htmlFor="fhUsername" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Username*</label>
                                            </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="password" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                            <span className="p-float-label">
                                                <Password id="password" {...input} autoComplete="new-password" header={passwordHeader} footer={passwordFooter} toggleMask
                                                          className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
                                            </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="department" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                            <span className="p-float-label">
                                                 <InputText id="department" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                 <label htmlFor="department" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Department*</label>
                                            </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="fhPosition" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="fhPosition" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="fhPosition" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Position*</label>
                                                </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}/>
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="status" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown id="status" {...input} options={statusLbl} className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                              optionLabel="name" optionValue="code"  />
                                                    <label htmlFor="status" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Status*</label>
                                                </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}/>
                                        </div>
                                    </div>
                                    <div  className="col-6 md:col-6">
                                        <div className="p-fluid">
                                             <Field name="region" render={({ input }) => (
                                                <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="region" options={regionList} editable={true} optionLabel="region" optionValue="region"
                                                              showClear/>
                                                    <label htmlFor="region">Region</label>
                                                </span>
                                                </div>
                                            )}/>
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="area" render={({ input }) => (
                                                <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="area" options={areaList} editable={true} optionLabel="area" optionValue="area"
                                                               showClear/>
                                                    <label htmlFor="area">Area</label>
                                                </span>
                                                </div>
                                            )}/>
                                        </div>
                                    </div>
                                    <div className="col-6 md:col-6">
                                        <div className="p-fluid">
                                            <Field name="userAccess" render={({ input, meta }) => (
                                                <div style={field2rem}>
                                            <span className="p-float-label">
                                                <Dropdown id="userAccess" {...input} options={accessLbl} className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                          optionValue="accessId" optionLabel="accessVal"  />
                                                 <label htmlFor="userAccess" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Access</label>
                                            </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-dialog-footer">
                                    <div>
                                        <Button aria-label="Cancel" onClick={onHideDialog}  className="p-button p-component p-button-text"><span className="p-button-label p-c">Cancel</span><span role="presentation" className="p-ink"/></Button>
                                        <Button aria-label="Submit" type="submit" className="p-button p-component"><span className="p-button-label p-c">Submit</span><span role="presentation" className="p-ink"/></Button>
                                    </div>
                                </div>
                            </form>
                        )} />
              </Dialog>
          </div>
      </>
    );
}
function EditProjectDialog({displayModal, onHideEdit, selectedProject, projectList, setProjectList}) {

    const toast = useRef(null);
    const [selProject,setSelProject] = useState(null);
    const [selArea,setSelArea] = useState(null);
    const [selRegion, setSelRegion] = useState(null);
    const getProjectList = useOrgTree();

    const validate = (data) => {
        let errors = {};

        /*if(!data.project){
            errors.project = 'Project is required';
        }*/
        return errors;
    };

    const onSubmitEdit = (data) => {
        /*  data.project = typeof({selProjectName}) !== 'undefined'? data.project: {selProjectName}.selProjectName.project;
          data.region = typeof({selRegion}) !== 'undefined'? data.region :{selRegion}.selRegion;
          data.area = typeof({selArea}) !== 'undefined'? data.area : {selArea}.selArea;*/

        submitFormEdit(data);

    };

    const submitFormEdit = (data) => {
        ProjectService.editProjectDetails(data)
            .then((res) => {
                toast.current.show({severity: 'success', summary: 'Project updated'});
                ProjectService.getAllProjectList().then((res) => {
                    setProjectList(res.data);
                    onHideEdit(true);
                }).catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error getting Project list', detail: 'Please try again'});
                });
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error updating Project', detail: 'Please try again'});
        });
    };

    return(
        <>
            <Toast ref={toast}/>
            <Dialog header="Edit Project" visible={displayModal} style={{height: '22vw',width: '50vw' }} modal={true}
                    onHide={onHideEdit}>
                <Form onSubmit={onSubmitEdit}  validate={validate} initialValues={selectedProject}
                      render={({ handleSubmit }) => (
                          <form onSubmit={handleSubmit} className="p-fluid" autoComplete={"off"}>
                              <input type="hidden" value="nocomplete"/>
                              <div className="grid">
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-5 md:col-5">
                                      <br/><br/>
                                      <div className="p-fluid">
                                          <Field name="project" render={({ input, meta }) => (
                                              <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="project" dropdownIcon="fa fa-sitemap" options={getProjectList}
                                                              optionLabel="label" optionValue="label"
                                                              editable={true}  showClear/>
                                                    <label htmlFor="project" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Project*</label>
                                                </span>
                                                  {getFormErrorMessage(meta)}
                                              </div>
                                          )}/>
                                      </div>
                                  </div>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-5 md:col-5">
                                      <div className="p-fluid">
                                          <Field name="region" render={({ input }) => (
                                              <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="region" options={[...new Set(projectList.map(q => q.region))]} editable={true}
                                                              showClear/>
                                                    <label htmlFor="region">Region</label>
                                                </span>
                                              </div>
                                          )}/>
                                      </div>
                                  </div>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-5 md:col-5">
                                      <div className="p-fluid">
                                          <Field name="area" render={({ input }) => (
                                              <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="area" options={[...new Set(projectList.map(q => q.area))]} editable={true}
                                                              showClear/>
                                                    <label htmlFor="area">Area</label>
                                                </span>
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
                                      <Button aria-label="Dismiss" type="button" onClick={onHideEdit} className="p-button p-component p-button-secondary">
                                          <span className="p-button-icon p-c p-button-icon-left pi pi-times"/><span className="p-button-label p-c">Dismiss</span>
                                          <span role="presentation"  className="p-ink"/>
                                      </Button>
                                  </div>
                              </div>
                          </form>
                      )} />
            </Dialog>
        </>
    );
}
function AddProjectDialog({displayAddDialog, onHideAdd, projectList, setProjectList}) {
    const toast = useRef(null);
    const [regionList, setRegionList] = useState(null);
    const [areaList, setAreaList] = useState(null);
    const getProjectList = useOrgTree();

    const validate = (data) => {
        let errors = {};

        if(!data.project){
            errors.project = 'Project is required';
        }
        if(!data.area){
            errors.area = 'Area is required';
        }
        return errors;
    };

    const onSubmit = (data) => {
        /*  data.project = typeof(data.project) !== 'undefined'? data.project.project: data.project;
            data.region = typeof({selRegion}) !== 'undefined'? data.region :{selRegion}.selRegion;
            data.area = typeof({selArea}) !== 'undefined'? data.area : {selArea}.selArea;
        */
        submitForm(data);
    };

    const submitForm = (data) => {
        ProjectService.saveNewProject(data)
            .then((res) => {
                toast.current.show({severity: 'success', summary: 'Project added'});
                ProjectService.getAllProjectList().then((res) => {
                    setProjectList(res.data);
                    setRegionList([...new Set(res.data.map(q => q.region))]);
                    setAreaList([...new Set(res.data.map(q => q.area))]);
                    onHideAdd(true);
                }).catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error getting Project list', detail: 'Please try again'});
                });
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error adding Project', detail: 'Please try again'});
        });
    };

    return(
        <>
            <Toast ref={toast}/>
            <Dialog header="Add New Project" visible={displayAddDialog} style={{height: '22vw',width: '50vw' }} modal={true}
                    onHide={onHideAdd}>
                <Form onSubmit={onSubmit}  validate={validate}
                      render={({ handleSubmit }) => (
                          <form onSubmit={handleSubmit} className="p-fluid" autoComplete={"off"}>
                              <input type="hidden" value="nocomplete"/>
                              <div className="grid">
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-5 md:col-5">
                                      <br/><br/>
                                      <div className="p-fluid">
                                          <Field name="project" render={({ input, meta }) => (
                                              <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="project" dropdownIcon="fa fa-sitemap" options={getProjectList}
                                                              optionLabel="label" optionValue="label"
                                                              editable={true}  showClear/>
                                                    <label htmlFor="project" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Project*</label>
                                                </span>
                                                  {getFormErrorMessage(meta)}
                                              </div>
                                          )}/>
                                      </div>
                                  </div>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-5 md:col-5">
                                      <div className="p-fluid">
                                          <Field name="region" render={({ input }) => (
                                              <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="region" options={[...new Set(projectList.map(q => q.region))]} editable={true}
                                                              showClear/>
                                                    <label htmlFor="region">Region</label>
                                                </span>
                                              </div>
                                          )}/>
                                      </div>
                                  </div>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-3 md:col-3"/>
                                  <div className="col-5 md:col-5">
                                      <div className="p-fluid">
                                          <Field name="area" render={({ input,meta }) => (
                                              <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="area" options={[...new Set(projectList.map(q => q.area))]} editable={true}
                                                               showClear/>
                                                    <label htmlFor="area">Area</label>
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
                                      <Button aria-label="Dismiss" type="button" onClick={onHideAdd} className="p-button p-component p-button-secondary">
                                          <span className="p-button-icon p-c p-button-icon-left pi pi-times"/><span className="p-button-label p-c">Dismiss</span>
                                          <span role="presentation"  className="p-ink"/>
                                      </Button>
                                  </div>
                              </div>
                          </form>
                      )} />
            </Dialog>
        </>
    );
}
function AddContactAssetDialog({displayAddDialog, onHideAdd, organizationList,projectList, setContactAssets}) {

    const toast = useRef(null);
    const [selProject,setSelProject] = useState("");
    const [selArea,setSelArea] = useState(null);
    const [selRegion, setSelRegion] = useState(null);
    const [areaList,setAreaList] = useState(null);
    const [regionList, setRegionList] = useState(null);
    const [modifyProject, setModifyProject] = useState(false);
    const [newProject, setNewProject] = useState(null);
    const getProjectList = useOrgTree();
    const validate = (data) => {
        let errors = {};

        if (!data.projectLeadName) {
            errors.projectLeadName = 'Project Lead is required.';
        }
        if (!data.platformManagerAndAdminManager) {
            errors.platformManagerAndAdminManager = 'Platform/Admin Manager is required.';
        }
        if (!data.project) {
            errors.project = 'Project is required.';
        }
        if (!data.areaAdmin){
            errors.areaAdmin = 'Area Admin is required';
        }
        return errors;
    };

    const onSubmit = (data, form) => {
        data.project = typeof(data.project) !== 'undefined'? data.project: "";
        data.region = typeof({selRegion}) !== 'undefined'? data.region : "";
        data.area = typeof(data.area) !== 'undefined'? data.area : "";
        submitForm(data);
        form.restart();
    };


    const submitForm = (data) => {
        ContactAssetService.saveContactListData(data)
            .then((res) => {
                toast.current.show({severity: 'success', summary: 'Contact Asset added'});
                ContactAssetService.loadContactList().then((res) => {
                    setContactAssets(res.data);
                    onHideAdd(true);
                }).catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error getting Contact Assets list', detail: 'Please try again'});
                });
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error adding Contact Asset', detail: 'Please try again'});
        });
    };


    function selectedEditProject(value) {
        setSelProject(value);
        setModifyProject(true);
    }

    function changeOldProjectName() {
        if ((newProject !== "undefined" || newProject != null)){
            const param = new FormData();
            param.append("oldProjName", selProject);
            param.append("newProjName",newProject);
            ContactAssetService.modifyProjectName(param).then((res) => {
                toast.current.show({severity: 'success', summary: 'Project name changed'});
                ContactAssetService.loadContactList().then((res) => {
                    setContactAssets(res.data);
                    onHideAdd(true);
                }).catch((error) => {
                    toast.current.show({severity: 'error', summary: 'Error getting Contact Assets list', detail: 'Please try again'});
                });
            }).catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error modifying Project Name', detail: 'Please try again'});
            });
        }else{
            toast.current.show({severity: 'error', summary: 'Required', detail: 'New Project Name field is empty'});
        }
    }

    return(
        <>
        <Toast ref={toast}/>
        <Dialog header="Contact List Information" visible={displayAddDialog} style={{height: '32vw',width: '50vw' }} modal={true}
                onHide={onHideAdd}>
            <TabView>
                <TabPanel header="ADD">
                    <Form onSubmit={onSubmit}  validate={validate}
                          render={({ handleSubmit,form}) => (
                              <form onSubmit={handleSubmit} className="p-fluid" autoComplete={"off"}>
                                  <input type="hidden" value="nocomplete"/>
                                  <div className="grid">
                                      <div className="col-1 md:col-1"/>
                                      <div className="col-5 md:col-5">
                                          <br/>
                                          <div className="p-fluid">
                                              <Field name="project" render={({ input, meta }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="project" name="project" dropdownIcon="fa fa-sitemap" options={projectList}
                                                              optionLabel="label" optionValue="label"
                                                              showClear/>
                                                    <OnChange name="project">
                                                      {(label,value) => {
                                                          //setRegionList(value.region);
                                                          form.change('area', undefined);
                                                          setAreaList([...getProjectList].filter(parent => label === parent.label).flatMap(org => org.children));
                                                      }}
                                                    </OnChange>
                                                    <label htmlFor="project" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Project*</label>
                                                </span>
                                                      {getFormErrorMessage(meta)}
                                                  </div>
                                              )}/>
                                          </div>
                                      </div>
                                      <div className="col-5 md:col-5">
                                          <br/>
                                          <div className="p-fluid">
                                              <Field name="platformManagerAndAdminManager" render={({ input, meta }) => (
                                                  <div style={field2rem}>
                                            <span className="p-input-icon-left p-float-label">
                                                <i className="pi pi-id-card" />
                                                <InputText id="platformManagerAndAdminManager" name="platformManagerAndAdminManager" {...input}
                                                           className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                <label htmlFor="platformManagerAndAdminManager" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Platform Manager/Admin Manager</label>
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
                                              <Field name="region" render={({ input }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="region" options={regionList} editable={true} optionLabel="region" optionValue="region"
                                                              showClear/>
                                                    <label htmlFor="region">Region</label>
                                                </span>
                                                  </div>
                                              )}/>
                                          </div>
                                      </div>
                                      <div className="col-5 md:col-5">
                                          <div className="p-fluid">
                                              <Field name="pmWeChatId" render={({ input }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="pmWeChatId" {...input}/>
                                                    <label htmlFor="pmWeChatId">PM WeChat ID</label>
                                                </span>
                                                  </div>
                                              )}/>
                                          </div>
                                      </div>
                                      <div className="col-1 md:col-1"/>
                                      <div className="col-1 md:col-1"/>
                                      <div className="col-5 md:col-5">
                                          <div className="p-fluid">
                                              <Field name="area" render={({ input }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="area" options={areaList} editable={true}
                                                              optionLabel="label" optionValue="label"
                                                              showClear/>
                                                    <label htmlFor="area">Area</label>
                                                </span>
                                                  </div>
                                              )}/>
                                          </div>
                                      </div>
                                      <div className="col-5 md:col-5">
                                          <div className="p-fluid">
                                              <Field name="areaAdmin" render={({ input,meta }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="areaAdmin" {...input}/>
                                                    <label htmlFor="areaAdmin">Area Admin</label>
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
                                              <Field name="projectLeadName" render={({ input,meta }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="projectLeadName" {...input}/>
                                                    <label htmlFor="projectLeadName">Project Lead Name</label>
                                                </span>
                                                  {getFormErrorMessage(meta)}
                                              </div>
                                              )}/>
                                          </div>
                                      </div>
                                      <div className="col-5 md:col-5">
                                          <div className="p-fluid">
                                              <Field name="areaAdminWeChatId" render={({ input }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="areaAdminWeChatId" {...input}/>
                                                    <label htmlFor="areaAdminWeChatId">Area Admin WeChat ID</label>
                                                </span>
                                                  </div>
                                              )}/>
                                          </div>
                                      </div>

                                      <div className="col-1 md:col-1"/>
                                      <div className="col-1 md:col-1"/>
                                      <div className="col-5 md:col-5">
                                          <div className="p-fluid">
                                              <Field name="projectLeadWeChatId" render={({ input }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="projectLeadWeChatId" {...input}/>
                                                    <label htmlFor="projectLeadWeChatId">Project Lead WeChat ID</label>
                                                </span>
                                                  </div>
                                              )}/>
                                          </div>
                                      </div>
                                      <div className="col-5 md:col-5">
                                          <div className="p-fluid">
                                              <Field name="contact" render={({ input }) => (
                                                  <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText id="contact" {...input}/>
                                                    <label htmlFor="contact">Contact</label>
                                                </span>
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
                                          <Button aria-label="Dismiss" type="button" onClick={onHideAdd} className="p-button p-component p-button-secondary">
                                              <span className="p-button-icon p-c p-button-icon-left pi pi-times"/><span className="p-button-label p-c">Dismiss</span>
                                              <span role="presentation"  className="p-ink"/>
                                          </Button>
                                      </div>
                                  </div>
                              </form>
                          )} />
                </TabPanel>
                <TabPanel header="MODIFICATION">
                    <br/>
                    <div className="grid">
                        <div className="col-2 md:col-2"/>
                        <div className="col-7 md:col-7">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="fa fa-sitemap">
                                    </i>
                                </span>
                                <span className="p-float-label">
                                     <Dropdown id="project" options={getProjectList}
                                               optionLabel="label"
                                               value={selProject}
                                               onChange={(e) => selectedEditProject(e.target.value)}/>
                                    <label htmlFor="project">Project</label>
                                </span>
                            </div>
                        </div>
                        <div className="col-2 md:col-2"/><br/><br/>
                        {modifyProject &&
                            <>
                            <div className="col-2 md:col-2"/>
                            <div className="col-3 md:col-3">
                                <br/><br/>
                                <div className="p-fluid">
                                   <span className="p-input-icon-left p-float-label">
                                        <i className="fa fa-sitemap" />
                                        <InputText id="oldProjectName" value={selProject.label} disabled   />
                                        <label htmlFor="oldProjectName">Old Project Name</label>
                                    </span>
                                </div>
                            </div>
                            <div className="col-1 md:col-1"/>
                            <div className="col-3 md:col-3"><br/><br/>
                                <div className="p-fluid">
                                    <span className="p-input-icon-left p-float-label">
                                        <i className="fa fa-sitemap" />
                                        <InputText id="newProjectName" value={newProject || ''} onChange={(e) => setNewProject(e.target.value)}/>
                                        <label htmlFor="newProjectName">New Project Name</label>
                                    </span>
                                </div>
                            </div>
                            </>
                        }
                        </div>
                    {modifyProject &&
                        <div className="p-dialog-footer" style={{paddingTop: "12em"}}>
                            <div>
                                <Button aria-label="Save" type="submit" onClick={changeOldProjectName} className="p-button p-component p-button-primary"><span className="p-button-icon p-c p-button-icon-left
                                                   pi pi-save"/><span className="p-button-label p-c">Save</span>
                                    <span role="presentation" className="p-ink" style={{height: "66px", width: "66px", top: "-14.5555px", left: "28.5139px"}}/>
                                </Button>
                                <Button aria-label="Dismiss" type="button" onClick={onHideAdd} className="p-button p-component p-button-secondary">
                                    <span className="p-button-icon p-c p-button-icon-left pi pi-times"/><span className="p-button-label p-c">Dismiss</span>
                                    <span role="presentation" className="p-ink"/>
                                </Button>
                            </div>
                        </div>
                    }
                </TabPanel>
            </TabView>

        </Dialog>
    </>
    )
}
export{
    AddContactAssetDialog,
    AddFhUserDialog,
    AddProjectDialog,
    EditProjectDialog
}
