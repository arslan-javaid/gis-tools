function Door() {

    this.init();
}

Door.prototype.init = function() {

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