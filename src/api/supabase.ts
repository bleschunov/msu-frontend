import {createClient} from "@supabase/supabase-js";
import {MessageModel} from "../component/Message";
import {ReviewModel} from "../model/ReviewModel";

const supabase = createClient("https://jkhlwowgrekoqgvfruhq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGx3b3dncmVrb3FndmZydWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NTcwMzQsImV4cCI6MjAwNjAzMzAzNH0.5PLTJ0CaG1n9EdWC-M3B2-p9WK6VCdxTr7eNnPON4oU")

const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
}

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
}

const insertReview = async (reviewModel: ReviewModel) => {
    const { data, error } = await supabase.from("review").insert(reviewModel).select()
    return data
}

const getMessagesByChatId = async (chatId: string) => {
    const { data, error } = await supabase.from("message").select(`
        answer,
        chat_id,
        created_at,
        exception,
        id,
        note,
        query,
        sql,
        table,
        review (
            id,
            commentary,
            mark,
            message_id
        )
    `).eq("chat_id", chatId)
    return data
}

const insertMessage = async (messageModel: MessageModel) => {
    const { data, error } = await supabase.from("message").insert(messageModel)
    return data
}

const getOrCreateChat = async (userId: string) => {
    const existingChats = await supabase.from("chat").select().eq("user_id", userId)
    if (existingChats.data?.length != 0) {
        return existingChats
    }

    const { data, error } = await supabase.from("chat").insert({ "user_id": userId }).select()
    // @ts-ignore
    await insertMessage({chat_id: data[0].id, answer: "Какой у вас запрос?"})
    return data
}

const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export {
    supabase,
    signInWithEmail,
    signOut,
    getMessagesByChatId,
    insertMessage,
    getUser,
    getOrCreateChat,
    insertReview
}
