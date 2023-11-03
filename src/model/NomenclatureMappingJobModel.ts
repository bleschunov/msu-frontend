interface NomenclatureMappingJobModel {
    id: number | null
    input: string
    output: string | null
    status: string | null
    correctness: string | null
    wide_group: string | null
    middle_group: string | null
    narrow_group: string | null
}

export type {
    NomenclatureMappingJobModel
}