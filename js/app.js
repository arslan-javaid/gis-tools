/**
 * Created by Arslan on 7/11/2015.
 */

App = {

    init : function(){

        $(".chk-draw").change(function() {
            $('.draw-content').hide();
            $('#'+this.id+'-content').show();
        });

        $(".nav-pills li").click(function(){
            $('.content-div').hide();
            $('.nav-pills li').removeClass('active');
            $(this).addClass('active');
            var content = $(this).attr('content');
            $('#'+content).show();
            console.log($(this).attr('content'));
        });

    }

};