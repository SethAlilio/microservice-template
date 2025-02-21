import React, { useState, useEffect, useRef } from 'react';
import { Tree } from 'primereact/tree';

//import { NodeService } from '../service/NodeService';

import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {Dropdown} from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import BaseService from "../service/BaseService";
import useOrganizationTree, {useAddOrganization, useOrgTree, useUpdateOrganization} from "../stores/OrganizationStore";
import OrganizationService from "../service/Inventory/AccessManagement/OrganizationService";

const Organizations = () => {
/** DECLARATION */
    const [treeNodes, setTreeNodes] = useState([]);
    const [organizatioRes, setOrganizationRes] = useState([]);
    const [orgSelRes, setOrgSelRes] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [accSel, setAccSel] = useState([]);

    const [dialogOrg, setDialogOrg] = useState(false);
    const [selectedParent, setSelectedParent] = useState({});
    const [orgParentList, setOrgParentList] = useState([]);
    const toast = useRef(null);
    const [actionType, setActionType] = useState("none");
/** INITIALIZATION */

/** ON LOADING */
useEffect(() => {
    // --------------------
    onLoading();
    // --------------------

}, []);
/** FUNCTIONS */
const onLoading = () => {
    BaseService.HttpGet("/system/menu/showOrganizationTree").then(
        (response) => {
            setTreeNodes(response.data["orgTree"]);
            setOrganizationRes(response.data["queryOrig"]);
            setAccounts(response.data["queryAcc"]);
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
               // console.log('error'); console.log(_content);
        }
    );
}

const onSelect = (event) => {

    const re = organizatioRes.filter(x=> x.ORGANIZATION_ID == event.node.key );
    setOrgSelRes(re[0]);
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

const closeDialog = () =>{
    setDialogOrg(false);
    setOrgSelRes({});
}

//const addOrganization = useAddOrganization();
const addOrganization = useOrganizationTree((state)=> state.addOrganizationToTree);
let newOrg = {};
const saveNewOrg = () => {
    const objectV = {name:'saveNewOrg', object: orgSelRes};
    OrganizationService.saveNewOrganization(objectV).then((response) => {
        if(response.data.feedback === "1"){
            onLoading();
            newOrg ={parentKey: response.data?.parentId,
                org: {key: response.data?.key,label:response.data?.label,
                    children:null}};
            //console.log(newOrg);
            toast.current.show({severity:'success', summary: 'Organization Page', detail:'Save Success', life: 3000});
            closeDialog();
        }
    }).catch((error) => {
        const _content =
            (error.response && error.response.data) || error.message || error.toString();
       // console.log('error'); console.log(_content);
    });
    //console.log(newOrg);
    addOrganization(newOrg);
        // --------------------
      /*  BaseService.HttpPost("/system/menu/saveNewOrg", objectV).then(
            (response) => {
                if(response.data.feedback === "1"){
                    onLoading();
                    newOrg ={parentKey: response.data?.parentId,
                        org: {key: response.data?.key,label:response.data?.label,
                            children:null}};
                    /!*addOrganization({parentKey: response.data?.parentId,
                        org: {key: response.data?.key,label:response.data?.label,
                        children:null}});*!/
                    toast.current.show({severity:'success', summary: 'Organization Page', detail:'Save Success', life: 3000});
                    closeDialog();
                }else{
                    toast.current.show({severity:'error', summary: 'Organization Page', detail:'Asterisk fields is required', life: 5000});
                }
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                    console.log('error'); console.log(_content);
            }
        );*/

        // --------------------
}

const loadParentOrg = () =>{
    var parent = {};
    setOrgParentList(
        organizatioRes.map(item => {
            return {...parent, name: item.FULL_NAME, id: item.ORGANIZATION_ID}
        })
    );
}

const updateOrg = () => {
    let updateOrganization = useUpdateOrganization();

    const objectV = {name:'updateOrg', object: orgSelRes };
     // --------------------
     BaseService.HttpPost("/system/menu/updateOrg", objectV).then(
        (response) => {
            if(response.data.feedback === "1"){
                onLoading();
                updateOrganization({parentKey: response.data?.parentId,
                    org: {key: response.data?.key,label:response.data?.label,
                        children:null}, oldParentKey: orgSelRes.key});
                toast.current.show({severity:'success', summary: 'Organization Page', detail:'Update Success', life: 3000});
                closeDialog();
            }else{
                toast.current.show({severity:'error', summary: 'Organization Page', detail:'Asterisk fields is required', life: 5000});
            }
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                //console.log('error'); console.log(_content);
        }
    );
    // --------------------
}
/** TEMPLATES */
const basicDialogFooter =
(
        <div>
            <Button type="button" label="Save" icon="pi pi-save" className="p-button-primary"
                onClick={
                    ()=>{

                        if(actionType === "add"){
                            saveNewOrg();
                        } else {
                            updateOrg();
                        }


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
/** MAIN CONTENT */
    return (
        <div className="grid">
            <Toast ref={toast} position="bottom-right" />
            <div className="col-4">
                <div className="card">
                    <h5>Organization Tree</h5>
                    <ScrollPanel style={{ width: '100%', height: '550px' }}>
                        <Tree value={treeNodes} onSelect={onSelect} selectionMode="single"/>
                    </ScrollPanel>

                </div>
            </div>
            <div className="col-8">

                <TabView>
                    <TabPanel header="Organization Details">
                    <div className="template">
                        <Button className="google p-0" aria-label="Google"
                            onClick={
                                e=> {
                                    setDialogOrg(true);
                                    loadParentOrg();
                                    setActionType("add");

                                    setOrgSelRes({ ...orgSelRes, ORGANIZATION_ID: selectedParent.id })

                                    //alert(JSON.stringify(selectedParent.id));
                                }
                            }
                        >
                            <i className="pi pi-globe px-2"></i>
                            <span className="px-3">Add Organization</span>
                        </Button>

                    </div>
                    <br></br>
                        <div className="card p-fluid">

                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Organization</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.FULL_NAME || ''} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Parent Org</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={parentOrgTemplate(orgSelRes)} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Address</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.ADDRESS || ''} disabled/>
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Remarks</label>
                                <div className="col-12 md:col-9">
                                    <InputText id="email3" type="text" value={orgSelRes.REMARK || ''} disabled/>
                                </div>
                            </div>
                        </div>

                    <div className="template">
                        <Button className="amazon p-0" aria-label="Amazon"
                            onClick={e=>{

                                setDialogOrg(true);
                                loadParentOrg();
                                var parentid = 0;

                                if (typeof (orgSelRes.PARENT_ID) !== 'undefined' && orgSelRes.PARENT_ID != null) {
                                    parentid = orgSelRes.PARENT_ID;
                                }

                                var sel = orgParentList.filter(x => x.id == parentid);
                                setSelectedParent(sel[0]);
                                setActionType("edit");

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
            <Dialog header="Organization" visible={dialogOrg} style={{ width: '50vw' }} modal footer={basicDialogFooter}
                onHide={() => closeDialog()} >
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
                                setOrgSelRes({ ...orgSelRes, ORGANIZATION_ID: e.value.id })
                            }}
                                optionLabel="name">
                        </Dropdown>
                        </div>
                    </div>

                    <div className="field grid">
                        <label htmlFor="name3" className="col-12 mb-3 md:col-3 md:mb-0">Address</label>
                        <div className="col-12 md:col-9">
                            <InputText id="email3" type="text" value={orgSelRes.ADDRESS || ''}
                                onChange={e => setOrgSelRes({ ...orgSelRes, ADDRESS: e.target.value.toUpperCase() })} />
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
        </div>
    );
}
/* eslint eqeqeq: 0 */
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Organizations, comparisonFn);
