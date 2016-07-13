// Script: 'basictest.js' , generated by Gamedonia
describe("Gamedonia test environments", function() {
    
	// config
	var col_name = "players";
	
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
    		 out.println("JOB result: " +jobData);
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
	    	var loaded = session.loadData(col_name,[
		                                             {"name":"John","lastname":"Smith"},
		                                             {"name":"Michael","lastname":"Douglas"},
		                                             {"name":"Tom","lastname":"Jerry"},
		                                             {"name":"Tony","lastname":"Soprano"},
		                                             {"name":"Walter","lastname":"White"},
		                                             ]);
	    	expect(loaded.isOk()).toBe(true);
			expect(loaded.getResult()).not.toBeUndefined();
			expect(loaded.getResult().length).toEqual(5);

			var entCount = session.count(col_name, "{}");
			expect(entCount.isOk()).toBe(true);
			expect(entCount.getResult().count).toBe(5);
		});
	    
	    it("insert single entity & get", function() {
	    
	    	// single insert
			var inserted = session.insertData(col_name,{"name":"Paul"});
			expect(inserted.isOk()).toBe(true);
			expect(inserted.getResult().name).toBe("Paul");
			
			var entCount = session.count(col_name, "{}");
			expect(entCount.isOk()).toBe(true);
			expect(entCount.getResult().count).toBe(6);
			
			var entityId = inserted.getResult()._id;
			
			var ent = session.get(col_name, entityId);
	    	expect(ent.isOk()).toBe(true);
	    	expect(ent.getResult().name).toBe("Paul");
	    })
	    
	    it("run custom scripts", function() {
	    	
	    	// before running, 0 rankings
	    	var rankingsCount = session.count("rankings", "{}");
			expect(rankingsCount.isOk()).toBe(true);
			expect(rankingsCount.getResult().count).toBe(0);
	    	
	    	// run the script
	    	var scriptResult = session.run("addranking", {player:"player1",score:400 });
	    	if(scriptResult.isOk()) {	
	    		
	    		var result = scriptResult.getResult();
	    		expect(result).not.toBeUndefined();
	    		out.println(result.player);
	    		expect(result.player).toBe("player1");4
	    		expect(result.score).toBe(400);
	    	}
	    	else {
	    		fail("run failed");
	    	}
	    	
	    	// after running, 1 ranking
	    	rankingsCount = session.count("rankings", "{}");
			expect(rankingsCount.isOk()).toBe(true);
			expect(rankingsCount.getResult().count).toBe(1);
	    });

	    it("search", function() {

	    	var searchResult = session.search(col_name,'{"name":"Jurassic Park"}');
	    	if (searchResult.isOk()) {
	    		
	    		var res = searchResult.getResult();
	    		out.println("SEARCH result: " +res[0].name);
	    		expect(res[0].name).toBe("Jurassic Park");
	    	}
	    	else {
	    		fail("search failed");
	    	}
	    });
	});
});