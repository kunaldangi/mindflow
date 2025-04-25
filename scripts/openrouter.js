import { config } from 'dotenv'; config();
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "MyAwesomeApp", // Optional. Site title for rankings on openrouter.ai.
    },
});

// const client = new OpenAI();

async function main() {
    //   const completion = await openai.chat.completions.create({
    //     model: "microsoft/mai-ds-r1:free",
    //     messages: [
    //       {
    //         "role": "user",
    //         "content": "What is the meaning of life?"
    //       }
    //     ],

    //   });

    //   console.log(completion.choices[0].message);

    const stream = await openai.chat.completions.create({
        model: 'microsoft/mai-ds-r1:free',
        messages: [
            { role: "system", content: "You're a helpful assistant." },
            { role: "user", content: "What's 5 + 7?" },
            { role: "assistant", content: "5 + 7 is 12." },
            { role: "user", content: "Multiply that by 2." }
            // {
            //     role: 'user',
            //     content: 'What is the value of pi? And why it\'s value is that?',
            // },
        ],
        stream: true,
    });

    let isReasonStart = false;
    let isContentStart = false;

    for await (const chunk of stream) {
        let reasoning = chunk.choices[0]?.delta?.reasoning;
        if (reasoning) {
            if (!isReasonStart) {
                isReasonStart = true;
                process.stdout.write("\n\nReasoning:\n");
            }

            process.stdout.write(reasoning);
            continue;
        }
        let content = chunk.choices[0]?.delta?.content;
        if (content) {
            if (!isContentStart) {
                isContentStart = true;
                process.stdout.write("\n\nContent:\n");
            }

            // process.stdout.write(content);
            console.log(content)
            continue;
        }
    }
}

main();