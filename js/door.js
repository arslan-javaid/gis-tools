function Door() {

    this.init();
}

Door.prototype.init = function() {
    let labArray=['05-21', '05-22', '05-23', '05-24', '05-26', '05-27'];
    let dataArray=[12, 19, 3, 5, 2, 3];
    // check status
    this.doorStatus();

    // Check Door status
    let self = this;
    self.drawChart(labArray,dataArray);

    setInterval(function(){ self.doorStatus(); }, 5000);

    self.chartData();

    // Events
    $('#door').on('change', function(){
        // check status
        self.doorStatus();
        // Charts
        self.chartData();
    });
};    

Door.prototype.openDoor = function (field) {
    let y = $(field).find(".thumb"),
        x = y.attr("class");

    if (y.hasClass("thumbOpened")) {
        y.removeClass("thumbOpened");
    }
    else {
        $(".thumb").removeClass("thumbOpened");
        y.addClass("thumbOpened");
    }
};

Door.prototype.chartData = function () {
   
    let $doorSelect = $('#doors-select'), 
    fields = { DevEUI: $doorSelect.val() };
    let self = this;
    let dataArray=[];

    // Loading
    $('.loading').show();
    $.ajax({
        url: 'https://twms75ak6c.execute-api.us-east-1.amazonaws.com/dev/contact',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(fields),

        success: function (data) {
            console.log(data);
            // Loading
            $('.loading').hide();
            if(data.status){
                console.log(Object.keys(data.series));
                for (x in data.series){
                    dataArray.push(data.series[x])
                }
           
                self.drawChart(Object.keys(data.series),dataArray);

            }
        
        },
    });

} 

Door.prototype.drawChart=function(labArray,dataArray){
    let ctx = document.getElementById('canvas').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labArray,
            datasets: [{
                label: 'Door Open',
                backgroundColor: 'rgba(54, 162, 235, 1)',
                stack: 'Stack 0',
                data: dataArray,
            }, {
                label: 'Door Close',
                backgroundColor: 'rgb(255, 99, 132)',
                stack: 'Stack 1',
                data: dataArray,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

Door.prototype.doorStatus = function () {
    let $doorSelect = $('#doors-select'),
        $door =  $(".thumb"),
        fields = { DevEUI: $doorSelect.val() };

    $.ajax({
        url: 'https://twms75ak6c.execute-api.us-east-1.amazonaws.com/dev/door_status',
        type: 'post',
        dataType: 'json',
    
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            if(data.doorStatus == 'Door Open'){
                $door.removeClass("thumbOpened");
                $door.addClass("thumbOpened");
            } else {
                $door.removeClass("thumbOpened");
            }
        },
        data: JSON.stringify(fields)
    });

    
      
    // $.post("https://twms75ak6c.execute-api.us-east-1.amazonaws.com/dev/contact", fields, function(response, status){
    // $.post("http://localhost:3000/contact", fields, function(response, status){
    //     let data = response.data;
    //
    //     console.log(data);
    // }).fail(function(jqXHR, status, error) {
    //     console.log( "error" );
    // })
    //     .always(function() {
    //         // Loading
    //         $('.loading').hide();
    //         console.log( "finished" );
    //     });
};