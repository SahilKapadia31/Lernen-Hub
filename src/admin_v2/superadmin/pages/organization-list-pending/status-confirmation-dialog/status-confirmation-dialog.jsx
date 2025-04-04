import React from "react";
import { Modal, Button } from "react-bootstrap";
import './status-confirmation-dialog.scss'
const StatusConfirmationDialog = ({ show, handleClose, handleConfirm,status,organization_id }) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="dialog-title">
                        {status === "active" ? "Confirm Activation" : "Confirm Deactivation"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>
                        Are you sure you want to{" "}
                        <strong className={status === "active" ? "text-success" : "text-danger"}>
                            {status === "active" ? "Activate" : "Deactivate"}
                        </strong>{" "}
                        this organization?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={status === "active" ? "success" : "danger"}
                        onClick={handleConfirm}
                    >
                        {status === "active" ? "Activate" : "Deactivate"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StatusConfirmationDialog