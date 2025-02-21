const stateBodyTemplate = (param) =>{
    return  <span className={`customer-badge status-${param.STATE == '1' ? 'qualified' : 'unqualified'}`}>
        {param.STATE == '1' ? 'ACTIVE' : 'INACTIVE'}
        </span>;
}

const genderBodyTemplate = (param) => {
    return  <span className={`customer-badge status-${param.SEX == '1' ? 'new' : 'unqualified'}`}>
    {param.SEX == '1' ? 'MALE' : 'FEMALE'}
    </span>;
}

const TempAccount = {
    stateBodyTemplate,
    genderBodyTemplate
}

export { TempAccount };