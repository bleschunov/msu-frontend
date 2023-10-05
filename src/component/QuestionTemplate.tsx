import { Circle, Grid, GridItem, HStack, Spacer, Text } from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import QuestionModel from '../model/QuestionModel'
import EditableWithControls from './EditableWithControls'

interface ITemplateQuestion {
    templateQuestions: QuestionModel[]
}

const TemplateQuestion = ({ templateQuestions }: ITemplateQuestion) => {


    return (
        <Grid
            h="200px"
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(2, 1fr)'
            gap={4}
        >
            {templateQuestions?.map(({ question }) => (
                <GridItem
                    w="full"
                    justifyContent="center"
                    alignItems="center"
                    fontStyle="italic"
                    borderWidth={2}
                    borderColor="gray.200"
                    borderRadius={10}
                    gap={1}
                    cursor="pointer"
                    _hover={{
                        background: "gray.200"
                    }}
                >
                    {/*<HStack w="full" p="1">*/}
                    {/*    <Spacer />*/}
                    {/*    */}
                    {/*</HStack>*/}
                    <EditableWithControls />
                    {/*<Text*/}
                    {/*    // TODO: fix text only in 1 full line to enable horizontal scrolling*/}
                    {/*    w="fit-content"*/}
                    {/*    wordBreak="keep-all"*/}
                    {/*    onClick={() => handleTemplateQuestionClick(question)}*/}
                    {/*    p="2"*/}
                    {/*>*/}
                    {/*    {cleanTemplateQuestion(question)}*/}
                    {/*</Text>*/}
                </GridItem>
            ))}
        </Grid>
    )
}

export default TemplateQuestion
