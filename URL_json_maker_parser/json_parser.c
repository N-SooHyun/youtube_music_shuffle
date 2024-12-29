#include<stdio.h>
#include<stdlib.h>
#include<Windows.h>
#include<math.h>

typedef enum { STRING, OBJECT, LIST, INTEGER, DOUB } ValueType;

#define VALUESIZE 2048

//�������� �������� ���� �ǹ�
typedef struct Value {
	ValueType type;  //0:STR, 1:OBJ, 2:LIST, 3:INT, 4:DOUB
	union {
		char stringValue[VALUESIZE];
		struct Object* object;
		struct ListValue* list;
		int intValue;
		double doubleValue;
	};
}Value;

//{}��ü�� �ǹ� {key:value, key:value} Object -> Object
typedef struct Object {
	struct Value* key;
	struct Value* value;
	struct Object* next;
}KeyValue;

//[]����Ʈ�� �ǹ� ���� Object�� [{}, 1, []]  ListValue(Object) -> ListValue(int) -> ListValue(ListValue)
typedef struct ListValue {
	struct Value* value;
	struct ListValue* next;
}ListValue;



void json_parse_main() {
	struct Object* root;

	root = (struct Object*)malloc(sizeof(struct Object*) * 1024);

	root->key;

	
}