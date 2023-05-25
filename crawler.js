//. crawler.js
var client = require( 'cheerio-httpcli' );
client.set( 'browser', 'chrome' );
client.set( 'referer', false );


//. parameter
var url = '';
if( process.argv.length > 2 ){
  url = process.argv[2];
}

if( url ){
  client.fetch( url, {}, 'utf-8', function( err0, $, res0, body0 ){
    if( err0 ){
      console.log( {err0} );
    }else{
      $('script').each( async function(){
        var src = $(this).attr( 'src' );
        if( src && src.toLowerCase().endsWith( '.js' ) ){
          var src1 = src;
          if( !src.startsWith( 'http' ) ){
            if( src.startsWith( '//' ) ){
              if( url.startsWith( 'https' ) ){
                src1 = 'https:' + src;
              }else{
                src1 = 'http:' + src;
              }
            }else if( src.startsWith( '/' ) ){
              var tmp = url.split( '/' );  //. [ 'https:' , '', 'www.example.com', 'path1', 'hello.html' ]
              while( tmp.length > 3 ){
                tmp.pop();
              }
              src1 = tmp.join( '/' ) + src;
            }else{
              if( url.endsWith( '/' ) ){
                src1 = url + src;
              }else{
                src1 = url + '/' + src;
              }
            }
          }
          //console.log( src + ' : ' );
          console.log( src1 + ' : ' );
          var r1 = await client.fetch( src1, {}, 'utf-8' );
          if( r1 && r1.body ){
            try{
              var body1 = r1.body;
              var idx = 0;
              while( ( idx = body1.toLowerCase().indexOf( 'apikey', idx ) ) > -1 ){
                var idx1 = ( idx > 20 ? idx - 20 : 0 );
                var idx2 = ( idx + 30 );
                var text = body1.substring( idx1, idx2 );
                console.log( src, idx, text );
  
                idx ++;
              }
            }catch( e ){
              console.log( {e} );
            }
          }
        }
      });
    }
  });
  console.log( 'crawler done.' );
}else{
  console.log( '$ node crawler [URL]' );
}
