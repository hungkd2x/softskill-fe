import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteRecommendTaskss,
    getRecommendTasks,
    updateRecommendTasks,
} from './../../../../redux/thunks/author/recommend-task-thunks';
import { sendThankMail } from './../../../../redux/thunks/mail-thunks';
import { Editor } from 'primereact/editor';
import './RecommendTask.scss';

function RecommendTask() {
    const dispatch = useDispatch();
    let emptyRecommendTask = {
        id: -1,
        no: -1,
        createdName: 0,
        taskContent: '',
        softSkillName: '',
        taskType: '',
        status: '0',
        createdDate: '',
        updateName: 0,
        taskImage: '',
        guideline: '',
        guidelineImage: null,
        mail: '',
    };

    const [recommendTasks, setRecommendTasks] = useState(null);
    const [mailContent, setMailContent] = useState('');
    const [mailSubject, setMailSubject] = useState('');
    const [recommendTaskDialog, setRecommendTaskDialog] = useState(false);
    const [recommendTaskViewDialog, setRecommendTaskViewDialog] = useState(false);
    const [deleteRecommendTaskDialog, setDeleteRecommendTaskDialog] = useState(false);
    const [deleteRecommendTasksDialog, setDeleteRecommendTasksDialog] = useState(false);
    const [recommendTask, setRecommendTask] = useState(emptyRecommendTask);
    const [selectedRecommendTasks, setSelectedRecommendTasks] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        dispatch(getRecommendTasks());
    }, []);

    const rt = useSelector((state) => {
        return state.recommendTaskData.recommendTasks;
    });

    const rtType = useSelector((state) => {
        return state.recommendTaskData.rtType;
    });

    useEffect(() => {
        if (rtType === 'load') {
            setRecommendTasks(rt);
        }
    }, [rt, rtType]);

    const openNew = () => {
        setMailContent('');
        setMailSubject('');
        setSubmitted(false);
        setRecommendTaskDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRecommendTaskDialog(false);
    };

    const hideViewDialog = () => {
        setSubmitted(false);
        setRecommendTaskViewDialog(false);
    };

    const hideDeleteRecommendTaskDialog = () => {
        setDeleteRecommendTaskDialog(false);
    };

    const hideDeleteRecommendTasksDialog = () => {
        setDeleteRecommendTasksDialog(false);
    };

    const saveRecommendTask = (e) => {
        setSubmitted(true);

        let _recommendTasks = [...recommendTasks];
        let _recommendTask = { ...recommendTask };
        if (_recommendTask.id) {
            _recommendTask.status = e;
            _recommendTask.updateName = 'B???n';
            dispatch(
                updateRecommendTasks({
                    id: _recommendTask.id,
                    status: _recommendTask.status,
                }),
            );
            const index = findIndexById(recommendTask.id);

            _recommendTasks[index] = _recommendTask;
            toast.current.show({
                severity: 'success',
                summary: 'Th??nh c??ng',
                detail: 'C???p nh???t th??nh c??ng!',
                life: 3000,
            });

            setRecommendTaskViewDialog(false);
            setRecommendTasks(_recommendTasks);
            setRecommendTask(emptyRecommendTask);
            hideDialog();
        }
    };

    const viewRecommendTask = (recommendTask) => {
        setRecommendTask({ ...recommendTask });
        setRecommendTaskViewDialog(true);
    };

    const confirmDeleteRecommendTask = (recommendTask) => {
        setRecommendTask(recommendTask);
        setDeleteRecommendTaskDialog(true);
    };

    const sendMail = () => {
        setSubmitted(true);
        if (mailSubject.trim() && mailContent.trim()) {
            // send mail - todo


            // let content = document.getElementsByClassName('p-inputtextarea')[2].innerHTML;
            // let r = content.replaceAll('\n', ' <br/>');
            dispatch(
                sendThankMail({
                    to: recommendTask.mail,
                    subject: mailSubject,
                    mailContent: mailContent,
                }),
            );
            // accept
            saveRecommendTask('2');
        }
    };

    // const formatMailContent = () => {
    //     let content = document.getElementsByClassName('p-inputtextarea')[2].innerHTML;
    //     let r = content.replace('\n', ' <br/>');
    //     setMailContent(r);
    // };

    const deleteRecommendTask = () => {
        let ids = [recommendTask.id];
        dispatch(deleteRecommendTaskss(ids));
        let _recommendTasks = recommendTasks.filter((val) => val.id !== recommendTask.id);
        setRecommendTasks(_recommendTasks);
        setDeleteRecommendTaskDialog(false);
        setRecommendTaskViewDialog(false);
        setRecommendTask(emptyRecommendTask);
        toast.current.show({ severity: 'success', summary: 'Th??nh c??ng', detail: 'X??a th??nh c??ng!', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < recommendTasks.length; i++) {
            if (recommendTasks[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const confirmDeleteSelected = () => {
        if (selectedRecommendTasks.length === 1) {
            setRecommendTask(selectedRecommendTasks[0]);
            setDeleteRecommendTaskDialog(true);
        } else {
            setDeleteRecommendTasksDialog(true);
        }
    };

    const deleteSelectedRecommendTasks = () => {
        let ids = [];
        for (let index = 0; index < selectedRecommendTasks.length; index++) {
            const element = selectedRecommendTasks[index];
            ids.push(element.id);
        }
        dispatch(deleteRecommendTaskss(ids));
        let _recommendTasks = recommendTasks.filter((val) => !selectedRecommendTasks.includes(val));
        setRecommendTasks(_recommendTasks);
        setDeleteRecommendTasksDialog(false);
        setSelectedRecommendTasks(null);
        toast.current.show({ severity: 'success', summary: 'Th??nh c??ng', detail: 'X??a th??nh c??ng!', life: 3000 });
    };

    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setMailSubject(val);
    };

    const onMailChange = (e) => {
        const val = (e.target && e.target.value) || '';
        setMailContent(val);
    };

    const initDemoMail = () => {
        const demo =
            'Ch??o b???n, <br>L???i ?????u ti??n, ch??ng t??i r???t c???m ??n b???n v?? ???? g???i ????? xu???t nhi???m v??? cho <strong>C???ng ?????ng ph??t tri???n K??? n??ng m???m</strong>. S??? gi??p ????? c???a b???n s??? gi??p ??ch r???t nhi???u cho ch??ng t??i.<br><br>????? xu???t c???a b???n th???c s??? h???u ??ch v?? r???t ph?? h???p v???i nh???ng ti??u ch?? m?? <strong>C???ng ?????ng ph??t tri???n K??? n??ng m???m</strong> ??ang h?????ng t???i. V?? v???y, ch??ng t??i ch???c ch???n s??? th??m nhi???m v??? c???a b???n trong l???n c???p nh???t s???p t???i.<br><br>M???t l???n n???a, c???m ??n b???n r???t nhi???u. N???u nh?? b???n c?? nh???ng ?? t?????ng, ????ng g??p n??o kh??c, vui l??ng li??n h??? v???i ch??ng t??i.<br><br>Th??n g???i,<br>LoiND';
        setMailContent(demo);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="X??a"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedRecommendTasks || !selectedRecommendTasks.length}
                />
            </React.Fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <span
                className={`recommendTask-badge status-${rowData.status.toLowerCase()} ${rowData.status === '2' ? 'text-success' : rowData.status === '1' ? 'text-primary' : 'text-danger'
                    }`}
            >
                {rowData.status === '1' ? 'Ch??? duy???t' : rowData.status === '2' ? 'Duy???t' : 'T??? ch???i'}
            </span>
        );
    };

    const leftPagnitor = (
        <Button
            label="X??a t???t c???"
            className="p-button-text"
            style={{ margin: '0px', color: 'black', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}
            onClick={confirmDeleteSelected}
            disabled={!selectedRecommendTasks || !selectedRecommendTasks.length}
        />
    );

    const paginatorRight = <Button type="button" icon="pi pi-refresh" className="p-button-text" hidden />;

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-primary mr-2"
                    onClick={() => viewRecommendTask(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger mr-2"
                    onClick={() => confirmDeleteRecommendTask(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            {/* <h5 className="mx-0 my-1">Qu???n l?? nhi???m v??? ????? xu???t</h5> */}
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onGlobalFilterChange} placeholder="T??m ki???m" />
            </span>
        </div>
    );
    const recommendTaskViewDialogFooter = (
        <React.Fragment>
            {recommendTask.status === '1' && (
                <div>
                    <Button
                        label="Duy???t"
                        icon="pi pi-check"
                        className="p-button-raised p-button-rounded p-button-primary"
                        onClick={() => saveRecommendTask('2')}
                    />
                    <Button
                        label="Duy???t v?? C???m ??n"
                        icon="pi pi-heart"
                        className="p-button-raised p-button-rounded p-button-primary"
                        onClick={() => openNew()}
                    />
                    <Button
                        label="T??? ch???i"
                        icon="pi pi-ban"
                        className="p-button-raised p-button-rounded p-button-danger"
                        onClick={() => saveRecommendTask('3')}
                    />
                </div>
            )}
            {recommendTask.status !== '1' && (
                <div>
                    <Button label="OK" icon="pi pi-check" className="p-button-text" onClick={hideViewDialog} />
                </div>
            )}
        </React.Fragment>
    );
    const recommendTaskDialogFooter = (
        <React.Fragment>
            <Button label="H???y" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="G???i" icon="pi pi-check" className="p-button-text" onClick={() => sendMail()} />
        </React.Fragment>
    );
    const deleteRecommendTaskDialogFooter = (
        <React.Fragment>
            <Button label="H???y" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRecommendTaskDialog} />
            <Button label="X??c nh???n" icon="pi pi-check" className="p-button-text" onClick={deleteRecommendTask} />
        </React.Fragment>
    );
    const deleteRecommendTasksDialogFooter = (
        <React.Fragment>
            <Button label="H???y" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRecommendTasksDialog} />
            <Button
                label="X??c nh???n"
                icon="pi pi-check"
                className="p-button-text"
                onClick={deleteSelectedRecommendTasks}
            />
        </React.Fragment>
    );

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    const replyMailHeader = renderHeader();

    return (
        <div className="recommend-task-manager">
            <div className="datatable-crud-demo">
                <Toast ref={toast} />

                <div className="recommend-task-card">
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar> */}

                    <DataTable
                        ref={dt}
                        value={recommendTasks}
                        selection={selectedRecommendTasks}
                        onSelectionChange={(e) => setSelectedRecommendTasks(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        paginatorLeft={leftPagnitor}
                        paginatorRight={paginatorRight}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="T???ng s???: {totalRecords} b???n ghi"
                        rowsPerPageOptions={[10, 20, 50]}
                        filters={filters}
                        header={header}
                        responsiveLayout="scroll"
                        emptyMessage="Ch??a c?? d??? li???u"
                        style={{ fontSize: '12px' }}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                        <Column
                            field="no"
                            header="STT"
                            sortable
                            style={{ minWidth: '3rem', justifyContent: 'left' }}
                        ></Column>
                        <Column field="createdName" header="Ng?????i ????? xu???t" style={{ minWidth: '8rem' }}></Column>
                        <Column field="softSkillName" header="K??? n??ng" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="taskType" header="Lo???i nhi???m v???" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column
                            field="status"
                            header="Tr???ng th??i"
                            body={statusBodyTemplate}
                            sortable
                            style={{ minWidth: '8rem' }}
                        ></Column>
                        <Column field="createdDate" header="Ng??y g???i" sortable style={{ minWidth: '8rem' }}></Column>
                        <Column
                            field="updateName"
                            header="Ng?????i ph???n h???i"
                            sortable
                            style={{ minWidth: '6rem' }}
                        ></Column>
                        <Column
                            header="Thao t??c"
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ minWidth: '10rem' }}
                        ></Column>
                    </DataTable>
                </div>

                {/* dialog view */}
                <Dialog
                    visible={recommendTaskViewDialog}
                    style={{ width: '500px' }}
                    draggable={false}
                    header="Chi ti???t"
                    modal
                    className="p-fluid"
                    dismissableMask
                    closeOnEscape
                    footer={recommendTaskViewDialogFooter}
                    onHide={hideViewDialog}
                >
                    <div className="field">
                        <span>
                            <label htmlFor="taskType" className="mr-3 mt-3">
                                Lo???i nhi???m v???:{' '}
                            </label>
                            <label className="font-weight-bold"> {recommendTask.taskType}</label>
                        </span>
                    </div>

                    <div className="field">
                        <span>
                            <label htmlFor="softSkillName" className="mr-3 mt-3">
                                K??? n??ng:{' '}
                            </label>
                            <label className="font-weight-bold"> {recommendTask.softSkillName}</label>
                        </span>
                    </div>

                    <div className="field">
                        <label htmlFor="taskContent" className="mr-3 mt-3">
                            N???i dung nhi???m v???
                        </label>
                        <InputTextarea
                            id="taskContent"
                            value={recommendTask.taskContent === null ? '' : recommendTask.taskContent}
                            readOnly
                            rows={3}
                            cols={20}
                        />
                    </div>

                    {recommendTask.taskImage === null && (
                        <label htmlFor="taskImage">
                            ???nh nhi???m v???<span className="font-weight-bold">: Kh??ng c??</span>
                        </label>
                    )}
                    {recommendTask.taskImage && (
                        <div>
                            <label htmlFor="taskImage" className="d-block">
                                ???nh nhi???m v???
                            </label>
                            <Image
                                src={`data:image/jpeg;base64,${recommendTask.taskImage}`}
                                onError={(e) => (e.target.src = './../../../../assets/image/softskill.jpg')}
                                preview
                                downloadable
                                alt="Image"
                                imageClassName="recommendTask-image block m-auto pb-3"
                                style={{ width: '150px', height: '150px' }}
                                imageStyle={{ width: '-webkit-fill-available', height: '-webkit-fill-available' }}
                            />
                        </div>
                    )}

                    <div className="field">
                        <label htmlFor="guideline">H?????ng d???n</label>
                        <InputTextarea
                            id="guideline"
                            value={recommendTask.guideline === null ? '' : recommendTask.guideline}
                            readOnly
                            rows={3}
                            cols={20}
                        />
                    </div>

                    {recommendTask.guidelineImage === null && (
                        <label htmlFor="taskImage">
                            ???nh nhi???m v???<span className="font-weight-bold">: Kh??ng c??</span>
                        </label>
                    )}
                    {recommendTask.guidelineImage && (
                        <div>
                            <label htmlFor="guidelineImage" className="d-block">
                                ???nh h?????ng d???n
                            </label>
                            <Image
                                src={
                                    `data:image/jpeg;base64,${recommendTask.guidelineImage}` ||
                                    require('./../../../../assets/image/softskill.jpg')
                                }
                                onError={(e) => (e.target.src = './../../../../assets/image/softskill.jpg')}
                                preview
                                downloadable
                                alt="Image"
                                imageClassName="recommendTask-image block m-auto pb-3"
                                style={{ width: '150px', height: '150px' }}
                                imageStyle={{ width: '-webkit-fill-available', height: '-webkit-fill-available' }}
                            />
                        </div>
                    )}
                </Dialog>

                {/* send mail */}
                <Dialog
                    visible={recommendTaskDialog}
                    style={{ width: '600px' }}
                    draggable={false}
                    header="C???m ??n"
                    modal
                    className="p-fluid"
                    footer={recommendTaskDialogFooter}
                    onHide={hideDialog}
                >
                    <div className="field mb-3">
                        <label htmlFor="mail" className="font-weight-bold">
                            Ng?????i nh???n
                        </label>
                        <InputText
                            id="mail"
                            value={recommendTask.mail}
                            required
                            readOnly
                            className={classNames({ 'p-invalid': submitted && !recommendTask.mail })}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="mailSubject" className="font-weight-bold">
                            Ti??u ????? <span className="text-danger"> *</span>
                        </label>
                        <InputText
                            id="maiSubject"
                            value={mailSubject}
                            onChange={(e) => onInputChange(e)}
                            maxLength={100}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !mailSubject })}
                        />
                        {submitted && !mailSubject.trim() && (
                            <small className="p-error">Ti??u ????? kh??ng ???????c ????? tr???ng</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="mailContent" className="font-weight-bold">
                            N???i dung email <span className="text-danger"> *</span>
                        </label>
                        {/* <InputTextarea
                            id="mailContent"
                            rows={8}
                            cols={20}
                            value={mailContent}
                            onChange={(e) => onMailChange(e)}
                            className={classNames({ 'p-invalid': submitted && !mailContent })}
                        /> */}
                        <Editor
                            headerTemplate={replyMailHeader}
                            style={{ height: '290px' }}
                            value={mailContent}
                            onTextChange={(e) => {
                                setMailContent(e.htmlValue);
                            }}
                        />
                        {submitted && !mailContent.trim() && (
                            <small className="p-error">N???i dung email kh??ng ???????c ????? tr???ng</small>
                        )}
                        <Button
                            label="S??? d???ng m???u c?? s???n"
                            className="p-button-link"
                            style={{ width: '30%', display: 'block' }}
                            onClick={initDemoMail}
                        />
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteRecommendTaskDialog}
                    style={{ width: '250px' }}
                    draggable={false}
                    header="X??a?"
                    headerClassName="text-danger"
                    modal
                    closeOnEscape
                    dismissableMask
                    footer={deleteRecommendTaskDialogFooter}
                    onHide={hideDeleteRecommendTaskDialog}
                >
                    <div className="confirmation-content" style={{ fontFamily: 'Helvetica', fontSize: '1.2rem' }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {recommendTask && (
                            <span>
                                <label className="font-weight-bold">B???n c?? ch???c ch???n?</label>
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteRecommendTasksDialog}
                    style={{ width: '300px' }}
                    draggable={false}
                    header="X??a?"
                    modal
                    closeOnEscape
                    dismissableMask
                    footer={deleteRecommendTasksDialogFooter}
                    onHide={hideDeleteRecommendTasksDialog}
                >
                    <div className="confirmation-content" style={{ fontFamily: 'Helvetica', fontSize: '1.2rem' }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {recommendTask && (
                            <span>
                                <label className="font-weight-bold">B???n c?? ch???c ch???n mu???n x??a nh???ng m???c ???? ch???n?</label>
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default RecommendTask;
