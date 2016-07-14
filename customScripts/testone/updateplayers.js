var col = request.params.collec;

gamedonia.data.search(col, "{}", {

    success: function(res_search){

        if (res_search.length == 0 ) {

            response.error("Collection is empty");

        } else {

        	res_search.forEach(function(player){

        		player.name = "bot";
        		
        		gamedonia.data.update(col, player, {

                    success: function(res_update) {

                    	
                        response.success();
                    },
                    error: function(error) {

                        log.error(error.message);
                        response.error(error.message);
                    }
            	});
        	});

            response.success();
        }

    },
    error:function(error){

        log.error(error.message);
        response.error(error.message);
    }
});   