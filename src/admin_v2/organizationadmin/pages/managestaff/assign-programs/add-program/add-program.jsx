import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import './add-program.scss';
import { useSelector } from "react-redux";
import Loading from "react-fullscreen-loading";
import { toast } from "react-toastify";
import Select from "react-select";
import axiosInstance from "../../../../components/services/axiosInstance";

const AddPrograms = ({ show, handleClose, submitForm, user_id, getUserPrograms, userPrograms, programList }) => {
    const [isLoading, setIsLoading] = useState(false);
    const orgData = useSelector((state) => state.auth);
    const [updatedProgramList, setUpdatedProgramList] = useState([]);

    const getAllPrograms = async () => {
        try { 
            console.log("userPrograms",userPrograms);
            console.log("programList",programList);
            
            let updatedProgramList = programList.map(program => {
                const updatedSemesters = program.semester.map(semester => ({
                    label: semester.sem_name,
                    value: semester.semester_id,
                    program_id: semester.program_id,
                    is_deleted: semester.is_deleted
                }));
    
                // Get selected semesters based on userPrograms
                const selectedSemesters = (userPrograms && userPrograms.length > 0) 
                    ? userPrograms
                        .filter(userProgram => userProgram.program_id === program.pid)
                        .map(userProgram => userProgram.semester)
                        .flat()
                        .map(semester => semester.start_sem_id)
                    : [];
    
                return {
                    ...program,
                    semester: updatedSemesters,
                    selectedSemesters
                };
            });
    
            console.log("updatedProgramList", updatedProgramList);
    
            // Add `is_selected` and `is_added` properties
            updatedProgramList = updatedProgramList.map(item => ({
                ...item,
                is_selected: userPrograms?.find(userItem => userItem.program_id === item.pid) ? true : false,
                is_added: userPrograms?.find(userItem => userItem.program_id === item.pid) ? true : false
            }));
    
            setUpdatedProgramList(updatedProgramList);
        } catch (err) {
            setIsLoading(false);
            console.log("Error in getAllPrograms", err);
        }
    };
    

    useEffect(() => {
        if (show) {
            getAllPrograms();
        }
    }, [show]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleSelectProgram = (pid, selectedSemesterIds) => {
        let updatedList = updatedProgramList.map(item =>
            item.pid === pid
                ? { ...item, is_selected: selectedSemesterIds.length > 0, selectedSemesters: selectedSemesterIds } // Update selected semesters and checkbox
                : item
        );
        setUpdatedProgramList(updatedList);
    };

    const filteredPrograms = updatedProgramList.filter(item =>
        item.program_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const createProgram = async () => {
        try {
            const selectedPrograms = updatedProgramList.filter((item) => item?.is_selected && !item?.is_added)
            if (selectedPrograms.length) {
                setIsLoading(true);
                const payload = [];
                selectedPrograms.forEach((item) => {
                    payload.push({
                        "program_id": item?.pid,
                        "option_id": orgData?.role?.option_id,
                        "organization_id": item?.organization_id,
                        "user_id": user_id,
                        "semesters": item.selectedSemesters
                    })
                })
                console.log(payload);

                const response = await axiosInstance.post(`/userProgramAssociation/`, payload);
                if (response.data) {
                    toast.success("Program selected successfully");
                    getUserPrograms();
                }
                setIsLoading(false);
            }
            handleClose();
        } catch (err) {
            setIsLoading(false);
            console.log("Error in getAllPrograms", err);
            toast.error("Error!!! Please try again");
            handleClose();
        }
    };

    const checkIfValidToSave = (program) => {
        return program.is_selected && program.selectedSemesters.length > 0;
    };

    return (<>
        <Modal show={show} onHide={handleClose} size="lg" centered backdropClassName="nested-backdrop-modal">
            <Modal.Header className="border-bottom">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <Modal.Title className="dialog-title w-100">Add Program</Modal.Title>
                    <input type="text" className="form-control" placeholder="Search program" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </Modal.Header>
            <Modal.Body className="pb-0">
                <div className="program-table">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th width="5%"><h5>#</h5></th>
                                <th width="40%"><h5>Program</h5></th>
                                <th width="50%"><h5>Semester</h5></th>
                                <th width="5%" className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(filteredPrograms && filteredPrograms.length > 0) ?
                                filteredPrograms.map((item, index) =>
                                    <tr key={item.pid} className={`${item.is_added ? 'disabled' : ''}`}>
                                        <td style={{verticalAlign:'middle'}}><p>{index + 1}</p></td>
                                        <td style={{verticalAlign:'middle'}}><p>{item.program_name}</p></td>
                                        <td style={{verticalAlign:'middle'}}>
                                            <Select
                                                options={item.semester}
                                                isMulti
                                                classNamePrefix="react-select"
                                                value={item.semester.filter(option => item.selectedSemesters.includes(option.value))}
                                                onChange={(selectedOptions) => {
                                                    const selectedSemesterIds = selectedOptions.map(option => option.value);
                                                    handleSelectProgram(item.pid, selectedSemesterIds);
                                                }}
                                                placeholder="Select Semester"
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: '35px',
                                                        minHeight: '35px',
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        maxHeight: '200px',
                                                        overflowY: 'auto', 
                                                    }),
                                                    option: (provided) => ({
                                                        ...provided,
                                                        padding: '10px',
                                                    }),
                                                }}
                                            />
                                        </td>
                                        <td className="text-center" style={{verticalAlign:'middle'}}>
                                            <input
                                                type="checkbox"
                                                checked={item.is_selected}
                                                onClick={() => {
                                                    if (!item.is_added) {
                                                        handleSelectProgram(item.pid, item.selectedSemesters);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                )
                                :
                                <tr>
                                    <td colSpan={3} className="text-center">No Program Available</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button
                    variant="success"
                    onClick={createProgram}
                //disabled={programList.some(item => item.is_selected && item.selectedSemesters.length === 0)}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
        {isLoading && <Loading loading={true} loaderColor="#000" />}
    </>)
}

export default AddPrograms;
