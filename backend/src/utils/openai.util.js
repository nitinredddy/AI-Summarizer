import {Configuration,OpenAIApi} from 'openai'

const configuration = new Configuration({
    apiKey:process.env.OPEN_AI_SECRET
})

const openAi = new OpenAIApi(configuration)

export const summarizeText = async(yourText)=>{
    const response = await openAi.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[
            {role:"system",content:"You are a helpful assistant that summarizes notes."},
            {role:"user",content:"Summarize this : "+yourText}
        ]
    })
    return response.data.choices[0].message.content
}
