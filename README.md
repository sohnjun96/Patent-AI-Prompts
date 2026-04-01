# Patent-AI-Prompts (Chrome Extension)

한국 특허(KR 공개/출원번호) 기반 분석과 프롬프트 생성, ChatGPT 전송을 지원하는 Chrome 확장 프로그램입니다.

## 핵심 기능

### 1) 메인 페이지 (`chat.html`)
- Google Patents에서 `Claims`, `Description` 자동 수집
- Gemini API 기반 요약/청구항 분석
- Claim Changes 탭:
  - KIPRIS 변동 이력 로드
  - 선택한 Receipt Group vs 직전 Group 비교
  - AI 청구항 개정 해석(JSON) 실행
  - 요약 표 렌더링 (`청구항 | 종류 | 비고`)
  - 비고 클릭 시 수정보기 모달(diff)
    - 추가: 파란색 밑줄
    - 삭제: 빨간색 취소선
  - 기존 raw diff는 보조 정보로 유지
- 작업 상태/결과 세션 복원 (`chrome.storage.local`)

### 2) ChatGPT 사이드패널 (`sidepanel.html`)
- ChatGPT 페이지에서 확장 아이콘 클릭 시 사이드패널 오픈
- 프롬프트 카드에서 `붙여넣기 + 전송` 자동화

## Claim Changes AI 해석 유형

다음 변경 유형을 구조적으로 판정합니다.

- `claim_combination` (UI 표기: 병합)
- `reference_fix` (인용항 정정)
- `claim_deletion` (삭제)
- `new_content_addition` (신규 추가)
- `claim_renumbering` (번호 정정)

프롬프트: [`prompts/claim_changes.txt`](./prompts/claim_changes.txt)

## 프롬프트 파일

`prompts/*.txt` 템플릿을 로드해 변수 치환 후 모델에 전달합니다.

- `summary.txt`
- `claim_component.txt`
- `highlight_terms.txt`
- `claim_changes.txt`
- `citation_search.txt`
- `inventive_step_review.txt`
- `evidence_find.txt`
- `paper_citation_format.txt`
- `followup_chat.txt`

## 설치

1. 저장소 클론
```bash
git clone https://github.com/sohnjun96/Patent-AI-Prompts.git
```

2. Chrome에서 확장 로드
- `chrome://extensions` 이동
- `개발자 모드` ON
- `압축해제된 확장 프로그램 로드` 클릭
- 프로젝트 폴더 선택

## 사용 방법

### 메인 페이지
1. 확장 아이콘 클릭
2. 설정에서 Google AI Studio API Key 입력
3. 공개번호/출원번호로 특허 로드
4. 요약/청구항 분석 실행
5. Claim Changes 탭에서:
   - `Load History`
   - Receipt Group 선택
   - `Analyze Changes`
   - 요약 표 확인
   - 비고 클릭으로 수정보기 모달 확인

### ChatGPT 사이드패널
1. `https://chatgpt.com` 이동
2. 확장 아이콘 클릭
3. 원하는 프롬프트 카드 실행

## 프로젝트 구조

```text
background.js           # 특허 데이터 수집 및 백그라운드 처리
chat.html/js/css        # 메인 UI, 분석 로직
sidepanel.html/js/css   # ChatGPT 사이드패널 UI
manifest.json           # MV3 설정
prompts/*.txt           # 프롬프트 템플릿
```

## 참고

- ChatGPT 전송 셀렉터
  - 입력: `#prompt-textarea`
  - 전송: `#composer-submit-button`
- ChatGPT UI 변경 시 셀렉터 수정이 필요할 수 있습니다.
