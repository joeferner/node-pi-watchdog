{
  'targets': [
    {
      'target_name': 'nodepiwatchdog_bindings',
      'sources': [
        'src/piWatchdog.cpp'
      ],
      'include_dirs': [
        "<!(node -e \"require('nan')\")",
      ],
    }
  ]
}
