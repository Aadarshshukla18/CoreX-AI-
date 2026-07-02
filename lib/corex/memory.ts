type SessionMemory = {
  currentLead?: any;
  currentMeeting?: any;
  currentTask?: any;
  currentDeal?: any;
  currentEmail?: any;
};

const memory = new Map<string, SessionMemory>();

export function getMemory(userId: string): SessionMemory {
  return memory.get(userId) || {};
}

export function setMemory(
  userId: string,
  data: Partial<SessionMemory>
) {
  const current = memory.get(userId) || {};

  memory.set(userId, {
    ...current,
    ...data,
  });
}

export function clearMemory(userId: string) {
  memory.delete(userId);
}