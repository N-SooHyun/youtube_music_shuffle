#include<stdio.h>
#include<stdlib.h>
#include<Windows.h>
#include<math.h>

typedef enum { STRING, OBJECT, LIST, INTEGER, DOUB } ValueType;

#define VALUESIZE 2048

//전반적인 데이터의 값을 의미
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

//{}객체를 의미 {key:value, key:value} Object -> Object
typedef struct Object {
	struct Value* key;
	struct Value* value;
	struct Object* next;
}KeyValue;

//[]리스트를 의미 값이 Object면 [{}, 1, []]  ListValue(Object) -> ListValue(int) -> ListValue(ListValue)
typedef struct ListValue {
	struct Value* value;
	struct ListValue* next;
}ListValue;



void json_parse_main() {
	struct Object* root;

	root = (struct Object*)malloc(sizeof(struct Object*) * 1024);

	root->key;

	
}