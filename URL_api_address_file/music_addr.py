from googleapiclient.discovery import build
import os

# API 키와 재생목록 ID 설정
api_key = ''  # 여기에 생성한 API 키 입력
playlist_id = ''  # 재생목록 ID를 입력 (URL에서 확인 가능)

# YouTube API 클라이언트 초기화
youtube = build('youtube', 'v3', developerKey=api_key)

def get_video_urls(playlist_id):
    video_urls = []
    next_page_token = None

    while True:
        # 재생목록의 비디오 목록을 가져옴
        playlist_items_request = youtube.playlistItems().list(
            part='snippet',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        
        playlist_items_response = playlist_items_request.execute()

        # 비디오 URL을 리스트에 추가
        for item in playlist_items_response['items']:
            video_id = item['snippet']['resourceId']['videoId']
            video_url = f'https://www.youtube.com/watch?v={video_id}'
            video_urls.append(video_url)

        # 다음 페이지가 있을 경우
        next_page_token = playlist_items_response.get('nextPageToken')

        if not next_page_token:
            break

    return video_urls

def save_to_txt(video_urls, filename="youtube_playlist_urls.txt"):
    # URL을 텍스트 파일에 저장
    with open(filename, 'w', encoding='utf-8') as f:
        for url in video_urls:
            f.write(url + '\n')

# 비디오 URL 가져오기
video_urls = get_video_urls(playlist_id)

# 텍스트 파일에 저장
save_to_txt(video_urls)
print(f"{len(video_urls)}개의 URL을 파일에 저장했습니다.")
