type Context = {
  currentLead?: any;
  currentMeeting?: any;
  currentTask?: any;
  currentDeal?: any;
  currentEmailDraft?: any;
};

const contexts = new Map<string, Context>();

export function getContext(userId: string): Context {
  return contexts.get(userId) || {};
}

export function updateContext(
  userId: string,
  data: Partial<Context>
) {
  const current = contexts.get(userId) || {};

  contexts.set(userId, {
    ...current,
    ...data,
  });
}

export function clearContext(userId: string) {
  contexts.delete(userId);
}