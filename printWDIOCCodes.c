
#include <stdio.h>
#include <fcntl.h>
#include <linux/watchdog.h>

int main(int argc, char* argv[]) {
  printf("WDIOC_KEEPALIVE %lu\n", WDIOC_KEEPALIVE);
  printf("WDIOC_SETTIMEOUT %lu\n", WDIOC_SETTIMEOUT);
  printf("WDIOC_GETTIMEOUT %lu\n", WDIOC_GETTIMEOUT);
  return 0;
}
