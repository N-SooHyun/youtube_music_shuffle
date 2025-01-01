from googleapiclient.discovery import build
import os
import isodate  # ISO 8601 시간 형식을 변환하기 위한 라이브러리

# API 키 설정
api_key = ''  # 여기에 생성한 API 키 입력

# YouTube API 클라이언트 초기화
youtube = build('youtube', 'v3', developerKey=api_key)

def get_video_details(video_url):
    """주어진 YouTube URL에서 videoId를 추출하여 제목, 썸네일, 재생 시간 가져오는 함수"""
    video_id = video_url.split('v=')[1]
    
    # API 호출하여 비디오 정보 가져오기
    request = youtube.videos().list(
        part="snippet,contentDetails",  # 제목, 썸네일, 재생 시간을 포함한 파트
        id=video_id
    )
    
    response = request.execute()
    
    if response['items']:
        video_info = response['items'][0]
        
        # 비디오 제목, 썸네일, 재생 시간
        title = video_info['snippet']['title']
        thumbnail_url = video_info['snippet']['thumbnails']['high']['url']
        duration = video_info['contentDetails']['duration']

        
        # ISO 8601 duration을 초 단위로 변환
        duration_seconds = isodate.parse_duration(duration).total_seconds()
        duration_seconds = int(duration_seconds)
        
        return title, thumbnail_url, duration_seconds
    else:
        return None, None, None

def process_urls_from_file(filename):
    """메모장에서 URL을 읽어와서 비디오 제목, 썸네일, 재생 시간을 처리하는 함수"""
    with open(filename, 'r', encoding='utf-8') as f:
        urls = f.readlines()
    
    video_details = []
    
    for url in urls:
        url = url.strip()  # URL의 공백 문자 제거
        title, thumbnail_url, duration = get_video_details(url)
        
        if title and thumbnail_url and duration is not None:
            video_details.append({
                'url': url,
                'title': title,
                'thumbnail': thumbnail_url,
                'duration': duration  # 재생 시간 추가
            })
    
    return video_details

def save_video_details_to_txt(video_details, filename="video_details_fin.txt"):
    """제목, 썸네일, 재생 시간을 텍스트 파일로 저장하는 함수"""
    with open(filename, 'w', encoding='utf-8') as f:
        for detail in video_details:
            f.write(f"URL: {detail['url']}\n")
            f.write(f"Title: {detail['title']}\n")
            f.write(f"Thumbnail: {detail['thumbnail']}\n")
            f.write(f"Duration: {detail['duration']}\n")  # 재생 시간도 저장
            f.write("\n--------------------\n")

# 메모장에서 URL을 읽어들여 각 비디오에 대한 정보를 가져옴
video_details = process_urls_from_file("youtube_playlist_urls.txt") 

# 가져온 비디오 정보를 텍스트 파일에 저장
save_video_details_to_txt(video_details)
print(f"{len(video_details)}개의 비디오 정보를 파일에 저장했습니다.")
