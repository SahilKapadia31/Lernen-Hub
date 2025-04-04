import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import './confirmation-dialog.scss';
import "bootstrap/dist/css/bootstrap.min.css";
const ConfirmationDialog = ({ show, handleClose, handleConfirm }) => {
    const [inputText, setInputText] = React.useState("");
    return (
        <>
            {/* <Modal show={show} onHide={handleClose} centered>
                <div className="d-flex justify-content-center mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#0dcaf0" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
                        <path d="M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 1a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                        <path d="M7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM7.1 4.995a.905.905 0 0 1 1.8 0l-.35 3.505a.555.555 0 0 1-1.1 0l-.35-3.505z" />
                    </svg>
                </div>
                <Modal.Header className="d-flex justify-content-center gap-2">
                    <Modal.Title className="dialog-title" >
                        Are you sure ?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="mb-0">
                        You won't be able to revert this ! Please type{" "} <br />
                        <strong className={"text-info"}>
                            Delete
                        </strong>{" "}
                        below to delete the record.
                    </p>

                </Modal.Body>
                <Form.Group className="px-5 py-3">
                    <Form.Control
                        type="text"
                        placeholder="DELETE"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </Form.Group>
                <Modal.Footer className="d-flex justify-content-center gap-2 mx-3">
                    <Button className="rounded-pill text-info" variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        className="rounded-pill"
                        variant={"info"}
                        onClick={handleConfirm}
                        disabled={inputText !== "DELETE"}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal> */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="dialog-title">
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="mb-0">
                        Are you sure you want to{" "}
                        <strong className={"text-danger"}>
                            Delete
                        </strong>{" "}
                        this program type?
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-top">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={"danger"}
                        onClick={handleConfirm}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmationDialog