import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { getSandbox } from "./utlis";
//import { Agent, openai, createAgent } from "@inngest/agent-kit";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const sanboxId = await step.run("get sandbox id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test-10");
      return sandbox.sandboxId
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next js developer.  You write readable , maintainable code. You write simple next js & React snippets.",
      model: gemini({ model: "gemini-2.0-flash" }),
    // model: openai({ model:"gpt-4o" }),
    });
    
      const { output } = await codeAgent.run(
          `Write code snippet for the following text: ${event.data.value}`,
      );

      const sandboxUrl = await step.run("get sandbox url", async () => {
        
        const sandbox = await getSandbox(sanboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      });
    return {output,sandboxUrl};
  },
);
