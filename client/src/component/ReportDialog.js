import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PerformRequest from "../utilities/PerformRequest.js";

const ReportDialog = ({ open, onClose, onSubmit, reportId, span }) => {
    const [selectedReason, setSelectedReason] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const { OriginalRequest } = PerformRequest();
    const [questions, setQuestions] = useState([]);

    const handleReasonChange = (event) => {
        const id = event.target.value;
        setSelectedReason((prevReasons) =>
            prevReasons.includes(id)
                ? prevReasons.filter((reason) => reason !== id)
                : [...prevReasons, id]
        );
        setSelectedIds((prevIds) =>
            prevIds.includes(id)
                ? prevIds.filter((prevId) => prevId !== id)
                : [...prevIds, id]
        );
    };

    const handleSubmit = async () => {
        try {
            const content_reported = selectedIds.map(id => {
                const selectedQuestion = questions.find(question => question._id === id);
                return {
                    question: selectedQuestion ? selectedQuestion.question : "",
                };
            });
            const response = await OriginalRequest(`reportquestion/addReport/${reportId}`, "POST", {
                content_reported: content_reported,
                typeReported: span
            });

            onSubmit(selectedReason);
            setSelectedReason([]);
            setSelectedIds([]);
            onClose();
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const data = await OriginalRequest("reportquestion/getReportQuestion", "GET");
            setQuestions(data.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchQuestions();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                className: "bg-light60 dark:bg-dark60 text-lightText dark:text-darkTextSecondary dark:border-2 border-dark30"
            }}
        >
            <DialogTitle>Report {span}</DialogTitle>
            <DialogContent sx={{ height: '350px', width: '350px' }}>
                <RadioGroup value={selectedReason} onChange={handleReasonChange}>
                    {questions.map((question, index) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={selectedReason.includes(question._id)}
                                    onChange={handleReasonChange}
                                    value={question._id}
                                />
                            }
                            label={question.question}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Back</Button>
                {selectedReason.length > 0 && (
                    <Button onClick={handleSubmit}>Submit</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReportDialog;
