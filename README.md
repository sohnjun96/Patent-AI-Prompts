# Patent AI Prompts (Chrome Extension)

한국 특허(KR 공개번호) 분석과 ChatGPT 프롬프트 자동 전송을 지원하는 크롬 확장 프로그램입니다.

## 주요 기능

### 1) 풀페이지 앱 (`chat.html`)
- 공개번호 입력 → Google Patents 페이지에서 `Claims`, `Description` 자동 수집
- Gemini API 기반 발명 요약 생성 (버튼 클릭 시 생성)
- 탭 구성:
  - 요약 + 추가 대화
  - 청구항 카드 + 구성분석
  - 발명의 설명(청구항/설명 2컬럼)
  - 프롬프트(4종 프롬프트 카드)
- 세션/결과 로컬 저장(`chrome.storage.local`)로 재실행 시 복원

### 2) ChatGPT 사이드바 앱 (`sidepanel.html`)
- ChatGPT 탭에서 확장 아이콘 클릭 시 사이드바 오픈
- 청구항 드롭다운 카드에서 청구항 선택/조회
- 프롬프트 카드 버튼 클릭 시:
  - `#prompt-textarea`에 프롬프트 삽입
  - `#composer-submit-button` 자동 클릭으로 즉시 전송

## 프롬프트 카드 (현재 4종)

1. 인용발명 검색 프롬프트  
- 요구 입력: 특허판단 기준일

2. 진보성 판단 프롬프트  
- 요구 입력: 검토할 인용발명 번호

3. 증거찾기 프롬프트  
- 요구 입력: 청구항 번호, 검토할 인용발명 번호

4. 논문 인용문구 정리 프롬프트  
- 요구 입력: 인용발명 번호

프롬프트 템플릿은 `prompts/*.txt`에서 로드되며, 예약어(예: `{전체}`, `{발명의 요약}`, `{청구항1}` 등)가 실행 시 치환됩니다.

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/sohnjun96/Patent-AI-Prompts.git
```

2. Chrome에서 확장 프로그램 로드
- `chrome://extensions` 접속
- 우측 상단 `개발자 모드` ON
- `압축해제된 확장 프로그램을 로드합니다` 클릭
- 이 프로젝트 폴더 선택

## 사용 방법

### 풀페이지 앱
1. 확장 아이콘 클릭 (ChatGPT 탭이 아닌 일반 탭)
2. 설정 모달에서 Google AI Studio API Key 및 모델 설정
3. 공개번호 입력 후 `불러오기`
4. 요약 탭에서 `요약 생성`
5. 필요 탭에서 분석/프롬프트 생성

### ChatGPT 사이드바
1. `https://chatgpt.com` 탭으로 이동
2. 확장 아이콘 클릭 → 사이드바 열림
3. 프롬프트 카드의 `붙여넣기+전송` 클릭

## 프로젝트 구조

```text
background.js      # 특허 수집 + ChatGPT 주입/전송 + 액션 클릭 분기
manifest.json      # MV3 설정, sidePanel 권한/경로
chat.html/js/css   # 풀페이지 앱
sidepanel.html/js/css # ChatGPT 사이드바 앱
prompts/*.txt      # 분석 프롬프트 템플릿
```

## 참고
- 이 확장은 ChatGPT 입력/전송 셀렉터를 아래 값으로 사용합니다.
  - 입력: `#prompt-textarea`
  - 전송: `#composer-submit-button`
- ChatGPT UI가 변경되면 셀렉터 보정이 필요할 수 있습니다.
