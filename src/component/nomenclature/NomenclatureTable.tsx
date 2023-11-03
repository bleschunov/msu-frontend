import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { useQuery } from 'react-query'
import NomenclatureRow from './NomenclatureRow'
import { getNomenclatureMappingJobs } from '../../api/nomenclatureMappingJobApi'

export const NomenclatureTable = () => {

    const { data: nomenclatureMappingJobs } = useQuery("getNomenclatureMappingJobs", getNomenclatureMappingJobs)

    return (
        <TableContainer>
            <Table size="md">
                <Thead>
                    <Tr>
                        <Th>Статус</Th>
                        <Th>Номенклатура</Th>
                        <Th>Правильно?</Th>
                        <Th>Группа 1</Th>
                        <Th>Группа 2</Th>
                        <Th>Группа 3</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { nomenclatureMappingJobs?.map(job => <NomenclatureRow nomenclatureMappingJob={job}/>)}
                </Tbody>
            </Table>
        </TableContainer>
    )
}