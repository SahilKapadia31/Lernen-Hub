import React from "react";
import { Modal, Button } from "react-bootstrap";
import './status-confirmation-dialog.scss'
const StatusConfirmationDialog = ({ show, handleClose, handleConfirm, status }) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className="border-bottom">
                    <Modal.Title className="dialog-title">
                        {!status ? "Confirm Activation" : "Confirm Deactivation"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="mb-0">
                        Are you sure you want to{" "}
                        <strong className={!status ? "text-success" : "text-danger"}>
                            {!status ? "Activate" : "Deactivate"}
                        </strong>{" "}
                        this organization?
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-top">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={!status ? "success" : "danger"}
                        onClick={handleConfirm}
                    >
                        {!status ? "Activate" : "Deactivate"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StatusConfirmationDialog