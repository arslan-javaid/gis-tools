/**
 * Created by Arslan on 7/11/2015.
 */

App = {

    _apiUrl : 'http://basic.novaassure.com/api/',
    pageNum : '1',
    pageSize : '50',
    apiKey : '4EE1FE4ACE448CC73D0C3E5BB5343BD1',

    _vehicles : [],

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
        let self = this, $vehicle = $('#vehicle'),
            fields = { api_key: this.apiKey, pageNum: this.pageNum, pageSize: this.pageSize };

        // Reset
        $vehicle.html('');
        // Loading
        $('.loading').show();

        $.get("js/data/vehicles.json", fields, function(response, status){
            let vehicles = response.data;
            self._vehicles = vehicles;

            $.each(vehicles, function( key, vehicle ) {
                let $option = $('<option></option>');
                $option.attr("value",vehicle['vehicleId'])
                    .text(vehicle['vehicleId'] + ' : ' + vehicle['name']);
                $vehicle.append($option);
            });

            $vehicle.multiselect({
                buttonWidth: '100%'
            });
        }).fail(function(jqXHR, status, error) {
                console.log( "error" );
            })
            .always(function() {
                // Loading
                $('.loading').hide();
                console.log( "finished" );
            });
    },

    getVehicleById : function (vehicleId) {
        return $.grep(this._vehicles, function(e){ return e.vehicleId == vehicleId; });
    }

};