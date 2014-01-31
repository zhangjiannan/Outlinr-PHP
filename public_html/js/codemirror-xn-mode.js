// TODO actually recognize syntax of TypeScript constructs

CodeMirror.defineMode("xn", function(config, parserConfig) {

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  
  function chaosnotesTokenBase(stream, state){
  	if(stream.sol()){
		
	}
	var ch = stream.next();
	
	var matchURL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)(:[0-9]+)?((?:\/[\+~%\/.\w-_\(\)\:]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\w\=]*))?)/;
	
	if (ch == "#") {
		stream.eatWhile(/[A-Za-z0-9-_]/);
		var word = stream.current();
		return ret("xn-hashtag", "xn-hashtag");
	}else if (ch == "~") {
		stream.eatWhile(/[A-Za-z0-9-_@\.]/);
		var word = stream.current();
		return ret("xn-persontag", "xn-persontag");
	}else if (ch == "@") {
		stream.eatWhile(/[A-Za-z0-9-_]/);
		var word = stream.current();
		return ret("xn-maptag", "xn-maptag");
	}
  };


  
  return { 
	startState: function(basecolumn){
	    return {
			tokenize: chaosnotesTokenBase,
			lastType: null
		};
	},
	
	token: function(stream, state){
		return state.tokenize(stream, state);
	}
  
  };
});

