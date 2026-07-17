# Discord TempVoice App

Discord 서버의 임시 음성 채널을 사용자가 직접 관리할 수 있도록 만드는 봇 프로젝트입니다.

버튼과 모달로 구성된 관리 패널을 통해 채널 이름과 인원 제한을 변경할 수 있으며, 이후 채널 공개 범위와 사용자 권한, 소유권 이전 같은 관리 기능을 단계적으로 추가하고 있습니다.

## 현재 구현된 기능

- TempVoice 관리 패널 임베드
- 버튼 기반 상호작용 처리
- 채널 이름 변경 모달
- 음성 채널 인원 제한 설정
- 음성 채널 소유권 요청
- 같은 음성 채널 사용자에게 소유권 이전
- 기존 소유자 이탈 시 소유권 재요청
- `0` 입력 시 인원 제한 해제
- 사용자의 음성 채널 참여 상태 확인
- 모달 입력값 검증
- 사용자에게만 보이는 처리 결과 안내
- 환경 변수 유효성 검사
- 실행 로그 및 오류 처리
- 확인 절차가 포함된 음성 채널 삭제

## 추가할 기능

- 채널 잠금 및 잠금 해제
- 공개 및 비공개 전환
- 대기방 설정
- 채팅 권한 관리
- 사용자 신뢰 및 차단
- 사용자 초대 및 추방
- 음성 지역 변경
- 채널 소유권 요청 및 이전
- 임시 음성 채널 삭제
- 사용하지 않는 채널 자동 정리

## 기술 구성

- TypeScript
- Node.js
- discord.js v14
- dotenv
- zod

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 파일 생성

Windows PowerShell에서는 다음 명령어를 사용합니다.

```powershell
Copy-Item .env.example .env
```

macOS 또는 Linux에서는 다음 명령어를 사용합니다.

```bash
cp .env.example .env
```

생성한 `.env` 파일에 Discord 애플리케이션 정보를 입력합니다.

```env
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-application-id
GUILD_ID=your-test-server-id
```

각 항목에는 다음 값을 입력해야 합니다.

- `DISCORD_TOKEN`: Discord 봇 토큰
- `CLIENT_ID`: Discord 애플리케이션 ID
- `GUILD_ID`: 명령어를 등록할 테스트 서버 ID

`.env` 파일에는 봇 토큰이 포함되므로 저장소에 커밋하지 않습니다.

### 3. 슬래시 명령어 등록

```bash
npm run register
```

### 4. 개발 모드 실행

```bash
npm run dev
```

### 5. 빌드 확인

```bash
npm run build
```

### 6. 빌드 결과 실행

```bash
npm start
```

## 사용 가능한 명령어

### `/tempvoice-panel`

TempVoice 관리 패널을 현재 채널에 전송합니다.

이 명령어는 서버 관리 권한이 있는 사용자만 실행할 수 있습니다.

## 관리 패널 동작

현재 관리 패널에서는 다음 기능을 사용할 수 있습니다.

### 채널 이름 변경

1. 사용자가 음성 채널에 접속합니다.
2. 관리 패널에서 `Name` 버튼을 누릅니다.
3. 모달에 새로운 채널 이름을 입력합니다.
4. 입력값 검증 후 현재 음성 채널 이름을 변경합니다.

### 인원 제한 설정

1. 사용자가 음성 채널에 접속합니다.
2. 관리 패널에서 `Limit` 버튼을 누릅니다.
3. 모달에 `0`부터 `99` 사이의 숫자를 입력합니다.
4. 입력한 값으로 현재 음성 채널의 인원 제한을 변경합니다.

`0`을 입력하면 인원 제한이 해제됩니다.

## 프로젝트 구조

```text
src
├─ commands
│  └─ tempvoice-panel.ts
├─ components
│  └─ tempvoice
│     ├─ customIds.ts
│     └─ panel.ts
├─ config
│  └─ env.ts
├─ interactions
│  ├─ handleInteraction.ts
│  ├─ tempvoice-buttons.ts
│  └─ tempvoice-modals.ts
├─ services
│  └─ tempvoice.service.ts
├─ utils
│  └─ logger.ts
├─ index.ts
└─ register-commands.ts
```

## 주요 파일

### `src/components/tempvoice/panel.ts`

TempVoice 관리 임베드와 버튼 컴포넌트를 생성합니다.

### `src/components/tempvoice/customIds.ts`

버튼, 모달, 입력 필드에서 사용하는 custom id를 관리합니다.

### `src/interactions/tempvoice-buttons.ts`

관리 패널의 버튼 상호작용을 처리하고 필요한 모달을 표시합니다.

### `src/interactions/tempvoice-modals.ts`

모달에서 제출된 값을 검증하고 음성 채널 설정에 반영합니다.

### `src/services/tempvoice.service.ts`

채널 이름 변경과 인원 제한 설정처럼 Discord 음성 채널을 변경하는 작업을 담당합니다.

### `src/config/env.ts`

필수 환경 변수가 올바르게 설정되어 있는지 확인합니다.

### `src/utils/logger.ts`

봇 실행 상태와 오류를 일정한 형식으로 출력합니다.

## 작업 현황

- [x] 프로젝트 기본 구조 구성
- [x] TempVoice 관리 패널 추가
- [x] 슬래시 명령어 등록 흐름 구성
- [x] 환경 변수 검증 추가
- [x] 실행 로그 및 오류 처리 정리
- [x] 채널 이름 변경 모달 추가
- [x] 인원 제한 설정 모달 추가
- [ ] 채널 잠금 및 잠금 해제
- [ ] 공개 범위 설정
- [ ] 사용자 권한 관리
- [x] 음성 채널 소유권 요청
- [x] 음성 채널 소유권 이전
- [x] 음성 채널 삭제 확인 기능
- [ ] 사용하지 않는 임시 음성 채널 자동 정리

## 문서

- [`docs/interaction-flow.md`](docs/interaction-flow.md): 상호작용 처리 흐름
- [`docs/roadmap.md`](docs/roadmap.md): 기능 개발 순서와 작업 계획
