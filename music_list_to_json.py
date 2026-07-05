from googleapiclient.discovery import build
import json

# ── 설정 ─────────────────────────────────────────────
api_key = ''        # 발급받은 API 키 입력
PLAYLIST_ID = ''    # 재생목록 ID 입력 (URL의 list= 뒤 부분).
                    # 비워두면 아래 URL_FILE 에서 URL 목록을 읽어옴.
URL_FILE = 'youtube_playlist_urls.txt'   # 기존 방식 호환용
OUTPUT_JSON = 'Music/NewAge1.json'
# ────────────────────────────────────────────────────

youtube = build('youtube', 'v3', developerKey=api_key)


def get_video_ids_from_playlist(playlist_id):
    """재생목록 ID로 영상 ID 전체를 추출 (50개씩 페이지네이션).
    공개/일부공개 재생목록이면 소유자/참여자 여부와 무관하게 API 키만으로 동작."""
    # 전체 URL을 넣어도 list= 뒤의 ID만 자동으로 추출
    if 'list=' in playlist_id:
        playlist_id = playlist_id.split('list=')[1].split('&')[0]
    video_ids = []
    page_token = None
    while True:
        resp = youtube.playlistItems().list(
            part='contentDetails',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=page_token,
        ).execute()
        for item in resp['items']:
            video_ids.append(item['contentDetails']['videoId'])
        page_token = resp.get('nextPageToken')
        if not page_token:
            break
    return video_ids


def get_video_ids_from_file(filename):
    """기존처럼 텍스트 파일의 URL 목록에서 영상 ID 추출.
    v= 뒤에 &list= 등 다른 파라미터가 붙어 있어도 안전하게 처리."""
    ids = []
    with open(filename, 'r', encoding='utf-8') as f:
        for line in f:
            url = line.strip()
            if 'v=' in url:
                ids.append(url.split('v=')[1].split('&')[0])
    return ids


def fetch_video_details(video_ids):
    """영상 ID 목록 → 제목/썸네일. videos.list는 한 번에 50개까지 가능."""
    details = []
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i + 50]
        resp = youtube.videos().list(
            part='snippet',
            id=','.join(chunk),
        ).execute()
        for info in resp['items']:
            details.append({
                'url': f"https://www.youtube.com/watch?v={info['id']}",
                'title': info['snippet']['title'],
                'thumbnail': info['snippet']['thumbnails']['high']['url'],
            })
    return details


def save_to_json(video_details, filename=OUTPUT_JSON):
    """웹서버용 구조(ID/URL/Title/Thumbnail, ID는 문자열)로 JSON 저장."""
    data = [
        {
            'ID': str(idx),
            'URL': detail['url'],
            'Title': detail['title'],
            'Thumbnail': detail['thumbnail'],
        }
        for idx, detail in enumerate(video_details)
    ]
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return data


if __name__ == '__main__':
    if PLAYLIST_ID:
        ids = get_video_ids_from_playlist(PLAYLIST_ID)
    else:
        ids = get_video_ids_from_file(URL_FILE)

    video_details = fetch_video_details(ids)
    save_to_json(video_details)
    print(f"{len(video_details)}개의 비디오 정보를 {OUTPUT_JSON}에 저장했습니다.")
