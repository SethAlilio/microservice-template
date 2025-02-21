import React, { useState, useEffect, useRef } from 'react';
import { Tree } from 'primereact/tree';

//import { NodeService } from '../service/NodeService';
import BaseService from '../../service/BaseService';

import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

import OrganizationService from "../../service/AccessManagement/OrganizationService";
import {useAddOrganization, useRemoveOrganization, useUpdateOrganization} from "../../stores/OrganizationStore";
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { useUserDetails } from '../../stores/userStore';

const Organizations = () => {
/** DECLARATION */
    const userInfo = useUserDetails();
    const [treeNodes, setTreeNodes] = useState([]);
    const [organizatioRes, setOrganizationRes] = useState([]);
    const [organizatioV2, setOrganizationV2] = useState([]);
    const [orgSelRes, setOrgSelRes] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [accSel, setAccSel] = useState([]);

    const [dialogOrg, setDialogOrg] = useState(false);
    const [selectedParent, setSelectedParent] = useState({});
    const [orgParentList, setOrgParentList] = useState([]);
    const toast = useRef(null);
    const departDDL = useRef();

    const regionDDLRef = useRef(null);
    
    const [actionType, setActionType] = useState("none");

    const [selCategoryType, selCategoryTypeSet] = useState(null);
    const [setDepartmentControl, setDepartmentControlSet] = useState(true);
    const [setRegionControl, setRegionControlSet] = useState(true);
    const [setAreaControl, setAreaControlSet] = useState(true);


    const [optionDepartmentList, optionDepartmentListSet] = useState([]);
    const [optionAreaList, optionAreaListSet] = useState([]);
    const [optionRegionList, optionRegionListSet] = useState([]);

    const [selDepartmentDDL, selDepartmentDDLSet] = useState(null);
    const [selRegionDDL, selRegionDDLSet] = useState(null);
    const [selAreaDDL, selAreaDDLSet] = useState(null);
/** INITIALIZATION */
const optionCategoryList = [
    // {label: 'Department', code: '1'},
    {label: 'Department', code: '2'},
    {label: 'Region', code: '3'},
    {label: 'Area', code: '4'},
    {label: 'Project', code: '4'},
];



/** ON LOADING */
useEffect(() => {
    // --------------------
    onLoading();
    // --------------------
    //alert('load');
    selCategoryTypeSet(optionCategoryList[0]);
}, []);

/** FUNCTIONS */
const onLoading = () => {
    BaseService.HttpGet(`/system/menu/showOrganizationTree?companyId=${userInfo.COMPANY_ID}`).then(
        (response) => {
            setTreeNodes(response.data["orgTree"]);
            setOrganizationRes(response.data["queryOrig"]);
            //setOrganizationV2(response.data["queryOrigV2"]);
            setAccounts(response.data["queryAcc"]);

            //console.log(response.data["queryOrig"]);

        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                console.log('error'); console.log(_content);
        }
    );

}

const onDepartmentInit = () => {
    //
    let filterDept_ = treeNodes.filter(xo => xo.key == '1');
    let regionList_ = filterDept_[0].children;

    let regList_ = [];

    regionList_.map(xo => {
        let objxo_ = {label: xo.label, code: xo.key}
        regList_.push(objxo_);
    });

    optionRegionListSet(regList_);
}

const onSelect = (event) => {

    const re = organizatioRes.filter(x=> x.ORGANIZATION_ID == event.node.key );
    setOrgSelRes(re[0]);
    //console.log(re[0]);
    const reAcc = accounts.filter(y=> y.orgid == event.node.key);
    setAccSel(reAcc);

}

const parentOrgTemplate = (param) => {

    var res1 = param.PARENT_ID || '0';
    var res2 = organizatioRes.filter(x=> x.ORGANIZATION_ID == res1);
    var res3 ;
    try {
    res3 =res2[0].FULL_NAME;
    } catch (e) {
        // console.log(e.message);
        res3 = "NO PARENT";
    }

    return res3;
}

const orgTypeTemplate = (param) => {

    var orgTypeName = optionCategoryList[param?.type_ - 1];
    console.log();

    return orgTypeName?.label;
}

const closeDialog = () =>{
    setDialogOrg(false);

     optionDepartmentListSet([]);
    // optionProjectListSet([]);
     optionAreaListSet([]);
     optionRegionListSet([]);

    formik.resetForm();
    formik.setErrors({});


    //setOrgSelRes({});
}
const addOrganization = useAddOrganization();
const saveNewOrg = () => {
    OrganizationService.saveNewOrganization(orgSelRes).then((response) => {
        if(response.data.feedback === "1"){
            onLoading();
            addOrganization({parentKey: response.data?.parentId.toString(),
                org: {key: response.data?.key.toString(),label:response.data?.label,
                    children:null}});
            toast.current.show({severity:'success', summary: 'Organization Page', detail:'Save Success', life: 3000});
            closeDialog();
        }
    }).catch((error) => {
        const _content =
            (error.response && error.response.data) || error.message || error.toString();
        toast.current.show({severity:'error', summary: 'Organization Page', detail:`Save Failed ${_content}`, life: 5000});
    });
}

const loadParentOrg = () =>{
    let parent = {};
    setOrgParentList(
        organizatioV2.map(item => {
            return {...parent, name: item.FULL_NAME, id: item.ORGANIZATION_ID}
        })
    );
}
const updateOrganization = useUpdateOrganization();

const updateOrg = () => {

    OrganizationService.updateOrganization(orgSelRes).then((response) => {
        // if(response.data.feedback === '1') {
        //     onLoading();
        //     updateOrganization({parentKey: response.data?.parentId.toString(),
        //         org: {key: response.data?.key.toString(),label:response.data?.label,
        //             children:null}});
        //     toast.current.show({severity: 'success', summary: 'Organization Page', detail: 'Update Success', life: 3000});
        //     closeDialog();
        // }
    }).catch((error) => {
        const _content =
            (error.response && error.response.data) || error.message || error.toString();
        toast.current.show({severity:'error', summary: 'Organization Page', detail:`Update Failed ${_content}`, life: 5000});
    })

}

const formik = useFormik({
    initialValues:{
        name: '',
        department: '1',
        region: '',
        orgType: '2',
        orgOldId: '',
        costCenter: '',
        wbs:'',
        area:''
    },
    validate: (data) =>{
        let errors = {};

        if(!data.name){
            errors.name = "name is required";
        }

        if(data.orgType == 2){
            if(!data.department){
                errors.department = "company is required";
            }

        }
        if(data.orgType == 3){
            if(!data.department){
                errors.department = "company is required";
            }
            if(!data.region){
                errors.region = "region is required";
            }

        }
        if(data.orgType == 4){
            if(!data.department){
                errors.department = "company is required";
            }
            if(!data.region){
                errors.region = "region is required";
            }
            if(!data.area){
                errors.area = "area is required";
            }
        }

        return errors;
    },
    onSubmit: (data) =>{
        //alert(JSON.stringify(data));

        if (actionType == 'add') {

            OrganizationService.saveNewOrganization(data).then((response) => {
                closeDialog();
                onLoading();

            }).catch((error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                console.log(_content);
            });



        } else {

            console.log(data);

            data.orgOldId = orgSelRes.ORGANIZATION_ID;
            OrganizationService.updateOrganization(data).then((response) => {
                //
                if(response.data.status == 200){
                    closeDialog();
                    onLoading();
                } else {
                    alert('error encountered');
                }

                //
            }).catch((error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                console.log(_content);
            })
        }



    }
});

const onChangeCategoryDDL = (e) => {
    //
    onChangeCategoryDDLV2(e.value);
    //
}

const onChangeCategoryDDLV2 = (param) => {
    
    selCategoryTypeSet(param);


    formik.setFieldValue('orgType', param.code);
    //
    let depList_ = [];

    treeNodes.map(xo => {
        let objxo_ = { label: xo.label, code: xo.key }
        depList_.push(objxo_);
    });

    //optionDepartmentListSet(depList_);
    //debugger;
    switch (param.code) {
        case '1':
            setDepartmentControlSet(true);
            setRegionControlSet(true);
            setAreaControlSet(true);

            optionDepartmentListSet([]);
            optionRegionListSet([]);
            optionAreaListSet([]);
            break;
        case '2':
            //setDepartmentControlSet(false);
            setRegionControlSet(true);
            setAreaControlSet(true);

            selRegionDDLSet(null);
            selAreaDDLSet(null);

            break;
        case '3':
            //setDepartmentControlSet(false);
            setRegionControlSet(false);
            setAreaControlSet(true);

            selRegionDDLSet(null);
            selAreaDDLSet(null);
           
            onDepartmentInit();
            break;
        case '4':
            //setDepartmentControlSet(false);
            setRegionControlSet(false);
            setAreaControlSet(false);

            selRegionDDLSet(null);
            selAreaDDLSet(null);

            onDepartmentInit();

            break;
    }
}

/** TEMPLATES */
const basicDialogFooter =
(
        <div>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                onClick={
                    ()=>{

                        // if(actionType === "add"){
                        //     //saveNewOrg();

                        // } else {
                        //     //updateOrg();

                        // }

                        formik.handleSubmit();

                    }
                }
            />

            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                onClick={()=> {
                    closeDialog();
                }}
            />
        </div>
);

const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
const getErrorMessage = (param) => isFormFieldValid(param) && formik.errors[param];

/** MAIN CONTENT */
    return (
        <div className="grid">
            <Toast ref={toast} position="bottom-right" />
            <div className="field col-12 md:col-4">
                <div className="card">
                    <h5>Organization Tree</h5>
                    <ScrollPanel style={{ width: '100%', height: '550px' }}>
                        <Tree value={treeNodes} onSelect={onSelect} selectionMode="single"/>
                    </ScrollPanel>

                </div>
            </div>
            <div className="field col-12 md:col-8">

                <TabView >
                    <TabPanel header="Organization Details" >
                    <div className="template m-3">
                        <Button className="google p-0" aria-label="Google"
                            onClick={
                                e=> {
                                    setDialogOrg(true);
                                    //loadParentOrg();
                                    setActionType("add");

                                    //setOrgSelRes({ ...orgSelRes, ORGANIZATION_ID: selectedParent.id })
                                }
                            }
                        >
                            <i className="pi pi-globe px-2"></i>
                            <span className="px-3">Add Organization</span>
                        </Button>

                    </div>
                    <br></br>
                        <div className="card p-fluid m-3">

                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Organization ID</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.ORGANIZATION_ID || ''} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Organization</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.FULL_NAME || ''} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Organization Type</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgTypeTemplate(orgSelRes)} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Cost Center</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.cost_center_ || ''} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">WBS</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.wbs_ || ''} disabled/>
                                </div>
                            </div>
                        </div>

                    <div className="template m-3">
                        <Button className="amazon p-0" aria-label="Amazon"
                            onClick={e=>{

                                //debugger;
                                setDialogOrg(true);
                                //
                                formik.setFieldValue("name", orgSelRes.FULL_NAME);
                                formik.setFieldValue("costCenter", orgSelRes.cost_center_);
                                formik.setFieldValue("wbs", orgSelRes.wbs_);
                                var selCateg_ =  optionCategoryList[orgSelRes.type_ - 2];

                                //selCategoryTypeSet(selCateg_);
                                onChangeCategoryDDLV2(selCateg_);

                                //
                                setActionType("edit");

                                //#region old codes
                                // setDialogOrg(true);
                                // loadParentOrg();
                                // var parentid = 0;

                                // if (typeof (orgSelRes.PARENT_ID) !== 'undefined' && orgSelRes.PARENT_ID != null) {
                                //     parentid = orgSelRes.PARENT_ID;
                                // }

                                // var sel = orgParentList.filter(x => x.id == parentid);
                                // setSelectedParent(sel[0]);
                                // setActionType("edit");
                                //#endregion
                            }}
                        >
                            <i className="pi pi-pencil px-2"></i>
                            <span className="px-3">Update </span>
                        </Button>


                    </div>
                    </TabPanel>

                    <TabPanel header="Organization User">

                    <DataTable value={accSel} paginator className="p-datatable-gridlines" showGridlines rows={10}
                        dataKey="id"  emptyMessage="No Accounts found."
                          >

                        <Column field="ACCOUNT_NAME" header="Account"  style={{ minWidth: '12rem' }} />
                        <Column field="FULL_NAME" header="Name"  style={{ minWidth: '12rem' }} />
                        <Column field="role" header="Role" style={{ minWidth: '12rem' }} />
                        <Column field="CREATE_DATE_F" header="Create Date"  style={{ minWidth: '12rem' }} />

                    </DataTable>

                    </TabPanel>

                </TabView>

            </div>
            {/** DIALOG SECTION */}

            {/** OLD CODES */}
            <Dialog header="Organization" visible={null} style={{ width: '50vw' }} modal footer={basicDialogFooter}
                onHide={null} >
                <div className="card p-fluid">

                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Organization
                        &nbsp;
                        <span style={{color:'red'}}>*</span>
                        </label>
                        <div className="col-12 md:col-9">
                            <InputText id="email3" type="text" value={orgSelRes.FULL_NAME || ''}
                                onChange={e => setOrgSelRes({ ...orgSelRes, FULL_NAME: e.target.value.toUpperCase() })} />
                        </div>
                    </div>

                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Parent Org
                        &nbsp;
                        <span style={{color:'red'}}>*</span>
                        </label>
                        <div className="col-12 md:col-9">
                        <Dropdown id="dropdown" options={orgParentList} value={selectedParent} style={{ width: '100%' }}
                            onChange={e=>{
                                setSelectedParent(e.value);
                                setOrgSelRes({ ...orgSelRes, PARENT_ID: e.value.id })
                            }}
                                optionLabel="name">
                        </Dropdown>
                        </div>
                    </div>

                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Region</label>
                        <div className="col-12 md:col-9">
                            <InputText id="email3" type="text" value={orgSelRes.REGION || ''}
                                onChange={e => setOrgSelRes({ ...orgSelRes, REGION: e.target.value.toUpperCase() })} />
                        </div>
                    </div>

                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Remarks</label>
                        <div className="col-12 md:col-9">
                            <InputText id="email3" type="text" value={orgSelRes.REMARK || ''}
                                onChange={e => setOrgSelRes({ ...orgSelRes, REMARK: e.target.value.toUpperCase() })} />
                        </div>
                    </div>

                </div>
            </Dialog>

            <Dialog header="Organization" visible={dialogOrg} style={{ width: '40vw' }} modal footer={basicDialogFooter}
                onHide={() => closeDialog()} >
                <br></br>
                <div className="card p-fluid">
                    <div className="grid">

                            <div className="col-3 ">Name:</div>
                            <div className="col-9">
                                <InputText  value={formik.values.name} style={{ width: '100%' }}
                                    name='name' onChange={formik.handleChange}
                                    placeholder={getErrorMessage('name')}
                                    className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                                />
                            </div>

                            <div className="col-3 ">Select Hierarchy:</div>
                            <div className="col-9">
                                <Dropdown id="dropdown" options={optionCategoryList} value={selCategoryType} style={{ width: '100%' }} optionLabel="label"
                                    onChange={(e) => {onChangeCategoryDDL(e)} }
                                />
                            </div>

                            <div className="col-3 hidden">Select Company:</div>
                            {/* <div className="col-9 hidden">
                                <Dropdown id="dropdown" options={optionDepartmentList} value={selDepartmentDDL} style={{ width: '100%' }} optionLabel="label"
                                    onChange={(e) => {
                                        selDepartmentDDLSet(e.value);
                                        //

                                        //formik.setFieldValue('department', e.value.code);

                                        // let filterDept_ = treeNodes.filter(xo => xo.key == e.value.code);
                                        // let regionList_ = filterDept_[0].children;

                                        // let regList_ = [];

                                        // regionList_.map(xo => {
                                        //     let objxo_ = {label: xo.label, code: xo.key}
                                        //     regList_.push(objxo_);
                                        // });

                                        // optionRegionListSet(regList_);
                                        //
                                    }}
                                    disabled={setDepartmentControl}

                                    name='department'
                                    placeholder={getErrorMessage('department')}
                                    className={classNames({ 'p-invalid': isFormFieldValid('department') })}
                                />
                            </div> */}

                            <div className="col-3 ">Select Region:</div>
                            <div className="col-9">
                                <Dropdown id="dropdown" options={optionRegionList} value={selRegionDDL} style={{ width: '100%' }} optionLabel="label"
                                    ref={regionDDLRef}
                                    onChange={e => {
                                        selRegionDDLSet(e.value);
                                        //alert(JSON.stringify(e.value));
                                        //
                                        formik.setFieldValue('region', e.value.code);
                                        //
                                        let filterDept_ = treeNodes.filter(xo => xo.key == '1');
                                        let regionList_ = filterDept_[0].children;
                                        //
                                        let filterArea_ = regionList_.filter(xx => xx.key == e.value.code);
                                        let areaListAss = filterArea_[0].children;

                                        let areaList_ = [];

                                        areaListAss.map(xo => {
                                            let objxo_ = {label: xo.label, code: xo.key}
                                            areaList_.push(objxo_);
                                        });
                                        //
                                        optionAreaListSet(areaList_);
                                    }}
                                    disabled={setRegionControl}

                                    name='region'
                                    placeholder={getErrorMessage('region')}
                                    className={classNames({ 'p-invalid': isFormFieldValid('region') })}
                                />
                            </div>

                            <div className="col-3 ">Select Area:</div>
                            <div className="col-9">
                                <Dropdown id="dropdown" options={optionAreaList} value={selAreaDDL} style={{ width: '100%' }} optionLabel="label"
                                    onChange={e=> {
                                        
                                        selAreaDDLSet(e.value);

                                        formik.setFieldValue('area', e.value.code);
                                    }}
                                    disabled={setAreaControl}

                                    name='area'
                                    placeholder={getErrorMessage('area')}
                                    className={classNames({ 'p-invalid': isFormFieldValid('area') })}
                                />
                            </div>

                            <div className="col-3 ">Cost Center:</div>
                            <div className="col-9">
                                <InputText  value={formik.values.costCenter} style={{ width: '100%' }}
                                    name='costCenter' onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-3 ">WBS:</div>
                            <div className="col-9">
                                <InputText  value={formik.values.wbs} style={{ width: '100%' }}
                                    name='wbs' onChange={formik.handleChange}
                                />
                            </div>
                    </div>
                </div>

            </Dialog>
        </div>
    );
}
/* eslint eqeqeq: 0 */
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Organizations, comparisonFn);
