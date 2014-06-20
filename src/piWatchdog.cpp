
#include "piWatchdog.h"
#include <string>
#include <sstream>
#include <stdio.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <linux/watchdog.h>

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
  NODE_SET_PROTOTYPE_METHOD(s_ct, "setTimeout", setTimeout);
  NODE_SET_PROTOTYPE_METHOD(s_ct, "heartbeat", heartbeat);
  NODE_SET_PROTOTYPE_METHOD(s_ct, "disable", disable);

  target->Set(v8::String::NewSymbol("PiWatchdog"), s_ct->GetFunction());
}

PiWatchdog::PiWatchdog() {
}

PiWatchdog::~PiWatchdog() {
}

NAN_METHOD(PiWatchdog::New) {
  NanScope();

  PiWatchdog *self = new PiWatchdog();
  self->Wrap(args.This());

  NanReturnValue(args.This());
}

#define OPEN_DEVICE(fileName)                                                                  \
  int deviceHandle;                                                                            \
  if ((deviceHandle = open(fileName.c_str(), O_RDWR | O_NOCTTY)) < 0) {                        \
    std::ostringstream errStr;                                                                 \
    errStr << "Could not open watchdog device: " << fileName;                                  \
    v8::Handle<v8::Value> error = v8::Exception::Error(v8::String::New(errStr.str().c_str())); \
    argv[0] = error;                                                                           \
    argv[1] = v8::Undefined();                                                                 \
		v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);         \
		NanReturnUndefined();                                                                      \
	}

NAN_METHOD(PiWatchdog::getTimeout) {
  NanScope();

  v8::Handle<v8::Value> argv[2];

  v8::Local<v8::String> v8FileName = v8::Local<v8::String>::Cast(args[0]);
  v8::String::AsciiValue v8FileNameVal(v8FileName);
  std::string fileName = *v8FileNameVal;

  v8::Handle<v8::Value> callback = args[1];

  OPEN_DEVICE(fileName);

  int timeout = -1;
  if(ioctl(deviceHandle, WDIOC_GETTIMEOUT, &timeout) != 0) {
    v8::Handle<v8::Value> error = v8::Exception::Error(v8::String::New("Failed to get timeout"));
    argv[0] = error;
    argv[1] = v8::Undefined();
    v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    NanReturnUndefined();
  }

  close(deviceHandle);

  argv[0] = v8::Undefined();
  argv[1] = v8::Integer::New(timeout);
  v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);

  NanReturnUndefined();
}

NAN_METHOD(PiWatchdog::setTimeout) {
  NanScope();

  v8::Handle<v8::Value> argv[2];

  v8::Local<v8::String> v8FileName = v8::Local<v8::String>::Cast(args[0]);
  v8::String::AsciiValue v8FileNameVal(v8FileName);
  std::string fileName = *v8FileNameVal;

  v8::Handle<v8::Value> v8Timeout = args[1];

  v8::Handle<v8::Value> callback = args[2];

  OPEN_DEVICE(fileName);

  int timeout = v8::Integer::Cast(*v8Timeout)->Value();
  if(ioctl(deviceHandle, WDIOC_SETTIMEOUT, &timeout) != 0) {
    v8::Handle<v8::Value> error = v8::Exception::Error(v8::String::New("Failed to set timeout"));
    argv[0] = error;
    argv[1] = v8::Undefined();
    v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    NanReturnUndefined();
  }
  if(ioctl(deviceHandle, WDIOC_GETTIMEOUT, &timeout) != 0) {
    v8::Handle<v8::Value> error = v8::Exception::Error(v8::String::New("Failed to get timeout"));
    argv[0] = error;
    argv[1] = v8::Undefined();
    v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    NanReturnUndefined();
  }

  close(deviceHandle);

  argv[0] = v8::Undefined();
  argv[1] = v8::Integer::New(timeout);
  v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);

  NanReturnUndefined();
}

NAN_METHOD(PiWatchdog::heartbeat) {
  NanScope();

  v8::Handle<v8::Value> argv[2];

  v8::Local<v8::String> v8FileName = v8::Local<v8::String>::Cast(args[0]);
  v8::String::AsciiValue v8FileNameVal(v8FileName);
  std::string fileName = *v8FileNameVal;

  v8::Handle<v8::Value> callback = args[1];

  OPEN_DEVICE(fileName);

  if(ioctl(deviceHandle, WDIOC_KEEPALIVE, 0) != 0) {
    v8::Handle<v8::Value> error = v8::Exception::Error(v8::String::New("Failed to send keepalive"));
    argv[0] = error;
    argv[1] = v8::Undefined();
    v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    NanReturnUndefined();
  }

  close(deviceHandle);

  argv[0] = v8::Undefined();
  v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);

  NanReturnUndefined();
}

NAN_METHOD(PiWatchdog::disable) {
  NanScope();

  v8::Handle<v8::Value> argv[2];

  v8::Local<v8::String> v8FileName = v8::Local<v8::String>::Cast(args[0]);
  v8::String::AsciiValue v8FileNameVal(v8FileName);
  std::string fileName = *v8FileNameVal;

  v8::Handle<v8::Value> callback = args[1];

  OPEN_DEVICE(fileName);

  if(write(deviceHandle, "V", 1) != 1) {
    v8::Handle<v8::Value> error = v8::Exception::Error(v8::String::New("Failed to disable"));
    argv[0] = error;
    argv[1] = v8::Undefined();
    v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    NanReturnUndefined();
  }

  close(deviceHandle);

  argv[0] = v8::Undefined();
  v8::Function::Cast(*callback)->Call(v8::Context::GetCurrent()->Global(), 2, argv);

  NanReturnUndefined();
}
