
var query = require('./pj.query.json'),
    // explain = require('./pj.explain.json');
    explain = require('./explain3.json');

function debugBlock( indent, block ){

  var desc = block.description;
  desc = desc.replace(' [PerFieldSimilarity], result of:', '')
  desc = desc.replace(', product of:', '')
  desc = desc.replace('field value function: ', '')
  desc = desc.replace('product of:', '')
  desc = desc.replace('Math.min of', '')
  desc = desc.replace(/ in \d+/g, '')
  desc = desc.replace(/doc=\d+,?/g, '')
  desc = desc.replace('()', '')
  //  [PerFieldSimilarity], result of:

  var pad = Array(indent).join(" ");

  // weight(name.default:pet in 166029) [PerFieldSimilarity], result of:
  if( 'weight' === desc.substr(0,6) ){
    var fieldValue = desc.substring(
      desc.indexOf('(')+1,
      desc.indexOf(')')
    ).split(':');
    if( fieldValue.length > 1 ){
      console.log( indent, '------', block.value, '-----', fieldValue[0], '"' + fieldValue[1] + '"', '------' )
    } else {
      console.log( pad, '[' + block.value + ']', desc );
    }
  }
  /*
    value 5.499984
    description idf(docFreq=23952, maxDocs=2156145)
    Math.log(2156145/(23952+1))+1
  */
  else if( 'idf' === desc.substr(0,3) ){
    var func = desc.substr(4,desc.length-5);
    var freq = func.split(',')[0].split('=')[1];
    var max = func.split(',')[1].split('=')[1];
    // console.log( pad, 'IDF: Math.log(' + max + '/(' + freq + '+1))+1 == ' + block.value );
    console.log( pad, '[' + block.value + '] IDF' );
  }
  else if( 'tf' === desc.substr(0,2) ){
    var func = desc.substr(4,desc.length-5);
    var freq = func.split(',')[0].split('=')[1];
    var max = func.split(',')[1].split('=')[1];
    // console.log( pad, 'IDF: Math.log(' + max + '/(' + freq + '+1))+1 == ' + block.value );
    console.log( pad, '[' + block.value + '] TF' );
  }
  else if( 'termFreq=1.0' === desc ){
    // discard
  }
  else if( '' === desc ){
    // discard
  }
  //
  else {
    // console.log( pad, 'value', block.value );
    console.log( pad, '[' + block.value + ']', desc );
  }
  // console.log( pad, '----' );

  if( block.hasOwnProperty('details') ){
    block.details.forEach( debugBlock.bind( null, indent+1 ) );
  }
}

// debugBlock( 0, explain.explanation );
explain.hits.hits.forEach( function( hit ){
  debugBlock( 0, hit._explanation );
});
