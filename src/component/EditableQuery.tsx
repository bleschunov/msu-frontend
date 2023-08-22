import {Box, Editable, EditableInput, EditablePreview, Input, Tooltip, useEditableControls} from "@chakra-ui/react";
import {useState} from "react";

const EditableQuery = () => {
    const [value, setValue] = useState("something")
    const [clickableValue, setClickableValue] = useState("another")

    const CustomEditablePreview = () => {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps
        } = useEditableControls();

        if (isEditing) {
            return <EditablePreview
                py={2}
                px={4}
                _hover={{
                    background: "gray.100"
                }}
            />
        }

        return (<>{value.split(" ").map(v => <Box>{v}!</Box>)}</>)
    }

    return (
        <Editable
            value={clickableValue}
            defaultValue="Rasengan ⚡️"
            isPreviewFocusable={true}
            selectAllOnFocus={false}
        >
            <Tooltip label="Click to edit" shouldWrapChildren={true}>
                <CustomEditablePreview />
            </Tooltip>
            <Input py={2} px={4} as={EditableInput} />
        </Editable>
    )
}

export default EditableQuery