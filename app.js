/**
 * Created by Arslan on 7/11/2015.
 */

App = {

    init : function(){

        $(".chk-draw").change(function() {
            $('.draw-content').hide();
            $('#'+this.id+'-content').show();
        });

    }

};