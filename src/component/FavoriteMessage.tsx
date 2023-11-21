import { IconButton, MenuItem } from "@chakra-ui/react"
import { FavoriteMessageContext, IFavoriteMessageContext } from "context/favoriteMessageContext"
import { FC, useContext } from "react"
import { FaTrashAlt } from "react-icons/fa"
import { useDeleteFavoriteMessage } from "service/messageService"
import { IFavoriteMessage } from "component/Message/types"

export const FavoriteMessage: FC<IFavoriteMessage> = ({
    favoriteMessage,
}) => {

    const { setSelectedFavoriteQuery } = useContext<IFavoriteMessageContext>(FavoriteMessageContext)
    const deleteFavoriteMessageMutation = useDeleteFavoriteMessage()

    const handleDeleteFavoriteMessage = (favorite_message_id: number) => {
        deleteFavoriteMessageMutation.mutate(favorite_message_id)
    }

    return (
        <MenuItem justifyContent="space-between" gap={10} onClick={() => setSelectedFavoriteQuery(favoriteMessage.query)}>
            {favoriteMessage.query}
            <IconButton
                aria-label="delete-button"
                colorScheme="red"
                icon={<FaTrashAlt color="white" />}
                isLoading={deleteFavoriteMessageMutation.isLoading}
                onClick={() => handleDeleteFavoriteMessage(favoriteMessage.id)}
            ></IconButton>
        </MenuItem>
    )
}