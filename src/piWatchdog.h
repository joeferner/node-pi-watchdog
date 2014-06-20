
#ifndef _pi_watchdog_h_
#define _pi_watchdog_h_

#include <v8.h>
#include <node.h>
#include <nan.h>

class PiWatchdog : public node::ObjectWrap {
public:
  static void Init(v8::Handle<v8::Object> target);

  static NAN_METHOD(New);
  static NAN_METHOD(getTimeout);

private:
  PiWatchdog();
  ~PiWatchdog();

  static v8::Persistent<v8::FunctionTemplate> s_ct;
};

#endif
