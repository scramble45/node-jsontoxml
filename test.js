//copyright Ryan Day 2010 <http://ryanday.org> [MIT Licensed]

var jsonxml = require("./jsontoxml.js");
var async = require('async');
var assert = require('assert');

var date = (new Date());
var input = {
  node:'text content',
  parent:[
    {name:'taco',text:'beef taco',children:{salsa:'hot!'}},
    {name:'xml',text:'tag'},
    {name:'taco',text:'fish taco',attrs:{mood:'sad'},children:[
     {name:'salsa',text:'mild'},
     'hi',
     {name:'salsa',text:'weak',attrs:{type:2}}
    ]},
    {name:'taco',attrs:{mood:"party!"}}
  ],
  parent2:{
    hi:'this & this is a nice thing to say',
    node:'i am another not special child node',
    date:date+'',
    date2:date
  },
  unicode:'mixed \u0050\u0070\u00A0\u00E0\u0160\uD800\uDC00'
};

var expected_no_element_substitution = 
'<node>text content</node>'
+'<parent>'
  +'<taco>'
    +'beef taco'
    +'<salsa>hot!</salsa>'
  +'</taco>'
  +'<xml>tag</xml>'
  +'<taco mood="sad">'
    +'fish taco'
    +'<salsa>mild</salsa>'
    +'hi'
    +'<salsa type="2">weak</salsa>'
  +'</taco>'
  +"<taco mood=\"party!\"/>"
+'</parent>'
+'<parent2>'
  +'<hi>this &amp; this is a nice thing to say</hi>'
  +'<node>i am another not special child node</node>'
  +'<date>'+date+'</date>'
  +'<date2>'+date.toJSON()+'</date2>'
+'</parent2>'
+'<unicode>mixed Pp&#160;&#224;&#352;&#65536;</unicode>';

var expected_with_element_substitution = 
'<node>text content</node>'
+'<parent>'
  +'<taco>'
    +'beef taco'
    +'<salsa>hot!</salsa>'
  +'</taco>'
  +'<_>tag</_>'
  +'<taco mood="sad">'
    +'fish taco'
    +'<salsa>mild</salsa>'
    +'hi'
    +'<salsa type="2">weak</salsa>'
  +'</taco>'
  +"<taco mood=\"party!\"/>"
+'</parent>'
+'<parent2>'
  +'<hi>this &amp; this is a nice thing to say</hi>'
  +'<node>i am another not special child node</node>'
  +'<date>'+date+'</date>'
  +'<date2>'+date.toJSON()+'</date2>'
+'</parent2>'
+'<unicode>mixed Pp&#160;&#224;&#352;&#65536;</unicode>';

var expected_with_element_substitution_and_xml_header = 
 '<?xml version="1.0" encoding="utf-8"?>'
+'<node>text content</node>'
+'<parent>'
  +'<taco>'
    +'beef taco'
    +'<salsa>hot!</salsa>'
  +'</taco>'
  +'<_>tag</_>'
  +'<taco mood="sad">'
    +'fish taco'
    +'<salsa>mild</salsa>'
    +'hi'
    +'<salsa type="2">weak</salsa>'
  +'</taco>'
  +"<taco mood=\"party!\"/>"
+'</parent>'
+'<parent2>'
  +'<hi>this &amp; this is a nice thing to say</hi>'
  +'<node>i am another not special child node</node>'
  +'<date>'+date+'</date>'
  +'<date2>'+date.toJSON()+'</date2>'
+'</parent2>'
+'<unicode>mixed \u0050\u0070\u00A0\u00E0\u0160\uD800\uDC00</unicode>'

var tests = [
    function(cb) {
	var buffer = new Buffer(JSON.stringify(input));
	var result = jsonxml(buffer, {escape:true});
	assert.equal(result, expected_no_element_substitution, "Buffer test failed");
	cb();
    },
    function(cb) {
	var result = jsonxml(input, {escape:true});
	assert.equal(result, expected_no_element_substitution, "String test failed");
	cb();
    },
    function(cb) {
	var result = jsonxml(input, {escape:true, removeIllegalNameCharacters:true});
	assert.equal(result, expected_with_element_substitution, "Name substitution test failed");
	cb();
    },
    function(cb) {
	var result = jsonxml(input, {escape:true, removeIllegalNameCharacters:true, xmlHeader:true});
	assert.equal(result, expected_with_element_substitution_and_xml_header, "XML header test failed");
	cb();
    }
];

async.series(tests, function(){console.log('done');});
