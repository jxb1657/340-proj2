    ///////////////////////////////Utilities///////////////////////////////
	/*
	ajax utils
		arguments:
		getPOst - get or post
		d = {path: '/about/'}
		idForSpinner - #parent (optional)
			the id of the conatiner I want the spinner to go into

			use: xhr('get', {path:'/about/''}, '#id').done(function(){//code});
	*/
	function xhr(getPost, d, idForSpinner){
		return $.ajax({
			type: getPost,
			dataType: 'json',
			data: d,
			cache: false,
			async: true,
			url: 'proxy.php',
			beforeSend: function(){
			//This is new. This event fires befroe the callback is sent.
			//turn on spinnder IF the argument was sent in
				$(idForSpinner).append('<img src="assets/media/gears.gif" class="spin"/>');
			}
		}).always(function(){//always will fire...
			//remove spinner  - fade out then kill itself
		   $(idForSpinner).find('.spin').fadeOut(500,function(){
			   $(this).remove();
		   });
		}).fail(function(err){//if an error, we should know!
			console.log("there was an AJAX error");
			console.log(err);
		});
	}

	//now what?
	//api:  http://www.ist.rit.edu/api/
	
	$(document).ready(function(){
		//create a simple ajax call that will essentially
		//GET the "About" information from the API and use a 
		//proxy to to send in the data of path = /about/
		$.ajax({
			type:'get',
			url:'proxy.php',
			data:{path:"/about/"},
			dataType:'json'
		}).done(function(json){
			console.log(json.title);
		});
		
		//ajax call for undergraduate 
		$.ajax({
			//set the properties of the AJAX call
			type: 'get', //get or post, we want a get
			async: true, //do we want this to be a blocking or not (Non-blocking)
			cache: false, //we do NOT want to use a cached version (if there was one)
			url: 'proxy.php', //still (always for this assignment) hit the proxy.php
			data:{path:'/degrees/undergraduate/'}, //want more specific information
			dataType: 'json' //want it to come back as JSON
		}).done(function(json){
			/*
			inside of here is when we have made the return trip, this is the callback the argument 'json' above
			is holding the returned value from the API since the json.undergraduate is an array (square brackets!),
			we can use jQuery's each iterator and put it on the page!
			*/
			$.each(json.undergraduate,function(i, item){
				/*
				i - counter, item - reference to this pass through the data
				next 2 lines showing the use of either this or item (they are interchangeable)
				*/
				$('#content').append('<h2>'+ this.title +"</h2>");
				$('#content').append('<h4>'+ item.description + '</h4>');
			});
		});

//========================================================================================================		
		//get graduate
		xhr('get', {path: '/degrees/graduate'}, '#graduate').done(function(json){
			var z ='';
			$.each(json.graduate, function(i, item){
				if(item.availableCertificates === undefined || item.availableCertificates.length == 0){
					z += '<div class = "graduate" degree-name ="'+ this.degreeName + 
					'" data-type = graduate"><h5>' +this.title+'</br>' +  item.description +
					'</h5><p>' + item.concentrations + '</p></div>';
				}
				else{
					z += '<div class = "gac" degree-name ="'+ this.degreeName + 
					'" data-type = graduate"></br>' +
					'<h6>' +item.availableCertificates +'</h6></div>';
				}
			});
			$('#graduate').append(z);

			$('.graduate').on('click',function(){
				var me = getAttributesByName(json.graduate,'degreeName', $(this).attr('degree-name'));
				console.log(me);
			});
		});
		
//========================================================================================================
		//get undergraduate
		xhr('get', {path: '/degrees/undergraduate'}, '#undergraduate').done(function(json){
			//just put out faculty...[staff would be inside of her as well, your problem!]
			var y = '';
			$.each(json.undergraduate,function(i, item){//go through each person in faculty
				//build up a big string to place on page
				//note the class = "faculty" - how we will put an onclick on them all
				//note the data-uname, how we can access all of the data later on!
					//username is a unique identifier!
				y += '<div class="undergraduate" degree-name = "'+this.degreeName+
				'" data-type = undergraduate"><h5>'+this.title+'</br>'+item.description+
				'</h5><P>'+ item.concentrations +'</p></div>';
			})
			$('#undergraduate').append(y);

			$('.undergraduate').on('click',function(){
				//HUGE note - since this is assigned within the callback from the AJAX call
					//another way to think of it is from here, the code can 'see' the json variable
				//and when I later click on one of div's with a class of faculty
				//I can access the entire json object!

				//while that is awesome, I still need to find out within all that data, which one am I?
				//see: ******
				var me = getAttributesByName(json.undergraduate,'degreeName', $(this).attr('degree-name'));
				console.log(me);
			});
		});

//========================================================================================================
		//get minors
		xhr('get', {path: '/minors/'}, '#minors').done(function(json){
			var minors1 = '';
			var minors2 = '';
			$.each(json.UgMinors, function(i, item){
				//get the title screen for the minors
				minors1 += '<div class = "minorFirst" <h3>'+this.title+'</h3></div>';
				//get the info screen for the appropriate minor click.
				minors2 += '<div class = "minorSecond" <h3>'+this.title+'</h3><h6>'+
				this.name+'</h6><p>'+this.description+'</p><div>'+item.courses+'</div><p>'+
				this.note+'</p></div>';
			})
			$('.minorFirst').append(minors1);
			$('.minorSecond').append(minors2);
		})

//========================================================================================================
		//get employment

		xhr('get', {path: '/employment/'}, '#employment').done(function(json){
			var empIntro = '';
			var empStat = '';
			var empEmployers = '';
			var empCareers = '';
			var empCoopHead = '';
			var empCoopBody ='';
			var empEmpHead ='';
			var empEmpBody = '';

			//get introduction 

			$.each(json.introduction, function(){
				empIntro = '<div class = "intro"><h3>'+ json.introduction.title +'</h3><h2>'+this[0].title + '</h2></br><p>' +this[0].description +'</p></br><h2>' + this[1].title + '</h2></br><p>' + this[1].description + '</p></div>';
			})
			$('.intro').append(empIntro);

			//get careers
			$.each(json.careers.careerNames, function(i, item){
				empCareerTitle = '<h3>'+json.careers.title+'</h3>';
				empCareers += '<div><ul><li>'+ json.careers.careerNames[i] + '</li></ul></div>';
			})
			$('.career').append(empCareerTitle);
			$('.career').append(empCareers);
						
			//get employers
			$.each(json.employers.employerNames, function(i, item){
				empEmployerTitle = '<h3>'+json.employers.title+'</h3>';
				empEmployers += '<div><ul><li>'+ json.employers.employerNames[i] + '</li></ul></div>';
			})
			$('.career').append(empEmployerTitle);
			$('.career').append(empEmployers);
			
			//get degreeStatistics
			$.each(json.degreeStatistics.statistics, function(i, item){
				empStat += '<div class = "stats"<div>'+
				json.degreeStatistics.statistics[i].value+ json.degreeStatistics.statistics[i].description + '</div></div>';
			})
			$('.stats').append('<h3>'+json.degreeStatistics.title+'</h3></br>' + empStat);

			//get coopTable
			//get headers
			//var headerName = Object.keys(json.coopTable);
			$.each(json.coopTable.coopInformation[0], function(i, item){
				empCoopHead += '<th>'+ i +'</th>';
			})

			//get body
			$.each(json.coopTable.coopInformation, function(i, item){
				empCoopBody += '<tr><td>' + json.coopTable.coopInformation[i].employer + '</td><td>' +
				json.coopTable.coopInformation[i].degree+'</td><td>'+ json.coopTable.coopInformation[i].city +'</td><td>'+ 
				json.coopTable.coopInformation[i].term +'</td></tr>';
			})
			$('.coopTable').append('<div class = "coopTable"><div><table id="table_id1" class="display"><h3>'+json.coopTable.title+'</h3></br><thead><tr>' + empCoopHead +'</tr></thead><tbody>'+ empCoopBody + '</tbody></table></div></div>');

			//get employmentTabel
			//get headers
			$.each(json.employmentTable.professionalEmploymentInformation[0], function(i, item){
				empEmpHead += '<th>'+ i +'</th>';
			})
			
			//get body
			$.each(json.employmentTable.professionalEmploymentInformation, function(i, item){
				empEmpBody += '<tr><td>' + json.employmentTable.professionalEmploymentInformation[i].employer + '</td><td>' +
				json.employmentTable.professionalEmploymentInformation[i].degree+'</td><td>'+ json.employmentTable.professionalEmploymentInformation[i].city +'</td><td>'+ 
				json.employmentTable.professionalEmploymentInformation[i].title +'</td><td>'+ json.employmentTable.professionalEmploymentInformation[i].startDate +'</td></tr>';
			})
			$('.empTable').append('<div class = "empTable"><div><table id="table_id2" class="display"><h3>'+json.employmentTable.title+'</h3></br><thead><tr>' + empEmpHead + '</tr></thead><tbody>'+ empEmpBody + '</tbody></table></div></div>');
		})

//========================================================================================================
		//get faculty
		xhr('get', {path: '/people/'}, '#people').done(function(json){
			//just put out faculty...[staff would be inside of her as well, your problem!]
			var x = '';
			$.each(json.faculty,function(){//go through each person in faculty
				//build up a big string to place on page
				//note the class = "faculty" - how we will put an onclick on them all
				//note the data-uname, how we can access all of the data later on!
					//username is a unique identifier!
				x += '<div class="faculty" data-uname = "'+this.username+
				'" data-type = faculty"><h5>'+this.office+'</br>'+this.name+
				'</h5><img style ="max-width: 150px" src="'+this.imagePath+'"/></div>';
			})
			$('#people').append(x);

			$('.faculty').on('click',function(){
				//HUGE note - since this is assigned within the callback from the AJAX call
					//another way to think of it is from here, the code can 'see' the json variable
				//and when I later click on one of div's with a class of faculty
				//I can access the entire json object!

				//while that is awesome, I still need to find out within all that data, which one am I?
				//see: ******
				var me = getAttributesByName(json.faculty,'username', $(this).attr('data-uname'));
				console.log(me);
			});
		});

	});

	//************this function helps to find out which one I am!!!
	function getAttributesByName(arr, name, val){
		var result = null;
		$.each(arr,function(){
			if(this[name] === val){
				result = this;
			}
		});
		return result;
	}