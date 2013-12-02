//getPosts() -> displayPosts() 
$(document).ready(function() {
	$('#postform').submit(function() {
		submitPostAndGetPosts();
		return false;
	});

	$('textarea#newpost').focus();
	$('textarea#newpost').keyup(function (event) {
		// #TODO #Future trim repeated enters
        if (event.keyCode == 13 && event.shiftKey) { // enter
        	var content = this.value;
        	var caret = getCaret(this);
        	this.value = content.substring(0,caret)+"\n"+content.substring(caret,content.length-1);
        	event.stopPropagation();
        } 
        else if(event.keyCode == 13){ // enter
        	$('#postform').submit();
        }
        else {
        	if(rootNodeViewModel!==null)
        		rootNodeViewModel.filter($(this).val() || "");
        }
    });

	$('textarea#newpost').change(function (event) {
		rootNodeViewModel.filter($(this).val());
	});

	function getCaret(el) { 
		if (el.selectionStart) { 
			return el.selectionStart; 
		} else if (document.selection) { 
			el.focus(); 

			var r = document.selection.createRange(); 
			if (r == null) { 
				return 0; 
			} 

			var re = el.createTextRange(), 
			rc = re.duplicate(); 
			re.moveToBookmark(r.getBookmark()); 
			rc.setEndPoint('EndToStart', re); 

			return rc.text.length; 
		}  
		return 0; 
	}

		/*
	$('#myTab a').click(function(e) {
		e.preventDefault();
		$(this).tab('show');
	})
	
	$('#myTab a:last').tab('show');
	*/
	getPosts();
});

//var entryList = null;
var rootNodeViewModel = null;

function displayPosts() {
	if (localStorage.getItem("posts") !== null){
		var jsonData = localStorage.getItem("posts");
		var rootNodeModel = $.parseJSON(jsonData)['treePosts'];

		rootNodeViewModel=new EntryNodeViewModel(rootNodeModel);

		//entryList = new EntryList(data);
		//var entrylist=entryNodeToHTML(data);
		//entryList = new EntryList(data);

		$("#currentposts").html("");
		console.log(z=rootNodeViewModel)
		$("#currentposts").append(rootNodeViewModel.render());

		//$("#currentposts").html(entrylist);
		/*
					var table = "<table class='table'>" // <tr> <th>Post Body</th>  <th></th>Progress Bar<th>User</th> <th>Time</th> </tr>";
			
			
					for (var i = 0; i < data.length; i++) {
						
			
						var time = new Date(data[i].time * 1000);
			
						var statusTable={0:"Not acknowledged",1:"Acknowledged",2:"In Progress", 3:"Done"};
						var progEntry=data[i].progress && data[i].progress != "null" ? data[i].progress + '% - ': "";
						
						status ="<td class='status'>" + '<a href="index.1.7_suggestionbox_inProgress.php" rel="popover" data-content="'+progEntry +data[i].metric+'" data-original-title="'+statusTable[data[i].status]+'"><div class="status sc'+data[i].status +'" >'+ '</div></a>' + "</td>";
						upvoter='<td class="votes" -idea-id="'+data[i].pid+'"><span class="vote"> </span><span class="votes" >'+data[i].upvotes+'</span></td>';
						
						table += '<tr>'+status + upvoter+'<td>' + nl2br(processIdea(data[i].body,data[i].pid)) + "</td>" + 
						   // '<td><div class="progressbar"></div></td>' +
							"<td><a href='#' class='uid'>" + (data[i].uid!=0 ? data[i].uid : "anon") + "</a></td>" +
							"<td class='timecol'>" + dateToString(time.getMonth(), time.getDate()) + ", " + timeToString(time.getHours(), time.getMinutes()) +
							"</td></tr>";
					}
					
					table += "</table>";
					$("#currentposts").html(table);
					
					//$( ".progressbar" ).progressbar({
				//		value: 59
					//});
		*/

		// Right hand bar
		displayIdeaNames();

		
	}


	//ADD #JQUERY HERE
	$('a.suggname').click(function(e){
		e.preventDefault();
	});

	//fix offset
	$('#ideanames a').click(function(e){	
		e.preventDefault();
		$('#newpost').val('');
		
		var targetName=$(e.target).attr('href').substr(1);
		var offset = $($("a[name='"+targetName+"']")).offset();
		var scrollto = offset.top - 57; // fixed_top_bar_height = 50px
		$('html, body').animate({scrollTop:scrollto}, 0);
	});
	
	$('#ideatags a').click(function(e){	
		e.preventDefault();

		var targetName=$(e.target).html();
		$('#newpost').val(targetName).focus();
		filterIdeas(targetName);
	});

	//linkifyHashtags($('.sidebar-nav-fixed'));
}

function displayIdeaNames() {
	if (localStorage.getItem("posts") !== null){
		var jsonData = localStorage.getItem("posts");
		var data = $.parseJSON(jsonData)['flatPosts'];

		var nameul = $('ul#ideanames').empty();
		var tags={};
		$.each( data,function(i,data) {
			var n=extractIdeaName(data.body);
			var t=extractTags(data.body);
			if(t)
				$.each(t,function(i,tag) {tags[tag]=true;});

			nameul.append('<li><a href="#'+data.pid+'">'+n + '</a></li>');

		});

		localStorage.setItem("tags", tags);
		var tagsul = $('ul#ideatags').empty();
		$.each( tags,function(tag,trueval) {

			tagsul.append('<li><a href="#">'+tag + '</a> </li>'); //TODO
		//			tagsul.append('<li><a href="#'+data.pid+'">'+tag + '</a> </li>');

	});
	}
}

//ajax
function doUpvote(ideaid,upOrDown) {

	$.ajax({
		'url': 'ajax/upvote.php?'+upOrDown+'=true',
		'data': {'ideaid':ideaid},
		'success': function(jsonData) {

		},
	});
}

function submitPostAndGetPosts() {
	$.ajax({
		'url': 'ajax/get_or_make_post.php',
		'data': {'mapid':$('#mapidform').val(), 'newpost': $('#newpost').val(),'ideatitle': extractIdeaName($('#newpost').val())},
		'success': function(jsonData) {
                 // todo: parse data and add into our table
                 localStorage.setItem("posts", jsonData);

                 $('#newpost').val('');
                 displayPosts();
             },
         });
}

function getPosts() {
	$.ajax({
		'url': 'ajax/get_or_make_post.php',
		'data': {'mapid':$('#mapidform').val(), 'newpost': ''},
		'success': function(jsonData) {
			localStorage.setItem("posts", jsonData);
			displayPosts();
		},
	});
}
