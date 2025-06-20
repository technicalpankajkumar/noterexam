
import { AlertCircleIcon, UploadCloud } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { selectFileNoteByDevice, selectImageByDevice } from "../../utils/FileUploadHelper";
import ButtonNE from "./ButtonNE";
import CheckBoxNE from "./CheckBoxNE";
import InputNE from "./InputNE";
import SelectNE from "./SelectNE";
import TextAreaNE from "./TextAreaNE";


const UploadFileSheetNE = () => {
  const [fallbackFields, setFallbackFields] = useState<Record<string, boolean>>({});
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
  };

  const fields = ['university', 'course', 'branch', 'year', 'semester', 'college'];


  return (<View className="w-full h-[450px]">
    <ScrollView showsVerticalScrollIndicator={false}>
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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextAreaNE isRequired error={typeof error?.message === 'string' ? error.message : undefined} />
        )}
      />

      <Controller
        name="type"
        control={control}
        rules={{ required: 'Type is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectNE isRequired error={typeof error?.message === 'string' ? error.message : undefined} />
        )}
      />

      {/* Dynamic Selects or Inputs */}
      {fields.map((field) => (
        <View key={field} className="space-y-1">
          <View className="flex-row items-center justify-between">
            <CheckBoxNE
              isChecked={fallbackFields[field]}
              onChange={() =>
                setFallbackFields((prev) => ({ ...prev, [field]: !prev[field] }))
              }
              aria-label={`Use custom ${field}`}
              title={'Not exist'}
            />
          </View>
          <Controller
            name={field}
            control={control}
            render={({ field: { onChange, value } }) =>
              fallbackFields[field] ? (
                <InputNE placeholder={`Enter ${field}`} value={value} onChangeText={onChange} title={field} />
              ) : (
                <SelectNE title={field} />
              )
            }
          />
        </View>
      ))}

      <Controller
        name="pdf_path"
        control={control}
        rules={{ required: 'PDF is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity
              onPress={async () => {
                const file = await selectFileNoteByDevice();
                onChange(file?.path);
              }
              }
            >
              <Text className="text-sm font-medium ">Choose Notes</Text>
              <View className="my-2 items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[60px] w-full">
                <UploadCloud className="h-[50px] w-[50px] stroke-background-200" />
                <Text className="text-sm">
                  {value ? value : 'Choose notes from device'}
                </Text>
              </View>
            </TouchableOpacity>
            {error && (
              <Text className="text-red-700 text-sm mb-2"><AlertCircleIcon size={14} color={'#b91c1c'} className="me-2"/> {error.message}</Text>
            )}
          </>
        )}
      />
      {/* Thumbnail */}
      <Controller
        name="thumbnail"
        control={control}
        rules={{ required: 'Thumbnail is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TouchableOpacity
              onPress={async () => {
                const file = await selectImageByDevice();
                onChange(file?.fileName);
              }
              }
              className=""
            >
              <Text className="text-sm font-medium ">Choose Thumbnail</Text>
              <View className="my-2 items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[60px] w-full">
                <UploadCloud className="h-[50px] w-[50px] stroke-background-200" />
                <Text className="text-sm">
                  {value ? value : 'Choose thumbnail from device'}
                </Text>
              </View>
            </TouchableOpacity>
            {error && (
              <Text className="text-red-700 text-sm mb-2"><AlertCircleIcon size={14} color={'#b91c1c'} className="me-2"/> {error.message}</Text>
            )}
          </>
        )}
      />

      <ButtonNE
        onPress={handleSubmit(onSubmit)}
        loading={false}
        title="Upload"
      />
    </ScrollView>
  </View>)
}

export default UploadFileSheetNE;