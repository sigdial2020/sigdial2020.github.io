Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
$(document).ready(function() {

    $.when(
        $.ajax({
           type: "GET",
           url: "/content/schedule.csv",
           //dataType: "text",
           success: function(data1){
                schedule = data1;
            }
        }),
        $.ajax({
           type: "GET",
           url: "/content/grouping.csv",
           //dataType: "text",
           success: function(data2){
                return data2;
            }
        })
    ).done(function ( v1, v2 ) {
        process(v1[0],v2[0])}

    )


    function process(schedule,grouping){
        papers_parsed=Papa.parse(grouping).data.slice(1)
        papers={}
        for (paper in papers_parsed){
            papers[papers_parsed[paper][0]]=papers_parsed[paper]
        }

        table_data=Papa.parse(schedule).data.slice(1)
        //table_html='<table class="col-md-12 board text-center"></table>'


        $(table_data).each(function (i, rowData) {


            id_row="schedule_"+i
            day_key="tab"+rowData[0][2]
            idx_color=get_color_idx(rowData[2])

            schedule_timeline=$("#schedule_timeline_"+rowData[0][2])

            dates=get_dates(rowData[1],rowData[0][2])

            dates_str=[]
            for (index = 0; index < dates.length; index++){
                dates_str.push(dates[index])
            }
            dates_str=dates_str.join(" ")
            schedule_timeline.append($("<li class='color-"+idx_color+"'><a style='width:100%'  href=#"+id_row+">"+dates_str+"</a><br>"+rowData[3]+"</li>"))
            date_col=$("<div class='col-md-4' align='center'></div>")
            //date_col.append(date_row)

            if (rowData[7] != ""){
                dates=get_dates(rowData[7],rowData[0][2])
                dates_str=[]
                for (index = 0; index < dates.length; index++){
                    dates_str.push(dates[index])
                }
                dates_str=dates_str.join(" ")
                schedule_timeline.append($("<li class='color-"+idx_color+"'><a style='width:100%'  href=#"+id_row+">"+dates_str+"</a><br>"+rowData[6]+"</li>"))
            }
            //schedule_timeline.append(date_col)
            if (rowData[2]=="Break"){
            return;}


            var row = $('<div class="row" id=schedule_'+i+'></div>');

            div_=$('<div class="col-md-12 "></div>')
            div=$('<div class="member stephen"></div>')
            title='<a href="#" class="btn-large bg-'+idx_color+'"><img src="assets/img/microphone.png" name='+id_row+'>'+rowData[2]+'</a>'

            div.append($('<div class="button color">'+title+'</div><h4>'+rowData[3]+'</h4></div>'))
            papers_ids=rowData[4].split(";")

            if (rowData[2]== "Keynote"){
                div.append($("<br><a href="+rowData[8]+">Abstract</a>"))
            }
            if (papers_ids != ""){
                if (["Prerecord stream","Session"].includes(rowData[2])){
                    console.log(rowData[2])

                    div.append($("<h5>Prerecord stream:</h5> "))
                }
                for (idx in papers_ids){
                    paper_id=papers_ids[idx]
                    if (paper_id in papers){
                        div.append($("<p>"+papers[paper_id][2]+"<br>"+papers[paper_id][1]+" </p>"))
                    }
                }
            }

            if (rowData[6]!= ""){
                div.append($("<br><h5>"+rowData[6]+"</h5>"))
            }

            div_.append(div)
            row.append(div_)


            $("#"+day_key).append(row)
        });



    }

    function get_dates(date, day){
        countries=[-7,-6,-4,2,5.5,8,9]
        date_split=date.split(":")
        times=[]
        var d = new Date(Date.UTC(20, 7,parseInt(day),  parseInt(date_split[0])+7, date_split[1], 0, 0));
        for (index = 0; index < countries.length; index++){
            date_=new Date(d.getTime()+ parseFloat(countries[index])*60*60*1000)
            var time = date_.toUTCString();
            times.push(time.split(" ")[4].slice(0,5))
        }
        return times
    }

    function get_docs(){
        $.ajax({
           type: "GET",
           url: "/content/schedule.csv",
           dataType: "text",
           success: process
        });

    }

    function get_color_idx(type_key){
        if (["Keynote","Talk","Demo"].includes(type_key)){
            return 1
        }
        else {
            return 2
            }
    }



   });
