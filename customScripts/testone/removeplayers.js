var col = request.params.collec;

gamedonia.data.search(col, '{"name":"bot"}', {

    success: function(res_search){

        if (res_search.length == 0 ) {

            response.error("Collection is empty");

        } else {

        	res_search.forEach(function(player){
        		
        		gamedonia.data.remove(col, player._id, {

                    success: function () {

                        response.success();
                    },
                    error: function (error) {
                    	
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