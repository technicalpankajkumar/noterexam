import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
} from "@components/ui/actionsheet"
import React from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"

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

    return <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust as needed
        >
            <ActionsheetContent className="pb-4 px-3">
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                    {children}
                </ScrollView>
            </ActionsheetContent>
        </KeyboardAvoidingView>
    </Actionsheet>
}


export default ActionSheetNE;