import {
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    Input,
    useEditableControls,
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'

interface IEditableWithControls {
    template: string
    setTemplate: Dispatch<SetStateAction<string>>
}

const EditableWithControls = ({template, setTemplate}: IEditableWithControls) => {
    /* Here's a custom control */
    const EditableControls = () => {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm'>
                <IconButton icon={<CheckIcon />} aria-label="check icon" {...getSubmitButtonProps()} />
                <IconButton icon={<CloseIcon />} aria-label="close icon" {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='center'>
                <IconButton size='sm' icon={<EditIcon />} aria-label="edit icon" {...getEditButtonProps()} />
            </Flex>
        )
    }

    const handleTemplateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTemplate(event.target.value)
    }

    return (
        <Editable
            textAlign='center'
            defaultValue='Rasengan ⚡️'
            fontSize='2xl'
            isPreviewFocusable={false}
        >
            <EditablePreview />
            {/* Here is the custom input */}
            <Input as={EditableInput} value={template} onChange={handleTemplateChange} />
            <EditableControls />
        </Editable>
    )
}

export default EditableWithControls