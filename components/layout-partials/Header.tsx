import { useRouter } from "expo-router";
import { Bell, NotebookPen, Search, Undo2 } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";


export const Header = ({backButton = false ,bellIcon=true,searchControl,title='Noter Exam'}: {title?:string,bellIcon?:boolean, backButton?: boolean,searchControl?:()=>void }) => {
    const router = useRouter();
    const back=()=>{
        router.back()
    }

  return (
      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-2 pt-2 pb-1 bg-white border-b border-gray-200">
        {backButton ? <TouchableOpacity className='flex-row items-center gap-1 mb-1' onPress={back}>
          <Undo2 size={22} color={'#1e40af'} fontWeight={'bold'} />
          <Text className="text-xl font-bold text-blue-800">{'Back'}</Text>
        </TouchableOpacity> :<View className='flex-row items-center gap-1'>
          <NotebookPen size={20} color={'#1e40af'} fontWeight={'bold'} />
          <Text className="text-xl font-bold text-blue-800">{title}</Text>
        </View>}
        <View className="flex-row space-x-3">
          {searchControl && <TouchableOpacity
            className="p-2"
            onPress={searchControl}
          >
            <Search size={24} color="#333" />
          </TouchableOpacity>}
          {bellIcon && <TouchableOpacity className="p-2">
            <Bell size={24} color="#333" />
          </TouchableOpacity>}
        </View>
      </View>
  )
}