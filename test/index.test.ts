// TODO: You should change this content.

import {hoge}  from '../src/piping-static-host';
import * as assert from 'power-assert';

describe('hoge', () => {
  it('should return the same value as string length', () => {
    assert.equal(hoge("hello"), 5);
  });
});