import { FormControl, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
import { Textarea, TextareaInput } from "@components/ui/textarea";
import { Text } from "react-native";

interface TextAreaNEProps{
    isRequired?:boolean
    errorMsg?:string
}
const TextAreaNE:React.FC<TextAreaNEProps> = ({
    isRequired,
    errorMsg
}) => {
    return (
        <FormControl size="sm" className="mb-2">
            <FormControlLabel>
                <FormControlLabelText>
                    Description {isRequired && <Text className="text-red-700">*</Text>}
                </FormControlLabelText>
            </FormControlLabel>
            <Textarea className="min-w-[200px]">
                <TextareaInput
                    size="sm"
                    style={{ textAlignVertical: 'top', fontSize: 12, }} // ✅ ensures cursor starts at top
                    multiline
                    placeholder="Type your book related description."
                />
            </Textarea>
            {errorMsg && <FormControlHelper>
                      <FormControlHelperText>
                        {errorMsg}
                      </FormControlHelperText>
                    </FormControlHelper>}
        </FormControl>
    );
}

export default TextAreaNE;