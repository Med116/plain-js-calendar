var UsefulCal = function (date) {
    console.log(date);
    this.startDate = date;
    var utcMonth = date.getUTCMonth();
    this.curMonth = utcMonth;
    if(this.curMonth == 0){
        this.prevMonth = 11;
    }else{
         this.prevMonth = utcMonth - 1;
    }
    if(this.curMonth == 11){
        this.nextMonth = 0;
    }else{
        this.nextMonth = utcMonth + 1;
    }
    this.year = date.getFullYear();
    this.displayYear =  "'" +  this.year.toString().substr(2);
    this.showHolidays = false;

};

UsefulCal.prototype.setEventDays = function(eventDays){
    this.eventDays = eventDays;
}

UsefulCal.prototype.getToday = function() {
    var today = new Date();
    return today;
};

UsefulCal.prototype.displayHolidays = function(){
    this.showHolidays = true;
}

UsefulCal.prototype.setHoliday = function(sqlDate, holidayName){
    this.holidays[sqlDate] = holidayName;
}


UsefulCal.prototype.getDaysArray = function () {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
};



UsefulCal.prototype.holidays = {
                                        "2014-07-04":"July 4th.",
                                        "2014-09-01":"Labor Day",
                                        "2014-10-13":"Columbus Day",
                                        "2014-11-11":"Veterans Day",
                                        "2014-11-27":"Thanksgiving",
                                        "2014-11-28":"After Thanksgiving",
                                        "2014-12-25":"Christmas"
                                    };

UsefulCal.prototype.checkHolidays = function(date){
    var sqlDate = this.getSqlDate(date);
    for(var holidayDate in this.holidays){
        if(holidayDate === sqlDate){
            return true;
        }
    }
}

UsefulCal.prototype.monthMap = ["Jan.","Feb.","Mar.", "Apr.","May", "Jun.","Jul.","Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

UsefulCal.prototype.renderToDom = function () {
    var el = document.getElementById(this.elementID);
    el.innerHTML = this.widget;
};

UsefulCal.prototype.checkScheduled = function (date) {
    var events = this.eventDays;
    var events = JSON.parse(events);
    for (var i=0;i<events.hasevents.length;i++) {
        var eventDate = events.hasevents[i];
        console.log(eventDate + " EVENTDATE");
        // pad zero in front if less than 10
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var curDate =  date.getFullYear() + "-" + month + "-" + date.getUTCDate();
        if (curDate === eventDate) {
            return true;
        }

    }
};

UsefulCal.prototype.getSqlDate = function (date) {
    var month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
    return date.getFullYear() + "-" + month + "-" + day;
};


UsefulCal.prototype.getEvents = function(eventsUrl, finishedCallback){
    function getAjax(){
        var xmlhttp;
        if (window.XMLHttpRequest)
          {// code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
          }
        else
          {// code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
          }
          return xmlhttp;
    }
     
    function getUrlResponse(url, params, callback){
        var http = getAjax();
        if(params){
            url += "?";
        }
        for(param in params){
            url += param + "=" + encodeURIComponent(params[param]) + "&";
        }
        http.open("GET", url,true);
        http.send(url);
        http.onreadystatechange = function(){
            if (http.readyState == 4){
                callback(http.responseText);
            }
        }
    }
    var that = this;
    var sqlDate = this.getSqlDate(this.startDate);
    getUrlResponse(eventsUrl,{date:sqlDate},function(resp){
        that.setEventDays(resp);
        finishedCallback();
    });
}

UsefulCal.prototype.getControls = function(){
    var controls = '<div id="controls">';
    var widgetWidth = document.getElementById(this.elementID).offsetWidth;
    var controlBoxWidth = (100 / 4) +  "%";
    var widthStyle = ' style="width:' + controlBoxWidth + '" ';
    controls += '<div ' + widthStyle + ' class="box month_control prev_month" month="' + this.prevMonth + '"> ' + '&lt;&lt;' + '</div>';
    //controls += '<div ' + widthStyle + ' class="box month_control current_month">' + this.monthMap[this.curMonth] + '<span class="current_year"> ' + this.displayYear + '</span></div>';
   
    controls += '<div ' + widthStyle + ' class="box month_control current_month" >';

    var select_month = '<select id="month_select">';
    for(var m=0;m<12;m++){
        if(m == this.curMonth){
             select_month += '<option value="' + m + '" selected="true" month_num="' + m + '"> ' + this.monthMap[m] + '</option>';
        }else{
             select_month += '<option value="' + m + '" month_num="' + m + '"> ' + this.monthMap[m] + '</option>';
        }
       
    }
    select_month += "</select>";

    controls += select_month;
    controls += '</div>'; // ends the month selector div;
    // start year select
    controls += '<div ' + widthStyle + ' class="box month_control current_month" >';
    var year_select = '<select id="year_select">';
    for(var y=1998;y<=this.getToday().getFullYear();y++){
        if(y==this.year){
            year_select += '<option value="' + y + '" selected="true" year="' + y + '"> ' + y + '</option>';
        }else{
            year_select += '<option value="' + y + '" year="' + y + '"> ' + y + '</option>';
        }
    }
    year_select += "</select>";
    controls += year_select;
    controls += "</div>"; // ends the year selector div
     controls += '<div ' + widthStyle + ' class="box month_control next_month" month="' + this.nextMonth +  '">' + '&gt;&gt;' + '</div>';


    return controls + "</div>";


}


UsefulCal.prototype.renderWidget = function(elementID){
    this.elementID = elementID;
    var todayNum = this.startDate;
    var todayClass,holidayClass;
    var widget = "<div id=\"useful_cal\">";
    var month = '<div class="month"> </div>';
    var widgetWidth = document.getElementById(this.elementID).offsetWidth;
    var widthOfBox = (100 / 7) +  "%";

    widget += this.getControls();
    widget += '<div class="header_row week_row" > ';
    for (var i = 0; i < this.getDaysArray().length; i++) {
        widget += "<div style=\"width:" + widthOfBox + "\" class=\"day_header box\">" + this.getDaysArray()[i] + "</div>";
    }
    widget += '</div><!-- ends Header Row -->';
    var d = this.startDate;
    console.log("D:");
    console.log(d);
    d.setDate(1);
    console.log(d);
    var dayOfMonth = d.getDay();
    console.log("dom:" + dayOfMonth);
    var monthNum = d.getMonth();
    var dayNum = 0;
    widget += '<div class="week_row">';
    var totalBoxes = dayOfMonth;

    // fill in the pre days

    for (var z = 0; z < dayOfMonth; z++) {
        widget += '<div style="width:' + widthOfBox + '" class="box empty" date=""></div>';
        dayNum++;
    }
    while (monthNum == d.getMonth()) {

        dayNum++;
        dayOfMonth = d.getDay();
        var weekendClass = (dayOfMonth === 0 || dayOfMonth === 6) ? "weekend" : "";
        //var scheduledClass = this.checkScheduled(d) ? "scheduled" : "";
        var scheduledClass = "";
        todayClass =  this.getToday().getDate() == d.getDate() && this.getToday().getMonth() == d.getMonth() ?  "today selected_day" : "";
        if(this.showHolidays === true){

            holidayClass = this.checkHolidays(d) ? "holiday" : "";
        }
        
       

        widget += '<div style="width:' + widthOfBox + '" class="box ' + weekendClass + ' ' + holidayClass + ' ' + todayClass + " " + scheduledClass + '" date="' + this.getSqlDate(d) + '">' + d.getDate() + '</div>';
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
    this.renderToDom();

}


var events = {
    hasevents: {
        c1d_5_1_2014: 1,
        c1d_5_2_2014: 1,
        c1d_5_5_2014: 1,
        c1d_5_6_2014: 1,
        c1d_5_8_2014: 1,
        c1d_5_9_2014: 1,
        c1d_5_12_2014: 1,
        c1d_5_13_2014: 1,
        c1d_5_14_2014: 1,
        c1d_5_15_2014: 1,
        c1d_5_19_2014: 1,
        c1d_5_21_2014: 1,
        c1d_5_22_2014: 1,
        c1d_5_27_2014: 1
    },
    notlive: [],
    statehouse: {
        c1d_5_1_2014: 1,
        c1d_5_2_2014: 1,
        c1d_5_5_2014: 1,
        c1d_5_6_2014: 1,
        c1d_5_7_2014: 1,
        c1d_5_8_2014: 1,
        c1d_5_9_2014: 1,
        c1d_5_12_2014: 1,
        c1d_5_14_2014: 1,
        c1d_5_15_2014: 1,
        c1d_5_19_2014: 1,
        c1d_5_20_2014: 1,
        c1d_5_21_2014: 1,
        c1d_5_22_2014: 1,
        c1d_5_23_2014: 1,
        c1d_5_27_2014: 1
    },
    fundraiser: {
        c1d_5_1_2014: 1,
        c1d_5_4_2014: 1,
        c1d_5_6_2014: 1,
        c1d_5_9_2014: 1,
        c1d_5_15_2014: 1,
        c1d_5_16_2014: 1,
        c1d_5_19_2014: 1,
        c1d_5_20_2014: 1,
        c1d_5_21_2014: 1,
        c1d_5_22_2014: 1,
        c1d_5_23_2014: 1,
        c1d_5_27_2014: 1,
        c1d_5_29_2014: 1
    },
    birthday: {
        c1d_5_4_2014: 1,
        c1d_5_9_2014: 1,
        c1d_5_8_2014: 1,
        c1d_5_7_2014: 1,
        c1d_5_18_2014: 1,
        c1d_5_30_2014: 1,
        c1d_5_2_2014: 1,
        c1d_5_31_2014: 1,
        c1d_5_25_2014: 1,
        c1d_5_19_2014: 1,
        c1d_5_13_2014: 1,
        c1d_5_3_2014: 1,
        c1d_5_22_2014: 1,
        c1d_5_20_2014: 1,
        c1d_5_23_2014: 1
    },
    deadline: {
        c1d_5_6_2014: 1,
        c1d_5_14_2014: 1
    }
};




