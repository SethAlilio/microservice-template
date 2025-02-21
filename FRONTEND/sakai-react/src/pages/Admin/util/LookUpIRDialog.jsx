import React, {useEffect, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {useUserDetails} from "../../../../stores/userStore";
import TeTaskService from "../../../../service/Inventory/TELedgerService/TeTaskService";
import {Button} from "primereact/button";
import {Ripple} from "primereact/ripple";
import {classNames} from "primereact/utils";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toast} from "primereact/toast";
import {Paginator} from "primereact/paginator";
import {Image} from "primereact/image";
import IncidentReportForm from "../../ToolsAndEquipmentsLedger/form/IncidentReportForm";

const LookUpIRDialog = (props) => {
    const toast = useRef(null);
    const paginator = useRef(null);
    const userInfo = useUserDetails();

    const [regionList, setRegionList] = useState([]);
    const [IRdataList, IRdataListSet] = useState([]);
    const [filteredIRData, setFilteredIRData] = useState([]);
    const [tableLoading, tableLoadingSet] = useState(false);
    const [imageContainer, imageContainerSet] = useState([]);
    const [dialogImage, dialogImageSet] = useState(false);
    const [haveImage, setHaveImage] = useState(true);
    const [IRDialogShow, IRDialogShowSet] = useState(false);
    const [selectedIr, setSelectedIr] = useState(false);

    const [tableTotalCount, setTableTotalCount] = useState(0);
    const [tableStart, setTableStart] = useState(0);
    const [tableLimit, setTableLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');

    const [refreshLoading, setRefreshLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ region: null });

    useEffect(() => {
        fetchIRData();
    }, []);

    const fetchIRData = () => {
        tableLoadingSet(true);
        TeTaskService.queryIrListOverall(0, 1000) 
            .then((res) => {
                tableLoadingSet(false);
                IRdataListSet(res.data.data);
                setFilteredIRData(res.data.data);
                setTableTotalCount(res.data.data.length);
                console.log("totalFetchedData:", res);
                const uniqueRegions = [...new Set(res.data.data.map((item) => item.region))];
                const filteredRegions = uniqueRegions.filter(region => region !== null && region !== undefined);
                setRegionList(filteredRegions);
            })
            .catch((err) => {
                console.error("Error fetching IR data:", err);
                tableLoadingSet(false);
            });
    };

    const getIrForm = (id) => {
        TeTaskService.getIrForm(id)
            .then(res => {
                setSelectedIr(res.data.data);
                IRDialogShowSet(true);
            })
            .catch(err => {
                toast.current.show({ severity: 'error', summary: "Error getting IR details", life: 1000 });
            });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const OnViewImage = async(filepath) => {
        await TeTaskService.viewImageFile(filepath).then(res => {
            let tempImage = [{}];
            tempImage[0] = {
                image: URL.createObjectURL(res.data)
            };
            imageContainerSet(tempImage);
            dialogImageSet(true);
        }).catch(err => {
            toast.current.show({ severity: 'error', summary: "Unable to load image", life: 1000 });
        });
    };

    const onRefresh = () => {
        setRefreshLoading(true);
        setSearchQuery({ region: null });
        fetchIRData();
    };

    const onChangeSearchQuery = (e) => {
        const { value } = e.target;
        setSearchQuery({ region: value });
        filterData(value);
    };

    const filterData = (region) => {
        const filteredData = IRdataList.filter(
            (item) => item.region === region || region === null
        );
        setFilteredIRData(filteredData);
        setTableTotalCount(filteredData.length);
        setTableStart(0); // Reset pagination
    };

    const onClearFilter = () => {
        setSearchQuery({ region: null });
        setFilteredIRData(IRdataList);
        setTableTotalCount(IRdataList.length);
        setTableStart(0); // Reset pagination
    };

    const onPageChange = (e) => {
        setTableStart(e.first);
        setTableLimit(e.rows);
        setCurrentPage(e.page + 1);
    };

    const onPageInputKeyDown = (e, options) => {
        if (e.key === 'Enter') {
            const page = parseInt(currentPage);
            if (page < 1 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            } else {
                const first = currentPage ? options.rows * (page - 1) : 0;
                setTableStart(first);
                setPageInputTooltip('Press \'Enter\' key to go to this page.');
            }
        }
    };

    const onPageInputChange = (e) => {
        setCurrentPage(e.target.value);
    };

    const tableHeaderTemplate = () => {
        return (
            <div className="flex justify-content-between">
                <Button
                    type="button"
                    icon="pi pi-refresh"
                    label="Refresh"
                    outlined
                    onClick={onClearFilter}
                />
                <Dropdown
                    name="region"
                    value={searchQuery.region}
                    options={regionList}
                    placeholder="Region"
                    onChange={onChangeSearchQuery}
                    className="mr-2 taskm-filter"
                />
            </div>
        );
    };

    const paginatorTemplate = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        'PrevPageLink': (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            );
        },
        'NextPageLink': (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            );
        },
        'PageLinks': (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return <span className={className} style={{ userSelect: 'none' }}>...</span>;
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            );
        },
        'RowsPerPageDropdown': (options) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 25, value: 25 },
                { label: 50, value: 50 },
                { label: 100, value: 100 }
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        'CurrentPageReport': (options) => {
            return (
                <>
                    <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                        Go to <InputText size="2" className="ml-1" value={currentPage} tooltip={pageInputTooltip}
                                         onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange} />
                    </span>
                    <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                        {options.first} - {options.last} of {options.totalRecords}
                    </span>
                </>
            );
        }
    };

    const personsInvolvedTemplate = (row) => {
        return (
            <React.Fragment>
                <DataTable value={row.objectArr} tableStyle={{ minWidth: '50rem' }} rowHover={false}>
                    <Column field="emp_name" header="Name"></Column>
                    <Column field="emp_id" header="Emp id"></Column>
                    <Column field="emp_position" header="Position"></Column>
                    <Column field="emp_department" header="Department"></Column>
                </DataTable>
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (row) => {
        const imageTemplate = (
            <>
                <Button data-id={row.id} title={"View Image"} icon="pi pi-image"
                        className="p-button-rounded p-button-outlined"
                        onClick={e => {
                            OnViewImage(row.photoPath);
                        }}
                />
            </>
        );

        let template = null;
        if (row.photoPath.length > 5) {
            template = imageTemplate;
        }

        return (
            <>
                <Button data-id={row.id} icon="pi pi-file"
                        className="p-button-rounded p-button-outlined"
                        onClick={() => {
                            getIrForm(row.id);
                        }} />
                {template}
            </>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog header="Overall IR List" visible={props.visible} style={{ width: '60vw' }} onHide={() => props.setVisible(false)}>
                <div className="card">
                    <DataTable value={filteredIRData.slice(tableStart, tableStart + tableLimit)} emptyMessage="No records found." header={tableHeaderTemplate}
                               columnResizeMode="fit" responsiveLayout="scroll" showGridlines rowHover={false}
                               className="datatable-responsive" loading={tableLoading}>
                        <Column header="Action" style={{ width: '8%', minWidth: '8rem', padding: '10px', textAlign: 'center' }}
                                body={actionBodyTemplate}></Column>
                        <Column field="itemName" header="Item Name"></Column>
                        <Column field="materialCode" header="Material Code"></Column>
                        <Column field="personsInvolved" header="Person Involved" style={{ width: '10%' }}></Column>
                        <Column field="details" header="Details"></Column>
                        <Column field="createdDate" body={(row) => formatDate(row.createdDate)} header="Date Created" style={{ width: '10%' }}></Column>
                        <Column field="region" header="Region" style={{ width: '10%' }}></Column>
                    </DataTable>
                    <Paginator
                        ref={paginator}
                        first={tableStart}
                        rows={tableLimit}
                        totalRecords={tableTotalCount}
                        onPageChange={onPageChange}
                        template={paginatorTemplate}
                    ></Paginator>
                </div>
            </Dialog>

            <Dialog header="Image Viewer" visible={dialogImage} modal onHide={() => { dialogImageSet(false); }}>
                <div style={{ margin: 'auto' }}>
                    <br></br>
                    {haveImage ?
                        imageContainer.map(
                            image => {
                                return (
                                    <>
                                        <Image src={image.image}
                                               style={{ width: '550px', border: '#f5f5f5 solid 1px', padding: '2px' }} />
                                    </>
                                )
                            }
                        )
                        :
                        (<>
                            <img src={"https://comnplayscience.eu/app/images/notfound.png"}
                                 style={{ width: '350px', border: '#f5f5f5 solid 1px', padding: '2px' }} alt="No image found." />
                        </>)}
                </div>
            </Dialog>

            <IncidentReportForm
                visible={IRDialogShow}
                setVisible={IRDialogShowSet}
                formType={"VIEW"}
                irData={selectedIr || {}}
            />
        </>
    );
}
export default LookUpIRDialog;
