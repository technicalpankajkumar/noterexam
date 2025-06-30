import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@components/ui/select";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react-native";
import { Text } from "react-native";

interface SelectNEProps {
    errorMsg?: string;
    error?: string;
    title?: string;
    isRequired?: boolean;
    onChange?: (e: any) => void;
    options?: { id: string, label: string, value: string }[];
    placeholder?:string;
}
const SelectNE: React.FC<SelectNEProps> = ({
    errorMsg,
    error = false,
    title ='Choose Notes Type',
    isRequired,
    onChange,
    options =[],
    placeholder="Select option"
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
                    {title} {isRequired && <Text className="text-red-700">*</Text>}
                </FormControlLabelText>
            </FormControlLabel>
            <Select onValueChange={onChange}>
                <SelectTrigger>
                    <SelectInput placeholder={placeholder} className="flex-1 text-sm" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent >
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {
                            options?.map(res =>{
                                return <SelectItem key={res.id} label={res.label} value={res.value} />
                            })
                        }
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