/**
 * Created by Arslan on 7/11/2015.
 */

App = {

    _apiUrl : 'http://basic.novaassure.com/api/',
    pageNum : '1',
    pageSize : '50',
    apiKey : '4EE1FE4ACE448CC73D0C3E5BB5343BD1',

    init : function(){

        $(".chk-draw").change(function() {
            $('.draw-content').hide();
            $('#'+this.id+'-content').show();
        });

        $(".nav-pills li").click(function(){
            $('.content-div').hide();
            $('.nav-pills li').removeClass('active');
            $(this).addClass('active');
            let content = $(this).attr('content');
            $('#'+content).show();
            console.log($(this).attr('content'));
        });

        // Load
        this.getVehicles();

        // on load
        $(function () {
            $('.date').datetimepicker({format: 'YYYY-MM-DDTHH:mm:ss'});
        });

    },

    getVehicles : function () {
        let $vehicle = $('#vehicle'),
            fields = { api_key: this.apiKey, pageNum: this.pageNum, pageSize: this.pageSize };

        // Reset
        $vehicle.html('');
        // Loading
        $('.loading').show();

        $.get("https://v1jc1ohvc3.execute-api.us-east-1.amazonaws.com/dev/", fields, function(response, status){
            let vehicles = response.data;

            $.each(vehicles, function( key, vehicle ) {
                $vehicle.append($("<option></option>")
                    .attr("value",vehicle['vehicleId'])
                    .text(vehicle['name']));
            });

            console.log(vehicles);
        }).fail(function(jqXHR, status, error) {
                console.log( "error" );
            })
            .always(function() {
                // Loading
                $('.loading').hide();
                console.log( "finished" );
            });
    }

};