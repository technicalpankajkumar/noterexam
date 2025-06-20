import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper } from "@components/ui/actionsheet";
import React from "react";
import { View } from "react-native";
import UploadFileSheetNE from "./UploadFileSheetNE";

type actionSheetNEProps = {
    showActionsheet: boolean,
    setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>,
    handleClose: () => void,
    handleAction: () => void,
}
const ActionSheetNE: React.FC<actionSheetNEProps> = ({
    showActionsheet,
    setShowActionsheet,
    handleClose,
    handleAction
}) => {

    return (
       <View>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose} >
        <ActionsheetBackdrop />
        <ActionsheetContent className="w-full flex justify-start items-start">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
         <UploadFileSheetNE/>
        </ActionsheetContent>
      </Actionsheet>
      </View>
    );
}


export default ActionSheetNE;