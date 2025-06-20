import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@components/ui/select";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react-native";

interface SelectNEProps {
    errorMsg?: string;
    error?: string;
    title?: string;
}
const SelectNE: React.FC<SelectNEProps> = ({
    errorMsg,
    error = false,
    title ='Choose Notes Type'
}) => {
    return (
        <FormControl
            isInvalid={!!error}
            size="sm"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className="mb-2"
        >
            <FormControlLabel>
                <FormControlLabelText>
                    {title}
                </FormControlLabelText>
            </FormControlLabel>
            <Select>
                <SelectTrigger>
                    <SelectInput placeholder="Select option" className="flex-1 text-sm" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent >
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label="Quantum" value="quantum" />
                        <SelectItem label="Book" value="book" />
                        <SelectItem label="Model Paper" value="modelPaper" />
                    </SelectContent>
                </SelectPortal>
            </Select>
            {errorMsg && <FormControlHelper>
                <FormControlHelperText>
                    {errorMsg}
                </FormControlHelperText>
            </FormControlHelper>}
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                    {error}
                </FormControlErrorText>
            </FormControlError>
        </FormControl>
    );
}

export default SelectNE