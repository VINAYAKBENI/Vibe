import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
//import { Agent, openai, createAgent } from "@inngest/agent-kit";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next js developer.  You write readable , maintainable code. You write simple next js & React snippets.",
      model: gemini({ model: "gemini-2.0-flash" }),
    // model: openai({ model:"gpt-4o" }),
    });
    
      const { output } = await codeAgent.run(
          `Write code snippet for the following text: ${event.data.value}`,
      );
    return {output};
  },
);
