var UsefulCal = function (id, eventDays) {
    this.eventDays = eventDays;
    var widget = "<div id=\"useful_cal\">";
    var month = '<div class="month"> </div>';
    var widgetWidth = document.getElementById(id).offsetWidth;
    var widthOfBox = (100 / 7) +  "%";
    var widgetHeight = document.getElementById(id).offsetHeight;
    var heightOfBox = (100 / 6) +  "%";

    widget += '<div class="header_row week_row" > ';
    for (var i = 0; i < this.getDaysArray().length; i++) {
        widget += "<div style=\"width:" + widthOfBox + ";height: " + heightOfBox + "\" class=\"day_header box\">" + this.getDaysArray()[i] + "</div>";

    }
    widget += '</div><!-- ends Header Row -->';
    var d = new Date();
    d.setUTCDate(1);
    var dayOfMonth = d.getUTCDay();
    var monthNum = d.getMonth();
    var dayNum = 0;
    widget += '<div class="week_row">';
    var totalBoxes = dayOfMonth;

    // fill in the pre days

    for (var z = 0; z < dayOfMonth; z++) {
        widget += '<div style="width:' + widthOfBox + ';height:' + heightOfBox + '" class="box empty" date=""></div>';
        dayNum++;
    }


    while (monthNum == d.getMonth()) {
        dayNum++;
        dayOfMonth = d.getUTCDay();
        var weekendClass = (dayOfMonth === 0 || dayOfMonth === 6) ? "weekend" : "";
        var scheduledClass = this.checkScheduled(d) ? "scheduled" : "";
       

        widget += '<div style="width:' + widthOfBox + ';height:' + heightOfBox + '" class="box ' + weekendClass + ' ' + scheduledClass + '" date="' + this.getSqlDate(d) + '">' + d.getDate() + '</div>';
        if (dayNum % 7 === 0) {
            widget += "</div>";
            widget += "<div class=\"week_row\">";
        }
        d.setDate(d.getDate() + 1);
    }

    widget += "</div>";
    var dayCount = 0;




    widget += "</div><!-- ends Widget -->";
    this.widget = widget;
    this.render(id);
};

UsefulCal.prototype.getToday = function () {
    var today = new Date();
    return today;
};

UsefulCal.prototype.getDaysArray = function () {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
};

UsefulCal.prototype.render = function (id) {
    var el = document.getElementById(id);
    el.innerHTML = this.widget;
};

UsefulCal.prototype.checkScheduled = function (date) {
    var e = this.eventDays;
    for (var key in e.hasevents) {
        key = key.replace(/c1d_/, "");
        key = key.replace(/_/g, "-");
        console.log(key);
        var curDate = (date.getMonth() + 1) + "-" + date.getUTCDate() + "-" + date.getFullYear();
        if (curDate === key) {
            return true;
        }

    }
};

UsefulCal.prototype.getSqlDate = function (date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate();
};




