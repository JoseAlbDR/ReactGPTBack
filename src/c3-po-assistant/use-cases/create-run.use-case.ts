import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (
  openai: OpenAI,
  { threadId, assistantId = 'asst_8sqkoBthcsHcxWBAVD8dDdNO' }: Options,
) => {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  console.log({ run });

  return run;
};
