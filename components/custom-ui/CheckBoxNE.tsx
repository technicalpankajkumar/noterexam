import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@components/ui/checkbox";
import { CheckIcon } from "lucide-react-native";
import { FC } from "react";

interface CheckBoxNEProps {
    title?: string,
    isRequired?: boolean;
    errorMsg?: string,
    error?: string;
    isChecked?: boolean;
    onChange?:()=>void
}
const CheckBoxNE: FC<CheckBoxNEProps> = ({
    title,
    isRequired,
    errorMsg,
    error,
    isChecked,
    onChange
}) => {
    return (
        <Checkbox value="" size="sm" isInvalid={false} isDisabled={false}  isChecked={isChecked} onChange={onChange}>
            <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel className="text-sm font-medium text-blue-500 mt-1">{title}</CheckboxLabel>
        </Checkbox>
    );
}

export default CheckBoxNE