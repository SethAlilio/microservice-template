export const getButtonBgColor = (status) => {
    if(status === "Uploaded")
        return "#63F57B";
    else if(status === "Error")
        return "#F57363";
    else
        return "#63B5F5";
};
