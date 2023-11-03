import React, { FC } from 'react'
import { Td, Tr, Text, ButtonGroup, IconButton } from '@chakra-ui/react'
import { INomenclatureRow } from './type'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { useMutation } from 'react-query'
import { updateNomenclatureMapping } from '../../api/nomenclatureMappingJobApi'
import queryClient from '../../api/queryClient'
import { NomenclatureMappingJobModel } from '../../model/NomenclatureMappingJobModel'


const NomenclatureRow: FC<INomenclatureRow> = ({ nomenclatureMappingJob }) => {

    const nomenclatureMappingMutation = useMutation("updateNomenclatureMapping", updateNomenclatureMapping)

    const handleCorrectButtonClick = () => {
        queryClient.setQueryData<NomenclatureMappingJobModel[]>("getNomenclatureMappingJobs", prevData => {
            prevData = prevData!.filter(job => job.id !== nomenclatureMappingJob.id)
            return [...prevData!, {...nomenclatureMappingJob, correctness: "correct"}]
        })
        nomenclatureMappingMutation.mutate({ id: nomenclatureMappingJob.id!, correctness: "correct"})
        queryClient.invalidateQueries("getNomenclatureMappingJobs")
    }

    const handleIncorrectButtonClick = () => {
        queryClient.setQueryData<NomenclatureMappingJobModel[]>("getNomenclatureMappingJobs", prevData => {
            prevData = prevData!.filter(job => job.id !== nomenclatureMappingJob.id)
            return [...prevData!, {...nomenclatureMappingJob, correctness: "incorrect"}]
        })
        nomenclatureMappingMutation.mutate({ id: nomenclatureMappingJob.id!, correctness: 'incorrect' })
        queryClient.invalidateQueries("getNomenclatureMappingJobs")
    }

    return (
        <Tr>
            <Td>{nomenclatureMappingJob.status}</Td>
            <Td>
                <Text as="b">Что мапим: </Text>{nomenclatureMappingJob.input}
                <br />
                <Text as="b">На что замапили: </Text>{nomenclatureMappingJob.output}
            </Td>
            <Td>
                { nomenclatureMappingJob.id &&
                    <ButtonGroup size='sm' isAttached variant='outline'>
                        <IconButton
                            onClick={handleCorrectButtonClick}
                            variant={nomenclatureMappingJob.correctness === "correct" ? "solid" : "outline"}
                            aria-label='Правильно'
                            icon={<CheckIcon />}
                        />
                        <IconButton
                            onClick={handleIncorrectButtonClick}
                            variant={nomenclatureMappingJob.correctness === "incorrect" ? "solid" : "outline"}
                            aria-label="Не правильно"
                            icon={<CloseIcon />}
                        />
                    </ButtonGroup>
                }
            </Td>
            <Td>{nomenclatureMappingJob.narrow_group}</Td>
            <Td>{nomenclatureMappingJob.middle_group}</Td>
            <Td>{nomenclatureMappingJob.wide_group}</Td>
        </Tr>
    )
}

export default NomenclatureRow