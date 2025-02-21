import React, {useState, useEffect, useRef} from 'react'
//import ContactAssetService, {loadContactListCancelToken} from "../../../service/Inventory/Admin/ContactAssetService";
import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {ConfirmDialog} from "primereact/confirmdialog";
import {Dialog} from "primereact/dialog";
import {Field, Form} from "react-final-form";
import {classNames} from "primereact/utils";
import {Dropdown} from "primereact/dropdown";
import {AddContactAssetDialog} from "./AdminDialog";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import {OnChange} from "react-final-form-listeners";
import AuthService from "../../../service/AuthService";
import {useOrgTree} from "../../../stores/OrganizationStore";

const ContactAssets = () => {
    const toast = useRef(null);
    const [contactAssets, setContactAssets] = useState([]);
    const [selectedEditData, setSelectedEditData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [dialogAddVisible, setDialogAddVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [displayModal,setDisplayModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedContactAsset, setSelectedContactAsset] = useState(null);
    const [projectList, setProjectList] = useState([]);
    const [organizationList, setOrganizationList] = useState([]);
    const [selProjectName,setSelProjectName] = useState("");
    const [selArea,setSelArea] = useState(null);
    const [areaList,setAreaList] = useState(null);
    const [selRegion, setSelRegion] = useState(null);
    const [regionList, setRegionList] = useState(null);
    const [filters2, setFilters2] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'project': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'area': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'projectLeadName': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'platformManagerAndAdminManager': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'areaAdmin': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'contact': { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });
    const [globalFilterValue2, setGlobalFilterValue2] = useState('');
    const getProjectList = useOrgTree();
    const [getAreaList, setAreaList2] = useState([]);
    const [querySelectedProject, setQueryProject] = useState(null);
    const [querySelectedArea, setQueryArea] = useState(null);
    const [filterOrgArea, setFilterOrgArea] = useState(null);


    const onGlobalFilterChange2 = (e) => {
        const value = e.target.value;
        let _filters2 = { ...filters2 };
        _filters2['global'].value = value;

        setFilters2(_filters2);
        setGlobalFilterValue2(value);
    };
    const renderHeader2 = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue2} onChange={onGlobalFilterChange2} placeholder="Search" />
                </span>
            </div>

        )
    };

    const field2rem = {
        marginBottom: "2rem"
    };

    useEffect(() => {
        queryContactAssets();

    }, []);

    const queryContactAssets = () => {
        /* if(loadContactListCancelToken){
            loadContactListCancelToken.cancel("Request Cancel")
        }
        ContactAssetService.loadContactList().then((res) => {
            setContactAssets(res.data);
        }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error getting Contact Assets list', detail: 'Please try again'});
        }); */
    };
    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const onHideAddDialog = () => {
        setDialogAddVisible(false);
    };

    const onHideEditDialog = () => {
        setDisplayModal(false);
    };

    const toggleDialog = (toggle) => {
        setDisplayModal(toggle);
    };

    const onSearch = () => {
        queryContactAssets();
    };
    const onClickAdd = () => {
        setDialogAddVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="Modify" icon="pi pi-pencil" className="p-button-success mr-2" onClick={onClickAdd} />
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
    const acceptDeleteContact = () => {
        /* let id = selectedContactAsset.id;
        if (id) {
            ContactAssetService.deleteAssetContactInfo(id)
                .then(
                    (res) => {
                        queryContactAssets();
                        toast.current.show({ severity: res.data.success ? 'success' : 'error', summary: res.data.message});
                    },
                    (error) => {
                        toast.current.show({ severity: 'error', summary: 'Error deleting Fh User', detail: 'Please try again'});
                    }
                );
        } else {
            toast.current.show({ severity: 'error', summary: 'No id selected'});
        } */
    };

    const showEditDialog= (rowData) => {
        let parentContact = contactAssets.find(asset =>  asset.id === rowData.groupId);
        let editData = {...rowData};
        if (parentContact){
            editData.projectLeadName = parentContact.projectLeadName;
            editData.projectLeadWeChatId = parentContact.projectLeadWeChatId;
            editData.platformManagerAndAdminManager = parentContact.platformManagerAndAdminManager;
            editData.pmWeChatId = parentContact.pmWeChatId;
        }

        setSelectedContactAsset(editData);
        setSelProjectName(editData.project);
        setDisplayModal(true);
    };

    const actionContactColumnTemplate = (rowData) => {
        return (
            <div style={{width: 'auto', minWidth: '10rem',padding:'5px',textAlign:'center'}}>
                <Button type="button" icon="pi pi-user-edit" className="p-button-rounded p-button-outlined"
                        title={"Edit"} onClick={() => showEditDialog(rowData)}/>

                <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Do you want to delete this record?"
                               header="Delete Confirmation" icon="pi pi-info-circle" acceptClassName="p-button-danger"
                               accept={() => acceptDeleteContact()} reject={() => {}} />
                <Button title={"Delete Record"} onClick={() => {setVisible(true); setSelectedContactAsset(rowData); }}
                        icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger" />
            </div>
        );
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error && meta.visited);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error"><h3>{meta.error}</h3></small>;
    };

    const onSubmitEdit = (data, form) => {
        data.project = typeof(data.project) !== 'undefined'? data.project: null;
        data.region = typeof(data.region) !== 'undefined'? data.region : null;
        data.area = typeof(data.area) !== 'undefined'? data.area : null;
        setFormData(data);
        submitFormEdit(data.id,data);
        form.restart();

    };
    const submitFormEdit = (id, data) => {
        /* ContactAssetService.updateContactAsset(id,data)
            .then((res) => {
                toast.current.show({severity: 'success', summary: 'Contact Asset updated'});
                queryContactAssets();
                onHideEditDialog();
            }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error updating Contact Asset', detail: 'Please try again'});
        });  */
    };

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

    const onFilterTable = (e, options) => {
        options.filterApplyCallback(e.value);
    };

    let projectFilter = (options) => {
        return <Dropdown style={{width: '100%'}} className="ui-column-filter" placeholder="Filter by Project"
                                               options={getProjectList}
                                               optionLabel="label" optionValue="label" value={options.value}
                                               onChange={(e) => onFilterTable(e,options)}/>
    };

    function titleCase(str) {
        str = str.replace(/([A-Z])/g, ' $1').trim();
        return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    }

    const exportExcel = () => {

        import('xlsx').then(xlsx => {
            let exportedContactAssets = [...contactAssets];
            exportedContactAssets.forEach((ca) => {
                let parentContact = contactAssets.find(asset =>  asset.id === ca.groupId);
                if (parentContact){
                    ca.projectLeadName = parentContact.projectLeadName;
                    ca.projectLeadWeChatId = parentContact.projectLeadWeChatId;
                    ca.platformManagerAndAdminManager = parentContact.platformManagerAndAdminManager;
                    ca.pmWeChatId = parentContact.pmWeChatId;
                }
            });
            let finalExportData = exportedContactAssets.map(({id, groupId, ...rest}) => rest);
            let exportData = [];
           finalExportData.forEach(o => {
               let obj =  Object.fromEntries(
                   Object.entries(o).map(([k, v]) => [titleCase(k), v])
               );
               exportData.push(obj);
           });
            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
             const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
             saveAsExcelFile(excelBuffer, 'Contact Assets List');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(module => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + EXCEL_EXTENSION);
            }
        });
       queryContactAssets();
    };
    return(
        <>
        <div className="grid">
            <Toast ref={toast}/>
            <div className="col-12 xl:col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} scrollable scrollDirection="both"/>
                    <DataTable dataKey="id" value={contactAssets} rows={15} responsiveLayout="scroll"
                               rowsPerPageOptions={[15, 30, 60, 100]} paginator
                               filters={filters2} filterDisplay="row"
                               header={renderHeader2}
                               globalFilterFields={['project','area', 'projectLeadName', 'platformManagerAndAdminManager','areaAdmin','contact']}
                               rowGroupMode="rowspan" groupRowsBy="project"
                               sortMode="single" resizableColumns columnResizeMode="fit"
                              /* selectionMode="single"
                               selection={selectedContactAsset} onSelectionChange={e => setSelectedContactAsset(e.value)}*/
                               className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contacts">
                        <Column header="Action" style={{padding: '5px', textAlign: 'center'}}
                                headerStyle={{width: 'auto', minWidth: '10rem', padding: '10px', textAlign: 'center'}}
                                bodyStyle={{width: "auto", textAlign: 'center', overflow: 'visible'}} body={actionContactColumnTemplate}
                        frozen alignFrozen="left"/>
                        <Column field="project"  style={{ minWidth: '14rem' }} header="Project" sortable filter showFilterMenu={false}
                                filterElement={projectFilter}/>
                        <Column field="region" header="Region" sortable />
                        <Column field="area" header="Area"  showFilterMenu={false} style={{ minWidth: '20rem' }} sortable filter filterPlaceholder="Filter by Area"/>
                        <Column field="projectLeadName" style={{ minWidth: '20rem' }} showFilterMenu={false} header="Project Lead Name" sortable filter filterPlaceholder="Filter by Project Lead"/>
                        <Column field="projectLeadWeChatId" header="Project Lead WeChat ID" sortable/>
                        <Column field="platformManagerAndAdminManager"  showFilterMenu={false} style={{ minWidth: '25rem' }} header="Platform Manager/ Admin Manager"
                                sortable filter filterPlaceholder="Filter by Platform/Admin Manager"/>
                        <Column field="pmWeChatId" header="PM WeChat ID" sortable/>
                        <Column field="areaAdmin" style={{ minWidth: '20rem' }} header="Area Admin" sortable filter
                                showFilterMenu={false} filterPlaceholder="Search by Area Admin" />
                        <Column field="areaAdminWeChatId" header="Area Admin WeChat ID" sortable/>
                        <Column field="contact" style={{ minWidth: '20rem' }} showFilterMenu={false} header="Contact" sortable filter filterPlaceholder="Search by Contact"/>
                        <Column field="groupId" hidden/>
                    </DataTable>
                </div>
            </div>
        </div>
        <Dialog header="Update Contact List Information" visible={displayModal} style={{height: '30vw', width: '50vw'}} modal
                onHide={() => setDisplayModal(false)}>
            <br/>
            <Form onSubmit={onSubmitEdit} initialValues={selectedContactAsset} validate={validate}
                  render={({handleSubmit,form}) => (
                      <form onSubmit={handleSubmit} className="p-fluid" autoComplete={"off"}>
                          <input type="hidden" value="nocomplete"/>
                          <div className="grid">
                              <div className="col-1 md:col-1">
                              </div>
                              <div className="col-5 md:col-5">
                                  <br/>
                                  <div className="p-fluid">
                                      <Field name="project" render={({ input, meta }) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <Dropdown {...input} id="project" name="project" dropdownIcon="fa fa-sitemap" options={getProjectList}
                                                              optionLabel="label" optionValue="label" editable={true}  showClear/>
                                                    <OnChange name="project">
                                                      {(label,value) => {
                                                          setSelProjectName(value);
                                                         // setRegionList(value.region);
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
                                      <Field name="platformManagerAndAdminManager" render={({input, meta}) => (
                                          <div style={field2rem}>
                                            <span className="p-input-icon-left p-float-label">
                                                <i className="pi pi-id-card"/>
                                                <InputText id="platformManagerAndAdminManager" name="platformManagerAndAdminManager" {...input} className={classNames({'p-invalid': isFormFieldValid(meta)})}/>
                                                <label htmlFor="platformManagerAndAdminManager" className={classNames({'p-error': isFormFieldValid(meta)})}>Platform Manager/Admin Manager</label>
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
                                                    <OnChange name="region">
                                                      {(value) => {
                                                          setSelRegion(value);
                                                      }}
                                                    </OnChange>
                                                    <label htmlFor="region">Region</label>
                                                </span>
                                          </div>
                                      )}/>
                                  </div>
                              </div>
                              <div className="col-5 md:col-5">
                                  <div className="p-fluid">
                                      <Field name="pmWeChatId" render={({input}) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText name="pmWeChatId" id="pmWeChatId" {...input}/>
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
                                                    <OnChange name="area">
                                                      {(value) => {
                                                          setSelArea(value);
                                                      }}
                                                    </OnChange>
                                                    <label htmlFor="area">Area</label>
                                                </span>
                                          </div>
                                      )}/>
                                  </div>
                              </div>
                              <div className="col-5 md:col-5">
                                  <div className="p-fluid">
                                      <Field name="areaAdmin" render={({input,meta}) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText name="areaAdmin" id="areaAdmin" {...input}/>
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
                                      <Field name="projectLeadName" render={({input,meta}) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText name="projectLeadName" id="projectLeadName" {...input}/>
                                                    <label htmlFor="projectLeadName">Project Lead Name</label>
                                                </span>
                                              {getFormErrorMessage(meta)}
                                          </div>
                                      )}/>
                                  </div>
                              </div>
                              <div className="col-5 md:col-5">
                                  <div className="p-fluid">
                                      <Field name="areaAdminWeChatId" render={({input}) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText name="areaAdminWeChatId" id="areaAdminWeChatId" {...input}/>
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
                                      <Field name="projectLeadWeChatId" render={({input}) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText name="projectLeadWeChatId" id="projectLeadWeChatId" {...input}/>
                                                    <label htmlFor="projectLeadWeChatId">Project Lead WeChat ID</label>
                                                </span>
                                          </div>
                                      )}/>
                                  </div>
                              </div>
                              <div className="col-5 md:col-5">
                                  <div className="p-fluid">
                                      <Field name="contact" render={({input}) => (
                                          <div style={field2rem}>
                                                <span className="p-float-label">
                                                    <InputText name="contact"  id="contact" {...input}/>
                                                    <label htmlFor="contact">Contact</label>
                                                </span>
                                          </div>
                                      )}/>
                                  </div>
                              </div>

                          </div>
                          <div className="p-dialog-footer">
                              <div>
                                  <button aria-label="Save" type="submit" className="p-button p-component p-button-primary"><span className="p-button-icon p-c p-button-icon-left
                                               pi pi-save"/><span className="p-button-label p-c">Save</span>
                                      <span role="presentation" className="p-ink" style={{height: "66px", width: "66px", top: "-14.5555px", left: "28.5139px"}}/>
                                  </button>
                                  <Button aria-label="Dismiss" type="button" onClick={() => toggleDialog(false)} className="p-button p-component p-button-secondary">
                                      <span className="p-button-icon p-c p-button-icon-left pi pi-times"/><span className="p-button-label p-c">Dismiss</span>
                                      <span role="presentation" className="p-ink"/>
                                  </Button>
                              </div>
                          </div>
                      </form>
                  )}/>
        </Dialog>
        <AddContactAssetDialog displayAddDialog={dialogAddVisible} onHideAdd={onHideAddDialog} organizationList={organizationList} projectList={getProjectList} setContactAssets={setContactAssets}/>
    </>
    )
};
export default ContactAssets;

