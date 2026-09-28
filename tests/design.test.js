import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArtwork, fitContain, normalizeAngle, viewSide, MAX_FILE_BYTES } from '../src/design.js';
test('rejects unsafe image formats, empty and oversized uploads',()=>{
 assert.ok(validateArtwork({type:'image/svg+xml',size:100}));
 assert.ok(validateArtwork({type:'image/png',size:0}));
 assert.ok(validateArtwork({type:'image/png',size:MAX_FILE_BYTES+1}));
 assert.equal(validateArtwork({type:'image/webp',size:1000}),null);
});
test('keeps wide and tall artwork within its print area without distortion',()=>{
 assert.deepEqual(fitContain(2000,1000,100,150),{width:100,height:50});
 assert.deepEqual(fitContain(1000,2000,100,150),{width:75,height:150});
 assert.throws(()=>fitContain(0,100,100,150));
});
test('rotation wraps and selects the outward facing side',()=>{
 assert.equal(normalizeAngle(-90),270);
 assert.equal(viewSide(540),'back');
 assert.equal(viewSide(-180),'back');
 assert.equal(viewSide(360),'front');
 assert.equal(viewSide(45),'front');
});
