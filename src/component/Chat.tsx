import {useMutation} from 'react-query';
import {useState} from "react";
import {getPrediction} from "../api/client";

function Chat() {
    const [query, setQuery] = useState("")
    const [value, setValue] = useState("")

    const mutation = useMutation(getPrediction, {
        onSuccess: async (response) => {
            setValue(response.data.answer)
        }
    })

    const handleSubmit = () => {
        mutation.mutate({query})
    }

    return (
        <div>
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <button onClick={handleSubmit}>Send</button>
            <div>{mutation.isLoading ? 'Loading...' : value}</div>
        </div>
    )
}

export default Chat