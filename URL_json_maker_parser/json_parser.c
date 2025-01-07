#include<stdio.h>
#include<stdlib.h>
#include<Windows.h>
#include<math.h>
#include<locale.h>
#include "json_parse.h"

int json_maker(wchar_t* key, wchar_t* value);


void txt_file_read() {
	//한글은 UTF-8이면서 2바이트 체계여서 char형식이 아닌 wchar_t형식으로 진행
	//wchar_t 형식은 fgetc, fputc와 같은것들로 1바이트가 아닌 2바이트로 받아와야해서 fputwc, fgetwc로 가져와야함

	FILE* pFile = NULL;
	wchar_t* arr;
	wchar_t end = '@';
	int max = 1024;

	arr = (wchar_t*)malloc(sizeof(wchar_t) * max);

	fopen_s(&pFile, "../URL_api_address_file/video_details_fin.txt", "r");

	int i;
	int j;
	wchar_t c;

	for (i = 0; ; i++) {
		if (i > max) {
			max *= 2;
			arr = (wchar_t*)realloc(arr, sizeof(wchar_t)*max);
		}
		if ((c = fgetwc(pFile)) == end) break;
		arr[i] = c;
	}
	arr[i] = '\0';

	FILE* wFile = NULL;

	fopen_s(&wFile, "../URL_api_address_file/test2.txt", "w");

	for (j = 0; ; j++) {
		if (arr[j] == '\0') break;
		fputwc(arr[j], wFile);
	}

}

int txt_file_json_maker() {
	FILE* pFile = NULL;
	wchar_t* arr;
	wchar_t end = '@';
	int max = 1024;

	arr = (wchar_t*)malloc(sizeof(wchar_t) * max);

	fopen_s(&pFile, "../URL_api_address_file/video_details_fin.txt", "r");

	int i, j;
	int end_num;
	wchar_t c;

	for (i = 0; ; i++) {
		if (i > max) {
			max *= 2;
			arr = (wchar_t*)realloc(arr, sizeof(wchar_t) * max);
		}
		if ((c = fgetwc(pFile)) == end) break;
		if (c == '\"' || c == '”') continue;
		arr[i] = c;
	}
	arr[i] = '\0';
	end_num = i;
	fclose(pFile);
	
	//arr 안에는 json으로 바꿔야할 문자열들이 기록되어있음
	//URL, Title, Thumbnail

	//key
	wchar_t* key = (wchar_t*)malloc(sizeof(wchar_t) * 50);

	//value
	wchar_t* ID = (wchar_t*)malloc(sizeof(wchar_t) * 1024);
	wchar_t* URL_add = (wchar_t*)malloc(sizeof(wchar_t) * 1024);
	wchar_t* Title = (wchar_t*)malloc(sizeof(wchar_t) * 1024);
	wchar_t* Thumbnail = (wchar_t*)malloc(sizeof(wchar_t) * 1024);
	wchar_t* Duration = (wchar_t*)malloc(sizeof(wchar_t) * 1024);

	i = 0;
	int json_arr_num = 0;
	while (i < end_num) {
		while (arr[i] != '\n') { 
			//ID
			if (arr[i] == 'I' && arr[i + 1] == 'D') {
				i += 4;
				for (j = 0; arr[i] != '\n'; j++, i++) {
					ID[j] = arr[i];
				}
				ID[j] = '\0';
				key[0] = 'I';
				key[1] = 'D';
				key[2] = '\0';

				json_arr_num = json_maker(key, ID);
			}

			//URL 
			if (arr[i] == 'U' && arr[i + 1] == 'R' && arr[i + 2] == 'L') {
				i += 5;
				for (j = 0; arr[i] != '\n'; j++, i++) {
					URL_add[j] = arr[i];
				}
				URL_add[j] = '\0';

				key[0] = 'U';
				key[1] = 'R';
				key[2] = 'L';
				key[3] = '\0';

				json_arr_num = json_maker(key, URL_add);
			}

			//Title
			if (arr[i] == 'T' && arr[i + 1] == 'i' && arr[i + 2] == 't' && arr[i + 3] == 'l' && arr[i + 4] == 'e') {
				i += 7;
				for (j = 0; arr[i] != '\n'; j++, i++)
					Title[j] = arr[i];
				Title[j] = '\0';

				key[0] = 'T';
				key[1] = 'i';
				key[2] = 't';
				key[3] = 'l';
				key[4] = 'e';
				key[5] = '\0';
				json_arr_num = json_maker(key, Title);
			}

			//Thumbnail
			if (arr[i] == 'T' && arr[i + 1] == 'h' && arr[i + 2] == 'u' && arr[i + 3] == 'm' && arr[i + 4] == 'b') {
				i += 11;
				for (j = 0; arr[i] != '\n'; j++, i++)
					Thumbnail[j] = arr[i];
				Thumbnail[j] = '\0';

				key[0] = 'T';
				key[1] = 'h';
				key[2] = 'u';
				key[3] = 'm';
				key[4] = 'b';
				key[5] = 'n';
				key[6] = 'a';
				key[7] = 'i';
				key[8] = 'l';
				key[9] = '\0';
				json_arr_num = json_maker(key, Thumbnail);
			}

			//Duration
			if (arr[i] == 'D' && arr[i + 1] == 'u' && arr[i + 2] == 'r' && arr[i + 3] == 'a' && arr[i + 4] == 't') {
				i += 10;
				for (j = 0; arr[i] != '\n'; j++, i++)
					Duration[j] = arr[i];
				Duration[j] = '\0';

				key[0] = 'D';
				key[1] = 'u';
				key[2] = 'r';
				key[3] = 'a';
				key[4] = 't';
				key[5] = 'i';
				key[6] = 'o';
				key[7] = 'n';
				key[8] = '\0';
				json_arr_num = json_maker(key, Duration);
			}
			i++;
		}
		i++;
	}
	free(arr);
	//key
	free(key);

	//value
	free(ID);
	free(URL_add);
	free(Title);
	free(Thumbnail);
	free(Duration);
	return json_arr_num;
}

wchar_t* json = NULL;

int json_maker(wchar_t *key, wchar_t *value) {
	static int max = 1024;

	int j;
	static int i = 1;

	for (j = 0; ; j++,i++) {

		if (key[j] == 'I' && key[j + 1] == 'D') {//ID
			if (i >= max || i + 50 >= max) {
				max *= 2;
				json = (wchar_t*)realloc(json, sizeof(wchar_t*) * max);
			}
			if (i != 1)
				json[i++] = ',';

			json[i++] = '{';
			json[i++] = '\"';

			for (j = 0; key[j] != '\0'; j++, i++) {
				json[i] = key[j];
			}
			json[i++] = '\"';
			json[i++] = ':';

			json[i++] = '\"';
			for (j = 0; value[j] != '\0'; j++, i++) {
				json[i] = value[j];
			}
			json[i++] = '\"';
			json[i++] = ',';
			break;

		}else if (key[j] == 'U') { //URL
			if (i >= max || i+50 >= max) {
				max *= 2;
				json = (wchar_t*)realloc(json, sizeof(wchar_t*) * max);
			}

			json[i++] = '\"';
			
			for (j = 0; key[j] != '\0'; j++, i++) {
				json[i] = key[j];
			}

			json[i++] = '\"';
			json[i++] = ':';

			json[i++] = '\"';
			for (j = 0; value[j] != '\0'; j++, i++) {
				json[i] = value[j];
			}
			json[i++] = '\"';
			json[i++] = ',';
			break;
		}
		else if (key[j] == 'T' && key[j + 1] == 'i') { //Title
			if (i >= max || i + 50 >= max) {
				max *= 2;
				json = (wchar_t*)realloc(json, sizeof(wchar_t*) * max);
			}
			json[i++] = '\"';

			for (j = 0; key[j] != '\0'; j++, i++) {
				json[i] = key[j];
			}

			json[i++] = '\"';
			json[i++] = ':';

			json[i++] = '\"';
			for (j = 0; value[j] != '\0'; j++, i++) {
				json[i] = value[j];
			}
			json[i++] = '\"';
			json[i++] = ',';
			break;
		}
		else if (key[j] == 'T' && key[j + 1] == 'h') { //Thumbnail
			if (i >= max || i + 50 >= max) {
				max *= 2;
				json = (wchar_t*)realloc(json, sizeof(wchar_t*) * max);
			}
			json[i++] = '\"';

			for (j = 0; key[j] != '\0'; j++, i++) {
				json[i] = key[j];
			}

			json[i++] = '\"';
			json[i++] = ':';

			json[i++] = '\"';
			for (j = 0; value[j] != '\0'; j++, i++) {
				json[i] = value[j];
			}
			json[i++] = '\"';
			json[i++] = ',';
			break;
		}
		else if (key[j] == 'D' && key[j + 1] == 'u' && key[j + 2] == 'r') { //Duration
			if (i >= max || i + 50 >= max) {
				max *= 2;
				json = (wchar_t*)realloc(json, sizeof(wchar_t*) * max);
			}
			json[i++] = '\"';

			for (j = 0; key[j] != '\0'; j++, i++) {
				json[i] = key[j];
			}

			json[i++] = '\"';
			json[i++] = ':';

			for (j = 0; value[j] != '\0'; j++, i++) {
				json[i] = value[j];
			}
			json[i++] = '}';
			break;
		}
	}
	return i;
}

void json_file_maker() {
	FILE* wwFile = NULL;
	fopen_s(&wwFile,"../URL_api_address_file/youtube_music.json", "w");
	int i=0;
	while (json[i] != '\0') {
		fputwc(json[i], wwFile);
		i++;
	}

	

}

void json_parse_main() {
	json = (wchar_t*)malloc(sizeof(wchar_t) * 1024);
	json[0] = '[';


	int end_num = txt_file_json_maker();
	
	json[end_num++] = ']';
	json[end_num] = '\0';
	json_file_maker();
	
	

	
}