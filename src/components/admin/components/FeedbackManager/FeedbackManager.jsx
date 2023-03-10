import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import ReactStars from 'react-rating-stars-component';
import { useDispatch, useSelector } from 'react-redux';
import { confirmFeedback, deleteFeedback, getFeedbacks } from '../../../../redux/thunks/admin/feedback-thunk';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';

function FeedbackManager() {
    const dispatch = useDispatch();

    const [feedbackData, setFeedbackData] = useState([]);
    const [isShowDetails, setIsShowDetails] = useState(false);
    const [feedbackDetail, setFeedbackDetail] = useState(null);
    const [isDeleteFeedback, setIsDeleteFeedback] = useState(false);
    const [feedbackDelete, setFeedbackDelete] = useState(null);
    const [reload, setReload] = useState(false);

    const feedbacks = useSelector((state) => state.adminFeedbackData.feedbacks);

    useEffect(() => {
        dispatch(getFeedbacks());
    }, [dispatch]);

    useEffect(() => {
        setDataInit(feedbacks);
        if (reload) {
            window.location.reload();
        }
        // window.location.reload();
    }, [feedbacks, dispatch]);

    const setDataInit = (data) => {
        if (data !== undefined && data !== null) {
            setReload(false);
            setFeedbackData(data);
            setIsShowDetails(false);
            setFeedbackDetail(null);
            setIsDeleteFeedback(false);
            setFeedbackDelete(null);
        } else {
            setFeedbackData([]);
        }
    };

    const onHide = () => {
        setIsShowDetails(false);
        setIsDeleteFeedback(false);
    };

    const statusType = (rowData) => {
        return (
            <span
                className={`product-badge status-${rowData.status} ${
                    rowData.status === true ? 'text-success' : 'text-danger'
                }`}
            >
                {rowData.status === true ? '???? ph???n h???i' : 'Ch??a ph???n h???i'}
            </span>
        );
    };

    const updatedName = (rowData) => {
        return (
            <span
                className={`product-badge status-${rowData.status} ${
                    rowData.status === true ? 'text-success' : 'text-danger'
                }`}
            >
                {rowData.status === true ? rowData.updatedName : 'Ch??a x??c ?????nh'}
            </span>
        );
    };

    const feedbackAction = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-primary mr-2"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Xem chi ti???t v?? tr??? l???i"
                    onClick={() => handleFeedbackDetail(rowData)}
                />

                <Button
                    id={`delete-room-${rowData.id}`}
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Xo?? ph???n h???i"
                    onClick={() => {
                        beforeDeleteFeedback(rowData);
                    }}
                />
            </React.Fragment>
        );
    };
    const accept = () => {
        dispatch(deleteFeedback(feedbackDelete.feedbackId));
    };

    const deleteFeedbackPopup = (
        <form>
            <React.Fragment>
                {/* <Button label="H???y" icon="pi pi-times" className="p-button-text" onClick={onHide} /> */}
                <Button label="X??c nh???n" icon="pi pi-check" className="p-button-text" onClick={accept} />
            </React.Fragment>
        </form>
    );

    const handleFeedbackDetail = (data) => {
        setIsShowDetails(true);
        setFeedbackDetail(data);
    };

    const beforeDeleteFeedback = (data) => {
        setFeedbackDelete(data);
        setIsDeleteFeedback(true);
    };

    const formik = useFormik({
        initialValues: {
            feedbackId: '',
            contentResponse: '',
            email: '',
        },
        validationSchema: Yup.object({
            contentResponse: Yup.string()
                .min(10, 'N???i dung ph???i ch???a ??t nh???t 10 k?? t???')
                .max(5000, 'N???i dung t???i ??a l?? 5000 k?? t???')
                .required('N???i dung tr??? l???i kh??ng ???????c tr???ng'),
        }),
        onSubmit: (values) => {
            let feedbackRequest = {
                feedbackId: feedbackDetail.feedbackId,
                contentResponse: values.contentResponse,
                email: feedbackDetail.createdMail,
            };
            dispatch(confirmFeedback(feedbackRequest));
            formik.resetForm();
            onHide();
            setDataInit(feedbacks);
            // formik.setSubmitting(false);
            setReload(true);
            // window.location.reload();
        },
    });

    // const handleConfirm = () => {
    //     let feedbackRequest = {
    //         feedbackId: feedbackDetail.feedbackId,
    //         contentResponse: contentResponse,
    //         email: feedbackDetail.createdMail
    //     };
    //     dispatch(confirmFeedback(feedbackRequest));
    // }

    return (
        <div className="softskill-manager">
            <div className="datatable-crud-demo">
                <div className="softskill-card">
                    <DataTable
                        value={feedbackData}
                        dataKey="roomId"
                        paginator
                        rows={8}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="T???ng s???: {totalRecords} b???n ghi"
                        rowsPerPageOptions={[10, 20, 50]}
                        responsiveLayout="scroll"
                        emptyMessage="Ch??a c?? d??? li???u"
                        style={{ fontSize: '12px' }}
                    >
                        <Column field="id" header="ID" hidden></Column>
                        <Column field="numRow" header="STT" sortable style={{ maxWidth: '4rem' }}></Column>
                        <Column field="createdName" header="Ng?????i g???i" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column
                            field="createdDate"
                            header="Th???i gian g???i"
                            sortable
                            style={{ minWidth: '6rem' }}
                        ></Column>
                        <Column
                            field="status"
                            header="Tr???ng th??i"
                            body={statusType}
                            sortable
                            style={{ minWidth: '6rem' }}
                        ></Column>
                        <Column
                            field="updatedName"
                            header="Ng?????i ph???n h???i"
                            body={updatedName}
                            sortable
                            style={{ minWidth: '8rem' }}
                        ></Column>
                        <Column
                            header="Thao t??c"
                            body={feedbackAction}
                            exportable={false}
                            style={{ minWidth: '8rem' }}
                        ></Column>
                    </DataTable>
                </div>

                {feedbackDetail !== null ? (
                    <>
                        <form action="submit" onSubmit={formik.handleSubmit}>
                            <div className="form-detail">
                                <Dialog
                                    visible={isShowDetails}
                                    style={{ width: '600px' }}
                                    header="Chi ti???t ph???n h???i"
                                    modal
                                    className="p-fluid"
                                    draggable={false}
                                    // footer={softskillDialogFooter}
                                    onHide={() => onHide()}
                                >
                                    <div className="field-info d-flex flex-row justify-content-between">
                                        <div style={{ width: '80%', margin: 'auto 0' }}>
                                            <label
                                                style={{ fontSize: 'larger', margin: '0' }}
                                                className="font-weight-bold"
                                            >
                                                ????nh gi?? sao
                                            </label>
                                        </div>

                                        <div className="feedback-star_rating">
                                            <ReactStars
                                                name="rate"
                                                count={5}
                                                value={feedbackDetail.rateStar}
                                                size={24}
                                                isHalf={false}
                                                emptyIcon={<i className="far fa-star"></i>}
                                                fullIcon={<i className="fa fa-star"></i>}
                                                color1={'#ffffff'}
                                                color2={'#ffd700'}
                                                edit={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="field-info d-flex flex-row justify-content-between">
                                        <div style={{ width: '80%', margin: 'auto 0' }}>
                                            <label
                                                style={{ fontSize: 'larger', margin: '0' }}
                                                className="font-weight-bold"
                                            >
                                                Lo???i c??u h???i
                                            </label>
                                        </div>

                                        <InputText
                                            value={feedbackDetail.feedbackTitle}
                                            style={{ width: '50%' }}
                                            readOnly
                                        />
                                    </div>
                                    <div className="field-info d-flex flex-row justify-content-between">
                                        <div style={{ width: '40%', margin: 'auto 0' }}>
                                            <label
                                                style={{ fontSize: 'larger', margin: '0' }}
                                                className="font-weight-bold"
                                            >
                                                N???i dung ph???n h???i
                                            </label>
                                        </div>
                                        <div>
                                            <InputTextarea
                                                style={{ height: '60px' }}
                                                value={feedbackDetail.content}
                                                rows={3}
                                                cols={45}
                                                autoResize
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="field-info d-flex flex-row justify-content-between">
                                        <div style={{ width: '40%', margin: 'auto 0' }}>
                                            <label
                                                style={{ fontSize: 'larger', margin: '0' }}
                                                className="font-weight-bold"
                                            >
                                                N???i dung tr??? l???i
                                            </label>
                                        </div>
                                        <div>
                                            {feedbackDetail.status === true ? (
                                                <InputTextarea
                                                    style={{ height: '60px' }}
                                                    value={feedbackDetail.contentResponse}
                                                    rows={3}
                                                    cols={45}
                                                    autoResize
                                                    readOnly
                                                />
                                            ) : (
                                                <>
                                                    {formik.errors.contentResponse &&
                                                        formik.touched.contentResponse && (
                                                            <p style={{ color: 'red', fontSize: '14px' }}>
                                                                {formik.errors.contentResponse}
                                                            </p>
                                                        )}

                                                    <InputTextarea
                                                        name="contentResponse"
                                                        style={{ height: '60px' }}
                                                        value={formik.values.contentResponse}
                                                        rows={3}
                                                        cols={45}
                                                        autoResize
                                                        onChange={formik.handleChange}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        style={{ fontSize: '1.4rem', display: 'block' }}
                                        onClick={formik.handleSubmit}
                                        type="submit"
                                    >
                                        G???i c??u tr??? l???i
                                    </Button>
                                </Dialog>
                            </div>
                        </form>
                    </>
                ) : (
                    <></>
                )}

                <div className="delete-room">
                    <Dialog
                        visible={isDeleteFeedback}
                        draggable={false}
                        style={{ width: '450px' }}
                        header="X??c nh???n xo?? ph???n h???i"
                        modal
                        footer={deleteFeedbackPopup}
                        onHide={onHide}
                    >
                        <div className="confirmation-content">
                            <div
                                style={{ fontSize: '1.4rem', paddingTop: '1.5rem', borderRadius: 'none' }}
                                className="field-checkbox"
                            >
                                <span>
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    Vi???c n??y s??? b??? qua vi???c tr??? l???i l???i ph???n h???i c???a ng?????i d??ng v?? xo?? v??nh vi???n. <br />
                                </span>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
export default FeedbackManager;
