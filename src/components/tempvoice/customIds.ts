export const tempVoiceCustomId = {
  rename: "tempvoice:rename",
  limit: "tempvoice:limit",
  privacy: "tempvoice:privacy",
  waitingRoom: "tempvoice:waiting-room",
  chat: "tempvoice:chat",
  trust: "tempvoice:trust",
  untrust: "tempvoice:untrust",
  invite: "tempvoice:invite",
  kick: "tempvoice:kick",
  region: "tempvoice:region",
  block: "tempvoice:block",
  unblock: "tempvoice:unblock",
  claim: "tempvoice:claim",
  transfer: "tempvoice:transfer",
  delete: "tempvoice:delete",
} as const;

export type TempVoiceAction =
  (typeof tempVoiceCustomId)[keyof typeof tempVoiceCustomId];

export const tempVoiceActionLabels: Record<TempVoiceAction, string> = {
  [tempVoiceCustomId.rename]: "채널 이름 변경",
  [tempVoiceCustomId.limit]: "인원 제한 설정",
  [tempVoiceCustomId.privacy]: "공개 범위 변경",
  [tempVoiceCustomId.waitingRoom]: "대기방 설정",
  [tempVoiceCustomId.chat]: "채팅 권한 변경",
  [tempVoiceCustomId.trust]: "유저 신뢰 등록",
  [tempVoiceCustomId.untrust]: "신뢰 유저 해제",
  [tempVoiceCustomId.invite]: "유저 초대",
  [tempVoiceCustomId.kick]: "유저 추방",
  [tempVoiceCustomId.region]: "음성 지역 변경",
  [tempVoiceCustomId.block]: "유저 차단",
  [tempVoiceCustomId.unblock]: "차단 유저 해제",
  [tempVoiceCustomId.claim]: "소유권 요청",
  [tempVoiceCustomId.transfer]: "소유권 이전",
  [tempVoiceCustomId.delete]: "임시 채널 삭제",
};
