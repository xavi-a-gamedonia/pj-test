describe("Test one", function() {
    
	// config
	var col_name = "players";
	
    var env=null;
    
    var user = null;
	var session = null;

    beforeAll(function() {
          env = gamedonia.createTestEnvironment();
          
          // we create a user
          user = env.createUser({name:'Guy', lastname:'Brush', age:27});

          // and log him in
          session = user.login();
    });
     
     afterAll(function() {
    	 
		session.logout();
		user = null;
		session = null;
    
		env.destroy();
		env=null;
    });
     
     it("insert data", function() {
     	
    	 var entCount = session.count(col_name, "{}");
 		expect(entCount.isOk()).toBe(true);
 		expect(entCount.getResult().count).toBe(0);
 		
 		// insert data
 		var loaded = session.loadData(col_name,[
 						                         {"name":"John"},
 						                         {"name":"Peter"},
 						                         {"name":"David"},
 						                         {"name":"Hendrik"},
 						                         {"name":"Ander"},
 						                         {"name":"William"},
 						                         {"name":"Tom"},
 						                         {"name":"Sephora"},
 						                         {"name":"Anna"},
 						                         {"name":"Martha"}
 						                         ]);
 		
 		var entCount = session.count(col_name, "{}");
 		expect(entCount.isOk()).toBe(true);
 		expect(entCount.getResult().count).toBe(10);
  	});

    it("call update script", function() {
    	
    	var scriptResult = session.run("updateplayers", {collec:col_name});
    	expect(scriptResult.isOk()).toBe(true);
    	
    	var entCount = session.count(col_name, '{"name":"bot"}');
		expect(entCount.isOk()).toBe(true);
		expect(entCount.getResult().count).toBe(10);
 	});
    
    it("call remove script", function() {
    	
    	var scriptResult = session.run("removeplayers", {collec:col_name});
    	expect(scriptResult.isOk()).toBe(true);
    	
    	var entCount = session.count(col_name, '{"name":"bot"}');
		expect(entCount.isOk()).toBe(true);
		expect(entCount.getResult().count).toBe(0);
 	});
});