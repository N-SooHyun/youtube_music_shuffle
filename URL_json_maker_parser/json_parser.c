#include<stdio.h>
#include<stdlib.h>
#include<Windows.h>
#include<math.h>
#include<locale.h>
#include "json_parse.h"


void txt_file_read() {
	//�ѱ��� UTF-8�̸鼭 2����Ʈ ü�迩�� char������ �ƴ� wchar_t�������� ����
	//wchar_t ������ fgetc, fputc�� �����͵�� 1����Ʈ�� �ƴ� 2����Ʈ�� �޾ƿ;��ؼ� fputwc, fgetwc�� �����;���

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

	//arr �ȿ��� json���� �ٲ���� ���ڿ����� ��ϵǾ�����


	

}

void json_parse_main() {
	struct Object root;
	

	

	
}