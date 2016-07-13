// Script: 'specificfields.js' , generated by Gamedonia
gamedonia.data.search("testapi", "{}",["name", "date"], 10, "{date:1}", 2, {

    success: function(res_search){

        log.info(res_search.size());

        if(res_search.length == 0 ) {

            log.info("empty");

        } else {

            log.info(res_search[0].name);
            log.info(res_search[0].date);
            response.success();
        }

    },
    error:function(error){

        log.error(error.message);
        response.error(error.message);
    }
});