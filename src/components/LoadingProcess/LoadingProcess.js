import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingProcess = ({ open }) => {
    return (
        <Dialog open={open}>
            <DialogTitle>Hệ thống đang tiến hành tải dữ liệu</DialogTitle>
            <Box className="d-flex justify-content-center" sx={{ display: "flex", height: "50px" }}>
                <CircularProgress />
            </Box>
        </Dialog>

    );
};

export default LoadingProcess;
