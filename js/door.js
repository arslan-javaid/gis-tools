function Door() {

    this._urlNove = 'https://v1jc1ohvc3.execute-api.us-east-1.amazonaws.com/dev/door_status';
    this._urlMachineQ = 'https://twms75ak6c.execute-api.us-east-1.amazonaws.com/dev/door_status';
    this.init();
}

Door.prototype.init = function() {

    // check status
    this.doorStatus();

    // Check Door status
    let self = this;
    setInterval(function(){ self.doorStatus(); }, 3000);

    let ctx = document.getElementById('canvas').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['05-21', '05-22', '05-23', '05-24', '05-26', '05-27'],
            datasets: [{
                label: 'Door Open',
                backgroundColor: 'rgba(54, 162, 235, 1)',
                stack: 'Stack 0',
                data: [12, 19, 3, 5, 2, 3],
            }, {
                label: 'Door Close',
                backgroundColor: 'rgb(255, 99, 132)',
                stack: 'Stack 1',
                data: [12, 19, 3, 5, 2, 3],
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



Door.prototype.doorStatus = function () {
    let $doorSelect = $('#doors-select'),
        $door =  $(".thumb"),
        url = ($doorSelect.val() === 'nova') ? this._urlNove : this._urlMachineQ,
        fields = { DevEUI: $doorSelect.val() };

    // Loading
    $('.loading').show();


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
        },
        data: JSON.stringify(fields)
    });
};