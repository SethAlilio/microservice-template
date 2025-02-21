import React, {useState, useEffect, useRef} from 'react'
import { useHistory, useParams } from "react-router";
//import ContactAssetService from "../../../service/Inventory/Admin/ContactAssetService";
import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {ConfirmDialog} from "primereact/confirmdialog";
import ProjectService from "../../../service/Inventory/Admin/ProjectService";
import {AddContactAssetDialog, AddProjectDialog, EditProjectDialog} from "./AdminDialog";

const Projects = () => {
    const toast = useRef(null);
    const [dialogAddVisible, setDialogAddVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [displayModal,setDisplayModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [projectList, setProjectList] = useState([]);
    const [areaList,setAreaList] = useState(null);
    const [regionList, setRegionList] = useState(null);

    const field2rem = {
        marginBottom: "2rem"
    };

    useEffect(() => {
        queryFhProjects();
    }, []);

    const queryFhProjects = () => {
        ProjectService.getAllProjectList().then((res) => {
            setProjectList(res.data);
        }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error getting Projects list', detail: 'Please try again'});
        });
    };

    const onHideAddDialog = () => {
        setDialogAddVisible(false);
    };

    const onHideEditDialog = () => {
        setDisplayModal(false);
    };

    const toggleDialog = (toggle) => {
        //setDialogAddVisible(toggle);
        setDisplayModal(toggle);
    };

    const onClickAdd = () => {
        setDialogAddVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Add" icon="pi pi-plus" className="p-button-success mr-2" onClick={onClickAdd} />
            </>
        );
    };


    const acceptDeleteProject = () => {
        // console.log(selectedContactAsset);
       let id = selectedProject.id;
        if (id) {
            ProjectService.deleteProject(id)
                .then(
                    (res) => {
                        queryFhProjects();
                        toast.current.show({ severity:  'success' , summary: res.message, detail: 'Project Deleted'});
                    },
                    (error) => {
                        toast.current.show({ severity: 'error', summary: 'Error deleting Project', detail: 'Please try again'});
                    }
                );
        } else {
            toast.current.show({ severity: 'error', summary: 'No id selected'});
        }
    };

    const showEditDialog= (rowData) => {
        setSelectedProject(rowData);

        onHideEditDialog();
        setDisplayModal(true);
        //setDisplayModal(true);
       /* let parentContact = contactAssets.find(asset =>  asset.id === rowData.groupId);
        let editData = {...rowData};
        if (parentContact){
            editData.projectLeadName = parentContact.projectLeadName;
            editData.projectLeadWeChatId = parentContact.projectLeadWeChatId;
            editData.platformManagerAndAdminManager = parentContact.platformManagerAndAdminManager;
            editData.pmWeChatId = parentContact.pmWeChatId;
        }
        setSelectedContactAsset(editData);
        setSelProjectName(rowData.project);
        setDisplayModal(true);*/
    };

    const actionProjectColumnTemplate = (rowData) => {

        return (
            <div style={{width: 'auto', minWidth: '10rem',padding:'5px',textAlign:'center'}}>
                <Button type="button" icon="pi pi-user-edit" className="p-button-rounded p-button-text"
                        title="Edit" onClick={() => showEditDialog(rowData)}/>

                <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Do you want to delete this record?"
                               header="Delete Confirmation" icon="pi pi-info-circle" acceptClassName="p-button-danger"
                               accept={() => acceptDeleteProject()} reject={() => {}} />
                <Button onClick={() => {setVisible(true); setSelectedProject(rowData); }}
                        icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" />
            </div>
        );
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error && meta.visited);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error"><h3>{meta.error}</h3></small>;
    };


    const validate = (data) => {
        let errors = {};

        return errors;
    };

    const onChangeSetRegionArea = (e) => {
        // console.log(e);
        setAreaList(e.value.area);
        setRegionList(e.value.region);

    };

    return(
        <>
            <div className="grid">
                <Toast ref={toast}/>
                <div className="col-12 xl:col-12">
                    <div className="card">
                        <Toolbar className="mb-4" left={leftToolbarTemplate} scrollable scrollDirection="both"/>
                        <DataTable dataKey="id" value={projectList} rows={15} responsiveLayout="scroll"
                                   rowsPerPageOptions={[15, 30, 60, 100]} paginator
                                   rowGroupMode="rowspan" groupRowsBy="project"
                                   sortMode="single" resizableColumns columnResizeMode="fit"
                                   className="datatable-responsive"
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contacts">
                            <Column field="id" hidden/>
                            <Column field="project" header="Project" sortable />
                            <Column field="region" header="Region" sortable/>
                            <Column field="area" header="Area" sortable/>
                            <Column style={{padding: '5px', textAlign: 'center'}}
                                    headerStyle={{width: 'auto', minWidth: '10rem', padding: '10px', textAlign: 'center'}}
                                    bodyStyle={{width: "auto", textAlign: 'center', overflow: 'visible'}} body={actionProjectColumnTemplate}/>
                        </DataTable>
                    </div>
                </div>
            </div>
            <AddProjectDialog displayAddDialog={dialogAddVisible} onHideAdd={onHideAddDialog} projectList={projectList} setProjectList={setProjectList}/>
            <EditProjectDialog displayModal={displayModal} onHideEdit={onHideEditDialog} selectedProject={selectedProject} projectList={projectList} setProjectList={setProjectList}/>
        </>
    )
};
export default Projects;

