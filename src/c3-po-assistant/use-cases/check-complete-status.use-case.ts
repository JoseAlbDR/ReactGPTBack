import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  { threadId, runId }: Options,
) => {
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  console.log({ status: runStatus.status }); // completed

  if (runStatus.status === 'completed') return runStatus;

  // if(runStatus.status === "failed") ...

  // if (runStatus.status === "cancelled")...
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkCompleteStatusUseCase(openai, { threadId, runId });
};
