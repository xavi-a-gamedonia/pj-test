describe("Gamedonia test environments", function() {
    
	// config
	var colName = "players";
	
    var env=null;

    beforeAll(function() {
          env = gamedonia.createTestEnvironment();
    });
     
     afterAll(function() {
        env.destroy();
        env=null;
    });

    it("run jobs", function() {

    	 var resJob = env.runJob( "jobapidata");
    	 expect(resJob.isOk()).toBe(true);
    	 if(resJob.isOk()) {
    		 
    		 var jobData = resJob.getResult();
    	 }
 	});
     
    it("load initial data", function() {
    	 
    	 // this loads the data from the orders collection in the .zip file
    	 var loadResult = env.loadTestData("20160701104630915.zip", ["orders"]);//, ["coleccionpruebaexport"]);
    	 expect(loadResult.isOk() ).toBe(true);
    });

	describe("Gamedonia user sessions", function() {

	    var user = null;
		var session = null;
		beforeAll(function() {

	    	// we create a user
	    	user = env.createUser({name:'Guy', lastname:'Brush', age:27});

	    	// and log him in
	    	session = user.login();
	    });
	     
	     afterAll(function() {

	        session.logout();
	        user = null;
	        session = null;
	    });

	    it("load multiple data into collections",function() {

    		// multiple load
	    	var loaded = session.loadData(colName,[
		                                             {"name":"John","lastname":"Smith"},
		                                             {"name":"Michael","lastname":"Douglas"},
		                                             {"name":"Tom","lastname":"Jerry"},
		                                             {"name":"Tony","lastname":"Soprano"},
		                                             {"name":"Walter","lastname":"White"},
		                                             ]);
	    	expect(loaded.isOk()).toBe(true);
			expect(loaded.getResult()).not.toBeUndefined();
			expect(loaded.getResult().length).toEqual(5);

			var entCount = session.count(colName, "{}");
			expect(entCount.isOk()).toBe(true);
			expect(entCount.getResult().count).toBe(5);
		});
	    
	    it("insert single entity & get", function() {
	    
	    	// single insert
			var inserted = session.insertData(colName,{"name":"Paul"});
			expect(inserted.isOk()).toBe(true);
			expect(inserted.getResult().name).toBe("Paul");
			
			var entCount = session.count(colName, "{}");
			expect(entCount.isOk()).toBe(true);
			expect(entCount.getResult().count).toBe(6);
			
			var entityId = inserted.getResult()._id;
			
			var ent = session.get(colName, entityId);
	    	expect(ent.isOk()).toBe(true);
	    	expect(ent.getResult().name).toBe("Paul");
	    })
	    
	    it("run custom scripts", function() {
	    	
	    	// run the script
	    	var scriptResult = session.run("addslot", {collec:"slots",name:"mine",points:400 });
	    	if(scriptResult.isOk()) {	
	    		
	    		var result = scriptResult.getResult();
	    		expect(result).not.toBeUndefined();
	    		out.println(result.name);
	    		expect(result.name).toBe("mine");
	    		expect(result.points).toBe(400);
	    	}
	    	else {
	    		fail("run failed");
	    	}
	    	
	    	// after running, 1 ranking
	    	rankingsCount = session.count("slots", "{}");
			expect(rankingsCount.isOk()).toBe(true);
			expect(rankingsCount.getResult().count).toBe(1);
	    });

	    it("search", function() {

	    	var searchResult = session.search(colName,'{"name":"Walter","lastname":"White"}');
	    	if (searchResult.isOk()) {
	    		
	    		var res = searchResult.getResult();
	    		out.println("SEARCH result: " +res[0].name);
	    		expect(res[0].name).toBe("Walter");
	    		expect(res[0].lastname).toBe("White");
	    	}
	    	else {
	    		fail("search failed");
	    	}
	    });
	});
});