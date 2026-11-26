import test from 'node:test';
import assert from 'node:assert/strict';
import {examplesFor,recommendThemes} from '../assets/js/theme-gallery-core.mjs';
test('examples require explicit canonical theme association',()=>{
 const rows=[{id:'a',title:'A',catalog:{designThemeIds:['dada-riot']},path:'/a/'},{id:'b',title:'B',catalog:{designThemeIds:[]},path:'/b/'}];
 assert.deepEqual(examplesFor('dada-riot',rows).map(x=>x.id),['a']);
});
test('theme recommendation reports matching source words',()=>{
 const result=recommendThemes('editorial collage',[{id:'a',name:'A',keywords:['collage'],bestFor:['Editorial projects']},{id:'b',name:'B',keywords:['minimal']}]);
 assert.deepEqual(result[0].matches,['collage','editorial']);
});
