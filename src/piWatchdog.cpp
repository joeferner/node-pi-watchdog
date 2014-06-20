
#include "piWatchdog.h"

extern "C" {
  static void init(v8::Handle<v8::Object> target) {
    PiWatchdog::Init(target);
  }

  NODE_MODULE(nodepiwatchdog_bindings, init);
}

#ifdef WIN32
BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) {
  return TRUE;
}
#endif

/*static*/ v8::Persistent<v8::FunctionTemplate> PiWatchdog::s_ct;

/*static*/ void PiWatchdog::Init(v8::Handle<v8::Object> target) {
  NanScope();

  v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(New);
  NanAssignPersistent(s_ct, t);
  s_ct->InstanceTemplate()->SetInternalFieldCount(1);
  s_ct->SetClassName(v8::String::NewSymbol("PiWatchdog"));

  NODE_SET_PROTOTYPE_METHOD(s_ct, "getTimeout", getTimeout);

  target->Set(v8::String::NewSymbol("PiWatchdog"), s_ct->GetFunction());
}

NAN_METHOD(PiWatchdog::New) {
  NanScope();

  PiWatchdog *self = new PiWatchdog();
  self->Wrap(args.This());

  NanReturnValue(args.This());
}

NAN_METHOD(PiWatchdog::getTimeout) {
  NanScope();

  NanReturnValue(args.This());
}