import "dotenv/config";

import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { kMaxLength } from "buffer";

// AGENT
/*
Model - OpenAI GPT 4o
Memory - Short Term, Long Term.
Tools - Tavily Search (web search - figuring out proximity), Parser Tool (DIY)
*/

const webSearchAgent = async ({ description }) => {
  try {
    console.log("Initializing TavilySearch tool...");
    const webTool = new TavilySearch({
      maxResults: 3,
      tavilyApiKey: process.env.TAVILY_API_KEY,
    });

    console.log("Initializing ChatOpenAI model...");
    //TODO: OPENROUTER INTEGRATION GOES HERE
    // const agentModel = //OPENROUTER INTEGRATION
    const agentModel = new ChatOpenAI({
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 2,
    });

    const agentCheckpointer = new MemorySaver(); // Initialize memory to persist state between graph runs

    console.log("Creating React agent...");
    const agent = createReactAgent({
      llm: agentModel,
      tools: [webTool],
      checkpointSaver: agentCheckpointer,
    });

    const question = new HumanMessage(JSON.stringify(description));

    console.log("Invoking agent with question:", description);
    const agentNextState = await agent.invoke(
      { messages: [question] },
      { configurable: { thread_id: "vndfjkvnjkdf" } }
    );

    console.log(
      agentNextState.messages[agentNextState.messages.length - 1].content
    );

    const result =
      agentNextState.messages[agentNextState.messages.length - 1].content;

    return result;
  } catch (error) {
    console.error("Error in webSearchAgent:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

export default webSearchAgent;
