#include<stdio.h>
#include<stdlib.h>
#include<Windows.h>
#include<math.h>
#include<locale.h>
#include "json_parse.h"


void txt_file_read() {
	//한글은 UTF-8이면서 2바이트 체계여서 char형식이 아닌 wchar_t형식으로 진행
	//wchar_t 형식은 fgetc, fputc와 같은것들로 1바이트가 아닌 2바이트로 받아와야해서 fputwc, fgetwc로 가져와야함

	FILE* pFile = NULL;
	wchar_t* arr;
	wchar_t end = '@';
	int max = 1024;

	arr = (wchar_t*)malloc(sizeof(wchar_t) * max);

	fopen_s(&pFile, "../URL_api_address_file/video_details.txt", "r");

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

void txt_file_json_maker() {
	FILE* pFile = NULL;
	wchar_t* arr;
	wchar_t end = '@';
	int max = 1024;

	arr = (wchar_t*)malloc(sizeof(wchar_t) * max);

	fopen_s(&pFile, "../URL_api_address_file/video_details.txt", "r");

	int i;
	int j;
	wchar_t c;

	for (i = 0; ; i++) {
		if (i > max) {
			max *= 2;
			arr = (wchar_t*)realloc(arr, sizeof(wchar_t) * max);
		}
		if ((c = fgetwc(pFile)) == end) break;
		arr[i] = c;
	}
	arr[i] = '\0';

	//arr 안에는 json으로 바꿔야할 문자열들이 기록되어있음


	

}

void json_parse_main() {
	struct Object root;
	

	

	
}