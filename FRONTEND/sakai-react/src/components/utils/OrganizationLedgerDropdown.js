import {MultiSelect} from "primereact/multiselect";
import {TreeSelect} from "primereact/treeselect";
import {Dropdown} from "primereact/dropdown";
import {classNames} from "primereact/utils";
import React, {useEffect} from "react";

let selectedProject = "";

export const OrganizationDropdown = ({getProjectList,getAreaList,onChangeSelectedProject,onChangeSelectedArea,querySelectedProject,
                                  querySelectedArea,queryYear,highLightProject,getArea,setArea}) => {
    return(
        <>
            <span className="p-float-label">
                 <MultiSelect display="chip" options={getProjectList} maxSelectedLabels={2}
                               filter filterBy="label" value={querySelectedProject}
                              onHide={queryYear}
                              onChange={onChangeSelectedProject} optionLabel="label" optionValue="key" optionGroupLabel="label" optionGroupChildren="children"
                              style = {highLightProject !== false ? {paddingBottom:'5px',border:"red solid", marginRight:'10px',width:"180px"} : {paddingBottom:'inherit', marginRight:'10px',width:"200px"}}
                 />
                 <label htmlFor="project">Project</label>
            </span>
            <span className="p-float-label">
                 <TreeSelect style={{overflow:"hidden",textOverflow: "ellipsis",maxWidth:"15em",minWidth:"10em", marginRight:'5px',width:"180px"}}
                             value={querySelectedArea} display="chip" options={getAreaList}
                             onChange={onChangeSelectedArea} onHide={queryYear}
                             filter filterMode="strict"
                             selectionMode="checkbox" />
                  <label htmlFor="area">Area</label>
            </span>

        </>
    );
};

export const findOrganizationById = (projectList,organizationId) => {
    //console.log( projectList.find(organization => organization.key === organizationId));

    return projectList.find(organization => organization.key === organizationId);
};
export const filterAreaListByProjectV2 = (projectList, filter) => {

    // return projectList.filter(parent => filter.includes(parent.label));
    return projectList.filter(parent => {
        return filter === parent.label;
    });
};

//Filter Initial Area List By Selected Project
export const filterAreaListByProject = (projectList, filter) => {

    return projectList.filter(parent => filter.includes(parent.label));
    // return projectList.filter(parent => {
    //     return filter === parent.label;
    // });
};
/*Added to remap selected Areas to reset to default/unselected/unchecked when a project selection was removed
 using object keys of the selected areas
*/

export const remapSelectedAreaFilter = (selectedAreaList,filteredAreaByProj) => {
    let areaResetValueMap = [...filteredAreaByProj.flatMap(e => e.key),
        ...filteredAreaByProj.map(parent => parent.children.flatMap(child => child.key))
            .flat()];
    return Object.keys(selectedAreaList)
        .filter(areas => areaResetValueMap.includes(areas))
        .reduce((obj, key) => {
            obj[key] = selectedAreaList[key];
            return obj },{});
};
/*Added to remap selected Areas to override paramaters if user org relation is available when a project selection was removed
 using object keys of the selected projects
*/

//Create custom area params map each selected project and areas selected
//initial/default selected area params is select all when all is unchecked
export const createCustomAreaParamMap = (areaDropdownEventKeys,areaList,selectedProject) => {
    if (areaList) {
        if (!areaDropdownEventKeys) {
            //console.log("no areas");
            return areaList.reduce((acc, a) => {
                if (selectedProject.includes(a.label)) {
                    let {key, children, ...label} = a;
                    acc.push({...label, children: a.children.map(area => area.label)});
                }
                return acc;
            }, []);
        }
        else {
            //console.log("has areas");
            return areaList.reduce((acc, a) => {
                const ch = a.children && a.children.filter(b => areaDropdownEventKeys.includes(b.key));
                if (ch && ch.length) {
                    //console.log(ch.map(area => area.label));
                    // let {key,children, ...child} = ch;
                    acc.push({label: a.label, children: ch.map(area => area.label)});
                }
                else if (selectedProject.includes(a.label)) {
                    let {key, children, ...child} = a;
                    acc.push({...child, children: a.children.map(area => area.label)});
                }
                return acc;
            }, []);
        }
    }
};

//Create custom area params map each selected project and areas selected
//initial/default selected area params is select all when all is unchecked
//@Pagination Version of Datatables
export const createCustomAreaParamMapPagination = (areaDropdownEventKeys,areaList,selectedProject) => {
    if (areaList) {
        if (!areaDropdownEventKeys) {
            //console.log("no areas");
            return areaList.reduce((acc, a) => {
                if (selectedProject.includes(a.label)) {
                    let {key, children, ...label} = a;
                    acc.push(a.children.map(area => area.label));
                }
                //console.log(acc.flat());
                //return acc.flat();
                return [];
            }, []);
        }
        else {
            //console.log("has areas");
            return areaList.reduce((acc, a) => {
                const ch = a.children && a.children.filter(b => areaDropdownEventKeys.includes(b.key));
               // console.log(selectedProject);
               // console.log(a);
                if (ch && ch.length) {
                    //console.log(ch.map(area => area.label));
                    // let {key,children, ...child} = ch;
                    acc.push(ch.map(area => area.label));
                    //console.log(acc);
                }
                else if (selectedProject.includes(a.label)) {
                    let {key, children, ...child} = a;
                    acc.push(a.children.map(area => area.label));
                    //console.log(acc);
                }
                return acc.flat();
            }, []);
        }
    }
};

export const SingleProjectOrganizationDropdown = ({getProjectList,onChangeSelectedProject,selectedProject,
                                               highLightProject}) => {
    return(
        <>
            <Dropdown name="project" options={getProjectList} value={selectedProject} onChange={onChangeSelectedProject}
                      optionValue="label" optionLabel="label"
                      style = {highLightProject !== false ? {width: "100%",paddingBottom:'5px',border:"red solid", marginRight:'10px'} : {width: "100%", marginRight:'10px'}}
                      showClear filter filterBy="label">
            </Dropdown>
        </>
        )
}


export const FormikSingleProjectOrganizationDropdown = ({options,formik,classNames,isFormFieldValid,setAreaList, AreaList, mode}) => {
    useEffect(() => {
        if(mode === 'Update'){
            // let area = filterAreaListByProjectV2(options, formik.values.project)[0].children;
            // setAreaList(area);
            // formik.setFieldValue("project", formik.values.project);
        }
    }, [])
    return (
    <span className="p-float-label">
        <Dropdown name="project" options={options} value={formik.values.project}
                  style={{ width: '100%' }}
                  optionValue="key" optionLabel="label" optionGroupLabel="label" optionGroupChildren="children"
                  showClear filter filterBy="label"
                  onChange={e => {
                      // ------> BENKURAMAX CODE
                       let filter = e.target.value;
                        //selectedProject = e.target.value;

                      if(filter) {

                        let selArea_ = AreaList.filter(x => x.key.split(".")[0] === filter);

                        setAreaList(selArea_);

                        selectedProject = selArea_[0].label.split(">")[0];

                      }

                       formik.setFieldValue("project", e.value);
                       formik.setFieldValue("area", null);
                       formik.setFieldValue("costCenter", "");
                       formik.setFieldValue("wbs", "");
                        // ------<
                  }}
                  className={classNames({ 'p-invalid': isFormFieldValid('project') })}>
        </Dropdown>
    <label htmlFor="project" className={classNames({ 'p-error': isFormFieldValid('project') })}>Project<span style={{ color: 'red' }}>*</span></label>
    </span>
    )
};

// backup old
// export const FormikSingleProjectOrganizationDropdown = ({options,formik,classNames,isFormFieldValid,setAreaList, mode}) => {
//     useEffect(() => {
//         if(mode === 'Update'){
//             let area = filterAreaListByProjectV2(options, formik.values.project)[0].children;
//             setAreaList(area);
//             formik.setFieldValue("project", formik.values.project);
//         }
//     }, [])
//     return (
//     <span className="p-float-label">
//         <Dropdown name="project" options={options} value={formik.values.project}
//                   style={{ width: '100%' }}
//                   optionValue="label" optionLabel="label"
//                   showClear filter filterBy="label"
//                   onChange={e => {
//                       let filter = e.target.value;
//                       if(filter) {
//                           let area = filterAreaListByProjectV2(options, filter)[0].children;
//                           setAreaList(area);
//                       }
//                       formik.setFieldValue("project", e.value);
//                       formik.setFieldValue("area", null);
//                   }}
//                   className={classNames({ 'p-invalid': isFormFieldValid('project') })}>
//         </Dropdown>
//     <label htmlFor="project" className={classNames({ 'p-error': isFormFieldValid('project') })}>Project<span style={{ color: 'red' }}>*</span></label>
//     </span>
//     )
// };

export const FormikSingleAreaOrganizationDropdown =
({options,formik,classNames,isFormFieldValid, ledgerOrganizationData, costCenterListSet, wbsListSet, name}) => {
    //console.log(formik.values)
    return (
        <span className="p-float-label">
            <Dropdown name={name} options={options} value={formik.values.area}
                      style={{ width: '100%' }}
                      optionValue="label" optionLabel="label" optionGroupLabel="label" optionGroupChildren="children"
                      showClear filter filterBy="label"
                      onChange={e => {

                        //alert(selectedProject);
                        formik.setFieldValue(name, e.value);
                        //formik.setFieldValue("costCenter", filterLO && filterLO[0].cost_center);
                        //formik.setFieldValue("wbs", filterLO && filterLO[0].wbs);

                        if(ledgerOrganizationData){
                            //
                        let filterLO = ledgerOrganizationData.filter(x => x.project === selectedProject && x.area === e.value);


                        let costC_ = [];
                        let wbs_ = [];

                          filterLO.map(
                              x => {
                                  let objCost = { label:x.cost_center};
                                  let objWbs = { label:x.wbs};

                                  costC_.push(objCost);
                                  wbs_.push(objWbs);
                              }
                        );
                        //
                        // const uniqCostC_ = costC_.filter((obj, index) => {
                        //     return index === costC_.findIndex(o => obj.label === o.label);
                        //   });
                        // //
                        // const uniqWbs_ = wbs_.filter((obj, index) => {
                        //     return index === wbs_.findIndex(o => obj.label === o.label);
                        //   });
                        //
                        costCenterListSet(costC_ );
                        wbsListSet(wbs_);

                        }

                      }}
                      className={classNames({ 'p-invalid': isFormFieldValid(name) })}>
            </Dropdown>
        <label htmlFor={name} className={classNames({ 'p-error': isFormFieldValid(name) })}>Area<span style={{ color: 'red' }}>*</span></label>
        </span>
    )
};

// backup old
// export const FormikSingleAreaOrganizationDropdown = ({options,formik,classNames,isFormFieldValid, name}) => {
//     //console.log(formik.values)
//     return (
//         <span className="p-float-label">
//             <Dropdown name={name} options={options} value={formik.values.area}
//                       style={{ width: '100%' }}
//                       optionValue="label" optionLabel="label"
//                       showClear filter filterBy="label"
//                       onChange={e => {
//                           formik.setFieldValue(name, e.value);
//                       }}
//                       className={classNames({ 'p-invalid': isFormFieldValid(name) })}>
//             </Dropdown>
//         <label htmlFor={name} className={classNames({ 'p-error': isFormFieldValid(name) })}>Area<span style={{ color: 'red' }}>*</span></label>
//         </span>
//     )
// };

export const FormikSingleAreaOrganizationDropdown2 = ({options,formik,classNames,isFormFieldValid, name, onChange, disabled}) => {
    return (
        <span className="p-float-label">
            <Dropdown name={name} options={options} value={formik.values[name.split(".")[0]][name.split(".")[1]]}
                      style={{ width: '100%' }}
                      optionValue="label" optionLabel="label"
                      showClear filter filterBy="label"
                      onChange={e => {
                            onChange(e)
                      }}
                      className={classNames({ 'p-invalid': isFormFieldValid(name) })}
                      disabled={disabled}>
            </Dropdown>
        <label htmlFor={name} className={classNames({ 'p-error': isFormFieldValid(name) })}>Area<span style={{ color: 'red' }}>*</span></label>
        </span>
    )
};


export const SingleAreaOrganizationDropdown = ({getAreaList,onChangeSelectedArea,selectedArea,highlightArea}) => {
    return(
        <>
            <Dropdown name="area" options={getAreaList} value={selectedArea} onChange={onChangeSelectedArea}
                      optionValue="label" optionLabel="label"
                      style = {highlightArea !== false ? {width: "100%",paddingBottom:'5px',border:"red solid", marginRight:'10px'} : {width: "100%", marginRight:'10px'}}
                      showClear filter filterBy="label">
            </Dropdown>
        </>
    )
};

export const TESingleProjectOrganizationDropdown = ({getProjectList,getProject, setAreaList,setProject, setArea, AreaList, setCostCenter, setWBS, formType}) => {
    return(
        <>
            <Dropdown name="project" options={getProjectList} value={getProject}
                      optionValue="key" optionLabel="label" optionGroupLabel="label" optionGroupChildren="children"
                      showClear filter filterBy="label"
                      onChange={e => {
                          let filter = e.target.value;
                          if(filter) {
                              let selArea_ = AreaList.filter(x => x.key.split(".")[0] === filter);
                              setAreaList(selArea_);
                              selectedProject = selArea_[0].label.split(">")[0];
                          }
                          setProject(e.value);
                          setArea(null);

                          if(formType == 'addTE'){
                              setCostCenter("");
                              setWBS("");
                          }


                      }}
                      style = {{width: "100%"}}
                      >
            </Dropdown>
        </>
    )
}

export const TESingleProjectOrganizationDropdownV2 = ({getProjectList, getProject, onChange, setAreaList, AreaList}) => {
    return(
        <>
            <Dropdown name="project" options={getProjectList} value={getProject}
                      //optionValue="key" optionLabel="label" 
                      optionGroupLabel="label" 
                      optionGroupChildren="children"
                      showClear filter filterBy="label"
                      onChange={e => {
                          let filter = e.target.value.key;
                          if(filter) {
                              let selArea_ = AreaList.filter(x => x.key.split(".")[0] === filter);
                              setAreaList(selArea_);
                              selectedProject = selArea_[0].label.split(">")[0];
                          }
                          onChange(e.value);
                      }}
                      style = {{width: "100%"}}
                      >
            </Dropdown>
        </>
    )
}
export const TESingleAreaOrganizationDropdown = ({getAreaList,getArea,setArea, setCostCenter, setWBS, ledgerOrganizationData, formType, costCenterListSet, wbsListSet}) => {
    return(
        <>
            <Dropdown name="area" options={getAreaList} value={getArea}
                      optionValue="label" optionLabel="label" optionGroupLabel="label" optionGroupChildren="children"
                      showClear filter filterBy="label"
                      style = {{width: "100%"}}
                      onChange={e=>{
                          let filterLO = ledgerOrganizationData.filter(x => x.project === selectedProject && x.area === e.value);


                          setArea(e.value);

                          if(formType == 'addTE'){

                              let costC_ = [];
                              let wbs_ = [];

                              filterLO.map(
                                  x => {
                                      let objCost = { label:x.cost_center};
                                      let objWbs = { label:x.wbs};

                                      costC_.push(objCost);
                                      wbs_.push(objWbs);
                                  }
                              );

                              costCenterListSet(costC_);
                              wbsListSet(wbs_);
                          }

                      }}
                      >
            </Dropdown>
        </>
    )
};
export const TESingleAreaOrganizationDropdownV2 = ({getAreaList,getArea, project, onChange, ledgerOrganizationData, formType, costCenterListSet, wbsListSet}) => {
    return(
        <>
            <Dropdown name="area" options={getAreaList} value={getArea}
                      //optionValue="label" optionLabel="label" 
                      optionGroupLabel="label" optionGroupChildren="children"
                      showClear filter filterBy="label"
                      style = {{width: "100%"}}
                      onChange={e=>{
                          let filterLO = ledgerOrganizationData.filter(x => x.project === project && x.area === e.value.label);
                          onChange(e.value);

                          if(formType == 'addTE'){
                              let costC_ = [];
                              let wbs_ = [];

                              filterLO.map(
                                  x => {
                                      let objCost = { label:x.cost_center};
                                      let objWbs = { label:x.wbs};

                                      costC_.push(objCost);
                                      wbs_.push(objWbs);
                                  }
                              );

                              costCenterListSet(costC_);
                              wbsListSet(wbs_);
                          }
                      }}
                      >
            </Dropdown>
        </>
    )
};
export default OrganizationDropdown;
