import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
} from "@components/ui/actionsheet"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import React from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type actionSheetNEProps = {
    showActionsheet: boolean,
    setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>,
    handleClose: () => void,
    children: React.ReactNode
}
const ActionSheetNE: React.FC<actionSheetNEProps> = ({
    showActionsheet,
    setShowActionsheet,
    handleClose,
    children
}) => {
    const tabBarHeight = useBottomTabBarHeight();

    return<Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : tabBarHeight - 100}
        >
          <ActionsheetContent className="pb-4 px-3">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="w-full"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Actionsheet>
}


export default ActionSheetNE;