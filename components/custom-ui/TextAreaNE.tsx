import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
import { Textarea, TextareaInput } from "@components/ui/textarea";
import { AlertCircleIcon } from "lucide-react-native";
import { Text } from "react-native";

interface TextAreaNEProps{
    isRequired?:boolean
    error?:string;
    errorMsg?:string
    onChange?:()=>void
}
const TextAreaNE:React.FC<TextAreaNEProps> = ({
    isRequired,
    errorMsg,
    error,
    onChange
}) => {
    return (
        <FormControl size="md" className="mb-2" isInvalid={!!error}>
            <FormControlLabel>
                <FormControlLabelText>
                    Description {isRequired && <Text className="text-red-700">*</Text>}
                </FormControlLabelText>
            </FormControlLabel>
            <Textarea className="min-w-[200px]">
                <TextareaInput
                    size="sm"
                    style={{ textAlignVertical: 'top', fontSize: 14, }} // ✅ ensures cursor starts at top
                    multiline
                    placeholder="Type your book related description."
                    onChangeText={onChange}
                />
            </Textarea>
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

export default TextAreaNE;