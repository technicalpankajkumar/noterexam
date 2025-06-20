import { Textarea, TextareaInput } from "@components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import InputNE from "./InputNE";


const UploadFileSheetNE = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    return (<View className="w-full">
        <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field: { onChange, value } }) => (
                <InputNE
                    placeholder="Title"
                    value={value}
                    onChangeText={onChange}
                    size="sm"
                    title="Title"
                    isRequired={true}
                    error={typeof errors?.title?.message === 'string' ? errors.title.message : undefined}
                />
            )}
        />
        {/* Description */}
        <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field: { onChange, value } }) => (
                <Textarea
                    size="md"
                    isReadOnly={false}
                    isInvalid={false}
                    isDisabled={false}
                >
                    <TextareaInput placeholder="Your text goes here..." />
                </Textarea>
            )}
        />


    </View>)
}

export default UploadFileSheetNE;