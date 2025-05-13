export const Select = ({ children, ...props }) => <select {...props}>{children}</select>;
export const SelectTrigger = ({ children, className }) => <div className={className}>{children}</div>;
export const SelectValue = ({ placeholder }) => <option disabled>{placeholder}</option>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;