// patch.mjs — Node 23 fix for "Unexpected identifier 'assert'"

import Module from 'node:module'
const { _load } = Module

Module._load = function (request, parent, isMain) {
  if (request === 'assert') request = 'node:assert'
  return _load.call(this, request, parent, isMain)
}
