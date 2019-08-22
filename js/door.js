function Door() {

    this._urlNove = 'https://v1jc1ohvc3.execute-api.us-east-1.amazonaws.com/dev/';
    this._urlMachineQ = 'https://twms75ak6c.execute-api.us-east-1.amazonaws.com/dev/';
    this._gates = ['1818'];
    this.init();
}

Door.prototype.init = function() {
    let labArray=['05-21', '05-22', '05-23', '05-24', '05-26', '05-27'],
        dataArray=[12, 19, 3, 5, 2, 3],
        $doorSelect = $('#doors-select'),
        vehicleId = $doorSelect.val();
    // check status
    this.doorStatus();
    this.setLocation();

    // Check Door status
    let self = this;
    self.drawChart(labArray,dataArray);

    setInterval(function(){ self.doorStatus(); }, 5000);


    self.chartData();

    // Events
    $('#door').on('change', function(){
        let vehicleId = $doorSelect.val();
        // check status
        self.setLocation();
        self.doorStatus();
        self.chartData();
    });
};

Door.prototype.setLocation = function () {
    let url, fields, $doorSelect = $('#doors-select'), vehicleId = $doorSelect.val();


    if(this._gates.includes(vehicleId)){
        url =  this._urlNove + 'vehicalepos';
        fields = { vehicle: vehicleId };

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
                OL.setLocation(data.lng, data.lat);
            }
        });
    }
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

    let self = this, url, dataArray=[], fields, $doorSelect = $('#doors-select'),  vehicleId = $doorSelect.val();

    if(this._gates.includes(vehicleId)){
        url =  this._urlNove + 'door_count';
        fields = { vehicleId: vehicleId };
    } else{
        url =  this._urlMachineQ + 'contact';
        fields = { DevEUI: vehicleId };
    }

    // Loading
    $('.loading').show();
    $.ajax({
        url: url,
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

};

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
};

Door.prototype.doorStatus = function () {
    let url, fields, $doorSelect = $('#doors-select'), vehicleId = $doorSelect.val(),
        $door =  $(".thumb");


    if(this._gates.includes(vehicleId)){
        url =  this._urlNove + 'door_status';
        fields = { vehicleId: vehicleId };
    } else{
        url =  this._urlMachineQ + 'door_status';
        fields = { DevEUI: vehicleId };
    }


    $.ajax({
        url: url,
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

            OL.setLocation(data.lng, data.lat);
        },
        data: JSON.stringify(fields)
    });
};